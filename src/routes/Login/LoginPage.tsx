import { SyntheticEvent, useState } from "react";
import "./LoginPage.css";
import { Link, Navigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [navigate, setNavigate] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      console.log("Sending login request with:", { email, password });
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status} - ${errorText}`);
        setError("Invalid email or password. Please try again.");
        return;
      }

      const content = await response.json();

      if (content.status === "Ok") {
        setNavigate(true);
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Error occurred during login. Please try again.");
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setNavigate(true);
    },
  });

  if (navigate) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <h2 className="login-title">Login to Spotify</h2>
        <div className="google-button">
          <button onClick={() => login()} className="google-login-button">
            <img src="./src/assets/google.webp" alt="Google Icon" />
            Continue with Google
          </button>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <div className="login-footer">
          <a href="/forgot_account" className="forgot-password-link">
            Forgot your password?
          </a>
          <p className="register-link">
            Don't have an account?{" "}
            <Link to="/register">Sign up for Notify</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
