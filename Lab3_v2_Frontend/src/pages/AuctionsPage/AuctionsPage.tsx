import { useMemo, useState, useEffect } from "react";
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
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [query, setQuery] = useState("");
  const [showEnded, setShowEnded] = useState(false);
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
    const now = new Date();

    return auctions.filter((a) => {
      const matchesSearch =
        a.bookTitle.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q);

      const isEnded = new Date(a.endDate) < now;

      const matchesStatus = showEnded ? isEnded : !isEnded;

      return matchesSearch && matchesStatus;
    });
  }, [auctions, query, showEnded]);

  return (
    <Layout
      showSearch={true}
      showReturn={false}
      searchQuery={query}
      onSearchChange={setQuery}
      showEnded={showEnded}
      onToggleEnded={() => setShowEnded(!showEnded)}
    >
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