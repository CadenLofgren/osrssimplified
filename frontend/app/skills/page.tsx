"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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

        // Extract 23 unique base skill names (remove f2p/p2p duplicates)
        const unique = Array.from(
          new Map(
            data.map((s: any) => [s.name.toLowerCase(), { id: s.id, name: s.name }])
          ).values()
        );

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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {skills.map((skill) => (
          <Link
            key={skill.id}
            href={`/skills/${encodeURIComponent(skill.name)}`}
            className="bg-slate-800 hover:bg-slate-700 transition p-6 rounded-xl shadow-lg text-center font-semibold"
          >
            {skill.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
