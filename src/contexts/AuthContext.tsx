// src/contexts/AuthContext.tsx (超シンプル版 - デバッグ用)
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { auth } from '@/firebase/clientApp'; // db のインポートは不要

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("【簡易デバッグ版】AuthContextProvider: 認証状態の監視を開始します。");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true); // 状態が変わるたびにローディング開始
      console.log("【簡易デバッグ版】onAuthStateChangedが発火しました。 User:", user ? user.displayName : "null");
      if (user) {
        setUser(user);
        console.log("【簡易デバッグ版】★onAuthStateChanged: ユーザーオブジェクトを検知しました:", user);
      } else {
        setUser(null);
      }
      setLoading(false); // 状態セット後にローディング完了
    });

    console.log("【簡易デバッグ版】getRedirectResult の呼び出しを開始します...");
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("【簡易デバッグ版】★getRedirectResultでユーザーを取得しました:", result.user.displayName);
          // onAuthStateChanged がログインユーザーをセットするので、
          // ここで明示的に setUser(result.user) を呼び出す必要は必ずしもありません。
          // onAuthStateChangedが検知するのを待ちます。
        } else {
          console.log("【簡易デバッグ版】getRedirectResult: 有効なリダイレクト結果はありませんでした（これはページ初回表示時などでは正常です）。");
        }
      })
      .catch((error) => {
        console.error("【簡易デバッグ版】getRedirectResultエラー:", error);
      });

    return () => {
      console.log("【簡易デバッグ版】AuthContextProviderアンマウント。リスナー解除。");
      unsubscribe();
    };
  }, []);

  const value = { user, loading };

  // ローディング中は「Loading auth state...」を表示し、完了後に子コンポーネントを表示
  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading auth state...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);