import { useEffect, useState } from "react";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import orderService from "../../services/orderService";
import userService from "../../services/userService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      categoryService.getAll(),
      orderService.getAll(),
      userService.getAll(),
    ]).then(([p, c, o, u]) => {
      const revenue = o.data
        .filter((ord) => ord.status === "Delivered")
        .reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
      setStats({
        products: p.data.total ?? p.data.items?.length ?? 0,
        categories: c.data.length,
        orders: o.data.length,
        users: u.data.length,
        revenue,
      });
    });
  }, []);

  const cards = [
    { label: "Sản phẩm", value: stats.products, icon: "🗺️", color: "#4361ee" },
    {
      label: "Danh mục",
      value: stats.categories,
      icon: "📁",
      color: "#7209b7",
    },
    { label: "Đơn hàng", value: stats.orders, icon: "📦", color: "#f72585" },
    { label: "Người dùng", value: stats.users, icon: "👥", color: "#4cc9f0" },
  ];

  return (
    <div>
      <h1 className="admin-page-title">📊 Tổng quan</h1>
      <div className="stats-grid">
        {cards.map((card) => (
          <div
            key={card.label}
            className="stat-card"
            style={{ borderTop: `4px solid ${card.color}` }}
          >
            <div className="stat-icon">{card.icon}</div>
            <div>
              <p className="stat-value">{card.value}</p>
              <p className="stat-label">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="stat-card stat-revenue">
        <h3>💰 Doanh thu (đơn đã giao)</h3>
        <p className="stat-value-large">
          {stats.revenue.toLocaleString("vi-VN")}₫
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
