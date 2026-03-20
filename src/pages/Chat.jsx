import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import chatService from "../services/chatService";
import { useAuth } from "../context/AuthContext";
import {
  startConnection,
  getConnection,
  joinConversation,
  leaveConversation,
  onReceiveMessage,
  offReceiveMessage,
  stopConnection,
  sendTyping,
  sendStopTyping,
  onUserTyping,
  offUserTyping,
} from "../signalr/chatConnection";

const Chat = () => {
  const { conversationId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  // Load conversations
  useEffect(() => {
    let typingTimer;
    const handleTyping = (connectionId) => {
      setTypingUser(connectionId);
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => setTypingUser(null), 3000);
    };
    const handleStopTyping = () => setTypingUser(null);
    onUserTyping(handleTyping);
    getConnection()?.on("UserStopTyping", handleStopTyping);
    return () => {
      clearTimeout(typingTimer);
      offUserTyping();
    };
  }, []);
  useEffect(() => {
    chatService
      .getConversations()
      .then((res) => setConversations(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Load messages when conversation selected
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);

    chatService
      .getConversation(conversationId)
      .then((res) => setSelectedConversation(res.data))
      .catch(() => navigate("/chat"));

    chatService
      .getMessages(conversationId)
      .then((res) => setMessages(res.data))
      .finally(() => setLoading(false));
  }, [conversationId, navigate]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark as read when viewing
  useEffect(() => {
    if (conversationId) {
      chatService.markAsRead(conversationId);
    }
  }, [conversationId, messages]);

  // ── SignalR real-time ──────────────────────────────────────────────
  // Kết nối Hub khi login, ngắt khi logout
  useEffect(() => {
    if (!token) return;
    startConnection(token);

    return () => {
      offReceiveMessage();
      stopConnection();
    };
  }, [token]);

  // Join/leave conversation group khi đổi cuộc trò chuyện
  useEffect(() => {
    if (!conversationId) return;

    offReceiveMessage(); // xóa listener cũ trước
    joinConversation(parseInt(conversationId));

    onReceiveMessage((msg) => {
      setMessages((prev) => {
        // tránh trùng lặp nếu API response đã thêm rồi
        if (prev.some((m) => m.id === msg.id)) return prev;
        // chỉ nhận tin nhắn thuộc cuộc trò chuyện đang mở
        if (msg.conversationId !== parseInt(conversationId)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      offReceiveMessage();
      leaveConversation(parseInt(conversationId));
    };
  }, [conversationId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || sending) return;

    setSending(true);
    try {
      const res = await chatService.sendMessage({
        conversationId: parseInt(conversationId),
        content: newMessage.trim(),
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
      clearTimeout(handleInputChange._timer);
      sendStopTyping(parseInt(conversationId));
    } catch {
      alert("Không thể gửi tin nhắn");
    } finally {
      setSending(false);
    }
  };
  // Trong handleSend hoặc thêm input handler
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!conversationId) return;
    sendTyping(parseInt(conversationId));
    // debounce: sau 2s không gõ nữa → StopTyping
    clearTimeout(handleInputChange._timer);
    handleInputChange._timer = setTimeout(() => {
      sendStopTyping(parseInt(conversationId));
    }, 2000);
  };
  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Hôm nay";
    if (d.toDateString() === yesterday.toDateString()) return "Hôm qua";
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  };

  return (
    <div
      className="container"
      style={{ marginTop: "24px", marginBottom: "24px" }}
    >
      <h1 className="page-title">💬 Tin nhắn</h1>

      <div className="chat-layout">
        {/* Conversation List */}
        <aside className="chat-sidebar">
          <h3>Cuộc trò chuyện</h3>
          {loading && conversations.length === 0 ? (
            <p
              className="text-center"
              style={{ color: "#888", padding: "20px" }}
            >
              Đang tải...
            </p>
          ) : conversations.length === 0 ? (
            <p
              className="text-center"
              style={{ color: "#aaa", padding: "20px" }}
            >
              Chưa có cuộc trò chuyện nào
            </p>
          ) : (
            <ul className="conversation-list">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  <button
                    className={`conversation-item ${conversationId == conv.id ? "active" : ""}`}
                    onClick={() => navigate(`/chat/${conv.id}`)}
                  >
                    <div className="conversation-avatar">
                      {conv.otherUserName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <span className="conversation-name">
                          {conv.otherUserName}
                        </span>
                        {conv.lastMessageAt && (
                          <span className="conversation-time">
                            {formatDate(conv.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      {conv.productName && (
                        <span className="conversation-product">
                          🛍️ {conv.productName}
                        </span>
                      )}
                      <p className="conversation-preview">
                        {conv.lastMessage || "Chưa có tin nhắn"}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="conversation-badge">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Chat Area */}
        <div className="chat-area">
          {!conversationId ? (
            <div className="chat-empty">
              <div style={{ fontSize: "4rem" }}>💬</div>
              <h2>Chọn cuộc trò chuyện</h2>
              <p>Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
            </div>
          ) : loading ? (
            <div className="chat-empty">
              <p>Đang tải tin nhắn...</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-avatar">
                    {selectedConversation?.otherUserName
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3>{selectedConversation?.otherUserName}</h3>
                    {selectedConversation?.productName && (
                      <span className="chat-product-ref">
                        🛍️ {selectedConversation.productName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messages.map((msg, idx) => {
                  const isMe = Number(msg.senderId) === Number(user?.userId);
                  const showDate =
                    idx === 0 ||
                    formatDate(messages[idx - 1].createdAt) !==
                      formatDate(msg.createdAt);

                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="chat-date-divider">
                          {formatDate(msg.createdAt)}
                        </div>
                      )}
                      <div
                        className={`chat-message ${isMe ? "chat-message-me" : "chat-message-other"}`}
                      >
                        {!isMe && (
                          <div className="chat-msg-avatar">
                            {msg.senderName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="chat-msg-bubble">
                          <p>{msg.content}</p>
                          <span className="chat-msg-time">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              {typingUser && (
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  đang nhắn...
                </div>
              )}
              {/* Input */}
              <form className="chat-input-area" onSubmit={handleSend}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={handleInputChange}
                  disabled={sending}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!newMessage.trim() || sending}
                >
                  {sending ? "..." : "Gửi"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
