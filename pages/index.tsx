"use client";

import { useState, FormEvent } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiFramer } from "react-icons/si";

type Judge = "gordon" | "grandma" | "ipad_kid";

export default function Home() {
  const [judge, setJudge] = useState<Judge | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [roast, setRoast] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!judge || !file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("judge", judge);
      formData.append("file", file);

      const res = await fetch("/api/roast", {
        method: "POST",
        body: formData,
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
    { id: "gordon", label: "Gordon Ramsay", emoji: "🍳", gradient: "from-red-500 via-pink-500 to-red-600" },
    { id: "grandma", label: "Grandma", emoji: "👵", gradient: "from-pink-400 via-purple-500 to-pink-500" },
    { id: "ipad_kid", label: "iPad Kid", emoji: "📱", gradient: "from-yellow-400 via-orange-400 to-yellow-500" },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-6">
      
      {/* Header */}
      <header className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-10">
        <span className="text-gray-400 text-lg mb-2 sm:mb-0">Made by <span className="text-white font-semibold">Abbi Kamak</span></span>
        <div className="flex gap-6">
          <a href="https://www.linkedin.com/in/abbishekkamak/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition text-2xl">
            <FaLinkedin />
          </a>
          <a href="https://abbikamak.framer.website/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition text-2xl">
            <SiFramer />
          </a>
          <a href="https://github.com/aram0057" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-100 transition text-2xl">
            <FaGithub />
          </a>
        </div>
      </header>

      {/* Main container */}
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-center">
          🔥 UI Roast AI 🤬
        </h1>

        <label className="w-full mb-6 flex flex-col items-center cursor-pointer bg-white/10 hover:bg-white/20 px-6 py-5 rounded-2xl transition">
          <span className="text-gray-300 mb-2 text-lg font-medium">Upload your screenshot</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          {file && <span className="text-green-400 font-semibold mt-2">✅ {file.name} uploaded</span>}
        </label>

        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6 w-full ${!file ? "opacity-50 pointer-events-none" : ""}`}>
          {judges.map((j) => {
            const isSelected = judge === j.id;
            return (
              <button
                key={j.id}
                type="button"
                onClick={() => setJudge(j.id as Judge)}
                className={`
                  relative p-6 rounded-2xl text-white text-lg font-semibold border-2 overflow-hidden transition-all
                  ${isSelected ? `bg-gradient-to-r ${j.gradient} shadow-[0_0_20px_4px]` : "border-gray-500 bg-gray-700 hover:bg-gray-600"}
                  hover:scale-105 hover:shadow-lg duration-300
                `}
              >
                {/* Big semi-transparent icon */}
                <span
                  className="absolute text-7xl opacity-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
                >
                  {j.emoji}
                </span>
                {/* Button text */}
                <span className="relative z-10">{j.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          className={`bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors w-full text-xl font-bold ${
            !file || !judge || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!file || !judge || loading}
        >
          {loading ? "Roasting..." : "Roast my UI"}
        </button>

        {roast && (
          <div className="mt-10 w-full bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-inner text-gray-100">
            <h2 className="text-3xl font-semibold mb-4 text-center">Roast Result</h2>
            <p className="whitespace-pre-wrap text-lg leading-relaxed">{roast}</p>
          </div>
        )}
      </div>
    </div>
  );
}
