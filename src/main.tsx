import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./routes/Login/LoginPage";
import AdminPage from "./Admin/AdminPage";
import RegisterPage from "./routes/Register/RegisterPage";
import HomePage from "./routes/Home/HomePage";
import ForgotAccount from "./routes/ForgotAPassword/ForgotPassword";
import ResetPassword from "./routes/ResetPassword/ResetPassword";
import ActivationPage from "./routes/ActivitionPage/ActivitionPage";
import ProfilePage from "./routes/ProfilePage/ProfilePage";
import EditProfilePage from "./routes/EditProfile/EditProfile";
import SettingsPage from "./routes/SettingsPage/SettingsPage";
import GetVerifiedPage from "./routes/GetVerifiedPage/GetVerifiedPage";
import NotificationSettings from "./routes/NotificationSettings/NotificationSettings";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="777912629310-2aqjjt2u4lr2s2drqd75mdoi5u3iet78.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin_page" element={<AdminPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot_account" element={<ForgotAccount />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/activate" element={<ActivationPage />} />
          <Route path="/profile_page" element={<ProfilePage />} />
          <Route path="/edit_profile" element={<EditProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/get_verified_page" element={<GetVerifiedPage />} />
          <Route path="/notification_settings" element={<NotificationSettings />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
