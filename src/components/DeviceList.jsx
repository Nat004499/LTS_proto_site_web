import { useState } from 'react'
import { Icon } from './Icon.jsx'
import { computeStats } from '../data/mockData.js'

function statusFor(device) {
  const s = computeStats(device.series)
  const ratio = Math.abs(s.current) / device.threshold
  if (ratio >= 1)   return 'err'
  if (ratio >= 0.8) return 'warn'
  return 'ok'
}

const inputStyle = {
  background: 'var(--bg-1)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-0)',
  padding: '6px 10px',
  borderRadius: 4,
  fontSize: 12,
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
}

export default function DeviceList({
  devices, selectedId, onSelect,
  checkedIds, onToggleCheck, onToggleAll, onExport,
  onAdd, onRemoveChecked,
}) {
  const allChecked  = devices.length > 0 && checkedIds.size === devices.length
  const someChecked = checkedIds.size > 0 && !allChecked

  const [adding, setAdding] = useState(false)
  const [newId,  setNewId]  = useState('')
  const [newLoc, setNewLoc] = useState('')

  function submitAdd() {
    onAdd({ id: newId, location: newLoc })
    setNewId(''); setNewLoc(''); setAdding(false)
  }

  return (
    <aside className="devices">
      <div className="devices-header">
        <h2>Appareils</h2>
        <span className="sub">{devices.length} fissuromètres déployés</span>
      </div>

      <div className="devices-toolbar">
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-2)' }}>
          <input
            type="checkbox"
            className="checkbox"
            checked={allChecked}
            ref={(el) => { if (el) el.indeterminate = someChecked }}
            onChange={onToggleAll}
            disabled={devices.length === 0}
          />
          {checkedIds.size > 0 ? `${checkedIds.size} sélectionné(s)` : 'Tout sélectionner'}
        </label>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn ghost" onClick={() => setAdding((v) => !v)} title="Ajouter un appareil">
            + Ajouter
          </button>
          <button
            className="btn ghost"
            onClick={onRemoveChecked}
            disabled={checkedIds.size === 0}
            title="Supprimer la sélection"
          >
            − Supprimer
          </button>
          <button className="btn primary" onClick={onExport} disabled={checkedIds.size === 0}>
            <Icon name="download" size={14} />
            CSV
          </button>
        </div>
      </div>

      {adding && (
        <div style={{ padding: '12px 14px', display: 'grid', gap: 8, borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
          <input
            style={inputStyle}
            placeholder="Identifiant (ex. FM-F08)"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
          />
          <input
            style={inputStyle}
            placeholder="Emplacement (ex. Pont du Diable)"
            value={newLoc}
            onChange={(e) => setNewLoc(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
          />
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <button className="btn ghost" onClick={() => { setAdding(false); setNewId(''); setNewLoc('') }}>
              Annuler
            </button>
            <button className="btn primary" onClick={submitAdd} disabled={!newId.trim()}>
              Créer
            </button>
          </div>
        </div>
      )}

      <div className="devices-list">
        {devices.map((d) => {
          const stats  = computeStats(d.series)
          const status = statusFor(d)
          return (
            <div
              key={d.id}
              className={`device-row ${selectedId === d.id ? 'selected' : ''}`}
              onClick={() => onSelect(d.id)}
            >
              <input
                type="checkbox"
                className="checkbox"
                checked={checkedIds.has(d.id)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => onToggleCheck(d.id)}
              />
              <div className="icon"><Icon name={d.icon} size={28} /></div>
              <div>
                <div className="name">{d.id}</div>
                <div className="meta">{d.serial}</div>
              </div>
              <div className="value">
                <span className="mono">{stats.current.toFixed(2)}</span>
                <span className="unit">μm</span>
                <span className={`dot ${status}`} />
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
