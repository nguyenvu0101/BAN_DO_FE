import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, loading, cartTotal, updateItem, removeItem, clearCart } =
    useCart();
  const navigate = useNavigate();

  if (loading) return <div className="container text-center">Đang tải...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="container text-center">
        <div className="empty-state">
          <p className="empty-icon">🛒</p>
          <h2>Giỏ hàng trống</h2>
          <Link to="/shop" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">🛒 Giỏ hàng</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-img">
                {item.product?.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} />
                ) : (
                  <div className="img-placeholder">🗺️</div>
                )}
              </div>
              <div className="cart-item-info">
                <Link
                  to={`/products/${item.productId}`}
                  className="cart-item-name"
                >
                  {item.product?.name}
                </Link>
                <p className="cart-item-price">
                  {item.product?.price?.toLocaleString("vi-VN")}₫
                </p>
              </div>
              <div className="quantity-control">
                <button
                  onClick={() => updateItem(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateItem(item.productId, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="cart-item-subtotal">
                {(item.quantity * (item.product?.price || 0)).toLocaleString(
                  "vi-VN",
                )}
                ₫
              </p>
              <button
                className="btn-icon-danger"
                onClick={() => removeItem(item.productId)}
              >
                🗑️
              </button>
            </div>
          ))}
          <button className="btn btn-outline btn-sm" onClick={clearCart}>
            Xóa giỏ hàng
          </button>
        </div>

        <div className="cart-summary">
          <h3>Tổng đơn hàng</h3>
          <div className="summary-row">
            <span>Tổng tiền:</span>
            <strong>{cartTotal.toLocaleString("vi-VN")}₫</strong>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>Miễn phí</span>
          </div>
          <hr />
          <div className="summary-row summary-total">
            <span>Thanh toán:</span>
            <strong>{cartTotal.toLocaleString("vi-VN")}₫</strong>
          </div>
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate("/checkout")}
          >
            Tiến hành đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
