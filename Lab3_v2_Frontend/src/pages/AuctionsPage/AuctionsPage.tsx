import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
import "./AuctionsPage.css";
import AuctionList from "../../components/AuctionList/AuctionList";

type Auction = {
  auctionId: number;
  bookTitle: string;
  author: string;
  imageUrl?: string;
  description: string;
  startPrice: number;
  currentPrice: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  userId: number;
};

export default function AuctionsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); 

  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await fetch("http://localhost:5064/api/Auction");

        if (!response.ok) {
          throw new Error("Server error while fetching auctions.");
        }

        const data = await response.json();
        setAuctions(data);
      } catch {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    }

    fetchAuctions();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return auctions;

    return auctions.filter(
      (a) =>
        a.bookTitle.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
    );
  }, [auctions, query]);

  return (
    <Layout
      showSearch={true}
      showReturn={false}
      searchQuery={query}
      onSearchChange={setQuery}
    >

      {/* 🔹 Show Create Auction Button ONLY if logged in */}
      {isAuthenticated && (
        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <button
            className="create-auction-btn"
            onClick={() => navigate("/create-auction")}
          >
            + Create Auction
          </button>
        </div>
      )}

      {/* 🔹 Show message if NOT logged in */}
      {!isAuthenticated && (
        <div className="info-message">
          Login to create auctions and place bids.
        </div>
      )}

      {loading && (
        <div className="empty-state">Loading auctions...</div>
      )}

      {!loading && error && (
        <div className="empty-state error">{error}</div>
      )}

      {!loading && !error && auctions.length === 0 && (
        <div className="empty-state">No auctions available yet.</div>
      )}

      {!loading && !error && auctions.length > 0 && filtered.length === 0 && (
        <div className="empty-state">No auctions match your search.</div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <AuctionList auctions={filtered} />
      )}

    </Layout>
  );
}