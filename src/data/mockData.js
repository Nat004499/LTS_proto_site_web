// Génération de données mock pour les fissuromètres.
// Chaque appareil a une série temporelle (μm vs date) avec dérive,
// saisonnalité et bruit, pour ressembler à des relevés réels.

function genSeries({ days = 180, baseline = 0, drift = 0, amplitude = 5, noise = 0.4, seed = 1 }) {
  // PRNG simple et déterministe (mulberry32)
  let s = seed
  const rand = () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const out = []
  const end = new Date('2026-05-10T00:00:00Z')
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(end.getDate() - i)
    const t = (days - 1 - i) / days
    const seasonal = Math.sin(t * Math.PI * 2) * amplitude
    const trend = drift * t * days
    const jitter = (rand() - 0.5) * noise * amplitude
    const value = baseline + trend + seasonal + jitter
    out.push({
      date: d.toISOString().slice(0, 10),
      value: Math.round(value * 100) / 100,
      temperature: Math.round((12 + Math.sin(t * Math.PI * 2) * 9 + (rand() - 0.5) * 1.5) * 10) / 10,
    })
  }
  return out
}

export const DEVICES = [
  {
    id: 'FM-A12',
    serial: 'FM295-00001242',
    model: 'Vibrating Wire — VW-3D',
    location: 'Pont des Tilleuls — Pile P3',
    installedOn: '2024-09-12',
    threshold: 18,
    icon: 'caliper',
    series: genSeries({ days: 220, baseline: 6.2, drift: 0.012, amplitude: 3.5, noise: 0.5, seed: 11 }),
  },
  {
    id: 'FM-B07',
    serial: 'FM295-00001307',
    model: 'Vibrating Wire — VW-3D',
    location: 'Tunnel de Glion — PM 1240',
    installedOn: '2023-11-04',
    threshold: 25,
    icon: 'caliper',
    series: genSeries({ days: 220, baseline: 18.4, drift: 0.018, amplitude: 4.5, noise: 0.6, seed: 22 }),
  },
  {
    id: 'FM-C03',
    serial: 'FM289-00000884',
    model: 'LVDT — Geokon 4420',
    location: 'Barrage de Schiffenen — Joint 12',
    installedOn: '2024-02-21',
    threshold: 8,
    icon: 'dial',
    series: genSeries({ days: 220, baseline: 0.04, drift: -0.0002, amplitude: 0.6, noise: 0.4, seed: 33 }),
  },
  {
    id: 'FM-C04',
    serial: 'FM289-00000885',
    model: 'LVDT — Geokon 4420',
    location: 'Barrage de Schiffenen — Joint 13',
    installedOn: '2024-02-21',
    threshold: 8,
    icon: 'dial',
    series: genSeries({ days: 220, baseline: -0.5, drift: 0.0001, amplitude: 0.5, noise: 0.35, seed: 44 }),
  },
  {
    id: 'FM-D11',
    serial: 'FM295-00001411',
    model: 'Vibrating Wire — VW-3D',
    location: 'Viaduc de Chillon — Travée 4',
    installedOn: '2025-01-08',
    threshold: 20,
    icon: 'caliper',
    series: genSeries({ days: 220, baseline: -0.08, drift: 0.0008, amplitude: 1.2, noise: 0.5, seed: 55 }),
  },
  {
    id: 'FM-E02',
    serial: 'FM276-00000216',
    model: 'Mechanical — Avongard',
    location: 'Mur de soutènement — Yvonand',
    installedOn: '2025-06-30',
    threshold: 12,
    icon: 'wrench',
    series: genSeries({ days: 220, baseline: 5.6, drift: 0.006, amplitude: 2.2, noise: 0.45, seed: 66 }),
  },
]

// Calculs statistiques exposés sous forme d'helpers.
export function computeStats(series) {
  const values = series.map((p) => p.value)
  const n = values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const mean = values.reduce((a, b) => a + b, 0) / n
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n
  const std = Math.sqrt(variance)
  const current = values[n - 1]
  const previous = values[n - 2] ?? current
  const delta24h = current - previous
  // Régression linéaire simple : pente en μm / jour
  const xs = series.map((_, i) => i)
  const xMean = xs.reduce((a, b) => a + b, 0) / n
  const num = xs.reduce((acc, x, i) => acc + (x - xMean) * (values[i] - mean), 0)
  const den = xs.reduce((acc, x) => acc + (x - xMean) ** 2, 0)
  const slope = den === 0 ? 0 : num / den
  return {
    current: round(current),
    min: round(min),
    max: round(max),
    range: round(max - min),
    mean: round(mean),
    std: round(std),
    delta24h: round(delta24h),
    slopePerDay: round(slope),
    slopePerMonth: round(slope * 30),
    nMeasurements: n,
    lastDate: series[n - 1].date,
  }
}

function round(v) {
  return Math.round(v * 1000) / 1000
}
