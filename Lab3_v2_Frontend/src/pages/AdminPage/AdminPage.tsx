import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminAuctionPreview from "../../components/AdminAuctionPreview/AdminAuctionPreview";
import type { Auction } from "../../types/Auction";
import "./AdminPage.css";

type User = {
  userId: number;
  userName: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
};

export default function AdminPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showAuctions, setShowAuctions] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  // -------------------- LOAD USERS --------------------

  const loadUsers = async () => {
    const response = await fetch("http://localhost:5064/api/User", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) return;

    const data = await response.json();
    setUsers(data);
  };

  // -------------------- USER ACTIONS --------------------

  const handleDeactivateUser = async (userId: number) => {
    await fetch(`http://localhost:5064/api/User/deactivate/${userId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadUsers();
  };

  const handleReactivateUser = async (userId: number) => {
    await fetch(`http://localhost:5064/api/User/reactivate/${userId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadUsers();
  };

  // -------------------- LOAD AUCTIONS --------------------

  const loadAuctions = async () => {
    const response = await fetch("http://localhost:5064/api/Auction", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) return;

    const data = await response.json();
    setAuctions(data);
  };

  // -------------------- AUCTION ACTIONS --------------------

  const handleDeactivateAuction = async (auctionId: number) => {
    await fetch(
      `http://localhost:5064/api/Auction/deactivate/${auctionId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    loadAuctions();
  };

  const handleReactivateAuction = async (auctionId: number) => {
    await fetch(
      `http://localhost:5064/api/Auction/reactivate/${auctionId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    loadAuctions();
  };

  return (
    <Layout hideCreateButton>
      <div className="admin-container">

        <div className="admin-header">
          <button
            className="create-return-btn"
            onClick={() => navigate(-1)}
          >
            ← Return
          </button>
          <h1 className="admin-title">Admin Dashboard</h1>
          <div style={{ width: "80px" }} />
        </div>

        {/* ================= USERS ================= */}
        <div className="admin-card">
          <div className="admin-section-header">
            <h2>Manage Users</h2>
            <button
              className="admin-toggle-btn"
              onClick={() => setShowUsers(!showUsers)}
            >
              {showUsers ? "Hide ▲" : "Show ▼"}
            </button>
          </div>

          {showUsers && (
            <div className="admin-list">
              {users.map((user) => (
                <div
                  key={user.userId}
                  className={`admin-item ${
                    user.isActive ? "active-item" : "inactive-item"
                  }`}
                >
                  <div>
                    <strong>{user.userName}</strong>
                    <p>{user.email}</p>
                    <small>
                      Status: {user.isActive ? "Active" : "Inactive"}
                    </small>
                  </div>

                  {!user.isAdmin && (
                    <div className="admin-actions">
                      {user.isActive ? (
                        <button
                          className="admin-btn deactivate"
                          onClick={() => handleDeactivateUser(user.userId)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="admin-btn reactivate"
                          onClick={() => handleReactivateUser(user.userId)}
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= AUCTIONS ================= */}
        <div className="admin-card">
          <div className="admin-section-header">
            <h2>Manage Auctions</h2>
            <button
              className="admin-toggle-btn"
              onClick={() => {
                const state = !showAuctions;
                setShowAuctions(state);
                if (state) loadAuctions();
              }}
            >
              {showAuctions ? "Hide ▲" : "Show ▼"}
            </button>
          </div>

          {showAuctions && (
            <div className="admin-list">
              {auctions.map((auction) => (
                <div
                  key={auction.auctionId}
                  className={`admin-item ${
                    auction.isActive ? "active-item" : "inactive-item"
                  }`}
                >
                  <div>
                    <strong>{auction.bookTitle}</strong>
                    <p>Owner: {auction.creatorUserName}</p>
                    <p>Price: {auction.currentPrice} kr</p>
                    <p>
                      Ends:{" "}
                      {new Date(auction.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="admin-actions">
                    <button
                      className="admin-btn view"
                      onClick={() => setSelectedAuction(auction)}
                    >
                      View
                    </button>

                    {auction.isActive ? (
                      <button
                        className="admin-btn deactivate"
                        onClick={() =>
                          handleDeactivateAuction(auction.auctionId)
                        }
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className="admin-btn reactivate"
                        onClick={() =>
                          handleReactivateAuction(auction.auctionId)
                        }
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedAuction && (
        <AdminAuctionPreview
          auction={selectedAuction}
          onClose={() => setSelectedAuction(null)}
        />
      )}
    </Layout>
  );
}