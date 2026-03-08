import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import ProductCard from "../components/ProductCard";

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
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>�️ Mua sắm mọi thứ bạn cần</h1>
          <p>Hàng ngàn sản phẩm đa dạng, chất lượng cao, giao hàng toàn quốc</p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Danh mục sản phẩm</h2>
          <div className="category-grid">
            {categories.map((cat) => (
              <Link
                to={`/shop?category=${cat.id}`}
                key={cat.id}
                className="category-card"
              >
                <span className="category-icon">📁</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="section-title">Sản phẩm nổi bật</h2>
          {loading ? (
            <p className="text-center">Đang tải...</p>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <Link to="/shop" className="btn btn-outline">
              Xem thêm sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
