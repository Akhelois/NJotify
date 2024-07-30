import { SyntheticEvent, useState, useEffect } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useCookies } from "react-cookie";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const [cookies, setCookies] = useCookies(["Authorization"]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate a loading delay
  }, []);

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const content = await response.json();
        console.log("Received login response:", content.data); // Debugging
        localStorage.setItem("user", JSON.stringify(content));
        console.log(content.cookie);
        setCookies("Authorization", content.cookie);
        if (content.data.role == "Listener") nav("/home");
        if (content.data.role == "Admin") nav("/admin_page");
      } else {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status} - ${errorText}`);
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }

    const response1 = await fetch("http://localhost:8080/validate", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));

    console.log(response1);
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      nav("/home");
    },
  });

  return (
    <div className="login-page">
      {loading ? (
        <div>
          <Skeleton
            height={60}
            width={`100%`}
            baseColor="#202020"
            highlightColor="#444"
          />
          <div className="login-container">
            <Skeleton
              height={40}
              width={`60%`}
              baseColor="#202020"
              highlightColor="#444"
            />
            <div className="google-button">
              <Skeleton
                height={40}
                width={`100%`}
                baseColor="#202020"
                highlightColor="#444"
              />
            </div>
            <form className="login-form">
              <Skeleton
                height={40}
                width={`100%`}
                baseColor="#202020"
                highlightColor="#444"
              />
              <Skeleton
                height={40}
                width={`100%`}
                baseColor="#202020"
                highlightColor="#444"
              />
              {error && <p className="error">{error}</p>}
            </form>
            <div className="login-footer">
              <Skeleton
                height={40}
                width={`100%`}
                baseColor="#202020"
                highlightColor="#444"
              />
              <Skeleton
                height={40}
                width={`100%`}
                baseColor="#202020"
                highlightColor="#444"
              />
            </div>
          </div>
          <Skeleton
            height={60}
            width={`100%`}
            baseColor="#202020"
            highlightColor="#444"
          />
        </div>
      ) : (
        <>
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
              <button type="submit" className="login-button" disabled={loading}>
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
          <div className="footer">
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}

export default LoginPage;
