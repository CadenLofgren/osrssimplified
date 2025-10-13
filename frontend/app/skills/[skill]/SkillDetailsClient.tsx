"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import getSeasonalBackground from "@/utils/getSeasonalBackground";

interface SkillVersion {
  id: number;
  name: string;
  category: string;
  summary: string;
}

export default function SkillDetailsClient({ skill }: { skill: string }) {
  const [versions, setVersions] = useState<SkillVersion[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const bgImage = getSeasonalBackground(); // 🎃 Seasonal image helper

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
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-[#e5c77a] p-4 sm:p-8 font-osrs overflow-x-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundAttachment: "scroll", // default; overridden for sm+ via small <style> below
      }}
    >
      {/* Force fixed background for sm+ without breaking mobile */}
      <style>{`
        @media (min-width: 640px) {
          main[style] { background-attachment: fixed !important; }
        }
      `}</style>

      {/* Dark overlay covering full page */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70" />

      {/* Content container */}
      <div className="relative z-10 max-w-xl sm:max-w-4xl md:max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 capitalize drop-shadow-md">
          {skill}
        </h1>

        {versions.length > 0 && (
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            {versions.length > 1 && (
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-4 w-full sm:w-auto">
                {versions.map((v) => (
                  <button
                    key={v.category || v.id}
                    onClick={() => setActiveTab(v.category)}
                    className={`skill-tab-btn relative px-4 sm:px-6 py-2 sm:py-2 font-semibold transition duration-200 rounded-md border border-[#3b2f1c] w-full sm:w-auto text-center ${
                      activeTab === v.category
                        ? "bg-[#2b220f] text-[#ffdf6b]"
                        : "bg-transparent text-[#e5c77a]"
                    }`}
                  >
                    {v.category?.toUpperCase() || "GENERAL"}
                    {activeTab === v.category && (
                      <motion.div
                        layoutId="underline"
                        className="absolute left-0 right-0 -bottom-2 h-[2px] bg-[#ffcb05] rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="w-full flex justify-start">
              <a
                href="/skills"
                className="bg-[#1b1a17] hover:bg-[#2a281f] text-[#e5c77a] border border-[#3b2f1c] font-semibold py-2 px-4 rounded-xl transition text-sm sm:text-base"
              >
                ← Back to Skills
              </a>
            </div>
          </div>
        )}

        {activeVersion ? (
          <motion.div
            key={activeVersion.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="bg-[#1a1816]/95 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-[#3b2f1c]"
          >
            <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 uppercase text-[#ffcb05]">
              {activeVersion.category || "General"}
            </h2>

            <div className="prose prose-invert max-w-none leading-relaxed text-[#d6cfa1]">
              <ReactMarkdown
                components={{
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-[#ffcb05] text-lg sm:text-xl font-semibold mt-5 mb-3 border-b border-[#3b2f1c] pb-1"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => <p className="mb-3 sm:mb-4" {...props} />,
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside mb-3 sm:mb-4 space-y-1 marker:text-[#ffcb05]"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-[#ffcb05] font-semibold" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="text-[#d6cfa1] italic" {...props} />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        className="bg-[#22201b] text-[#ffcb05] px-1 py-0.5 rounded-sm text-sm font-mono"
                        {...props}
                      />
                    ) : (
                      <code
                        className="block bg-[#1b1a17] border border-[#3b2f1c] text-[#ffcb05] p-3 rounded-lg text-sm font-mono my-4 whitespace-pre-wrap overflow-x-auto"
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
          <p className="text-center text-[#a68f59]">No summary available for this skill.</p>
        )}

        <div className="mt-8 text-center">
          <a
            href="/skills"
            className="bg-[#1b1a17] hover:bg-[#2a281f] text-[#e5c77a] border border-[#3b2f1c] font-semibold py-2 px-4 rounded-xl transition text-sm sm:text-base"
          >
            ← Back to Skills
          </a>
        </div>
      </div>
    </main>
  );
}
