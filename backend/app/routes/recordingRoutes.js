// // Create this file: app/routes/recordingRoutes.js

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const CustomMatch = require('../models/customMatch-model');
// const authenticateUser = require('../middlewares/authenticateUser');

// const router = express.Router();

// // Ensure upload directory exists
// const uploadDir = './uploads/Recordings/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure multer for video uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname) || '.webm';
//     cb(null, `match-${req.body.matchId}-${uniqueSuffix}${ext}`);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 500 * 1024 * 1024, // 500MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     // Accept video files
//     const allowedMimes = [
//       'video/webm',
//       'video/mp4',
//       'video/x-msvideo', // .avi
//       'video/quicktime'  // .mov
//     ];
    
//     if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(webm|mp4|avi|mov)$/i)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only video files are allowed!'), false);
//     }
//   }
// });

// // Upload recording endpoint
// router.post('/upload-recording', authenticateUser, upload.single('video'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'No video file uploaded' 
//       });
//     }

//     const { matchId, mimeType, recordingId } = req.body;
    
//     if (!matchId) {
//       // Clean up uploaded file if matchId is missing
//       if (fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Match ID is required' 
//       });
//     }

//     console.log(`Processing recording for match ${matchId}:`);
//     console.log(`- File: ${req.file.filename}`);
//     console.log(`- Size: ${req.file.size} bytes`);
//     console.log(`- MIME Type: ${mimeType || req.file.mimetype}`);

//     // Find the match
//     const match = await CustomMatch.findById(matchId);
//     if (!match) {
//       // Clean up uploaded file
//       if (fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Match not found' 
//       });
//     }

//     // Construct the URL where the file can be accessed
//     const baseUrl = process.env.BASE_URL || 'http://localhost:3026';
//     const recordingUrl = `${baseUrl}/uploads/recordings/${req.file.filename}`;

//     // Update the recording in the database
//     if (recordingId) {
//       match.updateRecordingStatus(recordingId, 'completed', {
//         recordingUrl: recordingUrl,
//         fileSize: req.file.size,
//         mimeType: mimeType || req.file.mimetype,
//         duration: null, // Could be calculated with ffmpeg if needed
//         processed: false
//       });
//     } else {
//       // Legacy support - update the most recent pastStream
//       const latestStream = match.pastStreams[match.pastStreams.length - 1];
//       if (latestStream) {
//         latestStream.recordingUrl = recordingUrl;
//         latestStream.fileSize = req.file.size;
//         latestStream.mimeType = mimeType || req.file.mimetype;
//         latestStream.uploadStatus = 'completed';
//         latestStream.endedAt = latestStream.endedAt || new Date();
//       }
//     }

//     await match.save();

//     console.log(`Recording uploaded successfully: ${recordingUrl}`);

//     res.json({
//       success: true,
//       url: recordingUrl,
//       filename: req.file.filename,
//       size: req.file.size,
//       mimeType: mimeType || req.file.mimetype,
//       message: 'Recording uploaded successfully'
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
    
//     // Clean up file if it was uploaded but processing failed
//     if (req.file && fs.existsSync(req.file.path)) {
//       try {
//         fs.unlinkSync(req.file.path);
//       } catch (cleanupError) {
//         console.error('Failed to cleanup file:', cleanupError);
//       }
//     }
    
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to upload recording',
//       details: error.message 
//     });
//   }
// });

// // Get recording info endpoint
// router.get('/recording/:matchId', authenticateUser, async (req, res) => {
//   try {
//     const { matchId } = req.params;
    
//     const match = await CustomMatch.findById(matchId);
//     if (!match) {
//       return res.status(404).json({ error: 'Match not found' });
//     }

//     // Return recording information
//     const recordings = match.pastStreams.map(stream => ({
//       id: stream._id,
//       recordingId: stream.recordingId,
//       startedAt: stream.startedAt,
//       endedAt: stream.endedAt,
//       recordingUrl: stream.recordingUrl,
//       fileSize: stream.fileSize,
//       duration: stream.duration,
//       mimeType: stream.mimeType,
//       uploadStatus: stream.uploadStatus,
//       uploadProgress: stream.uploadProgress,
//       status: stream.recordingUrl && 
//               stream.recordingUrl !== "https://your-storage.com/recordings/stream.mp4" 
//               ? 'available' : stream.uploadStatus || 'processing'
//     }));
    
//     res.json({
//       success: true,
//       matchId,
//       currentRecordingStatus: match.stream.recordingStatus,
//       activeRecordingId: match.stream.activeRecordingId,
//       recordings
//     });

//   } catch (error) {
//     console.error('Error fetching recording info:', error);
//     res.status(500).json({ 
//       error: 'Failed to fetch recording info',
//       details: error.message 
//     });
//   }
// });

// // Update recording progress endpoint
// router.patch('/recording/:matchId/:recordingId/progress', authenticateUser, async (req, res) => {
//   try {
//     const { matchId, recordingId } = req.params;
//     const { progress, status, error } = req.body;

//     const match = await CustomMatch.findById(matchId);
//     if (!match) {
//       return res.status(404).json({ error: 'Match not found' });
//     }

//     const recording = match.pastStreams.find(stream => stream.recordingId === recordingId);
//     if (!recording) {
//       return res.status(404).json({ error: 'Recording not found' });
//     }

//     if (progress !== undefined) recording.uploadProgress = Math.max(0, Math.min(100, progress));
//     if (status) recording.uploadStatus = status;
//     if (error) recording.errorMessage = error;

//     await match.save();

//     res.json({
//       success: true,
//       message: 'Recording progress updated',
//       recording: {
//         id: recording._id,
//         recordingId: recording.recordingId,
//         uploadProgress: recording.uploadProgress,
//         uploadStatus: recording.uploadStatus
//       }
//     });

//   } catch (error) {
//     console.error('Error updating recording progress:', error);
//     res.status(500).json({ 
//       error: 'Failed to update recording progress',
//       details: error.message 
//     });
//   }
// });

// // Delete recording endpoint
// router.delete('/recording/:matchId/:recordingId', authenticateUser, async (req, res) => {
//   try {
//     const { matchId, recordingId } = req.params;
    
//     const match = await CustomMatch.findById(matchId);
//     if (!match) {
//       return res.status(404).json({ error: 'Match not found' });
//     }

//     // Check if user has permission to delete
//     if (match.createdBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: 'Not authorized to delete this recording' });
//     }

//     const streamIndex = match.pastStreams.findIndex(stream => stream.recordingId === recordingId);
//     if (streamIndex === -1) {
//       return res.status(404).json({ error: 'Recording not found' });
//     }

//     const stream = match.pastStreams[streamIndex];

//     // Delete file from disk
//     if (stream.recordingUrl && !stream.recordingUrl.startsWith('blob:')) {
//       const filename = path.basename(stream.recordingUrl);
//       const filePath = path.join(uploadDir, filename);
      
//       if (fs.existsSync(filePath)) {
//         try {
//           fs.unlinkSync(filePath);
//           console.log(`Deleted recording file: ${filename}`);
//         } catch (fileError) {
//           console.error('Failed to delete file:', fileError);
//           // Continue with database deletion even if file deletion fails
//         }
//       }
//     }

//     // Remove from database
//     match.pastStreams.splice(streamIndex, 1);
//     await match.save();

//     res.json({
//       success: true,
//       message: 'Recording deleted successfully'
//     });

//   } catch (error) {
//     console.error('Error deleting recording:', error);
//     res.status(500).json({ 
//       error: 'Failed to delete recording',
//       details: error.message 
//     });
//   }
// });

// // Health check for recording service
// router.get('/recording-health', (req, res) => {
//   try {
//     const stats = fs.statSync(uploadDir);
//     res.json({
//       success: true,
//       uploadDir: uploadDir,
//       exists: fs.existsSync(uploadDir),
//       writable: true, // Simplified check
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       uploadDir: uploadDir,
//       timestamp: new Date().toISOString()
//     });
//   }
// });

// module.exports = router;