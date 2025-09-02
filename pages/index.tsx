"use client";

import { useState, FormEvent, useEffect } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiFramer } from "react-icons/si";

type Judge = "gordon" | "grandma" | "ipad_kid";

// Fire emoji component (client-only) to avoid hydration errors
const FireEmoji = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <span className="animate-flicker">🔥</span>;
};

export default function Home() {
  const [judge, setJudge] = useState<Judge | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [roast, setRoast] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!judge || !imageUrl) return;

    setLoading(true);
    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judge, imageUrl }),
      });

      const data = await res.json();
      setRoast(data.roast);
    } catch (err) {
      console.error(err);
      setRoast("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const judges = [
    { id: "gordon", label: "Gordon Ramsay", gradient: "from-red-500 via-pink-500 to-red-600" },
    { id: "grandma", label: "Grandma", gradient: "from-pink-400 via-purple-500 to-pink-500" },
    { id: "ipad_kid", label: "iPad Kid", gradient: "from-yellow-400 via-orange-400 to-yellow-500" },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-6">
      {/* Top header with links */}
      <header className="w-full max-w-5xl flex justify-center sm:justify-between items-center mb-10 px-4 py-2">
        <span className="text-white font-semibold text-lg">Made by Abbi Kamak</span>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="https://www.linkedin.com/in/abbishekkamak/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 transition-colors text-2xl">
            <FaLinkedin />
          </a>
          <a href="https://abbikamak.framer.website/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-500 transition-colors text-2xl">
            <SiFramer />
          </a>
          <a href="https://github.com/aram0057" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors text-2xl">
            <FaGithub />
          </a>
        </div>
      </header>

      {/* Main container */}
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-10 flex flex-col items-center">

        {/* Header */}
        <div className="relative mb-8 flex flex-col items-center text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center gap-4">
            <FireEmoji />
            <span className="tracking-tight">UI Roast AI</span>
            <span className="text-yellow-400 animate-pulse">🤬</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg sm:text-xl">
            Brutally roast your UI like a pro chef 🔥
          </p>
        </div>

        {/* URL input */}
        <input
          type="url"
          placeholder="Paste your screenshot URL here"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full mb-6 p-4 rounded-2xl border border-gray-400 bg-white/10 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Judge buttons */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6 w-full ${!imageUrl ? "opacity-50 pointer-events-none" : ""}`}>
          {judges.map((j) => {
            const isSelected = judge === j.id;
            return (
              <button
                key={j.id}
                type="button"
                onClick={() => setJudge(j.id as Judge)}
                className={`
                  p-6 rounded-2xl text-white text-lg font-semibold border-2 transition-all
                  ${isSelected ? `bg-gradient-to-r ${j.gradient} shadow-[0_0_25px_6px]` : "border-gray-500 bg-gray-700 hover:bg-gray-600"}
                  hover:scale-105 hover:shadow-lg duration-300
                `}
              >
                {j.label}
              </button>
            );
          })}
        </div>

        {/* Roast button */}
        <button
          onClick={handleSubmit}
          className={`bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors w-full text-xl font-bold ${
            !imageUrl || !judge || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!imageUrl || !judge || loading}
        >
          {loading ? "Roasting..." : "Roast my UI"}
        </button>

        {/* Roast output */}
        {roast && (
          <div className="mt-10 w-full bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-inner text-gray-100">
            <h2 className="text-3xl font-semibold mb-4 text-center">Roast Result</h2>
            <p className="whitespace-pre-wrap text-lg leading-relaxed">{roast}</p>
          </div>
        )}

        {/* Footer */}
        <p className="mt-8 text-gray-400 text-sm text-center">
          Powered by ChatGPT GPT-4.1 | Built with Next.js & Tailwind CSS
        </p>

        {/* Animations */}
        <style jsx>{`
          @keyframes flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
            20%, 22%, 24%, 55% { opacity: 0.3; }
          }
          .animate-flicker {
            animation: flicker 1s infinite;
            display: inline-block;
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.05); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s infinite;
          }
          .animate-pulse {
            animation: pulse 1s infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
