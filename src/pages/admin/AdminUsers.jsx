import { useEffect, useState } from "react";
import userService from "../../services/userService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    userService
      .getAll()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    userService
      .getAll()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa người dùng này?")) return;
    await userService.delete(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>👥 Quản lý người dùng</h1>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.fullName}</td>
                <td>
                  <span
                    className={`badge ${u.role === "Admin" ? "badge-primary" : "badge-info"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${u.isActive ? "badge-success" : "badge-danger"}`}
                  >
                    {u.isActive ? "Hoạt động" : "Bị khóa"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(u.id)}
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

export default AdminUsers;
