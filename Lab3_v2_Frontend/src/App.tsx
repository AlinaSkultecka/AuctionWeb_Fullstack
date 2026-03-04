import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import AuctionsPage from "./pages/AuctionsPage/AuctionsPage";
import UserAccountPage from "./pages/UserAccountPage/UserAccountPage";
import HomePage from "./pages/HomePage/HomePage";
import AuctionDetailsPage from "./pages/AuctionDetailsPage/AuctionDetailsPage";
import CreateAuctionPage from "./pages/CreateAuctionPage/CreateAuctionPage";
import EditAuctionPage from "./pages/EditAuctionPage/EditAuctionPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auctions" element={<AuctionsPage />} />

      <Route
        path="/account"
        element={
          isAuthenticated
            ? <UserAccountPage />
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/create-auction"
        element={
          isAuthenticated
            ? <CreateAuctionPage />
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/edit-auction/:id"
        element={
          isAuthenticated
            ? <EditAuctionPage />
            : <Navigate to="/login" />
        }
      />

      <Route path="/auctions/:id" element={<AuctionDetailsPage />} />

      <Route
        path="/admin"
        element={
          isAuthenticated && user?.isAdmin
            ? <AdminPage />
            : <Navigate to="/" />
        }
      />
    </Routes>
  );
}

export default App;
