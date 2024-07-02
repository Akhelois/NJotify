import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./ActivitionPage.css";

function ActivationPage() {
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      fetch(`http://localhost:8080/activate?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          if (data.status === "Ok") {
            setActivated(true);
          } else {
            setError("Activation failed. Please try again.");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error:", error);
          setError("An error occurred. Please try again.");
        });
    } else {
      setLoading(false);
      setError("Invalid activation link.");
    }
  }, [location]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (activated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="activation-page">
      <Navbar />
      <div className="activation-container">
        <h2>Account Activation</h2>
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <p>Activating your account...</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ActivationPage;
