import { useEffect, useState } from "react";
import api from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get("/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  }, []);
// ------------------------------------------------
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>🔔 Notifications</h2>

//       {notifications.length === 0 ? (
//         <p>No notifications</p>
//       ) : (
//         notifications.map((n) => (
//           <div
//             key={n._id}
//             style={{
//               padding: "10px",
//               border: "1px solid #ccc",
//               marginBottom: "10px",
//             }}
//           >
//             {n.message}
//           </div>
//         ))
//       )}
//     </div>
//   );
return (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
      🔔 Notifications
    </h2>

    {notifications.length === 0 ? (
      <div className="text-center text-gray-500 mt-10">
        No notifications yet 🚫
      </div>
    ) : (
      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => api.put(`/notifications/${n._id}`)}
            className={`p-4 rounded-xl shadow-sm border cursor-pointer transition-all duration-200 
              ${
                n.read
                  ? "bg-white border-gray-200"
                  : "bg-blue-50 border-blue-300"
              } 
              hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <div className="text-xl">🚗</div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {n.message}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {!n.read && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}