import React, { useState } from "react";

const StreamSettings = ({ match, role, onUpdated }) => {
  const [streamKey, setStreamKey] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = () => {
    if (!streamKey) {
      alert("Please enter a Stream Key or RTMP URL!");
      return;
    }
    setIsStreaming(true);
    alert(`Streaming started for ${match.title}`);
    // TODO: Integrate Agora or RTMP streaming logic here
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    alert("Streaming stopped");
    // TODO: Stop streaming logic here
  };

  if (role !== "team_owner" && role !== "admin") return null; // Only owner/admin can stream

  return (
    <div className="mt-6 p-4 border rounded shadow bg-gray-50">
      <h3 className="text-lg font-bold mb-4">Live Streaming Settings</h3>

      {!isStreaming ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Stream Key or RTMP URL"
            value={streamKey}
            onChange={(e) => setStreamKey(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={startStreaming}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Start Streaming
          </button>
        </div>
      ) : (
        <div>
          <p className="text-green-600 font-semibold">Streaming is live!</p>
          <button
            onClick={stopStreaming}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Stop Streaming
          </button>
        </div>
      )}
    </div>
  );
};

export default StreamSettings;
