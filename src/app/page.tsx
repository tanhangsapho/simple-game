import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Link
        href="/game"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Play Game
      </Link>
    </main>
  );
}
