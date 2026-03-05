import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
import {
  getAuctionById,
  updateAuction
} from "../../services/auctionService";

import "../CreateAuctionPage/CreateAuctionPage.css";

export default function EditAuctionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, user } = useAuth();

  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState("");
  const [condition, setCondition] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH AUCTION =================

  useEffect(() => {
    async function fetchAuction() {
      try {
        if (!id) return;

        const data = await getAuctionById(id);

        // Prevent editing someone else's auction
        if (data.userId !== user?.userId) {
          navigate("/auctions");
          return;
        }

        setBookTitle(data.bookTitle);
        setAuthor(data.author);
        setDescription(data.description);
        setIsbn(data.isbn ?? "");
        setGenre(data.genre ?? "");
        setCondition(data.condition ?? "");
        setStartPrice(String(data.startPrice));
        setEndDate(data.endDate.slice(0, 10));
        setImageUrl(data.imageUrl ?? "");

      } catch {
        navigate("/auctions");
      } finally {
        setLoading(false);
      }
    }

    fetchAuction();
  }, [id, navigate, user]);

  // ================= UPDATE AUCTION =================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!id || !token) return;

    if (!bookTitle || !author || !description || !startPrice || !endDate) {
      setError("Please fill all required fields.");
      return;
    }

    const price = Number(startPrice);

    if (!price || price <= 0) {
      setError("Start price must be greater than 0.");
      return;
    }

    setSaving(true);

    try {
      await updateAuction(
        id,
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
        token
      );

      navigate(`/auctions/${id}`);

    } catch {
      setError("Failed to update auction.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: "3rem" }}>Loading...</div>
      </Layout>
    );
  }

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

            <h2>Edit Auction</h2>
          </div>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit} className="form-grid">

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

            <div className="field span-2">
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

            <div className="field span-2">
              <label>Image URL</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <button type="submit" className="primary" disabled={saving}>
              {saving ? "Updating..." : "Update Auction"}
            </button>

          </form>

        </div>
      </div>

    </Layout>
  );
}