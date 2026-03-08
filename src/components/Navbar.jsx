import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          �️ ShopOnline
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Trang chủ
          </Link>
          <Link to="/shop" className="nav-link">
            Sản phẩm
          </Link>
        </div>
        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="nav-icon-btn">
                🛒 <span className="cart-badge">{cartCount}</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link nav-admin">
                  Admin
                </Link>
              )}
              <div className="dropdown">
                <button className="dropdown-trigger">
                  👤 {user?.fullName || user?.username}
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    Thông tin cá nhân
                  </Link>
                  <Link to="/orders" className="dropdown-item">
                    Đơn hàng của tôi
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item dropdown-item-danger"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
