// components/JudgeSelector.tsx
import { useState } from "react";

const judges = [
  { id: "ramsay", name: "Gordon Ramsay", desc: "Brutal and angry chef vibes 🍳" },
  { id: "grandma", name: "Grandma", desc: "Hates tech, likes it simple 👵" },
  { id: "ipadkid", name: "iPad Kid", desc: "Tech savvy but short attention span 📱" },
];

export default function JudgeSelector({ onSelect }: { onSelect: (judge: string) => void }) {
  const [selected, setSelected] = useState<string>("");

  return (
    <div className="flex gap-4">
      {judges.map((judge) => (
        <button
          key={judge.id}
          className={`p-4 border rounded-xl ${selected === judge.id ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => {
            setSelected(judge.id);
            onSelect(judge.id);
          }}
        >
          <h3 className="font-bold">{judge.name}</h3>
          <p className="text-sm">{judge.desc}</p>
        </button>
      ))}
    </div>
  );
}
