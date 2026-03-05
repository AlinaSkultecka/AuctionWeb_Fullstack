import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
import { createAuction } from "../../services/auctionService";

import "./CreateAuctionPage.css";

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState("");
  const [condition, setCondition] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div style={{ padding: "3rem", textAlign: "center" }}>
          <h2>You must be logged in to create an auction.</h2>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!bookTitle || !author || !description || !startPrice || !endDate) {
      setError("Please fill all required fields.");
      return;
    }

    const price = Number(startPrice);

    if (!price || price <= 0) {
      setError("Start price must be greater than 0.");
      return;
    }

    setLoading(true);

    try {
      await createAuction(
        {
          bookTitle,
          author,
          description,
          isbn,
          genre,
          condition,
          startPrice: price,
          endDate,
          imageUrl
        },
        token!
      );

      navigate("/auctions");

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout hideCreateButton>

      <div className="create-container">
        <div className="create-card">

          <div className="create-header">
            <button
              type="button"
              className="create-return-btn"
              onClick={() => navigate(-1)}
            >
              ← Return
            </button>

            <h2>Create New Auction</h2>
          </div>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>

            <div className="field">
              <label>Book Title *</label>
              <input
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Author *</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>ISBN</label>
              <input
                value={isbn}
                maxLength={20}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Genre</label>
              <input
                value={genre}
                maxLength={100}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Used">Used</option>
              </select>
            </div>

            <div className="field">
              <label>Start Price (kr) *</label>
              <input
                type="number"
                min="1"
                step="1"
                value={startPrice}
                onChange={(e) => setStartPrice(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Image URL</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Auction"}
            </button>

          </form>

        </div>
      </div>

    </Layout>
  );
}