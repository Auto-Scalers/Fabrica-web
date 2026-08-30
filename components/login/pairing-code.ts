const ALPHANUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'

// Build an inline-SVG "QR-like" tile pattern from the invite code. This is
// NOT a real QR — the relay expects the textual invite code anyway, so the
// SVG is a brand-appropriate decoration that mirrors what the desktop app
// draws in `Fabrica-app/src/main/runtime/mobile-pairing-qr.ts`. The browser
// always shows the copyable code text alongside it.
export function renderPairingSvg(code: string, size = 192): string {
  const normalized = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 32)
  const grid = 25
  const cell = Math.floor(size / grid)
  const bitPattern: number[] = []
  for (let i = 0; i < normalized.length; i += 1) {
    const code = normalized.charCodeAt(i) ^ ((i * 31) & 0xff)
    for (let b = 0; b < 8; b += 1) {
      bitPattern.push((code >> b) & 1)
    }
  }

  const modules: string[] = []
  for (let y = 0; y < grid; y += 1) {
    for (let x = 0; x < grid; x += 1) {
      const idx = y * grid + x
      const bit = bitPattern[idx % bitPattern.length] ?? 0
      const finder =
        (x < 7 && y < 7) ||
        (x >= grid - 7 && y < 7) ||
        (x < 7 && y >= grid - 7)
      if (finder) continue
      if (bit === 1) {
        modules.push(
          `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" />`,
        )
      }
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges" role="img" aria-label="Fabrica pairing code ${normalized}">`,
    `<rect width="${size}" height="${size}" fill="#0B0C10" />`,
    `<g fill="#FF8A3D">`,
    finderSquare(0, 0, cell),
    finderSquare(grid - 7, 0, cell),
    finderSquare(0, grid - 7, cell),
    modules.join(''),
    `</g>`,
    `</svg>`,
  ].join('')
}

function finderSquare(x: number, y: number, cell: number): string {
  const w = cell * 7
  return [
    `<rect x="${x * cell}" y="${y * cell}" width="${w}" height="${w}" />`,
    `<rect x="${(x + 1) * cell}" y="${(y + 1) * cell}" width="${cell * 5}" height="${cell * 5}" fill="#0B0C10" />`,
    `<rect x="${(x + 2) * cell}" y="${(y + 2) * cell}" width="${cell * 3}" height="${cell * 3}" />`,
  ].join('')
}

export function makeInviteCode(): string {
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256)
  }
  let out = ''
  for (let i = 0; i < bytes.length; i += 1) {
    out += ALPHANUM[bytes[i] % ALPHANUM.length]
  }
  return out
}