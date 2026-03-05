import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuctions } from "../../services/auctionService";
import AuctionList from "../../components/AuctionList/AuctionList";
import type { Auction } from "../../types/Auction";

import "./HomePage.css";
import logo from "../../assets/logo.png";

export default function HomePage() {
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAuctions();
  }, []);

  async function loadAuctions() {
    try {
      const data = await getAuctions();

      // Show only first 3 auctions on homepage
      setAuctions(data.slice(0, 3));

    } catch {
      setError("Unable to load auctions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home-container">

      {/* HERO SECTION */}
      <div className="home-content">

        <img src={logo} alt="BookBid Logo" className="home-logo" />

        <h1 className="home-title">Welcome to BookBid</h1>

        <p className="home-subtitle">
          Discover books. Place bids. Win auctions.
        </p>

        <button
          className="home-login-btn"
          onClick={() => navigate("/login")}
        >
          Login or Sign Up
        </button>

      </div>

      {/* AUCTION PREVIEW */}
      <div className="home-preview-section">

        <h2 className="preview-title">Available Auctions</h2>

        {loading && (
          <div className="preview-loading">Loading auctions...</div>
        )}

        {!loading && error && (
          <div className="preview-error">{error}</div>
        )}

        {!loading && !error && auctions.length === 0 && (
          <div className="preview-empty">No auctions available yet.</div>
        )}

        {!loading && !error && auctions.length > 0 && (
          <>
            <div className="home-preview-list">
              <AuctionList auctions={auctions} />
            </div>

            <button
              className="view-all-btn"
              onClick={() => navigate("/auctions")}
            >
              View All Auctions →
            </button>
          </>
        )}

      </div>

    </div>
  );
}