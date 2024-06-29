import { SyntheticEvent, useState, useEffect } from "react";
import "./RegisterPage.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Link, Navigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  email: string;
  password: string;
  confirmPassword: string;
  general?: string;
}

function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validations, setValidations] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const email = formData.email;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    const emailIsValid = /\S+@\S+\.\S+/.test(email);
    const passwordIsValid =
      /[a-zA-Z]/.test(password) &&
      /[0-9!@#\$%\^\&*\)\(+=._-]/.test(password) &&
      password.length >= 10;
    const passwordsMatch = password === confirmPassword;

    setErrors({
      email: emailIsValid ? "" : "Invalid email format",
      password: passwordIsValid
        ? ""
        : "Password must contain at least 1 letter, 1 number or special character, and be at least 10 characters long.",
      confirmPassword: passwordsMatch ? "" : "Passwords do not match",
    });

    setValidations({
      email: emailIsValid,
      password: passwordIsValid,
      confirmPassword: passwordsMatch,
    });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (
      !validations.email ||
      !validations.password ||
      !validations.confirmPassword
    ) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status} - ${errorText}`);
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "Failed to register. Please try again.",
        }));
        return;
      }

      const content = await response.json();

      if (content.status === "Ok") {
        setNavigate(true);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "Failed to register. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: "Error occurred during registration. Please try again.",
      }));
    }

    setFormData({ email: "", password: "", confirmPassword: "" });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setNavigate(true);
    },
  });

  if (navigate) {
    return <Navigate to="/" />;
  }

  return (
    <div className="register-page">
      <Navbar />
      <h2 className="register-title">Sign up to start listening</h2>
      <div className="register-form-container">
        <button onClick={() => login()} className="google-login-button">
          <img src="./src/assets/google.webp" alt="Google Icon" />
          Continue with Google
        </button>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className={`input ${validations.email ? "valid" : "invalid"}`}
          />
          {errors.email && (
            <p
              className={`validation-message ${validations.email ? "valid" : ""}`}
            >
              {errors.email}
            </p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className={`input ${validations.password ? "valid" : "invalid"}`}
          />
          {errors.password && (
            <p
              className={`validation-message ${validations.password ? "valid" : ""}`}
            >
              {errors.password}
            </p>
          )}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`input ${validations.confirmPassword ? "valid" : "invalid"}`}
          />
          {errors.confirmPassword && (
            <p
              className={`validation-message ${validations.confirmPassword ? "valid" : ""}`}
            >
              {errors.confirmPassword}
            </p>
          )}
          {errors.general && <p className="error">{errors.general}</p>}
          <button type="submit" className="register-button">
            Sign Up
          </button>
        </form>
      </div>
      <div className="haveAccount">
        <p>
          Already have an account? <Link to="/">Log in to NJotify</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterPage;
