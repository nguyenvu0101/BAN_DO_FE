import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import api from "../services/api";

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
  const [avatarUploading, setAvatarUploading] = useState(false);
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
      await userService.update(authUser.userId, form);
      setMessage("✅ Cập nhật thành công!");
    } catch {
      setMessage("❌ Cập nhật thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/upload/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, avatarUrl: res.data.url }));
    } catch {
      setMessage("❌ Tải ảnh thất bại!");
    } finally {
      setAvatarUploading(false);
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
            <label>Ảnh đại diện</label>
            <div className="avatar-upload-row">
              {form.avatarUrl && (
                <img
                  src={form.avatarUrl}
                  alt="avatar"
                  className="avatar-preview"
                />
              )}
              <label className="btn btn-outline avatar-upload-btn">
                {avatarUploading ? "Đang tải..." : "📷 Chọn ảnh"}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarUpload}
                  disabled={avatarUploading}
                />
              </label>
            </div>
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
