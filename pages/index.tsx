"use client";

import { useState, FormEvent, useEffect } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiFramer } from "react-icons/si";

type Category = "colors" | "typography" | "spacing" | "usability" | "imagery" | "full";

// Fire emoji component
const FireEmoji = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <span className="animate-flicker">🔥</span>;
};

export default function Home() {
  const [category, setCategory] = useState<Category | null>(null);
  const [siteUrl, setSiteUrl] = useState<string>("");
  const [roast, setRoast] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = useState<boolean>(true);

  // Map category to CTA text
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
    setRoast(""); // clear previous roast
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
      {/* How-to Box */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm p-4 rounded-xl shadow-lg max-w-md text-center">
        <h3 className="font-semibold mb-1">How it works ✨</h3>
        <p className="text-gray-200">
          1. Paste your website URL <br />
          2. Pick a category <br />
          3. Get actionable UI feedback
        </p>
      </div>

      {/* Header */}
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
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-10 flex flex-col items-center">

        {/* Header */}
        <div className="relative mb-8 flex flex-col items-center text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center gap-4">
            <FireEmoji />
            <span className="tracking-tight">UI Roast AI</span>
            <span className="text-yellow-400 animate-pulse">🤬</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg sm:text-xl">
            Get actionable UI feedback in 6 categories
          </p>
        </div>

        {/* Input + categories + preview */}
        <div className="w-full flex flex-col sm:flex-row gap-6">
          {/* Left side */}
          <div className="flex-1 flex flex-col gap-4">
            <input
              type="url"
              placeholder="Paste your website URL here"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-400 bg-white/10 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div
  className={`grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6 w-full ${
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
          flex-1 min-w-[140px] p-6 rounded-2xl text-white font-semibold border-2 transition-all text-base sm:text-lg whitespace-nowrap
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
              className={`bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors w-full text-xl font-bold ${
                !siteUrl || !category || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!siteUrl || !category || loading}
            >
              {loading ? `Checking ${category ? categoryCTAMap[category] : ""}...` : `Get ${category ? categoryCTAMap[category] : ""}`}
            </button>
          </div>

          {/* Right side: Preview */}
          {siteUrl && (
            <div className="flex-1 border border-gray-400 rounded-2xl overflow-hidden relative h-80 sm:h-auto">
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
        </div>

        {/* Roast output */}
        {roast && (
          <div className="mt-10 w-full bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-inner text-gray-100">
            <h2 className="text-3xl font-semibold mb-4 text-center">Feedback</h2>
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
          .animate-flicker { animation: flicker 1s infinite; display: inline-block; }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.05); }
          }
          .animate-pulse-slow { animation: pulse-slow 3s infinite; }
          .animate-pulse { animation: pulse 1s infinite; }
        `}</style>
      </div>
    </div>
  );
}
