// src/contexts/AuthContext.tsx (超シンプル版 - デバッグ用 Ver.2)
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { auth } from '@/firebase/clientApp';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 初期値はtrue

  useEffect(() => {
    console.log("【デバッグV2】AuthContextProvider: useEffect開始。初期loading:", loading);

    // onAuthStateChanged listener: 認証状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, (_user) => {
      console.log("【デバッグV2】onAuthStateChanged 発火。受信ユーザー:", _user ? _user.displayName : "null");
      setUser(_user);
      setLoading(false); // ユーザー状態が確定したらローディング完了
      console.log("【デバッグV2】onAuthStateChanged 後。loading:", false, "user:", _user ? _user.displayName : "null");
    });

    // getRedirectResult handling: リダイレクトからの戻りを処理
    console.log("【デバッグV2】getRedirectResult 呼び出し前。");
    getRedirectResult(auth)
      .then((result) => {
        console.log("【デバッグV2】getRedirectResult .then() ブロック開始。");
        if (result) {
          // 実際にユーザー情報が取得できた場合
          console.log("【デバッグV2】getRedirectResult: 有効なリダイレクト結果あり。ユーザー:", result.user.displayName);
          // このユーザー情報は onAuthStateChanged でも検知されるため、
          // ここで setUser や setLoading を直接操作する必要は必ずしもありません。
          // onAuthStateChanged が最終的な状態をセットします。
        } else {
          // リダイレクト結果がない場合（例：直接アクセス時、リダイレクトではない通常のページ読み込み時）
          console.log("【デバッグV2】getRedirectResult: 有効なリダイレクト結果なし。");
          // この場合も onAuthStateChanged が現在の認証状態（おそらくnull）をセットし、
          // setLoading(false) を呼び出すため、ローディングは解除されるはずです。
        }
      })
      .catch((error) => {
        console.error("【デバッグV2】getRedirectResult エラー:", error);
        // エラーが発生した場合でも、onAuthStateChanged が最終的に初期状態（null）を
        // セットし、ローディングを解除することを期待。
        // もしここでローディングが止まるようなら、ここでもsetLoading(false)を検討。
      })
      .finally(() => {
        console.log("【デバッグV2】getRedirectResult .finally() ブロック。");
        // getRedirectResult が完了した時点で onAuthStateChanged がまだ発火していない場合、
        // ローディングが継続してしまう可能性を考慮。
        // ただし、通常 onAuthStateChanged は初期状態(null)をすぐに通知するはず。
        // ここで setLoading(false) を呼ぶと、onAuthStateChanged によるユーザーセットと競合する可能性も。
        // まずは onAuthStateChanged によるローディング解除を信頼します。
      });

    return () => {
      console.log("【デバッグV2】AuthContextProvider: useEffectクリーンアップ。リスナー解除。");
      unsubscribe();
    };
  }, []); // このuseEffectはマウント時に一度だけ実行されます

  const value = { user, loading };

  if (loading) {
    console.log("【デバッグV2】AuthContextProvider:レンダリング中 - Loading...");
  } else {
    console.log("【デバッグV2】AuthContextProvider:レンダリング中 - 子供を表示. User:", user ? user.displayName : "null");
  }

  return (
    <AuthContext.Provider value={value}>
      {/* 以前は {!loading && children} でしたが、常にchildrenを描画し、
          子コンポーネント側で useAuth().loading を見て表示制御する方が
          柔軟な場合もあります。ここでは AuthContext の役割としてローディング表示まで行います。*/}
      {loading ? <div>Loading auth state... (V2)</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);