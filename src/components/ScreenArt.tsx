import { useId, useState } from "react";
import type { ReactNode } from "react";
import type { ArtVariant, GalleryItem } from "../data/content";

const DARK = "#0b1117";
const LIGHT = "#f6f6f4";
const INK = "#0a0e11";
const FONT = "Inter, system-ui, sans-serif";

interface ArtProps {
  variant: ArtVariant;
  c1: string;
  c2: string;
  title: string;
}

/** Illustrated placeholder app screen, drawn in SVG from a project's two colours. */
export function ScreenArt({ variant, c1, c2, title }: ArtProps) {
  const raw = useId();
  const gid = `g${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const fill = `url(#${gid})`;
  const dark = variant === "splash" || variant === "timer" || variant === "scan" || variant === "waves";
  const chrome = dark ? "#ffffff" : INK;

  let body: ReactNode;

  switch (variant) {
    case "splash": {
      const size = Math.min(34, 170 / (Math.max(title.length, 1) * 0.58));
      body = (
        <>
          <rect width="200" height="410" fill={fill} />
          <rect width="200" height="410" fill="#000" opacity="0.14" />
          <circle cx="150" cy="100" r="72" fill="#fff" opacity="0.14" />
          <circle cx="30" cy="300" r="96" fill="#fff" opacity="0.1" />
          <text x="20" y="262" fill="#fff" fontFamily={FONT} fontSize={size} fontWeight="800" letterSpacing="-1">
            {title}
          </text>
          <rect x="20" y="280" width="96" height="6" rx="3" fill="#fff" opacity="0.65" />
          <rect x="20" y="294" width="64" height="6" rx="3" fill="#fff" opacity="0.35" />
          <rect x="20" y="344" width="160" height="34" rx="17" fill="#fff" />
          <rect x="72" y="358" width="56" height="6" rx="3" fill={c1} />
        </>
      );
      break;
    }
    case "cards": {
      body = (
        <>
          <rect width="200" height="410" fill={LIGHT} />
          <rect x="16" y="48" width="96" height="10" rx="5" fill={INK} opacity="0.85" />
          <rect x="16" y="66" width="62" height="6" rx="3" fill={INK} opacity="0.3" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(16 ${96 + i * 86})`}>
              <rect width="168" height="74" rx="16" fill="#fff" stroke={INK} strokeOpacity="0.08" />
              <circle cx="38" cy="37" r="22" fill={fill} opacity={1 - i * 0.18} />
              <rect x="70" y="24" width="72" height="8" rx="4" fill={INK} opacity="0.8" />
              <rect x="70" y="42" width="48" height="6" rx="3" fill={INK} opacity="0.25" />
            </g>
          ))}
          <rect x="0" y="366" width="200" height="44" fill="#fff" />
          {[50, 100, 150].map((x, i) => (
            <circle key={x} cx={x} cy="384" r="5" fill={i === 0 ? c1 : INK} opacity={i === 0 ? 1 : 0.2} />
          ))}
        </>
      );
      break;
    }
    case "timer": {
      body = (
        <>
          <rect width="200" height="410" fill={DARK} />
          <circle cx="100" cy="180" r="70" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="12" />
          <circle
            cx="100"
            cy="180"
            r="70"
            fill="none"
            stroke={fill}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="300 440"
            transform="rotate(-90 100 180)"
          />
          <text x="100" y="191" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="32" fontWeight="700">
            25:00
          </text>
          <rect x="40" y="300" width="120" height="40" rx="20" fill={fill} />
          <rect x="84" y="317" width="32" height="6" rx="3" fill="#fff" />
          <rect x="60" y="356" width="80" height="6" rx="3" fill="#fff" opacity="0.18" />
        </>
      );
      break;
    }
    case "scan": {
      body = (
        <>
          <rect width="200" height="410" fill={DARK} />
          {Array.from({ length: 36 }, (_, n) => {
            const r = Math.floor(n / 6);
            const c = n % 6;
            const odd = (r + c) % 2 === 1;
            return (
              <rect
                key={n}
                x={22 + c * 26}
                y={92 + r * 26}
                width="26"
                height="26"
                fill={odd ? c1 : "#fff"}
                opacity={odd ? 0.6 : 0.09}
              />
            );
          })}
          {[
            [2, 1],
            [4, 3],
            [1, 4],
          ].map(([c, r]) => (
            <circle key={`${c}${r}`} cx={22 + c * 26 + 13} cy={92 + r * 26 + 13} r="8" fill="#fff" opacity="0.9" />
          ))}
          <path
            d="M14 108V92H30 M170 92H186V108 M186 240V256H170 M30 256H14V240"
            transform="translate(0 -8)"
            fill="none"
            stroke={c2}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="40" y="290" width="120" height="36" rx="18" fill="#fff" opacity="0.1" />
          <text x="100" y="313" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="14" fontWeight="600">
            e2 → e4
          </text>
          <rect x="20" y="346" width="160" height="34" rx="17" fill={fill} />
        </>
      );
      break;
    }
    case "chart": {
      const heights = [40, 70, 55, 100, 80, 130, 110];
      body = (
        <>
          <rect width="200" height="410" fill={LIGHT} />
          <rect x="16" y="48" width="70" height="8" rx="4" fill={INK} opacity="0.3" />
          <text x="16" y="108" fill={INK} fontFamily={FONT} fontSize="38" fontWeight="800" letterSpacing="-1.5">
            +0.8
          </text>
          {heights.map((h, i) => (
            <rect key={i} x={20 + i * 24} y={340 - h} width="16" height={h} rx="6" fill={fill} opacity={0.45 + i * 0.09} />
          ))}
          <rect x="16" y="344" width="168" height="2" rx="1" fill={INK} opacity="0.12" />
        </>
      );
      break;
    }
    case "waves": {
      body = (
        <>
          <rect width="200" height="410" fill={DARK} />
          <circle cx="100" cy="124" r="50" fill={fill} />
          <circle cx="100" cy="124" r="70" fill="none" stroke={c2} strokeOpacity="0.35" />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M0 ${250 + i * 26} Q 25 ${220 + i * 26} 50 ${250 + i * 26} T 100 ${250 + i * 26} T 150 ${250 + i * 26} T 200 ${250 + i * 26}`}
              fill="none"
              stroke={i === 0 ? c2 : "#fff"}
              strokeOpacity={i === 0 ? 1 : 0.25 - i * 0.07}
              strokeWidth="3"
            />
          ))}
          <rect x="40" y="350" width="120" height="8" rx="4" fill="#fff" opacity="0.15" />
        </>
      );
      break;
    }
    case "list": {
      body = (
        <>
          <rect width="200" height="410" fill={LIGHT} />
          <rect x="16" y="48" width="90" height="10" rx="5" fill={INK} opacity="0.85" />
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i} transform={`translate(0 ${88 + i * 44})`}>
              <circle cx="30" cy="14" r="11" fill={fill} opacity={i % 2 ? 0.55 : 1} />
              <rect x="52" y="6" width={100 - (i % 3) * 18} height="8" rx="4" fill={INK} opacity="0.75" />
              <rect x="52" y="20" width="60" height="5" rx="2.5" fill={INK} opacity="0.2" />
              <rect x="160" y="9" width="24" height="8" rx="4" fill={c1} opacity="0.6" />
            </g>
          ))}
        </>
      );
      break;
    }
  }

  return (
    <svg
      className="art"
      viewBox="0 0 200 410"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${title} screen`}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      {body}
      <text x="18" y="24" fill={chrome} fontFamily={FONT} fontSize="9" fontWeight="600" opacity="0.8">
        9:41
      </text>
      <rect x="70" y="400" width="60" height="4" rx="2" fill={chrome} opacity="0.35" />
    </svg>
  );
}

interface ScreenProps {
  item: GalleryItem;
  colors: [string, string];
  title: string;
}

/** Shows a real screenshot if one is given (and loads), otherwise the illustrated placeholder. */
export function Screen({ item, colors, title }: ScreenProps) {
  const [failed, setFailed] = useState(false);

  if (item.src && !failed) {
    return (
      <img
        className="phone__img"
        src={item.src}
        alt={item.caption}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }
  return <ScreenArt variant={item.variant} c1={colors[0]} c2={colors[1]} title={title} />;
}

interface PhoneProps {
  children: ReactNode;
  className?: string;
}

export function PhoneMock({ children, className = "" }: PhoneProps) {
  return (
    <div className={`phone ${className}`.trim()}>
      <div className="phone__screen">{children}</div>
      <span className="phone__notch" />
    </div>
  );
}
