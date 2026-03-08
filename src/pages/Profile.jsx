import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    userService
      .getMe()
      .then((res) => {
        const u = res.data;
        setForm({
          fullName: u.fullName || "",
          phoneNumber: u.phoneNumber || "",
          address: u.address || "",
          avatarUrl: u.avatarUrl || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await userService.update(authUser.id, form);
      setMessage("✅ Cập nhật thành công!");
    } catch {
      setMessage("❌ Cập nhật thất bại!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container text-center">Đang tải...</div>;

  return (
    <div className="container">
      <h1 className="page-title">👤 Thông tin cá nhân</h1>
      <div className="profile-card">
        {message && (
          <div
            className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-error"}`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              className="form-input"
              value={authUser?.username}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              className="form-input"
              value={authUser?.email}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              className="form-input"
              value={form.fullName}
              onChange={set("fullName")}
              placeholder="Họ và tên"
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
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                className="form-input"
                value={form.address}
                onChange={set("address")}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Link ảnh đại diện</label>
            <input
              type="text"
              className="form-input"
              value={form.avatarUrl}
              onChange={set("avatarUrl")}
              placeholder="https://..."
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
