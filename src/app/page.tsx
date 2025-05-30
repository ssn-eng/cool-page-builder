import AuthButton from "@/components/AuthButton"; // 作成したAuthButtonコンポーネントをインポート

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Cool Page Builder
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          あなただけの特別なページを、簡単作成。
        </p>
        <AuthButton />
      </div>
    </main>
  );
}