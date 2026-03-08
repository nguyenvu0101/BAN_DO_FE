import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "../services/orderService";
import { useAuth } from "../context/AuthContext";

const STATUS_LABEL = {
  Pending: "Chờ xử lý",
  Processing: "Đang xử lý",
  Shipped: "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getById(id)
      .then((res) => setOrder(res.data))
      .catch(() => navigate("/orders"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    await orderService.delete(id);
    navigate("/orders");
  };

  if (loading) return <div className="container text-center">Đang tải...</div>;
  if (!order) return null;

  return (
    <div className="container">
      <h1 className="page-title">📦 Chi tiết đơn hàng #{order.id}</h1>
      <div className="order-detail-card">
        <div className="order-detail-meta">
          <div>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {STATUS_LABEL[order.status] || order.status}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.shippingAddress}
            </p>
            {order.note && (
              <p>
                <strong>Ghi chú:</strong> {order.note}
              </p>
            )}
          </div>
        </div>

        <h3>Sản phẩm trong đơn</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems?.map((item) => (
              <tr key={item.id}>
                <td>{item.productName || item.product?.name}</td>
                <td>{item.unitPrice?.toLocaleString("vi-VN")}₫</td>
                <td>{item.quantity}</td>
                <td>
                  {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}₫
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">
                <strong>Tổng cộng</strong>
              </td>
              <td>
                <strong>{order.totalAmount?.toLocaleString("vi-VN")}₫</strong>
              </td>
            </tr>
          </tfoot>
        </table>

        {order.status === "Pending" && !isAdmin && (
          <button className="btn btn-danger" onClick={handleCancel}>
            Hủy đơn hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
