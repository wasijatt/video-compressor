"use client"
import React, { useState } from 'react';
import GoogleDrivePicker from './GoogleDrivePicker';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [progress, setProgress] = useState(0);
  const [compressedVideo, setCompressedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleURLChange = (e) => {
    setVideoURL(e.target.value);
  };

  const handleGoogleDrivePick = (fileId) => {
    // Use Google Drive API to get file by ID
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setProgress(0);

    if (uploadMethod === 'file' && videoFile) {
      const formData = new FormData();
      formData.append('video', videoFile);

      const response = await fetch('/pages/api/compress', {
        method: 'POST',
        body: formData,
      });

      const reader = response.body.getReader();
      const textDecoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = textDecoder.decode(value);
        const match = text.match(/data: (\d+|\w+)\n\n/);
        if (match) {
          const data = match[1];
          if (data === 'complete') {
            setIsLoading(false);
            setCompressedVideo(`/api/temp/${videoFile.name.split('.')[0]}_compressed.mp4`);
          } else {
            setProgress(parseInt(data));
          }
        }
      }
    } else if (uploadMethod === 'url' && videoURL) {
      // Handle URL upload
    } else if (uploadMethod === 'googleDrive') {
      // Handle Google Drive upload
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <div className="mb-4">
        <label className="block mb-2">Choose upload method:</label>
        <select
          value={uploadMethod}
          onChange={(e) => setUploadMethod(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="file">Upload from Computer</option>
          <option value="url">Upload from URL</option>
          <option value="googleDrive">Upload from Google Drive</option>
        </select>
      </div>

      {uploadMethod === 'file' && (
        <div className="mb-4">
          <input type="file" accept="video/*" onChange={handleFileChange} className="mb-4" />
        </div>
      )}

      {uploadMethod === 'url' && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter video URL"
            value={videoURL}
            onChange={handleURLChange}
            className="mb-4 p-2 border rounded w-full"
          />
        </div>
      )}

      {uploadMethod === 'googleDrive' && (
        <div className="mb-4">
          <GoogleDrivePicker onPick={handleGoogleDrivePick} />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={isLoading}
      >
        Compress Video
      </button>

      {isLoading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full">
            <div
              className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        </div>
      )}

      {compressedVideo && (
        <div className="mt-4">
          <video controls src={compressedVideo} className="w-full" />
          <a
            href={compressedVideo}
            download="compressed_video.mp4"
            className="bg-green-500 text-white p-2 rounded mt-2 inline-block"
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
