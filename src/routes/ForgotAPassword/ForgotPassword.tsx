import { SyntheticEvent, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import "./ForgotPassword.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

interface FormData {
  email: string;
}

interface Errors {
  email: string;
  general?: string;
}

function ForgotAccount() {
  const [formData, setFormData] = useState<FormData>({ email: "" });
  const [errors, setErrors] = useState<Errors>({ email: "" });
  const [emailSent, setEmailSent] = useState(false);

  const handleInputChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/forgot_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status} - ${errorText}`);
        setErrors({
          email: "",
          general: "Failed to send reset link. Please try again.",
        });
        return;
      }

      const content = await response.json();

      if (content.status === "Ok") {
        setEmailSent(true);
      } else {
        setErrors({
          email: "",
          general: "Email address not found. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setErrors({
        email: "",
        general: "Error occurred during request. Please try again.",
      });
    }
  };

  if (emailSent) {
    return <Navigate to="/reset_password" />;
  }

  return (
    <div className="forgot-account-page">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="forgot-account-form-container">
        <h2 className="forgot-account-title">Find Your Account</h2>
        <form className="forgot-account-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className={`input ${errors.email ? "invalid" : ""}`}
          />
          {errors.email && <p className="validation-message">{errors.email}</p>}
          {errors.general && <p className="error">{errors.general}</p>}
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        <Link to="/" className="cancel-link">
          Cancel
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default ForgotAccount;
