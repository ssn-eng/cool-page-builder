// src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { auth, db } from '@/firebase/clientApp';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Contextで提供するデータの型を定義
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Contextを作成
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// アプリケーションに認証機能を提供するProviderコンポーネント
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContextProvider: 認証状態の監視を開始します。");

    // ログイン状態の変化をリアルタイムで監視する
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      console.log("onAuthStateChangedが発火しました。 User:", user ? user.displayName : "null");
      if (user) {
        // ユーザーがログインしている場合
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
          // 初回ログインならFirestoreにユーザー情報を作成
          try {
            await setDoc(userDocRef, {
              userId: user.uid,
              displayName: user.displayName || "名無しさん",
              profileImageUrl: user.photoURL,
              email: user.email,
              plan: "free",
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            });
            console.log("新規ユーザーをFirestoreに作成しました。");
          } catch (e) {
            console.error("Firestoreユーザー作成エラー:", e);
          }
        }
        setUser(user);
      } else {
        // ユーザーがログアウトしている場合
        setUser(null);
      }
      setLoading(false);
    });

    // リダイレクトからの戻りを処理する
    getRedirectResult(auth).catch((error) => {
      console.error("getRedirectResultエラー:", error);
    });

    // コンポーネントが不要になったら監視を終了する
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  // ローディング中は何も表示せず、完了後に子コンポーネントを表示
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 他のコンポーネントから認証情報を簡単に利用するためのカスタムフック
export const useAuth = () => useContext(AuthContext);