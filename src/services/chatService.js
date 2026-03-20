import api from "./api";

const chatService = {
  // Conversations
  getConversations: () => api.get("/chat/conversations"),
  getConversation: (id) => api.get(`/chat/conversations/${id}`),
  createConversation: (data) => api.post("/chat/conversations", data),
  getUnreadCount: () => api.get("/chat/unread-count"),

  // Messages
  getMessages: (conversationId, page = 1) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params: { page } }),
  sendMessage: (data) => api.post("/chat/messages", data),
  markAsRead: (conversationId) => api.post(`/chat/conversations/${conversationId}/read`),
};

export default chatService;
