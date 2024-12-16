import React, { useState } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);

  // Function to simulate chatbot responses
  const handleSendMessage = () => {
    const userMessage = { sender: "user", text: input };

    // Add the user message to the chat history
    setMessages((prev) => [...prev, userMessage]);

    // Process the input and send a response
    const botResponse = getBotResponse(input);

    setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    setInput("");
  };

  // Function to handle basic responses
  const getBotResponse = (message) => {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("hi") || lowerMsg.includes("hello")) {
        return "Hi there! How can I help you today?";
      } else if (lowerMsg.includes("bye")) {
        return "Goodbye! Have a great day!";
      } else if (lowerMsg.includes("create a user")) {
        return "To create a user, go to the 'Users' page, click 'Add User', and fill in the required details like name, email, and role.";
      } else if (lowerMsg.includes("create a task")) {
        return "To create a task, navigate to the 'Tasks' page, click 'Add Task', and provide details such as task name, description, and due date.";
      } else if (lowerMsg.includes("delete a user")) {
        return "To delete a user, go to the 'Users' page, select the user, and click the delete button.";
      } else if (lowerMsg.includes("logout")) {
        return "To log out, click on the 'Logout' button at the top right corner of the dashboard.";
      } else {
        return "I'm sorry, I don't have an answer for that. Please ask about creating or managing users or tasks.";
      }
    };

  return (
    <div style={styles.chatbotContainer}>
      <h3>Admin Assistant</h3>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#F1F0F0",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatbotContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "300px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    backgroundColor: "white",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  chatWindow: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  message: {
    margin: "5px 0",
    padding: "8px 12px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    border: "none",
    padding: "10px",
    outline: "none",
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
  },
};

export default Chatbot;
