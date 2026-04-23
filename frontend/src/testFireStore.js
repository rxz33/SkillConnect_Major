import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const testFirestore = async () => {
  try {
    await addDoc(collection(db, "test"), {
      message: "Firestore connected successfully",
      createdAt: Timestamp.now()
    });
    console.log("🔥 Firestore working");
  } catch (err) {
    console.error("❌ Firestore error", err);
  }
};
