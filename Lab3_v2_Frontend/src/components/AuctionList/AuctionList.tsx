import { useNavigate } from "react-router-dom";
import "./AuctionList.css";

export interface Auction {
  auctionId: number;
  bookTitle: string;
  author: string;
  currentPrice: number;
  endDate: string;
  imageUrl?: string;
}

interface AuctionListProps {
  auctions: Auction[];
}

export default function AuctionList({ auctions }: AuctionListProps) {
  const navigate = useNavigate();

  const goToDetails = (id: number) => {
    // ✅ Always allow navigation
    navigate(`/auctions/${id}`);
  };

  return (
    <div className="auctions-grid">
      {auctions.map((a) => (
        <button
          key={a.auctionId}
          className="auction-card"
          onClick={() => goToDetails(a.auctionId)}
          type="button"
        >
          <div className="auction-image">
            {a.imageUrl ? (
              <img src={a.imageUrl} alt={a.bookTitle} />
            ) : (
              <div className="img-placeholder">📚</div>
            )}
          </div>

          <div className="auction-info">
            <h3>{a.bookTitle}</h3>
            <p>{a.author}</p>

            <div className="auction-meta">
              <span>Current: {a.currentPrice} kr</span>
              <span>
                Ends: {new Date(a.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}