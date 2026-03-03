import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
import "./AuctionDetailsPage.css";

type Bid = {
  bidId: number;
  amount: number;
  bidDate: string;
  userId: number;
  auctionId: number;
  user?: {
    userId: number;
    userName: string;
  };
};

type AuctionDetails = {
  auctionId: number;
  bookTitle: string;
  author: string;
  description: string;
  imageUrl?: string;
  endDate: string;
  currentPrice: number;
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

  // Fetch auction
  useEffect(() => {
    async function fetchAuction() {
      try {
        const response = await fetch(
          `http://localhost:5064/api/Auction/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch auction.");
        }

        const data = await response.json();
        setAuction(data);
        setBids(data.bids ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAuction();
  }, [id]);

  // Redirect if not found
  useEffect(() => {
    if (!loading && !auction) {
      navigate("/auctions");
    }
  }, [loading, auction, navigate]);

  const currentHighest = useMemo(() => {
    return bids.length > 0
      ? Math.max(...bids.map(b => b.amount))
      : auction?.currentPrice ?? 0;
  }, [bids, auction]);

  const isAuctionClosed = auction
    ? new Date(auction.endDate) < new Date()
    : false;

  const isOwner = !!auction && user?.userId === auction.userId;

  // -------------------------
  // DELETE AUCTION
  // -------------------------
  const handleDeleteAuction = async () => {
    if (!auction) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this auction?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5064/api/Auction/${auction.auctionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete auction.");
      }

      navigate("/auctions");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // -------------------------
  // PLACE BID
  // -------------------------
  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      const response = await fetch("http://localhost:5064/api/Bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          auctionId: auction?.auctionId,
          amount
        })
      });

      if (!response.ok) {
        throw new Error("Bid failed.");
      }

      const newBid = await response.json();

      setBids(prev => [newBid, ...prev]);

      setAuction(prev =>
        prev ? { ...prev, currentPrice: newBid.amount } : prev
      );

      setBidAmount("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Layout showSearch showReturn searchQuery={query} onSearchChange={setQuery}>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!auction) return null;

  console.log("Logged in userId:", user?.userId);
console.log("Auction owner userId:", auction?.userId);
console.log("Is Owner:", user?.userId === auction?.userId);


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

                {/* EDIT and DELETE BUTTON */}
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
                    bids.map(b => (
                      <div key={b.bidId} style={{ marginBottom: "8px" }}>
                        <div>
                          {b.amount} kr — {b.user?.userName ?? "User"}
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