import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
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
  const [error, setError] = useState("");


  useEffect(() => {
    async function fetchAuction() {
      const response = await fetch(
        `http://localhost:5064/api/Auction/${id}`
      );

      if (!response.ok) {
        navigate("/auctions");
        return;
      }

      const data = await response.json();

      if (data.userId !== user?.userId) {
        navigate("/auctions");
        return;
      }

      setBookTitle(data.bookTitle);
      setAuthor(data.author);
      setDescription(data.description);
      setStartPrice(String(data.startPrice));
      setEndDate(data.endDate.slice(0, 10));
      setImageUrl(data.imageUrl ?? "");

      setLoading(false);
    }

    fetchAuction();
  }, [id, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch(
      `http://localhost:5064/api/Auction/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
        bookTitle,
        author,
        description,
        isbn,
        genre,
        condition,
        startPrice: Number(startPrice),
        endDate,
        imageUrl
        })
      }
    );

    if (!response.ok) {
      setError("Failed to update auction.");
      return;
    }

    navigate(`/auctions/${id}`);
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
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                required
                />
            </div>

            <div className="field">
                <label>Author *</label>
                <input
                type="text"
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
                type="text"
                value={isbn}
                maxLength={20}
                onChange={(e) => setIsbn(e.target.value)}
            />
            </div>

            <div className="field">
            <label>Genre</label>
            <input
                type="text"
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
                value={startPrice}
                min="0"
                step="1"
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
                <label>Image URL (optional)</label>
                <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>

            <button type="submit" className="primary" disabled={loading}>
                {loading ? "Updating..." : "Update Auction"}
            </button>

          </form>
        </div>
      </div>
    </Layout>
  );
}