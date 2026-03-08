import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    productService
      .getById(id)
      .then((res) => setProduct(res.data))
      .catch(() => navigate("/shop"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      alert("Đã thêm vào giỏ hàng!");
    } catch {
      alert("Có lỗi xảy ra!");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="container text-center">Đang tải...</div>;
  if (!product) return null;

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-detail-img">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="img-placeholder-lg">🗺️</div>
          )}
        </div>
        <div className="product-detail-info">
          <p className="product-detail-category">{product.categoryName}</p>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">
            {product.price?.toLocaleString("vi-VN")}₫
          </p>
          <p className="product-detail-desc">{product.description}</p>
          <p className="product-detail-stock">
            {product.stock > 0
              ? `✅ Còn hàng (${product.stock})`
              : "❌ Hết hàng"}
          </p>
          <div className="product-detail-actions">
            <div className="quantity-control">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
            >
              {adding ? "Đang thêm..." : "🛒 Thêm vào giỏ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
