import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderService from "../services/orderService";

const STATUS_LABEL = {
  Pending: "Chờ xử lý",
  Confirmed: "Đã xác nhận",
  Processing: "Đang xử lý",
  Shipping: "Đang giao",
  Shipped: "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

const STATUS_COLOR = {
  Pending: "order-badge--pending",
  Confirmed: "order-badge--confirmed",
  Processing: "order-badge--info",
  Shipping: "order-badge--shipping",
  Shipped: "order-badge--shipping",
  Delivered: "order-badge--delivered",
  Cancelled: "order-badge--cancelled",
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

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-loading">
          <div className="my-orders-spinner" />
          <p>Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <header className="my-orders-header">
          <h1 className="my-orders-title">Đơn hàng của tôi</h1>
          <p className="my-orders-subtitle">
            Theo dõi và quản lý đơn hàng của bạn
          </p>
        </header>

        {orders.length === 0 ? (
          <div className="my-orders-empty">
            <div className="my-orders-empty-icon">📦</div>
            <h2>Chưa có đơn hàng nào</h2>
            <p>Hãy khám phá sản phẩm và đặt hàng ngay!</p>
            <Link to="/shop" className="btn btn-primary my-orders-empty-cta">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <ul className="my-orders-list">
            {orders.map((order) => {
              const items = order.items || [];
              const firstItem = items[0];
              const itemCount = items.length;
              const statusClass =
                STATUS_COLOR[order.status] || "order-badge--info";
              const statusText = STATUS_LABEL[order.status] || order.status;

              return (
                <li key={order.id} className="my-orders-card">
                  <div className="my-orders-card-inner">
                    {/* Preview: thumbnails + meta */}
                    <div className="my-orders-card-preview">
                      <div className="my-orders-card-thumbs">
                        {items.length > 0 ? (
                          items.slice(0, 3).map((item, idx) => (
                            <div
                              key={`${order.id}-${item.productId}-${idx}`}
                              className="my-orders-card-thumb"
                            >
                              {item.productImageUrl ? (
                                <img
                                  src={item.productImageUrl}
                                  alt={item.productName}
                                />
                              ) : (
                                <span className="my-orders-card-thumb-placeholder">
                                  📦
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="my-orders-card-thumb">
                            <span className="my-orders-card-thumb-placeholder">
                              📦
                            </span>
                          </div>
                        )}
                        {itemCount > 3 && (
                          <span className="my-orders-card-thumb-more">
                            +{itemCount - 3}
                          </span>
                        )}
                      </div>
                      <div className="my-orders-card-meta">
                        <div className="my-orders-card-meta-row my-orders-card-date">
                          <span className="my-orders-card-meta-icon">📅</span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div className="my-orders-card-meta-row">
                          <span className="my-orders-card-meta-icon">📍</span>
                          <span className="my-orders-card-address" title={order.shippingAddress}>
                            {order.shippingAddress || "—"}
                          </span>
                        </div>
                        {firstItem && (
                          <p className="my-orders-card-items-desc">
                            {firstItem.productName}
                            {itemCount > 1 && ` và ${itemCount - 1} sản phẩm khác`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: total + status + CTA */}
                    <div className="my-orders-card-summary">
                      <div className="my-orders-card-head">
                        <span className="my-orders-card-id">Đơn #{order.id}</span>
                        <span className={`order-badge ${statusClass}`}>
                          {statusText}
                        </span>
                      </div>
                      <div className="my-orders-card-total">
                        <span className="my-orders-card-total-label">Tổng tiền</span>
                        <span className="my-orders-card-total-value">
                          {Number(order.totalAmount).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <Link
                        to={`/orders/${order.id}`}
                        className="my-orders-card-btn"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
