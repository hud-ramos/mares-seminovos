import Image from "next/image";

export function Logo({ altura = 40, className = "" }: { altura?: number; className?: string }) {
  return (
    <Image
      src="/marca/logo.svg"
      alt="Marés Seminovos"
      width={Math.round((126 / 40) * altura)}
      height={altura}
      className={className}
      preload
    />
  );
}

/** Grafismo de ondas tirado do S do logo, sempre translúcido. */
export function Ondas({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/marca/ondas.svg" alt="" aria-hidden className={`pointer-events-none select-none ${className}`} />
  );
}
