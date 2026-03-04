import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
import "./UserAccountPage.css";

export default function UserAccountPage() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  // ================= STATE =================
  const [preview, setPreview] = useState<string>(user?.photoUrl ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ================= VALIDATION =================
  const passwordValid = useMemo(() => {
    if (!newPassword) return true;
    return newPassword.length >= 6 && newPassword === repeatNewPassword;
  }, [newPassword, repeatNewPassword]);

  // ================= PROTECT PAGE =================
  if (!user) {
    return (
      <Layout hideCreateButton>
        <div className="account-container">
          <p>You must be logged in to view this page.</p>
        </div>
      </Layout>
    );
  }

  // ================= PHOTO PREVIEW =================
  const handlePickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  // ================= SAVE PROFILE (EMAIL + PHOTO) =================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Profile save logic not connected yet.");
  };

  // ================= CHANGE PASSWORD =================
const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault();

  setError(null);
  setMessage(null);

  if (!passwordValid) {
    setError("New password must match and be at least 6 characters.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "http://localhost:5064/api/User/update-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword: repeatNewPassword,
        }),
      }
    );

    // Debugging info
    console.log("Status:", response.status);
    console.log("StatusText:", response.statusText);

    const responseText = await response.text();
    console.log("Server response:", responseText);

    if (!response.ok) {
      setError(responseText || `Error ${response.status}`);
      return;
    }

    setMessage(responseText || "Password updated successfully!");

    // Clear only after success
    setCurrentPassword("");
    setNewPassword("");
    setRepeatNewPassword("");

  } catch (err) {
    console.error("Network error:", err);
    setError("Server connection failed.");
  } finally {
    setLoading(false);
  }
};

// ================= DELETE ACCOUNT =================
const handleDeleteAccount = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to permanently delete your account? This cannot be undone."
  );

  if (!confirmDelete) return;

  try {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch(
      "http://localhost:5064/api/User/me",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Delete status:", response.status);

    const text = await response.text();
    console.log("Delete response:", text);

    if (!response.ok) {
      setError(text || "Failed to delete account.");
      return;
    }

    alert("Your account has been deleted.");

    // Logout and redirect
    logout();
    navigate("/");

  } catch (err) {
    console.error("Delete error:", err);
    setError("Server connection failed.");
  } finally {
    setLoading(false);
  }
};

  // ================= RENDER =================
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

              <h3 className="account-title">My Account</h3>
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
              <button className="secondary" type="button" onClick={logout}>
                Logout
              </button>

              <button
                className="danger"
                type="button"
                onClick={handleDeleteAccount}
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

              <div className="field">
                <label>Current password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="pw-row">
                <div className="field">
                  <label>New password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Repeat new password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={repeatNewPassword}
                    onChange={(e) => setRepeatNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {!passwordValid && (
                <small className="error">
                  Passwords must match and be 6+ characters.
                </small>
              )}

              {error && <p className="error">{error}</p>}
              {message && <p className="success">{message}</p>}

              <button className="primary" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update password"}
              </button>

            </form>

          </div>

        </div>
      </div>
    </Layout>
  );
}