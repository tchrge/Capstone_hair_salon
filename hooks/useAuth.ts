import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  User,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Define interfaces for type safety
interface BarberService {
  id: string;
  name: string;
  duration: number;
  cost: number;
}

interface BarberData {
  name: string;
  email: string;
  services: BarberService[];
  bio: string;
  experience: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, barberData: BarberData) => {
    try {
      // Create the auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create the barber document in Firestore
      await setDoc(doc(db, "barbers", user.uid), {
        name: barberData.name,
        email: barberData.email,
        services: barberData.services,
        bio: barberData.bio,
        experience: barberData.experience,
        createdAt: new Date(),
        status: 'active',
        uid: user.uid
      });

      setUser(user);
      return user;
    } catch (error: any) {
      // Handle specific error cases
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('This email is already registered. Please use a different email or try logging in.');
        case 'auth/invalid-email':
          throw new Error('The email address is invalid.');
        case 'auth/operation-not-allowed':
          throw new Error('Email/password accounts are not enabled. Please contact support.');
        case 'auth/weak-password':
          throw new Error('The password is too weak. Please use a stronger password.');
        default:
          throw new Error('Failed to create account. Please try again.');
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error('Invalid email address.');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled. Please contact support.');
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          throw new Error('Invalid email or password.');
        default:
          throw new Error('Failed to log in. Please try again.');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      throw new Error('Failed to log out. Please try again.');
    }
  };

  return { user, loading, login, logout, register };
}