// Âm thanh tạo bằng Web Audio API — không cần file nhạc, không cần backend.
// Tự khởi tạo khi người dùng tương tác lần đầu (yêu cầu của trình duyệt mobile).

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  // Trình duyệt có thể "suspend" audio cho tới khi có tương tác
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// Bật lại audio context (gọi khi người dùng bấm nút lần đầu)
export function unlockAudio() {
  getCtx();
}

export function toggleMute(): boolean {
  muted = !muted;
  return muted;
}

export function isMuted() {
  return muted;
}

// Phát 1 nốt đơn giản
function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  startGain = 0.18,
  delay = 0
) {
  const audio = getCtx();
  if (!audio || muted) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const t = audio.currentTime + delay;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(startGain, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(t);
  osc.stop(t + duration);
}

// Tiếng "bắt được item" — vui tai, ngắn gọn
export function playCatch() {
  tone(660, 0.12, "triangle", 0.2);
  tone(880, 0.12, "triangle", 0.15, 0.06);
}

// Tiếng thắng game — giai điệu đi lên
export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => tone(f, 0.18, "triangle", 0.2, i * 0.12));
}

// Tiếng thua / hết giờ — đi xuống buồn buồn
export function playLose() {
  tone(392, 0.2, "sawtooth", 0.15);
  tone(294, 0.3, "sawtooth", 0.15, 0.18);
}

// Tiếng "glitch / lỗi" cho màn hình giả lập đơ
export function playGlitch() {
  tone(120, 0.15, "square", 0.12);
  tone(90, 0.2, "square", 0.1, 0.12);
}

// Giai điệu Happy Birthday ngắn cho màn reveal
export function playFanfare() {
  // Tempo nhanh, vui
  const melody: [number, number][] = [
    [523, 0.18],
    [523, 0.18],
    [587, 0.3],
    [523, 0.3],
    [698, 0.3],
    [659, 0.5],
  ];
  let t = 0;
  melody.forEach(([f, d]) => {
    tone(f, d, "triangle", 0.2, t);
    t += d * 0.85;
  });
}
