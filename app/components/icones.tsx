import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size: number | undefined, d: number) => ({
  width: size ?? d,
  height: size ?? d,
  fill: "none",
  "aria-hidden": true,
});

export const IconeLaudo = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <path d="M8 2l4.67 2v3.33C12.67 10.33 10.67 12.67 8 14 5.33 12.67 3.33 10.33 3.33 7.33V4L8 2Z" stroke="currentColor" strokeWidth="1.47" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.67 8 7.33 9.67l3-3.34" stroke="currentColor" strokeWidth="1.47" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeDono = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <circle cx="8" cy="5.33" r="2.67" stroke="currentColor" strokeWidth="1.47" />
    <path d="M3 13.33C4 11 5.87 10 8 10s4 1 5 3.33" stroke="currentColor" strokeWidth="1.47" strokeLinecap="round" />
  </svg>
);
export const IconeGarantia = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.47" />
    <path d="M5.67 9.33 4.67 14 8 12.33 11.33 14l-1-4.67" stroke="currentColor" strokeWidth="1.47" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeRevisao = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <path d="M9.67 4.33a2.67 2.67 0 0 0 3.33 3.34l-5 5a1.41 1.41 0 0 1-2-2l5-5a2.67 2.67 0 0 0-1.33-1.34Z" stroke="currentColor" strokeWidth="1.47" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeKm = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <path d="M2.67 11.33a5.33 5.33 0 0 1 10.66 0" stroke="currentColor" strokeWidth="1.47" strokeLinecap="round" />
    <path d="M8 11.33 10.67 8" stroke="currentColor" strokeWidth="1.47" strokeLinecap="round" />
  </svg>
);
export const IconeBusca = ({ size, ...p }: P) => (
  <svg viewBox="0 0 22 22" {...base(size, 22)} {...p}>
    <circle cx="10.08" cy="10.08" r="5.96" stroke="currentColor" strokeWidth="1.65" />
    <path d="m14.67 14.67 3.66 3.66" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
  </svg>
);
export const IconeCoracao = ({ size, cheio, ...p }: P & { cheio?: boolean }) => (
  <svg viewBox="0 0 22 22" {...base(size, 22)} {...p}>
    <path
      d="M11 18.33s-6.42-3.98-6.42-9.16A3.84 3.84 0 0 1 11 6.74a3.84 3.84 0 0 1 6.42 2.43c0 5.18-6.42 9.16-6.42 9.16Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinejoin="round"
      fill={cheio ? "currentColor" : "none"}
    />
  </svg>
);
export const IconeWhatsApp = ({ size, ...p }: P) => (
  <svg viewBox="0 0 20 20" {...base(size, 20)} {...p}>
    <path d="M10 2.5a7.5 7.5 0 0 0-6.5 11.25l-1 3.75 3.83-1A7.5 7.5 0 1 0 10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M7.5 7.08c0 2.92 2.08 5.42 5.42 5.42l.66-1.33-1.66-.84-.84.84c-.83-.42-1.83-1.42-2.25-2.25l.84-.84-.84-1.66-1.33.66Z" fill="currentColor" />
  </svg>
);
export const IconeChevron = ({ size, ...p }: P) => (
  <svg viewBox="0 0 20 20" {...base(size, 20)} {...p}>
    <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeSeta = ({ size, ...p }: P) => (
  <svg viewBox="0 0 20 20" {...base(size, 20)} {...p}>
    <path d="M12.5 5 7.5 10l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeCheck = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeX = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const IconeFiltros = ({ size, ...p }: P) => (
  <svg viewBox="0 0 18 18" {...base(size, 18)} {...p}>
    <path d="M1 4.5h16M1 9.5h16M1 14.5h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="11" cy="4.5" r="2.2" fill="var(--color-branco)" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="5" cy="9.5" r="2.2" fill="var(--color-branco)" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="9" cy="14.5" r="2.2" fill="var(--color-branco)" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
export const IconeInfo = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <circle cx="8" cy="8" r="6.3" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 7.3v3.7M8 5v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
export const IconePin = ({ size, ...p }: P) => (
  <svg viewBox="0 0 20 20" {...base(size, 20)} {...p}>
    <path d="M10 17.5s5.5-4.6 5.5-9a5.5 5.5 0 0 0-11 0c0 4.4 5.5 9 5.5 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="10" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
export const IconeCompartilhar = ({ size, ...p }: P) => (
  <svg viewBox="0 0 20 20" {...base(size, 20)} {...p}>
    <path d="M10 12.5V3m0 0L6.5 6.5M10 3l3.5 3.5M4 11v4.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeSetaCima = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <path d="M8 13V3m0 0L4 7m4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeSetaBaixo = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <path d="M8 3v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeTendencia = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <path d="M2 11.5 6 7.5l2.5 2.5L14 4.5m0 0h-3.5m3.5 0V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeCarro = ({ size, ...p }: P) => (
  <svg viewBox="0 0 20 20" {...base(size, 20)} {...p}>
    <path d="M3 12.5V10l1.6-4a1.5 1.5 0 0 1 1.4-1h8a1.5 1.5 0 0 1 1.4 1L17 10v2.5M3 12.5h14M3 12.5V15h2.5v-2.5m9 0V15H17v-2.5M6 9.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeRelogio = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const IconeDocumento = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 7h6M5 9.5h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const IconeTroca = ({ size, ...p }: P) => (
  <svg viewBox="0 0 16 16" {...base(size, 16)} {...p}>
    <path d="M3 5.5h9.5m0 0L10 3m2.5 2.5L10 8M13 10.5H3.5m0 0L6 8m-2.5 2.5L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconeInstagram = ({ size, ...p }: P) => (
  <svg viewBox="0 0 20 20" {...base(size, 20)} {...p}>
    <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="14.2" cy="5.8" r="0.9" fill="currentColor" />
  </svg>
);
export const IconeYouTube = ({ size, ...p }: P) => (
  <svg viewBox="0 0 20 20" {...base(size, 20)} {...p}>
    <rect x="2.5" y="4.5" width="15" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8.5 7.8v4.4L12.3 10 8.5 7.8Z" fill="currentColor" />
  </svg>
);
