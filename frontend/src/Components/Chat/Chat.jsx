import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { AuthContext } from "../../Context/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  updateDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { sendMessage } from "./sendMessage";
import "./Chat.css";

const Chat = ({ chatId }) => {
  const { currentUser, loading } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const [typingUser, setTypingUser] = useState(false);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  if (loading) return <h3>Loading...</h3>;
  if (!currentUser) return <h3>Please login to use chat</h3>;

  /* 🔽 Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 🔽 Listen to typing status */
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const unsub = onSnapshot(doc(db, "chats", chatId), (snap) => {
      if (!snap.exists()) return;

      const typingData = snap.data().typing || {};
      const isOtherTyping = Object.entries(typingData).some(
        ([uid, isTyping]) =>
          uid !== currentUser.uid && isTyping
      );

      setTypingUser(isOtherTyping);
    });

    return () => unsub();
  }, [chatId, currentUser]);

  /* 🔽 Listen to messages */
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsub();
  }, [chatId]);

  /* 🔽 Mark messages as seen */
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const markSeen = async () => {
      const q = query(
        collection(db, "chats", chatId, "messages"),
        where("senderId", "!=", currentUser.uid),
        where("seen", "==", false)
      );

      const snap = await getDocs(q);

      snap.forEach((docSnap) => {
        updateDoc(
          doc(db, "chats", chatId, "messages", docSnap.id),
          { seen: true }
        );
      });
    };

    markSeen();
  }, [chatId, currentUser]);

  /* 🔽 Fetch chat user */
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const fetchUser = async () => {
      const chatSnap = await getDoc(doc(db, "chats", chatId));
      if (!chatSnap.exists()) return;

      const otherUserId = chatSnap
        .data()
        .members.find((id) => id !== currentUser.uid);

      const userSnap = await getDoc(
        doc(db, "users", otherUserId)
      );

      if (userSnap.exists()) {
        setChatUser(userSnap.data());
      }
    };

    fetchUser();
  }, [chatId, currentUser]);

  /* 🔽 Typing handler (DEBOUNCED) */
  const handleTyping = async (value) => {
    setText(value);

    await updateDoc(doc(db, "chats", chatId), {
      [`typing.${currentUser.uid}`]: true,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      await updateDoc(doc(db, "chats", chatId), {
        [`typing.${currentUser.uid}`]: false,
      });
    }, 400);
  };

  /* 🔽 Send message */
  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage(chatId, text, currentUser.uid);

    await updateDoc(doc(db, "chats", chatId), {
      [`typing.${currentUser.uid}`]: false,
    });

    setText("");
  };

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header">
        {chatUser?.name || "Chat"}
      </div>

      {/* TYPING INDICATOR */}
      {typingUser && (
        <p
          style={{
            fontSize: "12px",
            color: "gray",
            marginLeft: "10px",
          }}
        >
          Typing...
        </p>
      )}

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.length === 0 && <p>No messages yet</p>}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.senderId === currentUser.uid
                ? "sent"
                : "received"
            }`}
          >
            {msg.text}

            {msg.senderId === currentUser.uid && (
              <div style={{ fontSize: "10px", color: "#ccc" }}>
                {msg.seen ? "✔✔ Seen" : "✔ Delivered"}
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              handleSend();
            }
          }}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
