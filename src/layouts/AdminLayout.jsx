import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">⚙️ Admin Panel</div>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link">
            📊 Tổng quan
          </Link>
          <Link to="/admin/products" className="admin-nav-link">
            🗺️ Sản phẩm
          </Link>
          <Link to="/admin/categories" className="admin-nav-link">
            📁 Danh mục
          </Link>
          <Link to="/admin/orders" className="admin-nav-link">
            📦 Đơn hàng
          </Link>
          <Link to="/admin/users" className="admin-nav-link">
            👥 Người dùng
          </Link>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Đăng xuất
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
