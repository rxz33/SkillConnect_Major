import { db } from "../../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc
} from "firebase/firestore";

export const sendMessage = async (chatId, text, userId) => {
  try {
    await addDoc(
      collection(db, "chats", chatId, "messages"),
      {
        text,
        senderId: userId,
        createdAt: serverTimestamp(),
        delivered: true,
        seen: false,
      }
    );

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("❌ Send message failed:", err);
  }
};
