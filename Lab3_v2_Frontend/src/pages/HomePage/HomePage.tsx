import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuctionList, { type Auction } from "../../components/AuctionList/AuctionList";
import "./HomePage.css";
import logo from "../../assets/logo.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await fetch("http://localhost:5064/api/Auction");
        const data = await response.json();

        // Take only first 3 auctions for preview
        setAuctions(data.slice(0, 3));
      } catch {
        // silent fail for homepage preview
      } finally {
        setLoading(false);
      }
    }

    fetchAuctions();
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">

        {/* HERO SECTION */}
        <img src={logo} alt="BookBit Logo" className="home-logo" />

        <h1 className="home-title">Welcome to BookBit</h1>
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

      {/* AUCTION PREVIEW SECTION */}
      <div className="home-preview-section">
        <h2 className="preview-title">Available Auctions</h2>

        {loading ? (
          <div className="preview-loading">Loading auctions...</div>
        ) : (
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