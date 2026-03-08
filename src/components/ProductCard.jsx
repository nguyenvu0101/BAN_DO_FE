import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch {
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card-img">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="img-placeholder">🗺️</div>
          )}
        </div>
        <div className="product-card-body">
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-category">{product.categoryName || ""}</p>
          <p className="product-card-price">
            {product.price?.toLocaleString("vi-VN")}₫
          </p>
        </div>
      </Link>
      <div className="product-card-footer">
        <button className="btn btn-primary w-full" onClick={handleAddToCart}>
          🛒 Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
