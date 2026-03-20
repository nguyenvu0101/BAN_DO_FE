import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import reviewService from "../services/reviewService";
import chatService from "../services/chatService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn, user: authUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [startingChat, setStartingChat] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    productService
      .getById(id)
      .then((res) => setProduct(res.data))
      .catch(() => navigate("/shop"))
      .finally(() => setLoading(false));
    reviewService.getByProduct(id).then((res) => {
      setReviews(res.data);
    });
    if (isLoggedIn) {
      reviewService
        .canReview(id)
        .then((res) => setCanReview(res.data.canReview))
        .catch(() => setCanReview(false));
    }
  }, [id, navigate, isLoggedIn]);

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

  const handleChatWithSeller = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!product.sellerId || product.sellerId === authUser?.id) {
      alert("Bạn không thể nhắn tin với chính mình!");
      return;
    }
    setStartingChat(true);
    try {
      const res = await chatService.createConversation({
        recipientId: product.sellerId,
        productId: product.id,
        initialMessage: `Xin chào! Tôi quan tâm đến sản phẩm "${product.name}" của bạn.`,
      });
      navigate(`/chat/${res.data.id}`);
    } catch {
      alert("Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại!");
    } finally {
      setStartingChat(false);
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
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const myExistingReview = reviews.find((r) => r.userId === authUser?.userId);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.createOrUpdate({
        productId: Number(id),
        rating: myRating,
        comment: myComment,
      });
      const res = await reviewService.getByProduct(id);
      setReviews(res.data);
      setMyComment("");
    } finally {
      setSubmitting(false);
    }
  };

//   const handleDeleteReview = async (reviewId) => {
//     await reviewService.delete(reviewId);
//     setReviews((prev) => prev.filter((r) => r.id !== reviewId));
//   };

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

          {product.location && (
            <div className="pd-meta-row">
              <span className="pd-meta-label">Địa điểm</span>
              <span>📍 {product.location}</span>
            </div>
          )}

          {product.soldCount > 0 && (
            <div className="pd-meta-row">
              <span className="pd-meta-label">Đã bán</span>
              <span style={{ color: "#ee4d2d", fontWeight: 600 }}>{product.soldCount} sản phẩm</span>
            </div>
          )}

          {product.averageRating > 0 && (
            <div className="pd-meta-row">
              <span className="pd-meta-label">Đánh giá</span>
              <span style={{ color: "#f5a623" }}>⭐ {product.averageRating} ({product.reviewCount} đánh giá)</span>
            </div>
          )}

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
              onClick={() => {
                if (!isLoggedIn) {
                  navigate("/login");
                  return;
                }
                navigate("/checkout", {
                  state: { buyNow: { product, quantity } },
                });
              }}
              disabled={adding || !inStock}
            >
              Mua Ngay
            </button>
            {isLoggedIn && authUser?.id !== product.sellerId && (
              <button
                className="pd-btn-chat"
                onClick={handleChatWithSeller}
                disabled={startingChat}
              >
                {startingChat ? "..." : "💬 Chat với người bán"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="reviews-section">
        <h2 className="reviews-title">
          ⭐ Đánh giá sản phẩm
          {avgRating && (
            <span className="reviews-avg">
              {avgRating} / 5 ({reviews.length} đánh giá)
            </span>
          )}
        </h2>

        {/* Write review form */}
        {isLoggedIn && canReview ? (
          myExistingReview ? (
            <div className="review-done">
              ✅ Bạn đã đánh giá sản phẩm này
            </div>
          ) : (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <h4>Viết đánh giá</h4>
              <div className="star-select">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`star-btn ${myRating >= s ? "active" : ""}`}
                    onClick={() => setMyRating(s)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                className="form-input"
                placeholder="Nhận xét của bạn..."
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
                rows={3}
              />
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </form>
          )
        ) : isLoggedIn && !canReview ? (
          <div className="review-locked">
            🔒 Chỉ khách hàng đã mua
            sản phẩm này mới có thể đánh giá.
          </div>
        ) : null}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <p className="reviews-empty">
            Chưa có đánh giá nào. Hãy là người đầu tiên!
          </p>
        ) : (
          <div className="reviews-list">
            {reviews.map((r) => (
              <div key={r.id} className="review-item">
                <div className="review-header">
                  <div className="review-avatar">
                    {r.avatarUrl ? (
                      <img src={r.avatarUrl} alt={r.username} />
                    ) : (
                      <span>
                        {(r.fullName || r.username)?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <strong>{r.fullName || r.username}</strong>
                    <div className="review-stars">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </div>
                  </div>
                  <span className="review-date">
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  {/* {r.userId === authUser?.userId && (
                    <button
                      className="review-delete-btn"
                      onClick={() => handleDeleteReview(r.id)}
                    >
                      🗑
                    </button>
                  )} */}
                </div>
                {r.comment && <p className="review-comment">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
