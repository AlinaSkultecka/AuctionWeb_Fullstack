import { useMemo, useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AuctionList from "../../components/AuctionList/AuctionList";
import { getAuctions } from "../../services/auctionService";

import "./AuctionsPage.css";

import type { Auction } from "../../types/Auction";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [query, setQuery] = useState("");
  const [showEnded, setShowEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      const data = await getAuctions();
      setAuctions(data);
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

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

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">No auctions match your search.</div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <AuctionList auctions={filtered} />
      )}
    </Layout>
  );
}