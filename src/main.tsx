import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./routes/Login/LoginPage";
import AdminPage from "./routes/Admin/AdminPage";
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
import YourPostPage from "./routes/YourPostPage/YourPostPage";
import CreateNewMusicPage from "./routes/CreateNewMusicPage/CreateNewMusicPage";
import AlbumPage from "./routes/AlbumPage/AlbumPage";
import SearchPage from "./routes/SearchPage/SearchPage";
import { useCookies } from "react-cookie";

const container = document.getElementById("root");
const root = createRoot(container!);

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [cookies] = useCookies(["Authorization"]);

  const auth = cookies.Authorization ? true : false;

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  return children;
}

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="777912629310-2aqjjt2u4lr2s2drqd75mdoi5u3iet78.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot_account" element={<ForgotAccount />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/activate" element={<ActivationPage />} />
          <Route path="/your_post" element={<YourPostPage />} />
          <Route path="/album_page/:albumID" element={<AlbumPage />} />
          <Route path="/search_page" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile_page" element={<ProfilePage />} />
          <Route
            path="/create_new_music_page"
            element={<CreateNewMusicPage />}
          />
          <Route
            path="/admin_page"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit_profile"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/get_verified_page"
            element={
              <ProtectedRoute>
                <GetVerifiedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification_settings"
            element={
              <ProtectedRoute>
                <NotificationSettings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
