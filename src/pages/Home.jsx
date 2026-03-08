import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import ProductCard from "../components/ProductCard";

const CATEGORY_META = [
  { icon: "👗", color: "#ee4d2d", bg: "#fff0ee" },
  { icon: "📱", color: "#ee4d2d", bg: "#fff0ee" },
  { icon: "💄", color: "#ee4d2d", bg: "#fff0ee" },
  { icon: "🏠", color: "#ee4d2d", bg: "#fff0ee" },
  { icon: "⚽", color: "#ee4d2d", bg: "#fff0ee" },
  { icon: "🍼", color: "#ee4d2d", bg: "#fff0ee" },
  { icon: "📚", color: "#ee4d2d", bg: "#fff0ee" },
  { icon: "🍎", color: "#ee4d2d", bg: "#fff0ee" },
];

const FEATURES = [
  { icon: "⚡", label: "Flash Sale", to: "/shop" },
  { icon: "🏷️", label: "Săn Deal Hot", to: "/shop" },
  { icon: "🎁", label: "Freeship 0đ", to: "/shop" },
  { icon: "✅", label: "Hàng Chính Hãng", to: "/shop" },
  { icon: "🔄", label: "Trả Hàng Dễ", to: "/shop" },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([pRes, cRes]) => {
        setFeaturedProducts(pRes.data.slice(0, 8));
        setCategories(cRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Banner */}
      <section className="home-banner">
        <div className="home-banner-inner">
          <div className="home-banner-text">
            <p className="home-banner-sub">Chào mừng đến với</p>
            <h1 className="home-banner-title">Mua Hàng Giá Tốt</h1>
            <p className="home-banner-desc">
              Hàng ngàn sản phẩm chính hãng · Giao hàng toàn quốc · Freeship đơn
              từ 150k
            </p>
            {/* <div className="home-banner-actions">
              <Link to="/shop" className="home-banner-btn-primary">
                Mua ngay
              </Link>
              <Link to="/shop" className="home-banner-btn-outline">
                Xem tất cả
              </Link>
            </div> */}
          </div>
          <div className="home-banner-illustration">🛍️</div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="trust-bar">
        <div className="container trust-bar-inner">
          <div className="trust-item">
            <span className="trust-icon">🔄</span>
            <div>
              <strong>Trả hàng Miễn phí</strong>
              <p>Trả hàng miễn phí trong 15 ngày</p>
            </div>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-icon">✅</span>
            <div>
              <strong>Hàng chính hãng 100%</strong>
              <p>Đảm bảo hoặc hoàn tiền gấp đôi</p>
            </div>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-icon">🚚</span>
            <div>
              <strong>Miễn phí vận chuyển</strong>
              <p>Giao hàng miễn phí toàn quốc</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature shortcuts */}
      <section className="features-bar">
        <div className="container">
          <div className="features-row">
            {FEATURES.map((f) => (
              <Link to={f.to} key={f.label} className="feature-item">
                <div className="feature-icon-wrap">{f.icon}</div>
                <span className="feature-label">{f.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-section">
        <div className="container">
          <div className="home-section-header">
            <span className="home-section-title">DANH MỤC</span>
            <Link to="/shop" className="home-section-more">
              Xem tất cả &rsaquo;
            </Link>
          </div>
          <div className="category-grid">
            {categories.map((cat, i) => {
              const meta = CATEGORY_META[i % CATEGORY_META.length];
              return (
                <Link
                  to={`/shop?category=${cat.id}`}
                  key={cat.id}
                  className="category-card"
                  style={{ "--cat-color": meta.color, "--cat-bg": meta.bg }}
                >
                  <div className="category-icon-wrap">
                    <span className="category-icon">{meta.icon}</span>
                  </div>
                  <span className="category-name">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flash sale / featured header */}
      <section className="home-section section-gray">
        <div className="container">
          <div className="home-section-header flash-sale-header">
            <span className="flash-sale-title">⚡ SẢN PHẨM NỔI BẬT</span>
            <Link to="/shop" className="home-section-more">
              Xem tất cả &rsaquo;
            </Link>
          </div>
          {loading ? (
            <p className="text-center">Đang tải...</p>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
