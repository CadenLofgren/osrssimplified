"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.6 },
    }),
  };

  return (
    <main className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center px-6 py-16 space-y-16">
      {/* Title */}
      <motion.h1
        className="text-5xl font-bold text-center text-yellow-400"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        About OSRS Simplified
      </motion.h1>

      {/* What is OSRS Simplified */}
      <motion.section
        className="max-w-3xl text-center leading-relaxed space-y-4"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <h2 className="text-2xl font-semibold text-white">What is OSRS Simplified?</h2>
        <p>
            OSRS Simplified is a project with the sole purpose of being concise but still effective.
            Sometimes reading the OSRSWiki takes longer than you would like. This website is for people
            like me who want no fluff.
        </p>
        
      </motion.section>



      {/* How it was made */}
        <motion.section
        className="max-w-3xl text-center leading-relaxed space-y-8"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={2}
        >
        <h2 className="text-2xl font-semibold text-white">How It Was Made</h2>

        <p>
            OSRS Simplified is powered by a modern web stack, combining a responsive frontend,
            a high-performance backend, and a robust database.
        </p>

        {/* Tech Stack Logos + Labels */}
        <div className="flex justify-center items-center space-x-12 mt-4">
            {/* Next.js */}
            <div className="flex flex-col items-center">
            <Image
                src="/about_images/nextjs_logo.svg" // add your logo here
                alt="Next.js"
                width={64}
                height={64}
                className="mb-2"
            />
            <span className="text-yellow-400 font-semibold">Next.js</span>
            </div>

            {/* FastAPI */}
            <div className="flex flex-col items-center">
            <Image
                src="/about_images/fastapi_logo.svg" // add your logo here
                alt="FastAPI"
                width={64}
                height={64}
                className="mb-2"
            />
            <span className="text-yellow-400 font-semibold">FastAPI</span>
            </div>

            {/* PostgreSQL */}
            <div className="flex flex-col items-center">
            <Image
                src="/about_images/postgresql_logo.svg" // add your logo here
                alt="PostgreSQL"
                width={64}
                height={64}
                className="mb-2"
            />
            <span className="text-yellow-400 font-semibold">PostgreSQL</span>
            </div>
        </div>

        <p>
            All the data used in this project is directly from {" "}
            <Link
                href="https://runescape.wiki/w/Application_programming_interface"
                target="_blank"
                className="underline text-yellow-400 hover:text-yellow-300"
            >
            OSRS Wiki API.
            </Link>{" "}
            A request is made in one script to pull skill training data from each page and stored into the database.
            This information is then processed into OpenAI API with a list of contraints and returned in markdown format.
            The summarized data is stored and that's how the frontend accesses this data.
            Information display is speedy and cost is low.
        </p>
        </motion.section>


      {/* Credits */}
      <motion.section
        className="max-w-3xl text-center leading-relaxed space-y-4"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <h2 className="text-2xl font-semibold text-white">Credits</h2>
        <ul className="list-none space-y-2">
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

      {/* Contact / Links */}
      <motion.section
        className="max-w-3xl text-center leading-relaxed space-y-6"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <h2 className="text-2xl font-semibold text-white">Links</h2>
        <p>
          You can follow the project on{" "}
          <Link
            href="https://github.com/"
            target="_blank"
            className="underline text-yellow-400 hover:text-yellow-300"
          >
            GitHub
          </Link>
          .
        </p>

        {/* Clickable Images */}
        <div className="flex justify-center space-x-10 mt-6">
          {/* GitHub Icon */}
          <Link
            href="https://github.com/CadenLofgren/osrssimplified"
            target="_blank"
            className="hover:scale-110 transition-transform"
          >
            <Image
              src="/about_images/github-mark-white.png" 
              alt="GitHub"
              width={64}
              height={64}
              className="rounded-full shadow-lg"
            />
          </Link>

          {/* OSRS Wiki Icon */}
          <Link
            href="https://oldschool.runescape.wiki/"
            target="_blank"
            className="hover:scale-110 transition-transform"
          >
            <Image
              src="/about_images/Old_School_RuneScape_Wiki_logo_white.svg" 
              alt="OSRS Wiki"
              width={64}
              height={64}
              className="rounded-full shadow-lg"
            />
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
