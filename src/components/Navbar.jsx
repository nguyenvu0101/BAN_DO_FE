import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim())
      navigate(`/shop?q=${encodeURIComponent(searchQ.trim())}`);
    else navigate("/shop");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          Mua Hàng Giá Tốt
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="navbar-search-input"
          />
          <button type="submit" className="navbar-search-btn">
            🔍
          </button>
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/cart" className="nav-cart-btn">
            <span className="nav-cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            <span className="nav-cart-label">Giỏ hàng</span>
          </Link>
          {isLoggedIn ? (
            <div className="dropdown">
              <button className="dropdown-trigger nav-user-btn">
                👤 {user?.fullName?.split(" ").pop() || user?.username}
              </button>
              <div className="dropdown-menu">
                {isLoggedIn && (
                  <Link to="/post-product" className="dropdown-item">
                    ➕ Đăng bán
                  </Link>
                )}
                <Link to="/profile" className="dropdown-item">
                  👤 Tài khoản
                </Link>
                <Link to="/orders" className="dropdown-item">
                  📋 Đơn hàng
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="dropdown-item"
                    style={{ color: "#f72585", fontWeight: 700 }}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="dropdown-item dropdown-item-danger"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/register" className="nav-auth-link">
                Đăng ký
              </Link>
              <span className="nav-auth-sep">|</span>
              <Link to="/login" className="nav-auth-link">
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
