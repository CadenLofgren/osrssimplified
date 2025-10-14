"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import getSeasonalBackground from "@/utils/getSeasonalBackground";

interface Skill {
  id: number;
  name: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const bgImage = getSeasonalBackground();

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`);
        const data: Skill[] = await res.json();

        // Remove duplicates (f2p/p2p)
        const unique = Array.from(
          new Map(
            data.map((s) => [s.name.toLowerCase(), { id: s.id, name: s.name }])
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
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-[#e5c77a] overflow-x-hidden"
      style={{ backgroundImage: `url(${bgImage})`, backgroundAttachment: "scroll" }}
    >
      <style>{`
        @media (min-width: 640px) {
          main[style] { background-attachment: fixed !important; }
        }
      `}</style>

      <motion.div
        className="absolute inset-0 bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center py-12 px-6 sm:py-16 sm:px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-yellow-400 mb-8 sm:mb-12 drop-shadow-lg">
          Skills
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl w-full">
          {skills.map((skill) => {
            const formattedName = skill.name.charAt(0).toUpperCase() + skill.name.slice(1);
            const iconSrc = `/icons/${formattedName}_icon.png`;

            return (
              <Link
                key={skill.id}
                href={`/skills/${encodeURIComponent(skill.name)}`}
                className="osrs-panel flex items-center justify-between hover:scale-105 transition-transform duration-200 cursor-pointer rounded-2xl p-4 sm:p-5"
              >
                <span className="font-semibold text-lg sm:text-xl capitalize text-yellow-300">
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
      </motion.div>
    </main>
  );
}
