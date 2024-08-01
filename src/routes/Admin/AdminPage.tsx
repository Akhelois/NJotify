import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import fallbackImage from "../../assets/profile.png";
import "./AdminPage.css";

interface VerificationRequest {
  id: number;
  name: string;
  profilePicture: string;
  followers: number;
  following: number;
}

function AdminPage() {
  const [pendingVerifications, setPendingVerifications] = useState<
    VerificationRequest[]
  >([]);

  useEffect(() => {
    const fetchPendingVerifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/pending_verifications"
        );
        if (response.ok) {
          const result = await response.json();
          if (Array.isArray(result.data)) {
            setPendingVerifications(result.data);
          } else {
            console.error("Fetched data is not an array:", result.data);
          }
        } else {
          console.error(
            "Error fetching pending verifications:",
            await response.json()
          );
        }
      } catch (error) {
        console.error("Error fetching pending verifications:", error);
      }
    };

    fetchPendingVerifications();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/approve_verification/${id}`,
        { method: "POST" }
      );
      if (response.ok) {
        setPendingVerifications((prev) => prev.filter((req) => req.id !== id));
      } else {
        console.error("Error approving verification:", await response.json());
      }
    } catch (error) {
      console.error("Error approving verification:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/reject_verification/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setPendingVerifications((prev) => prev.filter((req) => req.id !== id));
      } else {
        console.error("Error rejecting verification:", await response.json());
      }
    } catch (error) {
      console.error("Error rejecting verification:", error);
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="artist-list">
        <h1>Admin Page</h1>
        <h1>Verify Artist</h1>
        {pendingVerifications.map((req) => (
          <div key={req.id} className="artist-item">
            <img
              className="artist-avatar"
              src={
                req.profilePicture
                  ? `data:image/jpeg;base64,${req.profilePicture}`
                  : fallbackImage
              }
              alt={`${req.name} avatar`}
              onError={(e) => (e.currentTarget.src = fallbackImage)}
            />
            <div className="artist-info">
              <p>{req.name}</p>
              <p>
                {req.followers || 0} Follower · {req.following || 0} Following
              </p>
            </div>
            <div className="actions">
              <button
                className="reject-button"
                onClick={() => handleReject(req.id)}
              >
                ✖
              </button>
              <button
                className="approve-button"
                onClick={() => handleApprove(req.id)}
              >
                ✔
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
