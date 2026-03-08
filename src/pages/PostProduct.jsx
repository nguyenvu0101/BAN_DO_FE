import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import api from "../services/api";

const PostProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]); // [{ preview, url }]
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stockQuantity: "",
    categoryId: "",
  });

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data));
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - images.length;
    if (remaining <= 0) return;
    const toUpload = files.slice(0, remaining);
    setUploading(true);
    setError("");
    try {
      const uploaded = await Promise.all(
        toUpload.map(async (file) => {
          const preview = URL.createObjectURL(file);
          const formData = new FormData();
          formData.append("file", file);
          const res = await api.post("/upload/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return { preview, url: res.data.url };
        }),
      );
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err.response?.data?.message || "Upload ảnh thất bại!");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const imageUrls = images.map((img) => img.url);
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice
          ? parseFloat(form.originalPrice)
          : null,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        imageUrls,
        imageUrl: imageUrls[0] || null,
        categoryId: parseInt(form.categoryId),
      };
      const res = await productService.create(payload);
      setSuccess(true);
      setTimeout(() => navigate(`/products/${res.data.id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">📦 Đăng bán sản phẩm</h1>

      {success && (
        <div className="alert alert-success">
          ✅ Đăng sản phẩm thành công! Đang chuyển hướng...
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Tên sản phẩm *</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={set("name")}
              required
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Giá bán (₫) *</label>
              <input
                type="number"
                className="form-input"
                value={form.price}
                onChange={set("price")}
                required
                min="0"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>
                Giá gốc (₫) <span className="text-muted">tuỳ chọn</span>
              </label>
              <input
                type="number"
                className="form-input"
                value={form.originalPrice}
                onChange={set("originalPrice")}
                min="0"
                placeholder="Để trống nếu không có"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số lượng tồn kho *</label>
              <input
                type="number"
                className="form-input"
                value={form.stockQuantity}
                onChange={set("stockQuantity")}
                required
                min="1"
                placeholder="1"
              />
            </div>
            <div className="form-group">
              <label>Danh mục *</label>
              <select
                className="form-input"
                value={form.categoryId}
                onChange={set("categoryId")}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              Ảnh sản phẩm{" "}
              <span className="text-muted">({images.length}/5 ảnh)</span>
            </label>
            <div className="multi-image-grid">
              {images.map((img, idx) => (
                <div key={idx} className="img-thumb-wrap">
                  <img
                    src={img.preview}
                    alt={`Ảnh ${idx + 1}`}
                    className="img-thumb"
                  />
                  <button
                    type="button"
                    className="img-remove-btn"
                    onClick={() => removeImage(idx)}
                  >
                    ✕
                  </button>
                  {idx === 0 && (
                    <span className="img-main-badge">Ảnh chính</span>
                  )}
                </div>
              ))}
              {images.length < 5 && (
                <label htmlFor="imageFiles" className="img-add-btn">
                  {uploading ? "..." : "+"}
                  <input
                    type="file"
                    id="imageFiles"
                    accept="image/*"
                    multiple
                    className="file-input"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            <p className="text-muted" style={{ marginTop: 6 }}>
              Ảnh đầu tiên là ảnh đại diện. JPG, PNG, WEBP — tối đa 5MB/ảnh.
            </p>
          </div>

          <div className="form-group">
            <label>Mô tả sản phẩm</label>
            <textarea
              className="form-input"
              value={form.description}
              onChange={set("description")}
              rows={5}
              placeholder="Mô tả chi tiết về sản phẩm..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || uploading}
            >
              {loading ? "Đang đăng..." : "🚀 Đăng sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProduct;
