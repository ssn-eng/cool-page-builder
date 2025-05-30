// src/components/AuthButton.tsx
"use client";

// TwitterAuthProvider の代わりに GoogleAuthProvider をインポート
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/clientApp";

const AuthButton = () => {
  // Googleログイン処理
  const handleLogin = async () => {
    // new TwitterAuthProvider() を new GoogleAuthProvider() に変更
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("リダイレクト開始エラー:", error);
    }
  };

  return (
    // ボタンのデザインと文言をGoogle用に変更
    <button
      onClick={handleLogin}
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 ease-in-out flex items-center"
    >
      <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#FBBC05" d="M27.463 36.708l-6.571-4.819C19.055 34.12 14.47 36 9.656 36c-3.355 0-6.427-1.258-8.694-3.309l-6.571 4.819C4.956 41.54 11.237 44 18.257 44c4.715 0 8.995-1.579 12.28-4.212z"></path>
        <path fill="#EA4335" d="M43.611 20.083H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-4.832 0-9.012-2.12-11.66-5.405l-6.571 4.819C9.656 39.663 16.318 44 24 44s14.344-4.337 17.694-10.691C43.049 30.708 44 26.868 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
      </svg>
      Googleでログイン
    </button>
  );
};

export default AuthButton;