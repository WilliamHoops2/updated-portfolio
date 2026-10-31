import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";

const CODE = `struct FocusView: View {
    @State private var isFocused = true

    var body: some View {
        VStack(spacing: 16) {
            Text("Hello, SwiftUI")
                .font(.largeTitle.bold())
            Toggle("Deep focus", isOn: $isFocused)
        }
        .padding()
    }
}`;

const TOKEN =
  /(@\w+|"[^"\n]*"?|\b(?:struct|var|let|some|private|import|func|return)\b|\b[A-Z]\w*\b|\.[a-z]\w*|\$\w+)/g;

function classify(piece: string): string | null {
  if (piece.startsWith("@")) return "attr";
  if (piece.startsWith('"')) return "str";
  if (piece.startsWith("$")) return "var";
  if (piece.startsWith(".")) return "fn";
  if (/^(struct|var|let|some|private|import|func|return)$/.test(piece)) return "kw";
  if (/^[A-Z]/.test(piece)) return "type";
  return null;
}

function Highlighted({ code }: { code: string }) {
  // split() with a capture group alternates plain text and matched tokens.
  const parts = code.split(TOKEN);
  return (
    <>
      {parts.map((piece, i) => {
        const kind = i % 2 === 1 ? classify(piece) : null;
        return kind ? (
          <span key={i} className={`tok tok--${kind}`}>
            {piece}
          </span>
        ) : (
          piece
        );
      })}
    </>
  );
}

export function CodeCard() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [typed, setTyped] = useState(0);
  const [replay, setReplay] = useState(0);
  const finished = useRef(false);
  const lastReplay = useRef(0);

  // Type the snippet out the first time it scrolls into view (and again on "Replay").
  useEffect(() => {
    if (!inView) return;

    const replaying = replay !== lastReplay.current;
    lastReplay.current = replay;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || (finished.current && !replaying)) {
      setTyped(CODE.length);
      return;
    }

    finished.current = false;
    let i = 0;
    setTyped(0);
    const id = window.setInterval(() => {
      i += 2;
      setTyped(Math.min(i, CODE.length));
      if (i >= CODE.length) {
        finished.current = true;
        window.clearInterval(id);
      }
    }, 26);
    return () => window.clearInterval(id);
  }, [inView, replay]);

  return (
    <div ref={ref} className="codecard">
      <ol className="path" aria-label="My path: TypeScript, React, then SwiftUI">
        <li>TypeScript</li>
        <li>React</li>
        <li className="is-now">
          SwiftUI <span className="mono">now</span>
        </li>
      </ol>

      <pre className="code" aria-label="A small SwiftUI example">
        <code>
          <Highlighted code={CODE.slice(0, typed)} />
          <span className="code__caret" aria-hidden="true" />
        </code>
      </pre>

      <div className="codecard__foot">
        <span className="badge mono">Apple Developer Academy · Bali</span>
        <button type="button" className="textbtn mono" onClick={() => setReplay((n) => n + 1)}>
          Replay ↺
        </button>
      </div>
    </div>
  );
}
