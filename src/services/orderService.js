import api from "./api";

const orderService = {
  getAll: () => api.get("/orders"),
  getMyOrders: () => api.get("/orders/my"),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  delete: (id) => api.delete(`/orders/${id}`),
};

export default orderService;
