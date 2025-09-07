"use client";

import { useState, FormEvent, useEffect } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiFramer } from "react-icons/si";

type Category = "colors" | "typography" | "spacing" | "usability" | "imagery" | "full";

const FireEmoji = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
};

export default function Home() {
  const [category, setCategory] = useState<Category | null>(null);
  const [siteUrl, setSiteUrl] = useState<string>("");
  const [roast, setRoast] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = useState<boolean>(true);

  const categoryCTAMap: Record<Category, string> = {
    colors: "Colors Review",
    typography: "Typography Review",
    spacing: "Spacing Review",
    usability: "Usability Review",
    imagery: "Imagery Review",
    full: "Full Review",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!category || !siteUrl) return;

    setLoading(true);
    setRoast("");
    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, siteUrl }),
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

  const handleReset = () => {
    setCategory(null);
    setSiteUrl("");
    setRoast("");
    setPreviewLoading(true);
  };

  const categories = [
    { id: "colors", label: "🎨 Colors & Contrast", gradient: "from-red-500 via-pink-500 to-red-600" },
    { id: "typography", label: "🔤 Typography", gradient: "from-pink-400 via-purple-500 to-pink-500" },
    { id: "spacing", label: "📐 Layout & Spacing", gradient: "from-yellow-400 via-orange-400 to-yellow-500" },
    { id: "usability", label: "🧭 Usability", gradient: "from-green-400 via-emerald-500 to-green-600" },
    { id: "imagery", label: "🖼️ Imagery & Branding", gradient: "from-indigo-400 via-blue-500 to-indigo-600" },
    { id: "full", label: "🌐 Full Review", gradient: "from-blue-500 via-indigo-500 to-purple-600" },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-6 relative">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-center sm:justify-between items-center mt-8 mb-6 px-4 py-2 relative z-30">
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

      {/* How-to Box (now below header) */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm p-4 rounded-xl shadow-lg max-w-md text-center z-20 mb-10">
        <h3 className="font-semibold mb-1">How it works ✨</h3>
        <p className="text-gray-200">
          1. Paste your website URL <br />
          2. Pick a category <br />
          3. Get actionable UI/UX feedback
        </p>
      </div>

      {/* Main container */}
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col items-center relative z-10">
        {/* Header */}
        <div className="relative mb-8 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center gap-4">
           
            <span className="tracking-tight">UI/UX Feedback AI</span>
            <span className="text-yellow-400 animate-pulse">🎨</span>
          </h1>
          <p className="mt-4 text-gray-300 text-base sm:text-xl">
            Get actionable website feeback in different categories
          </p>
        </div>

        {/* Input + categories */}
        <div className="w-full flex flex-col gap-6">
          <input
            type="url"
            placeholder="Paste your website URL here"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="w-full p-4 rounded-2xl border border-gray-400 bg-white/10 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
          />

          <div
            className={`grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full ${
              !siteUrl ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {categories.map((c) => {
              const isSelected = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as Category)}
                  className={`
                    flex-1 min-w-[130px] sm:min-w-[150px] p-4 sm:p-6 rounded-2xl text-white font-semibold border-2 transition-all text-sm sm:text-lg whitespace-nowrap
                    ${isSelected ? `bg-gradient-to-r ${c.gradient} shadow-[0_0_25px_6px]` : "border-gray-500 bg-gray-700 hover:bg-gray-600"}
                    hover:scale-105 hover:shadow-lg duration-300
                  `}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            className={`bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors w-full text-lg sm:text-xl font-bold ${
              !siteUrl || !category || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!siteUrl || !category || loading}
          >
            {loading ? `Checking ${category ? categoryCTAMap[category] : ""}...` : `Get ${category ? categoryCTAMap[category] : ""}`}
          </button>

          {(siteUrl || roast) && (
            <button
              onClick={handleReset}
              className="mt-2 bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors w-full text-base sm:text-lg font-medium"
            >
              Reset
            </button>
          )}
        </div>

        {roast && (
          <div className="mt-10 w-full bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-2xl shadow-inner text-gray-100">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">Feedback</h2>
            <p className="whitespace-pre-wrap text-base sm:text-lg leading-relaxed">{roast}</p>
          </div>
        )}

        <p className="mt-8 text-gray-400 text-xs sm:text-sm text-center">
          Powered by ChatGPT GPT-4.1 | Built with Next.js & Tailwind CSS
        </p>
      </div>

      {/* Responsive Preview */}
      {siteUrl && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[90vw] max-w-md h-48 sm:w-[480px] sm:h-[320px] border border-gray-400 rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
          {previewLoading && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center text-gray-400">
              Loading preview...
            </div>
          )}
          <iframe
            src={siteUrl}
            className="w-full h-full"
            frameBorder={0}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onLoad={() => setPreviewLoading(false)}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 22%, 24%, 55% { opacity: 0.3; }
        }
        .animate-flicker { animation: flicker 1s infinite; display: inline-block; }
      `}</style>
    </div>
  );
}
