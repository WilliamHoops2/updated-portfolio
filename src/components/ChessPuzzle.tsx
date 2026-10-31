import { useState } from "react";

// Scholar's mate position: 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? and White plays 4.Qxf7#
const FEN = "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR";

type Square = string | null;
type Board = Square[][];
type Status = "idle" | "wrong" | "solved";

interface Cell {
  r: number;
  c: number;
}

// Both colours use the solid glyphs and are tinted with CSS. "\uFE0E" forces text (not emoji) rendering.
const GLYPH: Record<string, string> = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };
const NAME: Record<string, string> = {
  k: "king",
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
  p: "pawn",
};

const QUEEN: Cell = { r: 3, c: 7 }; // h5
const TARGET: Cell = { r: 1, c: 5 }; // f7
const BLACK_KING: Cell = { r: 0, c: 4 }; // e8

function parse(fen: string): Board {
  return fen.split("/").map((row) => {
    const out: Square[] = [];
    for (const ch of row) {
      if (/\d/.test(ch)) {
        for (let i = 0; i < Number(ch); i++) out.push(null);
      } else {
        out.push(ch);
      }
    }
    return out;
  });
}

const isWhite = (piece: string) => piece === piece.toUpperCase();
const same = (a: Cell | null, b: Cell) => a !== null && a.r === b.r && a.c === b.c;
const squareName = (r: number, c: number) => `${"abcdefgh"[c]}${8 - r}`;

const MESSAGES: Record<Status, string> = {
  idle: "White to move. Mate in one.",
  wrong: "Not quite. Try another move.",
  solved: "Qxf7#. Scholar's mate. Nicely done!",
};

export function ChessPuzzle() {
  const [board, setBoard] = useState<Board>(() => parse(FEN));
  const [selected, setSelected] = useState<Cell | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [hint, setHint] = useState(false);

  const reset = () => {
    setBoard(parse(FEN));
    setSelected(null);
    setStatus("idle");
    setHint(false);
  };

  const click = (r: number, c: number) => {
    if (status === "solved") return;
    const piece = board[r][c];

    if (!selected) {
      if (piece && isWhite(piece)) {
        setSelected({ r, c });
        setStatus("idle");
      }
      return;
    }

    if (selected.r === r && selected.c === c) {
      setSelected(null);
      return;
    }

    if (piece && isWhite(piece)) {
      setSelected({ r, c });
      return;
    }

    if (same(selected, QUEEN) && r === TARGET.r && c === TARGET.c) {
      const next = board.map((row) => [...row]);
      next[TARGET.r][TARGET.c] = next[QUEEN.r][QUEEN.c];
      next[QUEEN.r][QUEEN.c] = null;
      setBoard(next);
      setStatus("solved");
      setHint(false);
    } else {
      setStatus("wrong");
    }
    setSelected(null);
  };

  return (
    <div className="chess">
      <div className="chess__board" role="group" aria-label="Chess puzzle: White to move, mate in one">
        {board.map((row, r) =>
          row.map((piece, c) => {
            const dark = (r + c) % 2 === 1;
            const classes = [
              "sq",
              dark ? "sq--dark" : "sq--light",
              same(selected, { r, c }) ? "is-selected" : "",
              hint && (same(QUEEN, { r, c }) || same(TARGET, { r, c })) ? "is-hint" : "",
              status === "solved" && same(BLACK_KING, { r, c }) ? "is-check" : "",
              status === "solved" && same(TARGET, { r, c }) ? "is-moved" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const label = piece
              ? `${squareName(r, c)}, ${isWhite(piece) ? "white" : "black"} ${NAME[piece.toLowerCase()]}`
              : squareName(r, c);

            return (
              <button key={`${r}-${c}`} type="button" className={classes} aria-label={label} onClick={() => click(r, c)}>
                {piece && (
                  <span className={`piece ${isWhite(piece) ? "piece--w" : "piece--b"}`}>
                    {GLYPH[piece.toLowerCase()]}
                    {"\uFE0E"}
                  </span>
                )}
              </button>
            );
          }),
        )}
      </div>

      <p className={`chess__msg mono is-${status}`} aria-live="polite">
        {MESSAGES[status]}
      </p>

      <div className="chess__actions">
        <button type="button" className="textbtn mono" onClick={() => setHint((h) => !h)} disabled={status === "solved"}>
          {hint ? "Hide hint" : "Hint"}
        </button>
        <button type="button" className="textbtn mono" onClick={reset}>
          Reset ↺
        </button>
      </div>
    </div>
  );
}
