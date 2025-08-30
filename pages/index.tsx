"use client";

import { useState, FormEvent } from "react";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-white text-center">🔥 UI Roast AI 🤬</h1>

        <label className="w-full mb-4 flex flex-col items-center cursor-pointer bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-xl transition">
          <span className="text-gray-300 mb-2">Click to upload your screenshot</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          {file && <span className="text-green-400 font-semibold mt-2">✅ {file.name} uploaded</span>}
        </label>

        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 w-full ${!file ? "opacity-50 pointer-events-none" : ""}`}>
          <button type="button" onClick={() => setJudge("gordon")} className={`p-4 rounded-xl border-2 text-white transition ${judge === "gordon" ? "border-red-500 bg-red-600" : "border-gray-500 bg-gray-700 hover:bg-gray-600"}`}>
            🍳 Gordon Ramsay
          </button>
          <button type="button" onClick={() => setJudge("grandma")} className={`p-4 rounded-xl border-2 text-white transition ${judge === "grandma" ? "border-pink-400 bg-pink-500" : "border-gray-500 bg-gray-700 hover:bg-gray-600"}`}>
            👵 Grandma
          </button>
          <button type="button" onClick={() => setJudge("ipad_kid")} className={`p-4 rounded-xl border-2 text-white transition ${judge === "ipad_kid" ? "border-yellow-400 bg-yellow-500" : "border-gray-500 bg-gray-700 hover:bg-gray-600"}`}>
            📱 iPad Kid
          </button>
        </div>

        <button onClick={handleSubmit} className={`bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors w-full text-lg font-semibold ${!file || !judge || loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!file || !judge || loading}>
          {loading ? "Roasting..." : "Roast my UI"}
        </button>

        {roast && (
          <div className="mt-8 bg-gray-700 p-6 rounded-2xl shadow-inner w-full text-gray-100">
            <h2 className="text-2xl font-semibold mb-2">Roast Result:</h2>
            <p className="whitespace-pre-wrap">{roast}</p>
          </div>
        )}
      </div>
    </div>
  );
}
