import * as signalR from "@microsoft/signalr";

let connection = null;

export const startConnection = (token) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5285/chatHub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  connection.start().catch((err) => {
    console.error("SignalR connection error:", err);
  });

  return connection;
};

export const getConnection = () => connection;

export const stopConnection = () => {
  if (connection) {
    connection.stop().catch(console.error);
    connection = null;
  }
};

export const joinConversation = (conversationId) => {
  connection?.invoke("JoinConversation", conversationId).catch(console.error);
};

export const leaveConversation = (conversationId) => {
  connection?.invoke("LeaveConversation", conversationId).catch(console.error);
};

export const onReceiveMessage = (callback) => {
  connection?.on("ReceiveMessage", (msg) => {
    callback(msg);
  });
};

export const offReceiveMessage = () => {
  connection?.off("ReceiveMessage");
};
export const sendTyping = (conversationId) => {
  connection?.invoke("Typing", conversationId).catch(console.error);
};

export const sendStopTyping = (conversationId) => {
  connection?.invoke("StopTyping", conversationId).catch(console.error);
};

export const onUserTyping = (callback) => {
  connection?.on("UserTyping", callback);
};

export const offUserTyping = () => {
  connection?.off("UserTyping");
  connection?.off("UserStopTyping");
};
