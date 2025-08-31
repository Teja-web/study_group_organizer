import React, { useState, useEffect, useRef } from "react";

const Chat = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Mock messages data
  useEffect(() => {
    const mockMessages = [
      {
        id: "1",
        text: "Hello everyone! Welcome to the Advanced Calculus Study Group!",
        senderName: "Professor Smith",
        senderUid: "professor",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: "2",
        text: "Hi! I'm excited to join this group. I've been struggling with integration techniques.",
        senderName: "John Doe",
        senderUid: "john",
        createdAt: new Date(Date.now() - 82800000), // 23 hours ago
      },
      {
        id: "3",
        text: "Same here! The chain rule is giving me trouble. Anyone up for a study session tomorrow?",
        senderName: "Jane Smith",
        senderUid: "jane",
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      },
      {
        id: "4",
        text: "I found some great practice problems online. Should I share them?",
        senderName: "Mike Johnson",
        senderUid: "mike",
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      }
    ];

    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, [groupId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    
    try {
      const messageData = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        senderName: user.displayName || user.email,
        senderUid: user.uid,
        createdAt: new Date()
      };

      // Add message to local state
      setMessages(prev => [...prev, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === new Date(today.getTime() - 86400000).toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const isOwnMessage = (message) => {
    return message.senderUid === user?.uid;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading"></div>
        <span className="ml-2 text-gray-600">Loading messages...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">💬 Group Chat</h3>
        <div className="text-sm text-gray-500">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400">Be the first to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const showDate = index === 0 || formatDate(msg.createdAt) !== formatDate(messages[index - 1]?.createdAt);
            
            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="text-center my-4">
                    <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isOwnMessage(msg) ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage(msg) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {!isOwnMessage(msg) && (
                      <div className="text-xs font-medium mb-1 opacity-75">
                        {msg.senderName || 'Unknown'}
                      </div>
                    )}
                    <div className="text-sm">{msg.text}</div>
                    <div className={`text-xs mt-1 ${
                      isOwnMessage(msg) ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 input"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="btn btn-primary"
          >
            {sending ? (
              <>
                <div className="loading mr-2"></div>
                Sending...
              </>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
