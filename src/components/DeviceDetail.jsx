import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ReferenceLine, Area, AreaChart,
} from 'recharts'
import { computeStats } from '../data/mockData.js'
import { Icon } from './Icon.jsx'

function fmt(n, digits = 2) {
  return n.toFixed(digits)
}

function trendClass(n) {
  if (Math.abs(n) < 0.05) return 'flat'
  return n > 0 ? 'up' : 'down'
}

function trendArrow(n) {
  if (Math.abs(n) < 0.05) return '—'
  return n > 0 ? '▲' : '▼'
}

export default function DeviceDetail({ device, onExportOne }) {
  const [tab, setTab] = useState('overview')
  const stats = computeStats(device.series)

  // Garde les 30 derniers points pour le tableau et l'aperçu température
  const last30 = device.series.slice(-30)

  return (
    <section className="detail">
      <div className="detail-header">
        <div>
          <h1>{device.id} · <span style={{ color: 'var(--text-2)', fontWeight: 400 }}>{device.location}</span></h1>
          <div className="subtitle">{device.model} — Installé le {device.installedOn}</div>
        </div>
        <div className="right">
          <div className="serial">N° de série : {device.serial}</div>
          <div>Dernière mesure : {stats.lastDate}</div>
          <button className="btn ghost" style={{ marginTop: 6 }} onClick={onExportOne}>
            <Icon name="download" size={12} />
            CSV pour cet appareil
          </button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          Vue d'ensemble
        </button>
        <button className={`tab ${tab === 'curve' ? 'active' : ''}`} onClick={() => setTab('curve')}>
          Courbe
        </button>
        <button className={`tab ${tab === 'table' ? 'active' : ''}`} onClick={() => setTab('table')}>
          Tableau
        </button>
      </div>

      {tab === 'overview' && (
        <>
          <div className="stats-grid">
            <Stat label="Mesure actuelle" value={fmt(stats.current)} unit="μm"
                  trend={`${trendArrow(stats.delta24h)} ${fmt(stats.delta24h)} μm / 24 h`}
                  trendType={trendClass(stats.delta24h)} />
            <Stat label="Valeur max" value={fmt(stats.max)} unit="μm" />
            <Stat label="Valeur min" value={fmt(stats.min)} unit="μm" />
            <Stat label="Amplitude totale" value={fmt(stats.range)} unit="μm" />
            <Stat label="Moyenne (220 j)" value={fmt(stats.mean)} unit="μm" />
            <Stat label="Écart-type" value={fmt(stats.std)} unit="μm" />
            <Stat label="Dérive linéaire" value={fmt(stats.slopePerMonth, 3)} unit="μm / mois"
                  trend={`${fmt(stats.slopePerDay, 4)} μm / jour`}
                  trendType={trendClass(stats.slopePerDay)} />
            <Stat label="Seuil d'alerte" value={fmt(device.threshold, 1)} unit="μm" />
          </div>

          <ChartPanel device={device} stats={stats} />
        </>
      )}

      {tab === 'curve' && (
        <>
          <ChartPanel device={device} stats={stats} large />
          <TempPanel data={last30} />
        </>
      )}

      {tab === 'table' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Mesures récentes</h3>
            <span className="meta">30 derniers points · μm</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="num">Mesure (μm)</th>
                <th className="num">Δ vs précédent</th>
                <th className="num">Température (°C)</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {last30.slice().reverse().map((p, i, arr) => {
                const prev = arr[i + 1]
                const delta = prev ? p.value - prev.value : 0
                const overThreshold = Math.abs(p.value) >= device.threshold
                const warn = Math.abs(p.value) >= device.threshold * 0.8
                return (
                  <tr key={p.date}>
                    <td className="mono">{p.date}</td>
                    <td className="num mono">{fmt(p.value)}</td>
                    <td className="num mono" style={{ color: delta > 0 ? 'var(--err)' : delta < 0 ? 'var(--ok)' : 'var(--text-2)' }}>
                      {delta > 0 ? '+' : ''}{fmt(delta)}
                    </td>
                    <td className="num mono">{fmt(p.temperature, 1)}</td>
                    <td>
                      <span className={`tag ${overThreshold ? 'err' : warn ? 'warn' : 'ok'}`}>
                        {overThreshold ? 'Alerte' : warn ? 'Vigilance' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function Stat({ label, value, unit, trend, trendType }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value mono">
        {value}<span className="unit">{unit}</span>
      </div>
      {trend && <div className={`trend ${trendType}`}>{trend}</div>}
    </div>
  )
}

function ChartPanel({ device, stats, large }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Évolution de la fissure</h3>
        <span className="meta">μm · 220 derniers jours</span>
      </div>
      <div style={{ width: '100%', height: large ? 380 : 280 }}>
        <ResponsiveContainer>
          <AreaChart data={device.series} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${device.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5c518" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f5c518" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--grid)" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#5a5a5e"
              tick={{ fill: '#8a8a8e', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#2a2a2e' }}
              minTickGap={40}
            />
            <YAxis
              stroke="#5a5a5e"
              tick={{ fill: '#8a8a8e', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#2a2a2e' }}
              width={46}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-2)',
                border: '1px solid var(--border-strong)',
                borderRadius: 4,
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--text-1)' }}
              itemStyle={{ color: '#f5c518' }}
              formatter={(v) => [`${v.toFixed(2)} μm`, 'Mesure']}
            />
            <ReferenceLine
              y={device.threshold}
              stroke="var(--err)"
              strokeDasharray="4 4"
              label={{ value: `seuil +${device.threshold}`, fill: 'var(--err)', fontSize: 10, position: 'right' }}
            />
            <ReferenceLine
              y={-device.threshold}
              stroke="var(--err)"
              strokeDasharray="4 4"
              label={{ value: `seuil −${device.threshold}`, fill: 'var(--err)', fontSize: 10, position: 'right' }}
            />
            <ReferenceLine y={stats.mean} stroke="#5a5a5e" strokeDasharray="2 2" />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f5c518"
              strokeWidth={1.8}
              fill={`url(#grad-${device.id})`}
              dot={false}
              activeDot={{ r: 4, fill: '#f5c518', stroke: '#1a1a1a' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function TempPanel({ data }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Température corrélée</h3>
        <span className="meta">°C · 30 derniers jours</span>
      </div>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--grid)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="date" stroke="#5a5a5e" tick={{ fill: '#8a8a8e', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2a2a2e' }} minTickGap={30} />
            <YAxis stroke="#5a5a5e" tick={{ fill: '#8a8a8e', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2a2a2e' }} width={36} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--border-strong)', borderRadius: 4, fontSize: 12 }}
              formatter={(v) => [`${v.toFixed(1)} °C`, 'Température']}
            />
            <Line type="monotone" dataKey="temperature" stroke="#4ade80" strokeWidth={1.6} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
