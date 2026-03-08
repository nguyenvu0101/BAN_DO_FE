import { useEffect, useState } from "react";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
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

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
      categoryId: "",
    });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl || "",
      categoryId: p.categoryId,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
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
                  <label>Giá *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.price}
                    onChange={set("price")}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tồn kho *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.stock}
                    onChange={set("stock")}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Link ảnh</label>
                <input
                  className="form-input"
                  value={form.imageUrl}
                  onChange={set("imageUrl")}
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
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
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
                <td>{p.stock}</td>
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
