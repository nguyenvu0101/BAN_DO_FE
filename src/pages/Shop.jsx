import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const categoryId = searchParams.get("category");

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const request = categoryId
      ? productService.getByCategory(categoryId)
      : productService.getAll();
    request
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container">
      <div className="shop-header">
        <h1>🗺️ Tất cả sản phẩm</h1>
        <input
          type="text"
          className="form-input search-input"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="shop-layout">
        {/* Sidebar Filter */}
        <aside className="shop-sidebar">
          <h3>Danh mục</h3>
          <ul className="category-list">
            <li>
              <button
                className={`category-btn ${!categoryId ? "active" : ""}`}
                onClick={() => setSearchParams({})}
              >
                Tất cả
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  className={`category-btn ${categoryId === String(cat.id) ? "active" : ""}`}
                  onClick={() => setSearchParams({ category: cat.id })}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Products */}
        <div className="shop-content">
          {loading ? (
            <p className="text-center">Đang tải...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center">Không tìm thấy sản phẩm nào.</p>
          ) : (
            <>
              <p className="shop-count">{filtered.length} sản phẩm</p>
              <div className="product-grid">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
