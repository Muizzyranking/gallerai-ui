import Link from "next/link";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { box: number; svg: number; font: string }> = {
  sm: { box: 30, svg: 18, font: "1.15rem" },
  md: { box: 34, svg: 20, font: "1.3rem" },
  lg: { box: 40, svg: 24, font: "1.5rem" },
};

interface BrandProps {
  size?: Size;
  link?: boolean;
  dark?: boolean;
}

export default function Brand({
  size = "md",
  link = true,
  dark = false,
}: BrandProps) {
  const cfg = SIZES[size];

  const content = (
    <>
      <span
        aria-hidden="true"
        style={{
          width: cfg.box,
          height: cfg.box,
          borderRadius: 9,
          background: "var(--accent)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <svg
          aria-hidden="true"
          width={cfg.svg}
          height={cfg.svg}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m14.31 8 5.74 9.94" />
          <path d="M9.69 8h11.48" />
          <path d="m7.38 12 5.74-9.94" />
          <path d="M9.69 16 3.95 6.06" />
          <path d="M14.31 16H2.83" />
          <path d="m16.62 12-5.74 9.94" />
        </svg>
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: cfg.font,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: dark ? "#fff" : "var(--ink)",
        }}
      >
        Galler<span style={{ color: "var(--accent)" }}>AI</span>
      </span>
    </>
  );

  const style = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  } as const;

  if (link) {
    return (
      <Link href="/" aria-label="GallerAI home" style={style}>
        {content}
      </Link>
    );
  }

  return <span style={style}>{content}</span>;
}
