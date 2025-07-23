import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
// You may need to adjust the import path for your Redux slice
// import { updateCourierStatus } from "@/redux/features/courier/courierSlice";

const SOCKET_URL = "http://localhost:4000"; // Change to your backend URL

const Courier: React.FC = () => {
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const sock = io(SOCKET_URL);
    setSocket(sock);

    sock.on("connect", () => setConnected(true));
    sock.on("disconnect", () => setConnected(false));

    // Optionally listen for server acks or updates
    // sock.on("statusUpdateAck", (data) => { ... });

    return () => {
      sock.disconnect();
    };
  }, []);

  const handleSendUpdate = () => {
    if (socket && connected) {
      const update = { status, location, timestamp: new Date().toISOString() };
      socket.emit("courierStatusUpdate", update);
      // dispatch(updateCourierStatus(update)); // Uncomment if you have a Redux action
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Courier Status Update</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Status</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="e.g., Picked up, In transit, Delivered"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Location</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., 123 Main St, City"
        />
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSendUpdate}
        disabled={!connected}
      >
        {connected ? "Send Update" : "Connecting..."}
      </button>
    </div>
  );
};

export default Courier;
