/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logoutUser = () => {
    localStorage.removeItem("access-token");
    setRole(null);
    return signOut(auth);
  };

  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL,
    });
  };

  useEffect(() => {
    const fetchRoleWithRetry = async (token, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/role`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );

          return res.data?.role || "user";
        } catch (error) {
          if (i === retries - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, 700));
        }
      }

      return "user";
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (currentUser) {
        try {
          // force refresh token after register/login
          const token = await currentUser.getIdToken(true);
          localStorage.setItem("access-token", token);

          const fetchedRole = await fetchRoleWithRetry(token, 3);
          setRole(fetchedRole);
        } catch (error) {
          console.error("Role fetch error:", error);
          setRole("user");
        }
      } else {
        setRole(null);
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,
    loading,
    createUser,
    loginUser,
    googleLogin,
    logoutUser,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
}