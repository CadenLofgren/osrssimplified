"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import getSeasonalBackground from "@/utils/getSeasonalBackground";

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.6 },
    }),
  };

  const backgroundImage = getSeasonalBackground();

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-gray-200 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl flex flex-col items-center space-y-8 sm:space-y-12">
        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-yellow-400 drop-shadow-md"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          About OSRS Simplified
        </motion.h1>

        {/* What is OSRS Simplified */}
        <motion.section
          className="text-center leading-relaxed space-y-4"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            What is OSRS Simplified?
          </h2>
          <p className="text-sm sm:text-base">
            OSRS Simplified is a project with the sole purpose of being concise but still effective.
            Sometimes reading the OSRSWiki takes longer than you would like. This website is for people
            like me who want no fluff.
          </p>
        </motion.section>

        {/* How it was made */}
        <motion.section
          className="text-center leading-relaxed space-y-6 sm:space-y-8"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white">How It Was Made</h2>

          <p className="text-sm sm:text-base">
            OSRS Simplified is powered by a modern web stack, combining a responsive frontend,
            a high-performance backend, and a robust database.
          </p>

          {/* Tech Stack Logos */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12 mt-4">
            {[
              { src: "/about_images/nextjs_logo.svg", label: "Next.js" },
              { src: "/about_images/fastapi_logo.svg", label: "FastAPI" },
              { src: "/about_images/postgresql_logo.svg", label: "PostgreSQL" },
            ].map((tech) => (
              <div key={tech.label} className="flex flex-col items-center">
                <Image src={tech.src} alt={tech.label} width={64} height={64} className="mb-2" />
                <span className="text-yellow-400 font-semibold">{tech.label}</span>
              </div>
            ))}
          </div>

          <p className="text-sm sm:text-base mt-4">
            All the data used in this project is directly from{" "}
            <Link
              href="https://runescape.wiki/w/Application_programming_interface"
              target="_blank"
              className="underline text-yellow-400 hover:text-yellow-300"
            >
              OSRS Wiki API
            </Link>
            . A request is made in one script to pull skill training data from each page and stored into the database.
            This information is then processed into OpenAI API with a list of constraints and returned in markdown format.
            The summarized data is stored and that's how the frontend accesses this data.
            Information display is speedy and cost is low.
          </p>
        </motion.section>

        {/* Credits */}
        <motion.section
          className="text-center leading-relaxed space-y-4"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Credits</h2>
          <ul className="list-none space-y-2 text-sm sm:text-base">
            <li>A huge thanks:</li>
            <li>
              Game Data from{" "}
              <Link
                href="https://oldschool.runescape.wiki/"
                target="_blank"
                className="underline text-yellow-400 hover:text-yellow-300"
              >
                Old School RuneScape Wiki
              </Link>
            </li>
            <li>
              Background video by{" "}
              <Link
                href="https://www.youtube.com/watch?v=D7EGZDfTWO0"
                target="_blank"
                className="underline text-yellow-400 hover:text-yellow-300"
              >
                Melankola
              </Link>{" "}
              on YouTube
            </li>
            <li>Developed by Caden Lofgren</li>
          </ul>
        </motion.section>

        {/* Links */}
        <motion.section
          className="text-center leading-relaxed space-y-6"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Links</h2>
          <p className="text-sm sm:text-base">
            You can follow the project on{" "}
            <Link
              href="https://github.com/CadenLofgren/osrssimplified"
              target="_blank"
              className="underline text-yellow-400 hover:text-yellow-300"
            >
              GitHub
            </Link>.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-10 mt-4 sm:mt-6">
            <Link href="https://github.com/CadenLofgren/osrssimplified" target="_blank" className="hover:scale-105 transition-transform">
              <Image src="/about_images/github-mark-white.png" alt="GitHub" width={64} height={64} className="rounded-full shadow-lg" />
            </Link>

            <Link href="https://oldschool.runescape.wiki/" target="_blank" className="hover:scale-105 transition-transform">
              <Image src="/about_images/Old_School_RuneScape_Wiki_logo_white.svg" alt="OSRS Wiki" width={64} height={64} className="rounded-full shadow-lg" />
            </Link>
          </div>
        </motion.section>

        {/* Disclaimer */}
        <motion.footer
          className="text-center text-xs sm:text-sm text-gray-400 mt-8 sm:mt-12 border-t border-gray-700 pt-4 sm:pt-6 px-2 sm:px-4"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          Created using intellectual property belonging to{" "}
          <span className="text-gray-300 font-medium">Jagex Limited</span> under the terms of{" "}
          <span className="text-gray-300 font-medium">Jagex's Fan Content Policy</span>. This content is
          not endorsed by or affiliated with Jagex.
        </motion.footer>
      </div>
    </main>
  );
}
