import { useEffect, useState } from "react";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import api from "../../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]); // [{ preview, url }]
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stockQuantity: "",
    categoryId: "",
  });
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));
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
    } catch {
      setError("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      stockQuantity: "",
      categoryId: "",
    });
    setImages([]);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      originalPrice: p.originalPrice || "",
      stockQuantity: p.stockQuantity ?? p.stock,
      categoryId: p.categoryId,
    });
    // load existing images
    const existing = p.imageUrls?.length
      ? p.imageUrls.map((url) => ({ preview: url, url }))
      : p.imageUrl
        ? [{ preview: p.imageUrl, url: p.imageUrl }]
        : [];
    setImages(existing);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      if (editing) await productService.update(editing.id, payload);
      else await productService.create(payload);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    await productService.delete(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>🗺️ Quản lý sản phẩm</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          + Thêm sản phẩm
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên sản phẩm *</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={set("name")}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  className="form-input"
                  value={form.description}
                  onChange={set("description")}
                  rows={3}
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
                  <label>Tồn kho *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.stockQuantity}
                    onChange={set("stockQuantity")}
                    required
                    min="0"
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
                    <label htmlFor="adminImageFiles" className="img-add-btn">
                      {uploading ? "..." : "+"}
                      <input
                        type="file"
                        id="adminImageFiles"
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
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.categoryName}</td>
                <td>{p.price?.toLocaleString("vi-VN")}₫</td>
                <td>{p.stockQuantity ?? p.stock}</td>
                <td className="table-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => openEdit(p)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProducts;
