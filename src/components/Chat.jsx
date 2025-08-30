import { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useParams } from "react-router-dom";

export default function Chat() {
  const { groupId } = useParams(); // groupId will come from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages in real-time
  useEffect(() => {
    if (!groupId) return;

    const q = query(
      collection(db, "groups", groupId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [groupId]);

  // Send new message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "groups", groupId, "messages"), {
      text: newMessage,
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || auth.currentUser.email,
      createdAt: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
      <h2>💬 Group Chat</h2>

      {/* Chat messages */}
      <div style={{ height: "300px", overflowY: "auto", padding: "10px", border: "1px solid #eee" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "10px",
              textAlign: msg.senderId === auth.currentUser.uid ? "right" : "left",
            }}
          >
            <strong>{msg.senderName || "Unknown"}:</strong> {msg.text}
            <br />
            <small style={{ color: "gray" }}>
              {msg.createdAt?.toDate().toLocaleString()}
            </small>
          </div>
        ))}
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} style={{ marginTop: "10px", display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="submit" style={{ marginLeft: "5px" }}>Send</button>
      </form>
    </div>
  );
}
