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
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Skills</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {skills.map((skill) => {
          // Format name to match your icon filenames (e.g., Agility_icon.png)
          const formattedName =
            skill.name.charAt(0).toUpperCase() + skill.name.slice(1);
          const iconSrc = `/icons/${formattedName}_icon.png`;

          return (
            <Link
              key={skill.id}
              href={`/skills/${encodeURIComponent(skill.name)}`}
              className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 transition p-4 rounded-2xl shadow-lg"
            >
              <span className="font-semibold text-lg">{skill.name}</span>

              <div className="flex-shrink-0">
                <Image
                  src={iconSrc}
                  alt={skill.name}
                  width={48}
                  height={48}
                  className="rounded-md"
                  onError={(e) => {
                    // fallback if missing image
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
