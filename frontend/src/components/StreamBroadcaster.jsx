// components/StreamBroadcaster.jsx
// import React, { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';
// import axios from 'axios';

// const SIGNALING_URL = 'http://localhost:3026';
// const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// export default function StreamBroadcaster({ match }) {
//   const token = localStorage.getItem('token');
//   const [publishing, setPublishing] = useState(false);
//   const [error, setError] = useState('');
//   const localVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const socketRef = useRef(null);
//   const pcsRef = useRef(new Map()); // viewerId -> RTCPeerConnection

//     // NEW: recording states
//   const mediaRecorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);

//   const start = async () => {
//     try {
//       // update DB
//       await axios.post(`http://localhost:3026/api/matches/${match._id}/start-stream`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // capture
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       localStreamRef.current = stream;
//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;

//             // === NEW: start recording locally ===
//       const recorder = new MediaRecorder(stream, {
//         mimeType: 'video/webm; codecs=vp9',
//       });
//       recordedChunksRef.current = [];
//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) recordedChunksRef.current.push(e.data);
//       };
//       mediaRecorderRef.current = recorder;
//       recorder.start();
//       // ====================================

//       // signaling
//       const socket = io(SIGNALING_URL, { auth: { token } });
//       socketRef.current = socket;
//       socket.emit('join', { matchId: match._id, as: 'broadcaster' });

//       // new viewer → create PC and offer
//       socket.on('viewer-joined', async ({ viewerId }) => {
//         const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
//         pcsRef.current.set(viewerId, pc);

//         stream.getTracks().forEach(t => pc.addTrack(t, stream));

//         pc.onicecandidate = (e) => {
//           if (e.candidate) socket.emit('ice-candidate', { to: viewerId, candidate: e.candidate });
//         };

//         pc.onconnectionstatechange = () => {
//           if (['failed','disconnected','closed'].includes(pc.connectionState)) {
//             pc.close(); pcsRef.current.delete(viewerId);
//           }
//         };

//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);
//         socket.emit('offer', { to: viewerId, sdp: offer });
//       });

//       socket.on('answer', async ({ from, sdp }) => {
//         const pc = pcsRef.current.get(from);
//         if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp));
//       });

//       socket.on('ice-candidate', async ({ from, candidate }) => {
//         const pc = pcsRef.current.get(from);
//         if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
//       });

//       setPublishing(true);
//     } catch (e) {
//       setError(e.response?.data?.message || e.message || 'Failed to start stream');
//     }
//   };

//   const stop = async () => {
//     try {
//       await axios.post(`http://localhost:3026/api/matches/${match._id}/stop-stream`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } catch(err) {
//       console.log(err)
//     }
//     // pcsRef.current.forEach(pc => pc.close());
//     // pcsRef.current.clear();
//     // localStreamRef.current?.getTracks().forEach(t => t.stop());
//     // localStreamRef.current = null;
//     // if (localVideoRef.current) localVideoRef.current.srcObject = null;
//     // socketRef.current?.disconnect();
//     // socketRef.current = null;
    
//     // === NEW: stop recording and upload ===
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.onstop = async () => {
//         // combine chunks
//         const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
//         const formData = new FormData();
//         formData.append('video', blob, `${match._id}.webm`);

//         try {
//           await axios.post(
//             `http://localhost:3026/api/matches/${match._id}/uploadRecording`,
//             formData,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           console.log('Recording uploaded successfully');
//         } catch (uploadErr) {
//           console.error('Upload error', uploadErr);
//         }
//         recordedChunksRef.current = [];
//       };

//       mediaRecorderRef.current.stop();
//     }
//     // =======================================

//     // Close peer connections
//     pcsRef.current.forEach((pc) => pc.close());
//     pcsRef.current.clear();

//     // Stop local stream
//     localStreamRef.current?.getTracks().forEach((t) => t.stop());
//     localStreamRef.current = null;

//     // Clear video element
//     if (localVideoRef.current) localVideoRef.current.srcObject = null;

//     // Disconnect socket
//     socketRef.current?.disconnect();
//     socketRef.current = null;
//     setPublishing(false);
//   };

//   return (
//     <div className="mt-4 p-4 border rounded">
//       <div className="flex gap-2">
//         {!publishing ? (
//           <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={start}>Go Live</button>
//         ) : (
//           <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={stop}>Stop</button>
//         )}
//       </div>
//       {error && <p className="text-red-600 mt-2">{error}</p>}
//       <video ref={localVideoRef} autoPlay playsInline muted className="w-full max-w-md mt-3 rounded" />
//     </div>
//   );
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';
// import axios from 'axios';

// const SIGNALING_URL = 'http://localhost:3026';
// const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// export function StreamBroadcaster({ match, onMatchUpdate }) {
//   const token = localStorage.getItem('token');
//   const [publishing, setPublishing] = useState(false);
//   const [error, setError] = useState('');
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   const localVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const socketRef = useRef(null);
//   const pcsRef = useRef(new Map());
//   const mediaRecorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);

//   // Start streaming
//   const start = async () => {
//     try {
//       setError('');

//       // Update DB first
//       const response = await axios.post(`http://localhost:3026/api/matches/${match._id}/start-stream`, {
//         // method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       if (!response.ok) throw new Error('Failed to start stream on server');

//       // Capture media
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 1280, height: 720 },
//         audio: true
//       });
//       localStreamRef.current = stream;
//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;

//       // Start recording
//       const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
//       recordedChunksRef.current = [];

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) recordedChunksRef.current.push(e.data);
//       };

//       // 🔥 THIS is the completed onstop handler 🔥
//       recorder.onstop = async () => {
//         try {
//           // Combine chunks
//           const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
//           console.log('Recording size:', blob.size, 'bytes');

//           if (blob.size > 0) {
//             setUploading(true);
//             setUploadProgress(0);

//             const formData = new FormData();
//             formData.append('video', blob, `${match._id}_${Date.now()}.webm`);

//             const xhr = new XMLHttpRequest();
//             xhr.upload.onprogress = (e) => {
//               if (e.lengthComputable) {
//                 const progress = Math.round((e.loaded * 100) / e.total);
//                 setUploadProgress(progress);
//               }
//             };
//             xhr.onload = () => {
//               if (xhr.status === 200) {
//                 console.log('Recording uploaded successfully');
//                 if (onMatchUpdate) onMatchUpdate();
//               } else {
//                 console.error('Upload failed:', xhr.responseText);
//                 setError('Failed to upload recording');
//               }
//               setUploading(false);
//               setUploadProgress(0);
//             };
//             xhr.onerror = () => {
//               console.error('Upload error');
//               setError('Failed to upload recording');
//               setUploading(false);
//               setUploadProgress(0);
//             };
//             xhr.open('POST', `http://localhost:3026/api/matches/${match._id}/uploadRecording`);
//             xhr.setRequestHeader('Authorization', `Bearer ${token}`);
//             xhr.send(formData);

//           } else {
//             console.warn('No recording data to upload');
//             setUploading(false);
//           }
//         } catch (uploadErr) {
//           console.error('Upload error:', uploadErr);
//           setError('Failed to upload recording');
//           setUploading(false);
//         } finally {
//           recordedChunksRef.current = [];
//         }
//       };

//       mediaRecorderRef.current = recorder;
//       recorder.start(1000); // 1-second chunks

//       // Setup WebRTC signaling
//       const socket = io(SIGNALING_URL, { auth: { token } });
//       socketRef.current = socket;
//       socket.emit('join', { matchId: match._id, as: 'broadcaster' });

//       socket.on('viewer-joined', async ({ viewerId }) => {
//         const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
//         pcsRef.current.set(viewerId, pc);

//         stream.getTracks().forEach(t => pc.addTrack(t, stream));

//         pc.onicecandidate = (e) => {
//           if (e.candidate) socket.emit('ice-candidate', { to: viewerId, candidate: e.candidate });
//         };

//         pc.onconnectionstatechange = () => {
//           if (['failed', 'disconnected', 'closed'].includes(pc.connectionState)) {
//             pc.close();
//             pcsRef.current.delete(viewerId);
//           }
//         };

//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);
//         socket.emit('offer', { to: viewerId, sdp: offer });
//       });

//       socket.on('answer', async ({ from, sdp }) => {
//         const pc = pcsRef.current.get(from);
//         if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp));
//       });

//       socket.on('ice-candidate', async ({ from, candidate }) => {
//         const pc = pcsRef.current.get(from);
//         if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
//       });

//       setPublishing(true);
//       if (onMatchUpdate) onMatchUpdate();

//     } catch (e) {
//       console.error('Stream start error:', e);
//       setError(e.message || 'Failed to start stream');
//     }
//   };

//   // Stop streaming
//   // const stop = async () => {
//   //   try {
//   //     // Stop recording first
//   //     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//   //       mediaRecorderRef.current.stop();
//   //     }

//   //     // Stop stream on backend
//   //     const stopResponse = await fetch(`http://localhost:3026/api/matches/${match._id}/stop-stream`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`,
//   //         'Content-Type': 'application/json'
//   //       }
//   //     });
//   //     if (!stopResponse.ok) console.error('Failed to stop stream on server');

//   //     // Cleanup WebRTC
//   //     pcsRef.current.forEach((pc) => pc.close());
//   //     pcsRef.current.clear();

//   //     // Stop local stream
//   //     localStreamRef.current?.getTracks().forEach((t) => t.stop());
//   //     localStreamRef.current = null;

//   //     // Clear video element
//   //     if (localVideoRef.current) localVideoRef.current.srcObject = null;

//   //     // Disconnect socket
//   //     socketRef.current?.disconnect();
//   //     socketRef.current = null;

//   //     setPublishing(false);
//   //     if (onMatchUpdate) onMatchUpdate();

//   //   } catch (err) {
//   //     console.error('Stop error:', err);
//   //     setError('Failed to stop stream properly');
//   //     setUploading(false);
//   //   }
//   // };

//   // Replace your stop function in StreamBroadcaster with this debug version

// const stop = async () => {
//   try {
//     console.log('Starting stop process...');
    
//     // Stop recording first
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       console.log('Stopping media recorder...');
//       mediaRecorderRef.current.stop();
//     }

//     // Stop stream on backend with better error handling
//     console.log(`Calling stop-stream endpoint for match ${match._id}...`);
//     const stopResponse = await axios.post(`http://localhost:3026/api/matches/${match._id}/stop-stream`, {
//       // method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log('Stop stream response status:', stopResponse.status);
    
//     if (!stopResponse.ok) {
//       const errorText = await stopResponse.text();
//       console.error('Stop stream failed:', stopResponse.status, errorText);
      
//       // Try to parse error response
//       let errorMessage = 'Failed to stop stream on server';
//       try {
//         const errorData = JSON.parse(errorText);
//         errorMessage = errorData.msg || errorData.message || errorMessage;
//       } catch (parseErr) {
//         console.error('Could not parse error response:', errorText);
//       }
      
//       setError(`Server error: ${errorMessage}`);
//       // Continue with cleanup even if server call fails
//     } else {
//       const responseData = await stopResponse.json();
//       console.log('Stop stream successful:', responseData);
//     }

//     // Continue with cleanup regardless of server response
//     console.log('Cleaning up WebRTC connections...');
    
//     // Cleanup WebRTC
//     pcsRef.current.forEach((pc) => {
//       console.log('Closing peer connection...');
//       pc.close();
//     });
//     pcsRef.current.clear();

//     // Stop local stream
//     if (localStreamRef.current) {
//       console.log('Stopping local stream tracks...');
//       localStreamRef.current.getTracks().forEach((t) => t.stop());
//       localStreamRef.current = null;
//     }

//     // Clear video element
//     if (localVideoRef.current) {
//       console.log('Clearing video element...');
//       localVideoRef.current.srcObject = null;
//     }

//     // Disconnect socket
//     if (socketRef.current) {
//       console.log('Disconnecting socket...');
//       socketRef.current.disconnect();
//       socketRef.current = null;
//     }

//     setPublishing(false);
//     console.log('Stop process completed successfully');
    
//     if (onMatchUpdate) onMatchUpdate();

//   } catch (err) {
//     console.error('Stop error details:', err);
//     setError(`Failed to stop stream: ${err.message}`);
//     setUploading(false);
    
//     // Force cleanup even on error
//     setPublishing(false);
//     pcsRef.current.clear();
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((t) => t.stop());
//       localStreamRef.current = null;
//     }
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current = null;
//     }
//   }
// };

//   return (
//     <div className="mt-4 p-4 border rounded-lg bg-white shadow">
//       <h3 className="text-lg font-bold mb-3">🎥 Live Streaming</h3>

//       <div className="flex gap-2 mb-3">
//         {!publishing ? (
//           <button
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//             onClick={start}
//             disabled={uploading}
//           >
//             Go Live
//           </button>
//         ) : (
//           <button
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
//             onClick={stop}
//             disabled={uploading}
//           >
//             {uploading ? 'Stopping & Uploading...' : 'Stop Stream'}
//           </button>
//         )}

//         {publishing && (
//           <span className="flex items-center text-red-600 font-semibold">
//             <span className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></span>
//             LIVE
//           </span>
//         )}
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3">
//           {error}
//         </div>
//       )}

//       {uploading && (
//         <div className="mb-3">
//           <div className="flex justify-between text-sm text-blue-600 mb-1">
//             <span>Uploading recording...</span>
//             <span>{uploadProgress}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${uploadProgress}%` }}
//             ></div>
//           </div>
//         </div>
//       )}

//       <video
//         ref={localVideoRef}
//         autoPlay
//         playsInline
//         muted
//         className="w-full max-w-md rounded border"
//       />
//     </div>
//   );
// }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);
  const pcsRef = useRef(new Map());
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // ---------------- START STREAM -----------------
  const start = async () => {
    try {
      setError('');

      // 1. Tell backend to start the stream
      await axios.post(
        `http://localhost:3026/api/matches/${match._id}/start-stream`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // 2. Capture camera + mic
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      // 3. Start recording locally
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9',
      });
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

      setPublishing(true);
      if (onMatchUpdate) onMatchUpdate();
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
      } else {
        setUploading(false);
      }

      // stop stream on backend
      await axios.post(
        `http://localhost:3026/api/matches/${match._id}/stop-stream`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
      if (onMatchUpdate) onMatchUpdate();
    } catch (err) {
      console.error('Stop error:', err);
      setError('Failed to stop stream properly');
      setUploading(false);
    }
  };

  // ---------------- UPLOAD RECORDING -----------------
  const handleUploadRecording = async () => {
    try {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      recordedChunksRef.current = [];

      if (blob.size === 0) {
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('video', blob, `${match._id}_${Date.now()}.webm`);

      // do XHR upload with progress
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          if (onMatchUpdate) onMatchUpdate();
        } else {
          setError('Failed to upload recording');
        }
        setUploading(false);
        setUploadProgress(0);
      };

      xhr.onerror = () => {
        setError('Failed to upload recording');
        setUploading(false);
        setUploadProgress(0);
      };

      xhr.open('POST', `http://localhost:3026/api/matches/${match._id}/uploadRecording`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload recording');
      setUploading(false);
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
            <span>Uploading recording...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-md rounded border"
      />
    </div>
  );
}
