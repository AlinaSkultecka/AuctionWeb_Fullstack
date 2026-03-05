import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";

import {
  getAuctionById,
  deleteAuction,
  placeBid
} from "../../services/auctionService";

import "./AuctionDetailsPage.css";
import type { Auction } from "../../types/Auction";
import type { Bid } from "../../types/Bid";

type AuctionDetails = Auction & {
  userId: number;
  bids: Bid[];
};

export default function AuctionDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, isAuthenticated, user } = useAuth();

  const [auction, setAuction] = useState<AuctionDetails | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // ================= FETCH AUCTION =================

  useEffect(() => {
    async function loadAuction() {
      try {
        if (!id) return;

        const data = await getAuctionById(id);

        setAuction(data);
        setBids(data.bids ?? []);
      } catch {
        setError("Failed to load auction.");
      } finally {
        setLoading(false);
      }
    }

    loadAuction();
  }, [id]);

  // Redirect if auction not found

  useEffect(() => {
    if (!loading && !auction) {
      navigate("/auctions");
    }
  }, [loading, auction, navigate]);

  // ================= COMPUTED VALUES =================

  const currentHighest = useMemo(() => {
    if (!auction) return 0;

    return bids.length > 0
      ? Math.max(...bids.map(b => b.amount))
      : auction.currentPrice;
  }, [bids, auction]);

  const isAuctionClosed =
    auction && new Date(auction.endDate) < new Date();

  const isOwner = auction && user?.userId === auction.userId;

  // ================= DELETE AUCTION =================

  const handleDeleteAuction = async () => {
    if (!auction || !token) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this auction?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAuction(auction.auctionId, token);
      navigate("/auctions");
    } catch {
      alert("Failed to delete auction.");
    }
  };

  // ================= PLACE BID =================

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!auction) return;

    if (!isAuthenticated) {
      setError("You must be logged in to place a bid.");
      return;
    }

    if (isOwner) {
      setError("You cannot bid on your own auction.");
      return;
    }

    if (isAuctionClosed) {
      setError("Auction has ended.");
      return;
    }

    const amount = Number(bidAmount);

    if (!amount || isNaN(amount)) {
      setError("Enter a valid number.");
      return;
    }

    if (amount <= currentHighest) {
      setError(`Bid must be higher than ${currentHighest}.`);
      return;
    }

    try {
      const newBid = await placeBid(auction.auctionId, amount, token!);

      setBids(prev => [newBid, ...prev]);

      setAuction(prev =>
        prev ? { ...prev, currentPrice: newBid.amount } : prev
      );

      setBidAmount("");

    } catch {
      setError("Server connection failed.");
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <Layout showSearch showReturn searchQuery={query} onSearchChange={setQuery}>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!auction) return null;

  // ================= UI =================

  return (
    <Layout showSearch showReturn searchQuery={query} onSearchChange={setQuery}>
      <div className="details-container">
        <div className="details-card">
          <div className="details-grid">

            {/* LEFT SIDE */}

            <div className="book-card">
              <div className="book-image">
                {auction.imageUrl ? (
                  <img src={auction.imageUrl} alt={auction.bookTitle} />
                ) : (
                  <div className="book-placeholder">📚</div>
                )}
              </div>

              <div className="book-info">
                <h1>{auction.bookTitle}</h1>
                <p>{auction.author}</p>

                <div>
                  Owner: <strong>{auction.creatorUserName}</strong>
                </div>

                <div>
                  Ends: {new Date(auction.endDate).toLocaleString()}
                </div>

                <div>
                  Current highest: {currentHighest} kr
                </div>

                {isAuctionClosed && (
                  <div style={{ color: "red", fontWeight: "bold" }}>
                    Auction Closed
                  </div>
                )}

                <p>{auction.description}</p>

                {isOwner && !isAuctionClosed && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                    <button
                      className="edit-auction-btn"
                      onClick={() => navigate(`/edit-auction/${auction.auctionId}`)}
                    >
                      Edit Auction
                    </button>

                    <button
                      className="delete-auction-btn"
                      onClick={handleDeleteAuction}
                    >
                      Delete Auction
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}

            <div className="bid-card">
              <h2>Place a bid</h2>

              {isAuthenticated && !isOwner && !isAuctionClosed ? (
                <form onSubmit={handlePlaceBid}>
                  <label>Your bid (kr)</label>

                  <div>
                    <input
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      placeholder={`More than ${currentHighest}`}
                    />

                    <button type="submit">Bid</button>
                  </div>

                  {error && (
                    <div style={{ color: "red", marginTop: "6px" }}>
                      {error}
                    </div>
                  )}
                </form>
              ) : (
                <div style={{ marginBottom: "1rem" }}>
                  {!isAuthenticated && "Login to place a bid."}
                  {isOwner && "You cannot bid on your own auction."}
                  {isAuctionClosed && "Auction has ended."}
                </div>
              )}

              {!isAuctionClosed ? (
                <>
                  <h3>Bid history</h3>

                  {bids.length === 0 ? (
                    <div>No bids yet</div>
                  ) : (
                    [...bids]
                      .sort((a, b) => b.amount - a.amount)
                      .map(b => (
                        <div key={b.bidId} style={{ marginBottom: "8px" }}>
                          <div>
                            <strong>{b.amount} kr</strong> -{" "}
                            {b.userId === user?.userId ? (
                              <span style={{ color: "green", fontWeight: "bold" }}>
                                You
                              </span>
                            ) : (
                              <span>{b.userName}</span>
                            )}
                          </div>

                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            {new Date(b.bidDate).toLocaleString()}
                          </div>
                        </div>
                      ))
                  )}
                </>
              ) : (
                <>
                  <h3>Winning bid</h3>
                  <div>{currentHighest} kr</div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}