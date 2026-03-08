import { useEffect, useState } from "react";
import orderService from "../../services/orderService";

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Shipping",
  "Delivered",
  "Cancelled",
];
const STATUS_LABEL = {
  Pending: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Shipping: "Đang giao hàng",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    orderService
      .getAll()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    orderService
      .getAll()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    await orderService.updateStatus(id, { status });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa đơn hàng này?")) return;
    await orderService.delete(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>📦 Quản lý đơn hàng</h1>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.fullName || o.username}</td>
                <td>{o.shippingAddress}</td>
                <td>{o.totalAmount?.toLocaleString("vi-VN")}₫</td>
                <td>
                  <select
                    className="form-input form-input-sm"
                    value={o.statusName}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(o.id)}
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

export default AdminOrders;
