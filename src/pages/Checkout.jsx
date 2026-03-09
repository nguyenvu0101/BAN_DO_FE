import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNow = location.state?.buyNow;

  // Nếu mua ngay: dùng sản phẩm truyền vào, không dùng giỏ hàng
  const displayItems = buyNow
    ? [
        {
          id: buyNow.product.id,
          productId: buyNow.product.id,
          productName: buyNow.product.name,
          quantity: buyNow.quantity,
          subTotal: buyNow.product.price * buyNow.quantity,
        },
      ]
    : cartItems;
  const displayTotal = buyNow
    ? buyNow.product.price * buyNow.quantity
    : cartTotal;
  const [form, setForm] = useState({
    shippingAddress: user?.address || "",
    recipientName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (displayItems.length === 0) {
      setError("Giỏ hàng trống!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const orderItems = displayItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      const created = await orderService.create({ ...form, items: orderItems });
      if (!buyNow) await clearCart();
      navigate(`/orders/${created.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">📦 Đặt hàng</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Thông tin giao hàng</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label>Người nhận *</label>
            <input
              type="text"
              className="form-input"
              value={form.recipientName}
              onChange={set("recipientName")}
              required
              placeholder="Nhập tên người nhận"
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại *</label>
            <input
              type="tel"
              className="form-input"
              value={form.phoneNumber}
              onChange={set("phoneNumber")}
              required
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ giao hàng *</label>
            <input
              type="text"
              className="form-input"
              value={form.shippingAddress}
              onChange={set("shippingAddress")}
              required
              placeholder="Nhập địa chỉ giao hàng"
            />
          </div>
          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              className="form-input"
              value={form.note}
              onChange={set("note")}
              rows={3}
              placeholder="Ghi chú cho đơn hàng..."
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Đang đặt hàng..." : "✅ Xác nhận đặt hàng"}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Đơn hàng của bạn</h3>
          {displayItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <span className="checkout-item-name">
                {item.productName} x{item.quantity}
              </span>
              <span>{item.subTotal?.toLocaleString("vi-VN")}₫</span>
            </div>
          ))}
          <hr />
          <div className="summary-row summary-total">
            <span>Tổng cộng:</span>
            <strong>{displayTotal.toLocaleString("vi-VN")}₫</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
