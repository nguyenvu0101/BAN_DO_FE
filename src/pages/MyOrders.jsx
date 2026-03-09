import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderService from "../services/orderService";

const STATUS_LABEL = {
  Pending: "Chờ xử lý",
  Processing: "Đang xử lý",
  Shipped: "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

const STATUS_COLOR = {
  Pending: "badge-warning",
  Processing: "badge-info",
  Shipped: "badge-primary",
  Delivered: "badge-success",
  Cancelled: "badge-danger",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container text-center">Đang tải...</div>;

  return (
    <div className="container">
      <h1 className="page-title">📦 Đơn hàng của tôi</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📦</p>
          <h2>Chưa có đơn hàng nào</h2>
          <Link to="/shop" className="btn btn-primary">
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <span className="order-id">Đơn {order.id}</span>
                <span
                  className={`badge ${STATUS_COLOR[order.status] || "badge-info"}`}
                >
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>
              <div className="order-card-body">
                <p>
                  📅 {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <p>📍 {order.shippingAddress}</p>
                <p>
                  💰{" "}
                  <strong>{order.totalAmount?.toLocaleString("vi-VN")}₫</strong>
                </p>
              </div>
              <Link
                to={`/orders/${order.id}`}
                className="btn btn-outline btn-sm"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
