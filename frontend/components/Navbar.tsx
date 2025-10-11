"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#1a1816] border-b border-[#3b2f1c] py-4 px-6 shadow-[0_4px_8px_rgba(0,0,0,0.4)] font-osrs"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo / Site Title */}
        <Link
          href="/"
          className="text-2xl font-bold text-[#ffcb05] hover:text-[#fff2b0] transition duration-200 drop-shadow-[0_0_6px_rgba(255,203,5,0.4)]"
        >
          OSRS Simplified
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8 text-lg">
          {[
            { name: "Skills", path: "/skills" },
            { name: "About", path: "/about" },
          ].map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative transition duration-200 ${
                  isActive
                    ? "text-[#ffcb05]"
                    : "text-[#d6cfa1] hover:text-[#ffcb05]"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#ffcb05] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
