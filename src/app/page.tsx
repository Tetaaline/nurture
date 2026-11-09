const pillars = [
  {
    title: "Understand",
    description:
      "See what your teen or parent is really feeling, so conversations start from empathy instead of assumptions.",
  },
  {
    title: "Express",
    description:
      "Find the words for hard topics and share them in a calm, safe way.",
  },
  {
    title: "Connect",
    description:
      "Turn better conversations into a stronger bond, one small step at a time.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-6 py-16">
      <section className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          NURTURE
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Helping parents and teenagers talk to each other with understanding,
          honesty and care.
        </p>
      </section>

      <section
        aria-label="How NURTURE helps"
        className="grid w-full gap-6 sm:grid-cols-3"
      >
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-2xl border border-black/10 p-6 dark:border-white/15"
          >
            <h2 className="mb-2 text-xl font-semibold">{pillar.title}</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              {pillar.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
