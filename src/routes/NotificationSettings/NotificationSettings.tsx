import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar/Navbar";
import "./NotificationSettings.css";

type NotificationType = "email" | "push";

type Settings = {
  musicRecommendations: Record<NotificationType, boolean>;
  podcastRecommendations: Record<NotificationType, boolean>;
  followers: Record<NotificationType, boolean>;
};

function NotificationSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    musicRecommendations: { email: false, push: false },
    podcastRecommendations: { email: false, push: false },
    followers: { email: false, push: false },
  });

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleChange = (category: keyof Settings, type: NotificationType) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [type]: !prevSettings[category][type],
      },
    }));
  };

  return (
    <div className="notification-settings-container">
      <Navbar />
      <div className="content">
        <button className="back-button" onClick={handleBack}>
          <IoArrowBackCircleOutline size={30} />
        </button>
        <div className="settings-content">
          <h2>Notification settings</h2>
          <p>
            Pick the notifications you want to get via push or email. These
            preferences only apply to push and email.
          </p>
          <div className="settings">
            <div className="setting-item">
              <h3>Music & Artist Recommendations</h3>
              <div className="setting-options">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.musicRecommendations.email}
                    onChange={() =>
                      handleChange("musicRecommendations", "email")
                    }
                  />
                  Email
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.musicRecommendations.push}
                    onChange={() =>
                      handleChange("musicRecommendations", "push")
                    }
                  />
                  Push
                </label>
              </div>
            </div>
            <div className="setting-item">
              <h3>Podcast Recommendations</h3>
              <div className="setting-options">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.podcastRecommendations.email}
                    onChange={() =>
                      handleChange("podcastRecommendations", "email")
                    }
                  />
                  Email
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.podcastRecommendations.push}
                    onChange={() =>
                      handleChange("podcastRecommendations", "push")
                    }
                  />
                  Push
                </label>
              </div>
            </div>
            <div className="setting-item">
              <h3>Followers</h3>
              <div className="setting-options">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.followers.email}
                    onChange={() => handleChange("followers", "email")}
                  />
                  Email
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.followers.push}
                    onChange={() => handleChange("followers", "push")}
                  />
                  Push
                </label>
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <button className="cancel-button" onClick={handleBack}>
              Cancel
            </button>
            <button className="save-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationSettings;
