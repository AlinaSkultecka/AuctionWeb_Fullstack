import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import "./Layout.css";

type LayoutProps = {
  children: ReactNode;
  showSearch?: boolean;
  showReturn?: boolean;
  hideCreateButton?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  showEnded?: boolean;
  onToggleEnded?: () => void;
};

export default function Layout({
  children,
  showSearch = false,
  showReturn = false,
  hideCreateButton = false,
  searchQuery = "",
  onSearchChange,
  showEnded = false,
  onToggleEnded
}: LayoutProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="layout-container">

      {/* ================= NAVIGATION ================= */}
      <header className="navbar">

        {/* ================= ROW 1 ================= */}
        <div className="nav-row nav-row-1">

          {/* LEFT - Logo */}
          <div className="nav-left">
            <img
              src={logo}
              alt="BookBit"
              className="nav-logo"
              onClick={() => navigate("/auctions")}
            />
          </div>

          {/* RIGHT - Auth Buttons */}
          <div className="nav-right">
            {isAuthenticated ? (
              <>
                {user?.isAdmin && (
                <button
                  className="nav-btn"
                  onClick={() => navigate("/admin")}
                >
                  Admin Panel
                </button>
              )}
                <button
                  className="account-btn"
                  onClick={() => navigate("/account")}
                >
                  👤 Account Details
                </button>

                <button
                  className="logout-btn"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* ================= ROW 2 ================= */}
        <div className="nav-row nav-row-2">

          {/* LEFT - Return Button */}
          <div className="nav-left-group">
            {showReturn && (
              <button
                className="return-btn"
                onClick={() => navigate("/auctions")}
              >
                ← Return
              </button>
            )}
          </div>

          {/* CENTER - Search */}
          {showSearch && (
            <form
              className="nav-search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                value={searchQuery}
                onChange={(e) =>
                  onSearchChange && onSearchChange(e.target.value)
                }
                placeholder="Search book titles or authors..."
              />
              <button type="submit">Search</button>
            </form>
          )}

          {/* RIGHT - Actions */}
            <div className="nav-right-group">

              {onToggleEnded && (
                <button
                  className="ended-btn"
                  onClick={onToggleEnded}
                >
                  {showEnded ? "Hide Ended" : "Show Ended"}
                </button>
              )}

              {isAuthenticated && !hideCreateButton && (
                <button
                  className="create-btn"
                  onClick={() => navigate("/create-auction")}
                >
                  + Create Auction
                </button>
              )}

            </div>

        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <main className="layout-content">
        {children}
      </main>

    </div>
  );
}