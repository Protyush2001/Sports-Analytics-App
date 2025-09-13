// // components/StreamViewer.jsx
// import React, { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';

// const SIGNALING_URL = 'http://localhost:3026';
// const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// export default function StreamViewer({ match }) {
//   const token = localStorage.getItem('token');
//   const remoteVideoRef = useRef(null);
//   const socketRef = useRef(null);
//   const pcRef = useRef(null);
//   const [live, setLive] = useState(!!match?.stream?.isLive);

//   useEffect(() => {
//     if (!live) return;

//     const socket = io(SIGNALING_URL, { auth: { token } });
//     socketRef.current = socket;
//     socket.emit('join', { matchId: match._id, as: 'viewer' });

//     socket.on('offer', async ({ from, sdp }) => {
//       const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
//       pcRef.current = pc;

//       pc.ontrack = (e) => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]; };
//       pc.onicecandidate = (e) => { if (e.candidate) socket.emit('ice-candidate', { to: from, candidate: e.candidate }); };

//       await pc.setRemoteDescription(new RTCSessionDescription(sdp));
//       pc.addTransceiver('video', { direction: 'recvonly' });
//       pc.addTransceiver('audio', { direction: 'recvonly' });

//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       socket.emit('answer', { to: from, sdp: answer });
//     });

//     socket.on('ice-candidate', async ({ candidate }) => {
//       if (pcRef.current && candidate) await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//     });

//     socket.on('stream-ended', () => {
//       setLive(false);
//     });

//     return () => {
//       socket.disconnect();
//       pcRef.current?.close();
//       pcRef.current = null;
//     };
//   }, [live, match._id, token]);

//   if (!live) return <div className="p-4 border rounded mt-4">Stream not live.</div>;

//   return (
//     <div className="p-4 border rounded mt-4">
//       <h4 className="font-semibold">Live</h4>
//       <video ref={remoteVideoRef} autoPlay playsInline controls className="w-full rounded" />
//     </div>
//   );
// }

///////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SIGNALING_URL = 'http://localhost:3026';
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

export default function StreamViewer({ match, onMatchUpdate }) {
  const token = localStorage.getItem('token');
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const [live, setLive] = useState(!!match?.stream?.isLive);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [viewMode, setViewMode] = useState('live');

  // Update live status when match changes
  useEffect(() => {
    setLive(!!match?.stream?.isLive);
  }, [match?.stream?.isLive]);

  // Get available recordings from pastStreams
  const availableRecordings = match?.pastStreams?.filter(stream => 
    stream.recordingUrl && 
    stream.processed !== false &&
    stream.recordingUrl !== "https://your-storage.com/recordings/stream.mp4" // Filter out placeholder URLs
  ) || [];

  // WebRTC live streaming setup
  useEffect(() => {
    if (!live || viewMode !== 'live') return;

    const socket = io(SIGNALING_URL, { auth: { token } });
    socketRef.current = socket;
    socket.emit('join', { matchId: match._id, as: 'viewer' });

    socket.on('offer', async ({ from, sdp }) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;

      pc.ontrack = (e) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };
      
      pc.onicecandidate = (e) => {
        if (e.candidate) socket.emit('ice-candidate', { to: from, candidate: e.candidate });
      };

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
      if (onMatchUpdate) onMatchUpdate();
    });

    return () => {
      socket.disconnect();
      pcRef.current?.close();
      pcRef.current = null;
    };
  }, [live, match._id, token, viewMode]);

  return (
    <div className="p-4 border rounded-lg bg-white shadow mt-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">Stream Viewer</h4>
        
        {/* Toggle between live and recordings */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('live')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'live' 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-gray-100 text-gray-700'
            }`}
            disabled={!live}
          >
            Live {live && '🔴'}
          </button>
          <button
            onClick={() => setViewMode('recordings')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'recordings' 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700'
            }`}
            disabled={availableRecordings.length === 0}
          >
            Recordings ({availableRecordings.length})
          </button>
        </div>
      </div>

      {viewMode === 'live' ? (
        // Live stream mode
        live ? (
          <div>
            <div className="flex items-center mb-2">
              <span className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></span>
              <span className="text-red-600 font-semibold">LIVE</span>
            </div>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              controls
              className="w-full rounded border"
            />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Stream is not live</p>
            {availableRecordings.length > 0 && (
              <p className="text-sm mt-1">Switch to Recordings to watch highlights</p>
            )}
          </div>
        )
      ) : (
        // Recordings mode
        <div>
          {availableRecordings.length > 0 ? (
            <div>
              {/* Recording selector dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Recording:
                </label>
                <select
                  value={selectedRecording || ''}
                  onChange={(e) => setSelectedRecording(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full border rounded px-3 py-2 bg-white"
                >
                  <option value="">Choose a recording...</option>
                  {availableRecordings.map((stream, index) => (
                    <option key={index} value={index}>
                      {new Date(stream.startedAt).toLocaleString()}
                      {stream.endedAt && ` - ${new Date(stream.endedAt).toLocaleString()}`}
                      {stream.fileSize && ` (${Math.round(stream.fileSize / 1024 / 1024)}MB)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Video player */}
              {selectedRecording !== null && availableRecordings[selectedRecording] ? (
                <div>
                  <video
                    key={availableRecordings[selectedRecording].recordingUrl}
                    src={availableRecordings[selectedRecording].recordingUrl}
                    controls
                    className="w-full rounded border"
                    onError={(e) => {
                      console.error('Video playback error:', e);
                      console.log('Failed URL:', availableRecordings[selectedRecording].recordingUrl);
                    }}
                  />
                  
                  {/* Recording info */}
                  <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                    <p className="text-gray-600">
                      <strong>Started:</strong> {new Date(availableRecordings[selectedRecording].startedAt).toLocaleString()}
                    </p>
                    {availableRecordings[selectedRecording].endedAt && (
                      <p className="text-gray-600">
                        <strong>Ended:</strong> {new Date(availableRecordings[selectedRecording].endedAt).toLocaleString()}
                      </p>
                    )}
                    {availableRecordings[selectedRecording].fileSize && (
                      <p className="text-gray-600">
                        <strong>Size:</strong> {Math.round(availableRecordings[selectedRecording].fileSize / 1024 / 1024)} MB
                      </p>
                    )}
                    <p className="text-gray-600">
                      <strong>Status:</strong> {availableRecordings[selectedRecording].uploadStatus || 'Available'}
                    </p>
                    {/* Debug info */}
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-gray-400">Debug Info</summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(availableRecordings[selectedRecording], null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a recording to watch</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recordings available yet</p>
              <p className="text-sm mt-1">Recordings will appear here after streaming</p>
              
              {/* Debug: Show pastStreams structure */}
              {match?.pastStreams?.length > 0 && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-xs text-gray-400">Debug: Raw pastStreams data</summary>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(match.pastStreams, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}