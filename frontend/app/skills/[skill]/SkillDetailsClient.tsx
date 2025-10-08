"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

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

        const ordered = filtered.sort((a: SkillVersion, b: SkillVersion) => {
          const order = ["f2p", "p2p"];
          const aIndex = order.indexOf(a.category?.toLowerCase() || "");
          const bIndex = order.indexOf(b.category?.toLowerCase() || "");
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        setVersions(ordered);

        if (ordered.length > 0) {
          const hasF2P = ordered.find(
            (v: SkillVersion) => v.category?.toLowerCase() === "f2p"
          );
          setActiveTab(hasF2P ? "f2p" : ordered[0].category);
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 capitalize">
          {skill}
        </h1>

        {versions.length > 0 && (
          <div className="flex flex-col items-center mb-8">
            {versions.length > 1 && (
              <div className="flex justify-center gap-6 mb-4 relative">
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

            <div className="w-full max-w-6xl flex justify-start">
              <a
                href="/skills"
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-5 rounded-xl transition"
              >
                ← Back to Skills
              </a>
            </div>
          </div>
        )}

        {activeVersion ? (
          <motion.div
            key={activeVersion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700"
          >
            <h2 className="text-2xl font-semibold mb-6 uppercase text-emerald-400">
              {activeVersion.category || "General"}
            </h2>

            <div className="prose prose-invert max-w-none leading-relaxed text-gray-200">
              <ReactMarkdown
                components={{
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-emerald-400 text-xl font-semibold mt-6 mb-3 border-b border-slate-700 pb-1"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-4" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-white font-semibold" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="text-gray-300 italic" {...props} />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        className="bg-slate-700 text-emerald-300 px-1.5 py-0.5 rounded-md text-sm font-mono"
                        {...props}
                      />
                    ) : (
                      <code
                        className="block bg-slate-800 border border-slate-700 text-emerald-300 p-3 rounded-lg text-sm font-mono my-4 whitespace-pre-wrap"
                        {...props}
                      />
                    ),
                }}
              >
                {activeVersion.summary}
              </ReactMarkdown>
            </div>
          </motion.div>
        ) : (
          <p className="text-center text-gray-400">
            No summary available for this skill.
          </p>
        )}

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
