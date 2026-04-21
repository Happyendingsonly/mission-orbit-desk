import { useMemo } from "react";

interface Star {
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function Starfield({ count = 140 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    const rng = seeded(42);
    return Array.from({ length: count }, () => ({
      left: `${rng() * 100}%`,
      top: `${rng() * 100}%`,
      size: rng() < 0.92 ? 1 : 2,
      delay: `${(rng() * 6).toFixed(2)}s`,
      duration: `${(3 + rng() * 5).toFixed(2)}s`,
      opacity: 0.3 + rng() * 0.6,
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Nebula gradients */}
      <div className="absolute -top-32 -left-32 h-[40rem] w-[40rem] rounded-full bg-nebula-violet opacity-40 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-[42rem] w-[42rem] rounded-full bg-nebula-blue opacity-40 blur-3xl" />

      {/* Stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground animate-twinkle"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
