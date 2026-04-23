import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";

const ChatList = ({ onSelectChat }) => {
  const { currentUser } = useContext(AuthContext);
  const [chats, setChats] = useState([]);

  const getOtherUser = async (members) => {
  const otherId = members.find(id => id !== currentUser.uid);
  const snap = await getDoc(doc(db, "users", otherId));
  return snap.data();
};


  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid),
      orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(q, async (snapshot) => {
  const list = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const user = await getOtherUser(data.members);

      return {
        id: docSnap.id,
        ...data,
        user,
      };
    })
  );
  setChats(list);
});


    return () => unsub();
  }, [currentUser]);

  return (
    <div style={{ width: "300px", borderRight: "1px solid #ddd" }}>
      <h3 style={{ padding: "10px" }}>Chats</h3>

      {chats.length === 0 && <p>No chats yet</p>}

      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          style={{
            padding: "10px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          <p style={{ fontWeight: "bold" }}>
  {chat.user?.name || "User"}
</p>
<img
  src={chat.user?.photoURL || "/avatar.png"}
  alt="avatar"
  className="chat-avatar"
/>

          <p style={{ fontSize: "12px", color: "gray" }}>
            {chat.lastMessage || "No messages yet"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
