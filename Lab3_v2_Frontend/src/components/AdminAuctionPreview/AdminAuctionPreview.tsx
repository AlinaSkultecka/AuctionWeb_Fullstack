import { useEffect } from "react";
import "./AdminAuctionPreview.css";
import type { Auction } from "../../types/Auction";


type Props = {
  auction: Auction;
  onClose: () => void;
};

export default function AdminAuctionPreview({ auction, onClose }: Props) {

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
  <div className="modal-overlay" onClick={onClose}>
    <div
      className="modal-card"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-grid">

        {/* LEFT SIDE */}
        <div className="modal-book">

          <div className="modal-image">
            {auction.imageUrl ? (
              <img src={auction.imageUrl} alt={auction.bookTitle} />
            ) : (
              <div style={{ fontSize: "50px" }}>📚</div>
            )}
          </div>

          <div className="modal-info">
            <h2 className="modal-title">{auction.bookTitle}</h2>
            <p className="modal-author">{auction.author}</p>

            <div className="modal-meta">
              <span className="modal-pill">
                Owner: {auction.creatorUserName}
              </span>
              <span className="modal-pill">
                Ends: {new Date(auction.endDate).toLocaleDateString()}
              </span>
            </div>

            <p className="modal-desc">{auction.description}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="modal-side">
          <h3>Current Price</h3>
          <div className="modal-highlight">
            {auction.currentPrice} kr
          </div>

          <button className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
);
}