"use client";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
      {/* 🔹 Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-60 blur-sm scale-105 transition-all duration-1000"
      >
        <source src="/subtle-bg.mp4" type="video/mp4" />
        {/* Optional GIF fallback */}
        <img
          src="/subtle-bg.gif"
          alt="Subtle background"
          className="w-full h-full object-cover opacity-60 blur-sm"
        />
      </video>

      {/* 🔹 Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-900/80" />

      {/* 🔹 Foreground content */}
      <div className="relative z-10 text-center p-8">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">OSRSSimplified</h1>
        <p className="text-lg text-gray-200 max-w-xl mx-auto mb-8 drop-shadow-md">
          Your go-to hub for simplified Old School RuneScape skill training guides.
          Updated monthly with the most efficient and accessible methods.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/skills"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
          >
            View Skills
          </a>
          <a
            href="https://oldschool.runescape.wiki/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
          >
            OSRS Wiki
          </a>
        </div>
      </div>

      {/* 🔹 Credit footer */}
      <footer className="absolute bottom-2 left-0 right-0 text-center text-sm text-gray-400 z-10">
        Background video by{" "}
        <a
          href="https://www.youtube.com/watch?v=D7EGZDfTWO0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 underline transition"
        >
          Melankola
        </a>{" "}
        on YouTube
      </footer>
    </main>
  );
}
