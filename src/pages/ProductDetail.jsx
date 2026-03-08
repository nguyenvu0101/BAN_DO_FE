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
  const [activeImg, setActiveImg] = useState(0);

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

  const images = product.imageUrls?.length
    ? product.imageUrls
    : product.imageUrl
      ? [product.imageUrl]
      : [];
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;
  const inStock = product.stockQuantity > 0;

  return (
    <div className="container" style={{ padding: "32px 20px" }}>
      <div className="pd-wrapper">
        {/* Image gallery */}
        <div className="pd-gallery">
          <div className="pd-main-img">
            {images.length > 0 ? (
              <img src={images[activeImg]} alt={product.name} />
            ) : (
              <div className="img-placeholder-lg">🛍️</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="pd-thumbnails">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  className={`pd-thumb${activeImg === idx ? " active" : ""}`}
                  onClick={() => setActiveImg(idx)}
                >
                  <img src={url} alt={`Ảnh ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="pd-info">
          <span className="pd-category-badge">{product.categoryName}</span>
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-price-box">
            <span className="pd-price">
              {product.price?.toLocaleString("vi-VN")}đ
            </span>
            {discount && (
              <>
                <span className="pd-original-price">
                  {product.originalPrice?.toLocaleString("vi-VN")}đ
                </span>
                <span className="pd-discount-badge">-{discount}%</span>
              </>
            )}
          </div>

          {product.description && (
            <p className="pd-desc">{product.description}</p>
          )}

          <div className="pd-meta-row">
            <span className="pd-meta-label">Tình trạng</span>
            {inStock ? (
              <span className="pd-in-stock">
                ✓ Còn hàng ({product.stockQuantity})
              </span>
            ) : (
              <span className="pd-out-stock">× Hết hàng</span>
            )}
          </div>

          <div className="pd-meta-row">
            <span className="pd-meta-label">Số lượng</span>
            <div className="quantity-control">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(product.stockQuantity || 99, q + 1),
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="pd-actions">
            <button
              className="pd-btn-cart"
              onClick={handleAddToCart}
              disabled={adding || !inStock}
            >
              🛒 Thêm Vào Giỏ Hàng
            </button>
            <button
              className="pd-btn-buy"
              onClick={handleAddToCart}
              disabled={adding || !inStock}
            >
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
