import { useState, FormEvent } from "react";

type Judge = "gordon" | "grandma" | "ipad_kid";

export default function Home() {
  const [roast, setRoast] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [judge, setJudge] = useState<Judge | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!judge) {
      alert("Pick a judge first!");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judge }), // send chosen judge
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
        <h1 className="text-4xl font-bold mb-4 text-white text-center">
          🔥 UI Roast AI 🤬
        </h1>
        <p className="mb-6 text-center max-w-md text-gray-300">
          Choose your judge and get roasted! Brutal, funny, and painfully honest.
        </p>

        {/* Judge Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 w-full">
          <button
            type="button"
            onClick={() => setJudge("gordon")}
            className={`p-4 rounded-xl border-2 text-white transition ${
              judge === "gordon"
                ? "border-red-500 bg-red-600"
                : "border-gray-500 bg-gray-700 hover:bg-gray-600"
            }`}
          >
            🍳 Gordon Ramsay
            <p className="text-xs mt-1 text-gray-300">
              Brutal food-style roasts
            </p>
          </button>

          <button
            type="button"
            onClick={() => setJudge("grandma")}
            className={`p-4 rounded-xl border-2 text-white transition ${
              judge === "grandma"
                ? "border-pink-400 bg-pink-500"
                : "border-gray-500 bg-gray-700 hover:bg-gray-600"
            }`}
          >
            👵 Grandma
            <p className="text-xs mt-1 text-gray-300">
              Simplicity over everything
            </p>
          </button>

          <button
            type="button"
            onClick={() => setJudge("ipad_kid")}
            className={`p-4 rounded-xl border-2 text-white transition ${
              judge === "ipad_kid"
                ? "border-yellow-400 bg-yellow-500"
                : "border-gray-500 bg-gray-700 hover:bg-gray-600"
            }`}
          >
            📱 iPad Kid
            <p className="text-xs mt-1 text-gray-300">
              Fast, flashy, short attention
            </p>
          </button>
        </div>

        {/* Roast Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 w-full"
        >
          <button
            type="submit"
            className={`bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors w-full text-lg font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Roasting..." : "Roast my UI"}
          </button>
        </form>

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
