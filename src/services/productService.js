import api from "./api";

const productService = {
  getAll: () => api.get("/products", { params: { pageSize: 1000 } }),
  getFiltered: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export default productService;
