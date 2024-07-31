import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./AdminPage.css";

interface VerificationRequest {
  id: number;
  role: string;
  description: string;
  profilePicture: string;
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
      <h1>Pending Verification Requests</h1>
      <div className="requests-container">
        {pendingVerifications.map((req) => (
          <div key={req.id} className="request-card">
            <img src={req.profilePicture} alt="Profile" />
            <p>
              <strong>ID:</strong> {req.id}
            </p>
            <p>
              <strong>Role:</strong> {req.role}
            </p>
            <p>
              <strong>Description:</strong> {req.description}
            </p>
            <div className="actions">
              <button onClick={() => handleApprove(req.id)}>Approve</button>
              <button onClick={() => handleReject(req.id)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
