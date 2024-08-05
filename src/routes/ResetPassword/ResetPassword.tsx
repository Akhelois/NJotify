import { SyntheticEvent, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ResetPassword.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface FormData {
  password: string;
  confirmPassword: string;
}

interface Errors {
  password: string;
  confirmPassword: string;
  general?: string;
}

function ResetPassword() {
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({
    password: "",
    confirmPassword: "",
  });
  const [validations, setValidations] = useState({
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    validateForm();
    setLoading(false);
  }, [formData]);

  const handleInputChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const validateForm = () => {
    const { password, confirmPassword } = formData;
    const passwordIsValid =
      /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*()_\-+=.]).{10,}$/.test(password);
    const passwordsMatch = password === confirmPassword;

    setErrors({
      password: passwordIsValid
        ? ""
        : "Password must contain at least 1 letter, 1 number or special character, and be at least 10 characters long.",
      confirmPassword: passwordsMatch ? "" : "Passwords do not match",
    });

    setValidations({
      password: passwordIsValid,
      confirmPassword: passwordsMatch,
    });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!validations.password || !validations.confirmPassword) {
      return;
    }

    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    if (!email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        general:
          "Email is missing. Please try the reset password process again.",
      }));
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password: formData.password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: `Failed to reset password. (${response.status}: ${errorText})`,
        }));
        return;
      }

      const content = await response.json();

      if (content.message === "Password reset successful") {
        window.location.href = "/";
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "Failed to reset password. Please try again.",
        }));
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: "An error occurred during request. Please try again.",
      }));
    }

    setFormData({ password: "", confirmPassword: "" });
  };

  return (
    <div className="reset-password-page">
      <Navbar />
      <h2 className="reset-password-title">Reset Password</h2>
      <div className="reset-password-form-container">
        {loading ? (
          <Skeleton height={300} />
        ) : (
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <input
              type="password"
              name="password"
              placeholder="New Password"
              aria-label="New Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input ${validations.password ? "valid" : "invalid"}`}
            />
            {errors.password && (
              <p
                className={`validation-message ${
                  validations.password ? "valid" : ""
                }`}
              >
                {errors.password}
              </p>
            )}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              aria-label="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`input ${
                validations.confirmPassword ? "valid" : "invalid"
              }`}
            />
            {errors.confirmPassword && (
              <p
                className={`validation-message ${
                  validations.confirmPassword ? "valid" : ""
                }`}
              >
                {errors.confirmPassword}
              </p>
            )}
            {errors.general && <p className="error">{errors.general}</p>}
            <button type="submit" className="reset-password-button">
              Reset Password
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ResetPassword;
