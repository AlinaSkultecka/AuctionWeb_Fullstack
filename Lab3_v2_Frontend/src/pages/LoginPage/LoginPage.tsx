import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser, registerUser } from "../../api/userApi";
import "./LoginPage.css";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // LOGIN
        const data = await loginUser(username, password);

        login(data.token, {
        userId: data.userId,
        userName: data.userName,
        email: data.email,
        isAdmin: data.isAdmin,
        isActive: data.isActive,
        photoUrl: data.photoUrl
      });        
      
      navigate("/auctions"); 
      } else {
        // REGISTER
        await registerUser(username, email, password);

        // After successful register → switch to login
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setError("Account created successfully. Please log in.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <img src={logo} alt="BookBit Logo" className="auth-logo" />
          <p>Welcome to BookBit — your book auction platform.</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">

          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>

            {!isLogin && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <div className="switch-mode">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Sign up" : " Login"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}