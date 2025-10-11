"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Skill {
  id: number;
  name: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("http://127.0.0.1:8000/skills");
        const data = await res.json();

        // ✅ Remove duplicates (f2p/p2p)
        const unique = Array.from(
          new Map(
            data.map((s: any) => [s.name.toLowerCase(), { id: s.id, name: s.name }])
          ).values()
        );

        // Sort alphabetically
        unique.sort((a, b) => a.name.localeCompare(b.name));

        setSkills(unique);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    }
    fetchSkills();
  }, []);

  return (
    <main className="min-h-screen bg-black text-[#e5c77a] flex flex-col items-center py-16 px-8">
      {/* Title */}
      <h1 className="text-5xl font-bold text-center text-yellow-400 mb-12 drop-shadow-lg">
        Skills
      </h1>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {skills.map((skill) => {
          const formattedName =
            skill.name.charAt(0).toUpperCase() + skill.name.slice(1);
          const iconSrc = `/icons/${formattedName}_icon.png`;

          return (
            <Link
              key={skill.id}
              href={`/skills/${encodeURIComponent(skill.name)}`}
              className="osrs-panel flex items-center justify-between hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <span className="font-semibold text-lg capitalize text-yellow-300">
                {skill.name}
              </span>

              <div className="flex-shrink-0">
                <Image
                  src={iconSrc}
                  alt={skill.name}
                  width={48}
                  height={48}
                  className="rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/icons/default_icon.png";
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
