import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const getOrCreateChat = async (userId1, userId2) => {
  const chatsRef = collection(db, "chats");

  const q = query(
    chatsRef,
    where("members", "array-contains", userId1)
  );

  const snapshot = await getDocs(q);

  // 🔍 Check existing chat
  for (let doc of snapshot.docs) {
    const data = doc.data();
    if (data.members.includes(userId2)) {
      return doc.id; // existing chat
    }
  }

  // ❌ No chat found → create new
  const newChat = await addDoc(chatsRef, {
    members: [userId1, userId2],
    createdAt: serverTimestamp(),
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
  });

  return newChat.id;
};
