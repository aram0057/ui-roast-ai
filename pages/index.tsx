import { useState, FormEvent } from "react";

export default function Home() {
  const [roast, setRoast] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
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
          Upload your UI screenshot (or just click below) and get roasted by AI
          Gordon Ramsay. Brutal. Funny. Honest.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 w-full"
        >
          <button
            type="submit"
            className={`bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors w-full text-lg font-semibold ${
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
