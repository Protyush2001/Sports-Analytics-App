// components/StreamViewer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SIGNALING_URL = 'http://localhost:3026';
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

export default function StreamViewer({ match }) {
  const token = localStorage.getItem('token');
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const [live, setLive] = useState(!!match?.stream?.isLive);

  useEffect(() => {
    if (!live) return;

    const socket = io(SIGNALING_URL, { auth: { token } });
    socketRef.current = socket;
    socket.emit('join', { matchId: match._id, as: 'viewer' });

    socket.on('offer', async ({ from, sdp }) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;

      pc.ontrack = (e) => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]; };
      pc.onicecandidate = (e) => { if (e.candidate) socket.emit('ice-candidate', { to: from, candidate: e.candidate }); };

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { to: from, sdp: answer });
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      if (pcRef.current && candidate) await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('stream-ended', () => {
      setLive(false);
    });

    return () => {
      socket.disconnect();
      pcRef.current?.close();
      pcRef.current = null;
    };
  }, [live, match._id, token]);

  if (!live) return <div className="p-4 border rounded mt-4">Stream not live.</div>;

  return (
    <div className="p-4 border rounded mt-4">
      <h4 className="font-semibold">Live</h4>
      <video ref={remoteVideoRef} autoPlay playsInline controls className="w-full rounded" />
    </div>
  );
}
