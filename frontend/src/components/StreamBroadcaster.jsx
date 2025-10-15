


import React, { useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SIGNALING_URL = 'http://localhost:3026';
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

export default function StreamBroadcaster({ match, onMatchUpdate }) {
  const token = localStorage.getItem('token');

  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recordingId, setRecordingId] = useState(null);

  const localVideoRef = useRef(null);  // for showing the preview
  const localStreamRef = useRef(null); // holds the MediaStream object
  const socketRef = useRef(null); // for recording the stream
  const pcsRef = useRef(new Map()); // keeps track of peer connections for each viewer
  const mediaRecorderRef = useRef(null); // for WebSocket (Socket.IO) connection
  const recordedChunksRef = useRef([]); // stores video chunks

  // ---------------- START STREAM -----------------
  const start = async () => {
    try {
      setError('');

      // 1. Tell backend to start the stream and get recording ID
      const startResponse = await axios.post(
        `http://localhost:3026/api/matches/${match._id}/start-stream`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (startResponse.data.recordingId) {
        setRecordingId(startResponse.data.recordingId);
      }

      // 2. Capture camera + mic
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      // 3. Start recording locally
      const options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/mp4';
        }
      }

      const recorder = new MediaRecorder(stream, options);
      recordedChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onerror = (err) => {
        console.error('MediaRecorder error', err);
        setError('Recording failed');
      };

      // upload recording when stopped
      recorder.onstop = handleUploadRecording;
      mediaRecorderRef.current = recorder;
      recorder.start(1000); // 1-second chunks

      // 4. Setup WebRTC signaling
      const socket = io(SIGNALING_URL, { auth: { token } });
      socketRef.current = socket;
      socket.emit('join', { matchId: match._id, as: 'broadcaster' });

      socket.on('viewer-joined', async ({ viewerId }) => {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        pcsRef.current.set(viewerId, pc);

        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        pc.onicecandidate = (e) => {
          if (e.candidate)
            socket.emit('ice-candidate', { to: viewerId, candidate: e.candidate });
        };

        pc.onconnectionstatechange = () => {
          if (['failed', 'disconnected', 'closed'].includes(pc.connectionState)) {
            pc.close();
            pcsRef.current.delete(viewerId);
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

      // ImageKit upload progress events
      socket.on('recording_upload_progress', (data) => {
        if (data.matchId === match._id && data.recordingId === recordingId) {
          setUploadProgress(data.progress);
        }
      });

      setPublishing(true);
      if (onMatchUpdate) onMatchUpdate();
      
      console.log('Stream started with recording ID:', recordingId);
    } catch (err) {
      console.error('Stream start error:', err);
      setError(err.message || 'Failed to start stream');
    }
  };

  // ---------------- STOP STREAM -----------------
  const stop = async () => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // stop recording — triggers handleUploadRecording automatically
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        console.log('MediaRecorder stopped - ImageKit upload starting...');
      } else {
        console.log('No active recording, stopping stream without upload');
        setUploading(false);
        
        // Still stop the stream on backend
        await axios.post(
          `http://localhost:3026/api/matches/${match._id}/stop-stream`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // cleanup WebRTC
      pcsRef.current.forEach((pc) => pc.close());
      pcsRef.current.clear();

      // stop local stream
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;

      // clear video
      if (localVideoRef.current) localVideoRef.current.srcObject = null;

      // disconnect socket
      socketRef.current?.disconnect();
      socketRef.current = null;

      setPublishing(false);
      setRecordingId(null);
      
      if (onMatchUpdate) onMatchUpdate();
    } catch (err) {
      console.error('Stop error:', err);
      setError('Failed to stop stream properly');
      setUploading(false);
    }
  };

  // ---------------- UPLOAD TO IMAGEKIT -----------------
  const handleUploadRecording = async () => {
    try {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      recordedChunksRef.current = [];

      if (blob.size === 0) {
        console.warn('Empty recording blob, skipping upload');
        setUploading(false);
        return;
      }

      console.log('Starting ImageKit upload, size:', blob.size, 'recordingId:', recordingId);

      const formData = new FormData();
      formData.append('recording', blob, `${match._id}_${Date.now()}.webm`);
      if (recordingId) {
        formData.append('recordingId', recordingId);
      }

      const uploadRes = await axios.post(
        `http://localhost:3026/api/matches/${match._id}/uploadRecording`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
              
              // Emit progress via socket
              if (socketRef.current) {
                socketRef.current.emit('recording_upload_progress', {
                  matchId: match._id,
                  recordingId: recordingId,
                  progress: progress
                });
              }
            }
          },
        }
      );

      console.log('ImageKit upload successful:', uploadRes.data);
      
      // Emit completion event
      if (socketRef.current) {
        socketRef.current.emit('recording_uploaded', {
          matchId: match._id,
          recordingId: recordingId,
          recordingUrl: uploadRes.data.recordingUrl
        });
      }

      // Stop stream on backend after successful upload
      await axios.post(
        `http://localhost:3026/api/matches/${match._id}/stop-stream`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUploading(false);
      setUploadProgress(0);
      
      if (onMatchUpdate) onMatchUpdate();
      
    } catch (err) {
      console.error('ImageKit upload error:', err);
      setError('Failed to upload recording to cloud');
      
      // Update recording status as failed
      try {
        await axios.patch(
          `http://localhost:3026/api/matches/${match._id}/recording-status`,
          {
            recordingId: recordingId,
            status: 'failed',
            errorMessage: err.message
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (statusError) {
        console.error('Failed to update recording status:', statusError);
      }
      
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ---------------- UI -----------------
  return (
    <div className="mt-4 p-4 border rounded-lg bg-white shadow">
      <h3 className="text-lg font-bold mb-3">🎥 Live Streaming</h3>

      <div className="flex gap-2 mb-3">
        {!publishing ? (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={start}
            disabled={uploading}
          >
            Go Live
          </button>
        ) : (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={stop}
            disabled={uploading}
          >
            {uploading ? 'Stopping & Uploading...' : 'Stop Stream'}
          </button>
        )}

        {publishing && (
          <span className="flex items-center text-red-600 font-semibold">
            <span className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></span>
            LIVE
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3">
          {error}
        </div>
      )}

      {uploading && (
        <div className="mb-3 w-full">
          <div className="flex justify-between text-sm text-blue-600 mb-1">
            <span>📤 Uploading to ImageKit...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          {recordingId && (
            <p className="text-xs text-gray-500 mt-1">Recording ID: {recordingId}</p>
          )}
        </div>
      )}

      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-md rounded border"
      />
      
      <div className="mt-2 text-xs text-gray-500">
        <p>💡 Streams are automatically recorded and uploaded to ImageKit cloud storage</p>
      </div>
    </div>
  );
}
