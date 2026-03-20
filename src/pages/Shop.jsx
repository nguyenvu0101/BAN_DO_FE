import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import ProductCard from "../components/ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "name", label: "Tên A-Z" },
  { value: "best_selling", label: "Bán chạy" },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: searchParams.get("category") || "",
    search: searchParams.get("q") || "",
    minPrice: "",
    maxPrice: "",
    location: "",
    sortBy: "newest",
    page: 1,
    pageSize: 12,
  });

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params = { sortBy: filters.sortBy, page: filters.page, pageSize: filters.pageSize };
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.search) params.search = filters.search;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.location) params.location = filters.location;

    productService
      .getFiltered(params)
      .then((res) => { if (!cancelled) setResult(res.data); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [filters]);

  const setFilter = (key, value) => {
    setLoading(true);
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const resetFilters = () => {
    setLoading(true);
    setFilters({ categoryId: "", search: "", minPrice: "", maxPrice: "", location: "", sortBy: "newest", page: 1, pageSize: 12 });
  };

  return (
    <div className="container">
      <div className="shop-header">
        <h1>Tất cả sản phẩm</h1>
        <div className="shop-header-controls">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />
          <select
            className="form-input sort-select"
            value={filters.sortBy}
            onChange={(e) => setFilter("sortBy", e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <h3>Danh mục</h3>
          <ul className="category-list">
            <li>
              <button
                className={`category-btn ${!filters.categoryId ? "active" : ""}`}
                onClick={() => setFilter("categoryId", "")}
              >
                Tất cả
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  className={`category-btn ${filters.categoryId === String(cat.id) ? "active" : ""}`}
                  onClick={() => setFilter("categoryId", String(cat.id))}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: "24px" }}>Khoảng giá</h3>
          <div className="price-filter">
            <input
              type="number"
              className="form-input"
              placeholder="Từ (đ)"
              value={filters.minPrice}
              onChange={(e) => setFilter("minPrice", e.target.value)}
              min={0}
            />
            <span>—</span>
            <input
              type="number"
              className="form-input"
              placeholder="Đến (đ)"
              value={filters.maxPrice}
              onChange={(e) => setFilter("maxPrice", e.target.value)}
              min={0}
            />
          </div>

          <h3 style={{ marginTop: "24px" }}>Địa điểm</h3>
          <input
            type="text"
            className="form-input"
            placeholder="VD: Hồ Chí Minh"
            value={filters.location}
            onChange={(e) => setFilter("location", e.target.value)}
          />

          <button className="btn btn-outline w-full" style={{ marginTop: "16px" }} onClick={resetFilters}>
            Xóa bộ lọc
          </button>
        </aside>

        <div className="shop-content">
          {loading ? (
            <p className="text-center">Đang tải...</p>
          ) : result.items?.length === 0 ? (
            <p className="text-center">Không tìm thấy sản phẩm nào.</p>
          ) : (
            <>
              <p className="shop-count">{result.total} sản phẩm</p>
              <div className="product-grid">
                {result.items?.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {result.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={filters.page === 1}
                    onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                  >‹</button>
                  {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`page-btn ${filters.page === p ? "active" : ""}`}
                      onClick={() => setFilters((f) => ({ ...f, page: p }))}
                    >{p}</button>
                  ))}
                  <button
                    className="page-btn"
                    disabled={filters.page === result.totalPages}
                    onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                  >›</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
