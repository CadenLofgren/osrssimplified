"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 py-4 px-6 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo / Site Title */}
        <Link href="/" className="text-2xl font-bold text-emerald-400">
          OSRS Simplified
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link
            href="/skills"
            className="text-gray-300 hover:text-white transition"
          >
            Skills
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:text-white transition"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-300 hover:text-white transition"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
