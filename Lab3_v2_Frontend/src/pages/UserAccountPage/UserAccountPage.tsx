import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
import "./UserAccountPage.css";

export default function UserAccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 👇 Always define hooks first
  const [preview, setPreview] = useState<string>(user?.photoUrl ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  const passwordValid = useMemo(() => {
    if (!newPassword) return true;
    return newPassword.length >= 6 && newPassword === repeatNewPassword;
  }, [newPassword, repeatNewPassword]);

  // 👇 NOW safe to conditionally return
  if (!user) {
    return (
      <Layout hideCreateButton>
        <div className="account-container">
          <p>You must be logged in to view this page.</p>
        </div>
      </Layout>
    );
  }

  const handlePickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile saved (connect backend here)");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValid) {
      alert("New password must match and be 6+ characters.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setRepeatNewPassword("");

    alert("Password updated (connect backend here)");
  };

  return (
    <Layout hideCreateButton>
      <div className="account-container">
        <div className="account-card">

          {/* LEFT SIDE */}
          <div className="account-left">

            <div className="account-header">
              <button
                className="account-return-btn"
                onClick={() => navigate(-1)}
              >
                ←
              </button>

              <div>
                <h3 className="account-title">My Account</h3>
              </div>
            </div>

            <div className="profile-photo">
              {preview ? (
                <img src={preview} alt="Profile" />
              ) : (
                <div className="profile-placeholder">👤</div>
              )}
            </div>

            <label className="photo-btn">
              Change photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePickPhoto}
              />
            </label>

            <div className="user-mini">
              <div className="pillUser">
                Username: <b>{user.userName}</b>
              </div>

              <div className="pillUser">
                Email: <b>{user.email}</b>
              </div>

              <div className="pillUser">
                Status: <b>{user.isActive ? "Active" : "Inactive"}</b>
              </div>

              <div className="pillUser">
                Role: <b>{user.isAdmin ? "Admin" : "User"}</b>
              </div>
            </div>

            <div className="actions">
              <button
                className="secondary"
                type="button"
                onClick={logout}
              >
                Logout
              </button>

              <button
                className="danger"
                type="button"
                onClick={() => alert("Delete account logic here")}
              >
                Delete account
              </button>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="account-right">

            <h2 className="settings-title">Account Settings</h2>

            {/* PROFILE UPDATE */}
            <div className="section">
              <form onSubmit={handleSaveProfile} className="form-grid">
                <div className="field span-2">
                  <label>Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>

                <button className="primary" type="submit">
                  Save email & photo
                </button>
              </form>
            </div>

            {/* PASSWORD UPDATE */}
            <form onSubmit={handleChangePassword} className="pw-form">

              <div className="field" id = "current-pw">
                <label>Current password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  required
                />
              </div>

              <div className="pw-row">
                <div className="field">
                  <label>New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="field">
                  <label>Repeat new password</label>
                  <input
                    type="password"
                    value={repeatNewPassword}
                    onChange={(e) =>
                      setRepeatNewPassword(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {!passwordValid && (
                <small className="error">
                  Passwords must match and be 6+ characters.
                </small>
              )}

              <button className="primary" type="submit">
                Update password
              </button>
            </form>

          </div>

        </div>
      </div>
    </Layout>
  );
}