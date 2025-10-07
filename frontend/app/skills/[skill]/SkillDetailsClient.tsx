"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SkillVersion {
  id: number;
  name: string;
  category: string;
  summary: string;
}

export default function SkillDetailsClient({ skill }: { skill: string }) {
  const [versions, setVersions] = useState<SkillVersion[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    async function fetchSkillVersions() {
      try {
        const res = await fetch("http://127.0.0.1:8000/skills");
        const data = await res.json();

        const filtered = data.filter(
          (s: any) => s.name.toLowerCase() === skill.toLowerCase()
        );

        setVersions(filtered);

        if (filtered.length > 0) {
          const hasF2P = filtered.find(
            (v: SkillVersion) => v.category?.toLowerCase() === "f2p"
          );
          setActiveTab(hasF2P ? "f2p" : filtered[0].category);
        }
      } catch (error) {
        console.error("Error fetching skill versions:", error);
      }
    }
    fetchSkillVersions();
  }, [skill]);

  const activeVersion = versions.find(
    (v) => v.category?.toLowerCase() === activeTab?.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 capitalize">
          {skill}
        </h1>

        {/* Tabs */}
        {versions.length > 1 && (
          <div className="flex justify-center gap-6 mb-8 relative">
            {versions.map((v) => (
              <button
                key={v.category || v.id}
                onClick={() => setActiveTab(v.category)}
                className={`relative px-6 py-2 font-semibold transition ${
                  activeTab === v.category
                    ? "text-emerald-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {v.category?.toUpperCase() || "GENERAL"}
                {activeTab === v.category && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 -bottom-1 h-[2px] bg-emerald-400 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Summary Card */}
        {activeVersion ? (
          <motion.div
            key={activeVersion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700"
          >
            <h2 className="text-2xl font-semibold mb-3 uppercase">
              {activeVersion.category || "General"}
            </h2>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {activeVersion.summary}
            </p>
          </motion.div>
        ) : (
          <p className="text-center text-gray-400">
            No summary available for this skill.
          </p>
        )}

        {/* Back button */}
        <div className="mt-10 text-center">
          <a
            href="/skills"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-5 rounded-xl transition"
          >
            ← Back to Skills
          </a>
        </div>
      </div>
    </main>
  );
}
