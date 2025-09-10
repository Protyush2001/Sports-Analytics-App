// components/StreamBroadcaster.jsx
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SIGNALING_URL = 'http://localhost:3026';
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

export default function StreamBroadcaster({ match }) {
  const token = localStorage.getItem('token');
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);
  const pcsRef = useRef(new Map()); // viewerId -> RTCPeerConnection

    // NEW: recording states
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const start = async () => {
    try {
      // update DB
      await axios.post(`http://localhost:3026/api/matches/${match._id}/start-stream`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // capture
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            // === NEW: start recording locally ===
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9',
      });
      recordedChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      // ====================================

      // signaling
      const socket = io(SIGNALING_URL, { auth: { token } });
      socketRef.current = socket;
      socket.emit('join', { matchId: match._id, as: 'broadcaster' });

      // new viewer → create PC and offer
      socket.on('viewer-joined', async ({ viewerId }) => {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        pcsRef.current.set(viewerId, pc);

        stream.getTracks().forEach(t => pc.addTrack(t, stream));

        pc.onicecandidate = (e) => {
          if (e.candidate) socket.emit('ice-candidate', { to: viewerId, candidate: e.candidate });
        };

        pc.onconnectionstatechange = () => {
          if (['failed','disconnected','closed'].includes(pc.connectionState)) {
            pc.close(); pcsRef.current.delete(viewerId);
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { to: viewerId, sdp: offer });
      });

      socket.on('answer', async ({ from, sdp }) => {
        const pc = pcsRef.current.get(from);
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      });

      socket.on('ice-candidate', async ({ from, candidate }) => {
        const pc = pcsRef.current.get(from);
        if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      setPublishing(true);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to start stream');
    }
  };

  const stop = async () => {
    try {
      await axios.post(`http://localhost:3026/api/matches/${match._id}/stop-stream`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch(err) {
      console.log(err)
    }
    // pcsRef.current.forEach(pc => pc.close());
    // pcsRef.current.clear();
    // localStreamRef.current?.getTracks().forEach(t => t.stop());
    // localStreamRef.current = null;
    // if (localVideoRef.current) localVideoRef.current.srcObject = null;
    // socketRef.current?.disconnect();
    // socketRef.current = null;
    
    // === NEW: stop recording and upload ===
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        // combine chunks
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('video', blob, `${match._id}.webm`);

        try {
          await axios.post(
            `http://localhost:3026/api/matches/${match._id}/uploadRecording`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Recording uploaded successfully');
        } catch (uploadErr) {
          console.error('Upload error', uploadErr);
        }
        recordedChunksRef.current = [];
      };

      mediaRecorderRef.current.stop();
    }
    // =======================================

    // Close peer connections
    pcsRef.current.forEach((pc) => pc.close());
    pcsRef.current.clear();

    // Stop local stream
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    // Clear video element
    if (localVideoRef.current) localVideoRef.current.srcObject = null;

    // Disconnect socket
    socketRef.current?.disconnect();
    socketRef.current = null;
    setPublishing(false);
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <div className="flex gap-2">
        {!publishing ? (
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={start}>Go Live</button>
        ) : (
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={stop}>Stop</button>
        )}
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <video ref={localVideoRef} autoPlay playsInline muted className="w-full max-w-md mt-3 rounded" />
    </div>
  );
}
