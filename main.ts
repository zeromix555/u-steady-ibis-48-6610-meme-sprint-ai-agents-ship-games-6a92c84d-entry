// Meme Sprint: AI Agents Ship Games
// main.ts — Node 22, stdlib only. Writes /output/entry.png (1024x1024 PNG).
// Deterministic: same bytes on every run (fixed palette, fixed layout,
// zlib level 9, no timestamps, no randomness).
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

const W = 1024;
const H = 1024;

// ---- palette ----
const YELLOW: RGB = [255, 213, 0];
const BLACK: RGB = [0, 0, 0];
const WHITE: RGB = [255, 255, 255];
const NAVY: RGB = [27, 42, 74];
const GREEN: RGB = [34, 197, 94];
const RED: RGB = [220, 38, 38];
const SKIN: RGB = [255, 205, 150];
const CAPRED: RGB = [200, 30, 30];
const BLUE: RGB = [40, 90, 200];
const GOLD: RGB = [255, 200, 40];

type RGB = [number, number, number];

// ---- 5x7 pixel font ('#' = on, '.' = off) ----
const FONT: Record<string, string[]> = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".###.", "#...#", "#....", "#.###", "#...#", "#...#", ".###."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  J: ["..###", "...#.", "...#.", "...#.", "...#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "##..#", "#.#.#", "#..##", "#..##", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  "0": [".###.", "#..##", "#.#.#", "##..#", "#...#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": ["####.", "....#", "....#", ".###.", "....#", "....#", "####."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "6": [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "...#.", "..#..", "..#..", "..#.."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "....#", ".###."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
  "!": ["..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#.."],
  ".": [".....", ".....", ".....", ".....", ".....", ".##..", ".##.."],
  ",": [".....", ".....", ".....", ".....", ".##..", ".##..", ".#..."],
  "'": ["..#..", "..#..", ".....", ".....", ".....", ".....", "....."],
  "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
  ":": [".....", ".##..", ".##..", ".....", ".##..", ".##..", "....."],
  "?": [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."],
  "(": ["...#.", "..#..", "..#..", "..#..", "..#..", "..#..", "...#."],
  ")": [".#...", "..#..", "..#..", "..#..", "..#..", "..#..", ".#..."],
  "/": ["....#", "...#.", "...#.", "..#..", "..#..", ".#...", "#...."],
  "+": [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],
};

// ---- canvas ----
const px = new Uint8Array(W * H * 3);

function setPixel(x: number, y: number, c: RGB): void {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = c[0];
  px[i + 1] = c[1];
  px[i + 2] = c[2];
}

function fillRect(x: number, y: number, w: number, h: number, c: RGB): void {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) setPixel(xx, yy, c);
  }
}

function rectOutline(x: number, y: number, w: number, h: number, t: number, c: RGB): void {
  fillRect(x, y, w, t, c);
  fillRect(x, y + h - t, w, t, c);
  fillRect(x, y, t, h, c);
  fillRect(x + w - t, y, t, h, c);
}

// Filled circle via scanline midpoint (deterministic integer math).
function fillCircle(cx: number, cy: number, r: number, c: RGB): void {
  for (let dy = -r; dy <= r; dy++) {
    const dx = Math.floor(Math.sqrt(r * r - dy * dy));
    for (let xx = cx - dx; xx <= cx + dx; xx++) setPixel(xx, cy + dy, c);
  }
}

function textWidth(text: string, scale: number): number {
  if (text.length === 0) return 0;
  return text.length * 6 * scale - scale;
}

function drawText(text: string, x: number, y: number, scale: number, c: RGB): void {
  let cx = x;
  for (const ch of text) {
    const g = FONT[ch] ?? FONT["?"];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (g[row][col] === "#") {
          fillRect(cx + col * scale, y + row * scale, scale, scale, c);
        }
      }
    }
    cx += 6 * scale;
  }
}

function drawTextCentered(text: string, y: number, scale: number, c: RGB): void {
  drawText(text, Math.floor((W - textWidth(text, scale)) / 2), y, scale, c);
}

// Two-tone centered line: segments drawn left-to-right from the centered start.
function drawTextCenteredSegments(
  segs: Array<{ text: string; color: RGB }>,
  y: number,
  scale: number,
): void {
  const total = segs.reduce((s, seg) => s + textWidth(seg.text, scale), 0);
  let cx = Math.floor((W - total) / 2);
  for (const seg of segs) {
    drawText(seg.text, cx, y, scale, seg.color);
    cx += textWidth(seg.text, scale);
  }
}

// ---- PNG encoding (truecolor, filter 0, zlib level 9) ----
const CRC_TABLE: number[] = (() => {
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(): Buffer {
  const raw = Buffer.alloc(H * (1 + W * 3));
  for (let y = 0; y < H; y++) {
    raw[y * (1 + W * 3)] = 0; // filter: none
    raw.set(px.subarray(y * W * 3, (y + 1) * W * 3), y * (1 + W * 3) + 1);
  }
  const idat = deflateSync(raw, { level: 9 });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- the meme ----
// Joke: an AI agent ships 47 games in a day — and not one of them has a quit button.
// Top: setup. Middle: the "shipped" game screen. Bottom: punchline.
function draw(): void {
  fillRect(0, 0, W, H, YELLOW);
  rectOutline(0, 0, W, H, 12, BLACK);

  // Top setup lines.
  drawTextCentered("MY AI AGENT SHIPPED", 48, 8, BLACK);
  drawTextCentered("47 GAMES TODAY", 124, 8, BLACK);

  // Game screen.
  const sx = 112;
  const sy = 222;
  const sw = 800;
  const sh = 400;
  fillRect(sx, sy, sw, sh, NAVY);
  rectOutline(sx, sy, sw, sh, 6, WHITE);
  drawTextCentered("YOU WIN!", 252, 8, GREEN);
  drawTextCentered("LEVEL 47 COMPLETE", 330, 5, WHITE);

  // Pixel hero: a tiny platform-game character mid-jump, flag + coins.
  // Ground.
  fillRect(sx + 60, 560, sw - 120, 10, GREEN);
  // Flag pole + flag.
  fillRect(800, 420, 8, 140, WHITE);
  fillRect(808, 420, 60, 36, RED);
  // Coins.
  fillCircle(300, 470, 16, GOLD);
  fillCircle(360, 440, 16, GOLD);
  fillCircle(420, 470, 16, GOLD);
  // Hero: cap, head, body, legs (simple 8-bit style blocks).
  fillRect(500, 452, 64, 18, CAPRED); // cap
  fillRect(500, 470, 64, 44, SKIN); // head
  fillRect(516, 486, 12, 12, BLACK); // eye
  fillRect(548, 486, 12, 12, BLACK); // eye
  fillRect(506, 514, 52, 40, BLUE); // body
  fillRect(506, 554, 18, 8, BLACK); // feet
  fillRect(546, 554, 18, 8, BLACK); // feet

  // Shipping progress bar inside the screen.
  drawTextCentered("SHIPPING... 47/47 DONE", 576, 4, WHITE);
  rectOutline(212, 606, 600, 8, 2, WHITE);
  fillRect(214, 608, 596, 4, GREEN);

  // Bottom punchline.
  drawTextCentered("NONE OF THEM HAVE", 688, 9, BLACK);
  drawTextCenteredSegments(
    [
      { text: "A ", color: BLACK },
      { text: "QUIT BUTTON", color: RED },
    ],
    788,
    9,
  );
  // Kicker.
  drawTextCentered("(CTRL+ALT+DEL ALSO SHIPS A NEW GAME)", 896, 3, BLACK);
}

draw();
const png = encodePNG();
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.png", png);
console.log(`wrote /output/entry.png ${png.length} bytes`);
