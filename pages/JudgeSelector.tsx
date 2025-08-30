// components/JudgeSelector.tsx
import { useState } from "react";

const judges = [
  { id: "gordon", name: "Gordon Ramsay", emoji: "🍳", desc: "Brutal, no-nonsense design critique" },
  { id: "grandma", name: "Grandma", emoji: "👵", desc: "Hates tech, loves simplicity" },
  { id: "ipad_kid", name: "iPad Kid", emoji: "📱", desc: "Short attention span, needs instant clarity" },
];

export default function JudgeSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {judges.map((judge) => (
        <div
          key={judge.id}
          className={`cursor-pointer rounded-2xl border p-4 shadow-md hover:shadow-xl transition
            ${selected === judge.id ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          `}
          onClick={() => {
            setSelected(judge.id);
            onSelect(judge.id);
          }}
        >
          <div className="text-4xl">{judge.emoji}</div>
          <h3 className="text-lg font-bold">{judge.name}</h3>
          <p className="text-sm text-gray-600">{judge.desc}</p>
        </div>
      ))}
    </div>
  );
}
