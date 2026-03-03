import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import AuctionsPage from "./pages/AuctionsPage/AuctionsPage";
import UserAccountPage from "./pages/UserAccountPage/UserAccountPage";
import HomePage from "./pages/HomePage/HomePage";
import AuctionDetailsPage from "./pages/AuctionDetailsPage/AuctionDetailsPage";
import CreateAuctionPage from "./pages/CreateAuctionPage/CreateAuctionPage";
import EditAuctionPage from "./pages/EditAuctionPage/EditAuctionPage";




function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auctions" element={<AuctionsPage />} />
      <Route path="/account" element={<UserAccountPage />} />
      <Route path="/create-auction" element={<CreateAuctionPage />} />
      <Route path="/edit-auction/:id" element={<EditAuctionPage />} />
      <Route path="/auctions/:id" element={<AuctionDetailsPage />} />
    </Routes>
  );
}

export default App;

