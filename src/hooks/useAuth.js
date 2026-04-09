"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ||
    "https://sagip-backend-851223561042.asia-southeast1.run.app";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          // Verify token with backend and get role
          const res = await fetch(`${API_URL}/auth/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(firebaseUser);
            setToken(idToken);
            setRole(data.role);
            setName(data.name);
          } else {
            // Token valid but user not in Firestore users collection
            await signOut(auth);
            setUser(null);
            setToken(null);
            setRole(null);
            setName(null);
          }
        } catch (err) {
          console.error("Auth verification failed:", err);
          setUser(null);
          setToken(null);
          setRole(null);
          setName(null);
        }
      } else {
        setUser(null);
        setToken(null);
        setRole(null);
        setName(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  // Refresh token before it expires (Firebase tokens last 1 hour)
  const getToken = async () => {
    if (user) {
      const fresh = await user.getIdToken(false);
      setToken(fresh);
      return fresh;
    }
    return null;
  };

  return { user, token, role, name, loading, logout, getToken };
}
