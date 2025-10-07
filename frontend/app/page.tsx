export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
      <h1 className="text-5xl font-bold mb-4 text-center">
        OSRSSimplified
      </h1>
      <p className="text-lg text-gray-300 max-w-xl text-center mb-8">
        Your go-to hub for simplified Old School RuneScape skill training guides.
        Updated monthly with the most efficient and accessible methods.
      </p>
      <div className="flex gap-4">
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
    </main>
  );
}
