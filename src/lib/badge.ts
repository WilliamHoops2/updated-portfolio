import { useEffect, useState } from "react";
import { profile } from "../data/content";

const W = 630;
const H = 880;

function front(photo: HTMLImageElement): string {
  const c = Object.assign(document.createElement("canvas"), { width: W, height: H });
  const ctx = c.getContext("2d")!;
  // the whole portrait fills the card; everything else is drawn on top of it
  const k = Math.max(W / photo.naturalWidth, H / photo.naturalHeight);
  ctx.drawImage(photo, (W - photo.naturalWidth * k) / 2, (H - photo.naturalHeight * k) / 2, photo.naturalWidth * k, photo.naturalHeight * k);
  const top = ctx.createLinearGradient(0, 0, 0, 160);
  top.addColorStop(0, "rgba(13,20,16,0.75)");
  top.addColorStop(1, "rgba(13,20,16,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, W, 160);
  const bottom = ctx.createLinearGradient(0, H * 0.58, 0, H);
  bottom.addColorStop(0, "rgba(13,20,16,0)");
  bottom.addColorStop(1, "rgba(13,20,16,0.92)");
  ctx.fillStyle = bottom;
  ctx.fillRect(0, H * 0.58, W, H * 0.42);

  ctx.fillStyle = "#b9f27c";
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillText("● WILLIAM SILVANO ANGGA", 40, 66);
  ctx.fillStyle = "rgba(233,220,192,0.8)";
  ctx.textAlign = "right";
  ctx.fillText("ID 001 / DEV", W - 40, 66);
  ctx.textAlign = "left";

  ctx.fillStyle = "#e9dcc0";
  ctx.font = '800 92px "Bricolage Grotesque", sans-serif';
  ctx.fillText(profile.name, 40, 720);
  ctx.fillStyle = "#b9f27c";
  ctx.font = '500 24px "JetBrains Mono", monospace';
  ctx.fillText(profile.role.toUpperCase(), 40, 764);
  ctx.fillStyle = "rgba(233,220,192,0.8)";
  ctx.fillText(`${profile.location.toUpperCase()} · SWIFTUI · GAMES`, 40, 800);

  // barcode
  ctx.fillStyle = "rgba(233,220,192,0.7)";
  for (let x = 40, i = 0; x < W - 40; i++) {
    const bw = 2 + ((i * 7) % 5);
    ctx.fillRect(x, 826, bw, 28);
    x += bw + 3 + ((i * 3) % 4);
  }
  return c.toDataURL("image/jpeg", 0.92);
}

function back(photo: HTMLImageElement): string {
  const c = Object.assign(document.createElement("canvas"), { width: W, height: H });
  const ctx = c.getContext("2d")!;
  const k = Math.max(W / photo.naturalWidth, H / photo.naturalHeight);
  ctx.drawImage(photo, (W - photo.naturalWidth * k) / 2, (H - photo.naturalHeight * k) / 2, photo.naturalWidth * k, photo.naturalHeight * k);
  const top = ctx.createLinearGradient(0, 0, 0, 160);
  top.addColorStop(0, "rgba(13,20,16,0.6)");
  top.addColorStop(1, "rgba(13,20,16,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, W, 160);
  const bottom = ctx.createLinearGradient(0, H * 0.6, 0, H);
  bottom.addColorStop(0, "rgba(13,20,16,0)");
  bottom.addColorStop(1, "rgba(13,20,16,0.92)");
  ctx.fillStyle = bottom;
  ctx.fillRect(0, H * 0.6, W, H * 0.4);

  ctx.fillStyle = "#e9dcc0";
  ctx.font = '800 76px "Bricolage Grotesque", sans-serif';
  ctx.fillText("Say hi.", 40, 750);
  ctx.fillStyle = "#b9f27c";
  ctx.font = '500 26px "JetBrains Mono", monospace';
  ctx.fillText(profile.email, 40, 796);
  ctx.fillStyle = "rgba(233,220,192,0.7)";
  ctx.font = '500 20px "JetBrains Mono", monospace';
  ctx.fillText(profile.socials.map((s) => s.label.toUpperCase()).join("  ·  "), 40, 840);
  return c.toDataURL("image/jpeg", 0.92);
}

/** The ID-badge faces, drawn once on a canvas from the two portraits and the site's fonts. */
export function useBadge() {
  const [faces, setFaces] = useState<{ front: string; back: string } | null>(null);
  useEffect(() => {
    let live = true;
    const photo = new Image();
    photo.src = `${import.meta.env.BASE_URL}about/william.jpg`;
    const photo2 = new Image();
    photo2.src = `${import.meta.env.BASE_URL}about/william-2.jpg`;
    Promise.all([
      photo.decode(),
      photo2.decode(),
      document.fonts.load('800 64px "Bricolage Grotesque"'),
      document.fonts.load('500 20px "JetBrains Mono"'),
    ])
      .catch(() => undefined) // draw with fallback fonts rather than not at all
      .then(() => live && setFaces({ front: front(photo), back: back(photo2) }));
    return () => {
      live = false;
    };
  }, []);
  return faces;
}
