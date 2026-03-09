import api from "./api";

const reviewService = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  canReview: (productId) => api.get(`/reviews/can-review/${productId}`),
  createOrUpdate: (data) => api.post("/reviews", data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default reviewService;
