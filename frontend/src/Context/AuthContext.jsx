import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        // ✅ Mark user ONLINE + update lastSeen
        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            email: user.email,
            online: true,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );
      }
    });

    // 🔴 Handle tab close / refresh / logout
    const handleOffline = async () => {
      if (auth.currentUser) {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            online: false,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );
      }
    };

    window.addEventListener("beforeunload", handleOffline);

    return () => {
      handleOffline();          // mark offline on unmount
      window.removeEventListener("beforeunload", handleOffline);
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
