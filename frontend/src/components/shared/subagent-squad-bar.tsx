import React from "react";
import { AnimalAvatar, AnimalType } from "./animal-avatar";

export interface SubagentSquadBarProps {
  activeAnimals?: AnimalType[];
  currentAction?: string;
  className?: string;
}

export const SubagentSquadBar: React.FC<SubagentSquadBarProps> = ({
  activeAnimals = ["owl", "dog", "monkey", "rabbit"],
  currentAction = "Subagents Active",
  className = "",
}) => (
  <div
    className={`inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full backdrop-blur-2xl bg-neutral-900/60 border border-white/10 shadow-lg text-white/90 text-xs font-medium ${className}`}
  >
    <div className="flex items-center -space-x-2 overflow-hidden">
      {activeAnimals.map((animal, idx) => (
        <div
          key={animal}
          className="relative transition-transform hover:z-10 hover:scale-110"
        >
          <AnimalAvatar
            animal={animal}
            size="xs"
            status={idx === 0 ? "lead" : "online"}
          />
        </div>
      ))}
    </div>

    <div className="flex items-center gap-1.5 border-l border-white/10 pl-2.5">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="font-semibold text-white/80 tracking-wide text-[11px]">
        {activeAnimals.length} Animal Subagents Active
      </span>
    </div>
  </div>
);
