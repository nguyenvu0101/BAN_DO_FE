import api from "./api";

const cartService = {
  getCart: () => api.get("/cart"),
  addToCart: (data) => api.post("/cart", data),
  updateItem: (productId, data) => api.put(`/cart/${productId}`, data),
  removeItem: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete("/cart"),
};

export default cartService;
