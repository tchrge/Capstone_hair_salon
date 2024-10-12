import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user ? "User logged in" : "User logged out")
      setUser(user)
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return { user, login, logout };
}