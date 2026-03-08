import api from "./api";

const userService = {
  getAll: () => api.get("/users"),
  getMe: () => api.get("/users/me"),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default userService;
