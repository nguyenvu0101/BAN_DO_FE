import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h2 className="auth-title">🗺️ Đăng ký tài khoản</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Tên đăng nhập *</label>
              <input
                type="text"
                className="form-input"
                value={form.username}
                onChange={set("username")}
                required
                placeholder="username"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={set("email")}
                required
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Mật khẩu *</label>
            <input
              type="password"
              className="form-input"
              value={form.password}
              onChange={set("password")}
              required
              placeholder="Ít nhất 6 ký tự"
            />
          </div>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              className="form-input"
              value={form.fullName}
              onChange={set("fullName")}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                className="form-input"
                value={form.phoneNumber}
                onChange={set("phoneNumber")}
                placeholder="0123456789"
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                className="form-input"
                value={form.address}
                onChange={set("address")}
                placeholder="Địa chỉ giao hàng"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        <p className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
