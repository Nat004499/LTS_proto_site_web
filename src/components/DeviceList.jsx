import { Icon } from './Icon.jsx'
import { computeStats } from '../data/mockData.js'

function statusFor(device) {
  const s = computeStats(device.series)
  const ratio = Math.abs(s.current) / device.threshold
  if (ratio >= 1)   return 'err'
  if (ratio >= 0.8) return 'warn'
  return 'ok'
}

export default function DeviceList({
  devices,
  selectedId,
  onSelect,
  checkedIds,
  onToggleCheck,
  onToggleAll,
  onExport,
}) {
  const allChecked = checkedIds.size === devices.length
  const someChecked = checkedIds.size > 0 && !allChecked

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
          />
          {checkedIds.size > 0 ? `${checkedIds.size} sélectionné(s)` : 'Tout sélectionner'}
        </label>
        <button
          className="btn primary"
          onClick={onExport}
          disabled={checkedIds.size === 0}
          title="Exporter en CSV"
        >
          <Icon name="download" size={14} />
          Export CSV
        </button>
      </div>

      <div className="devices-list">
        {devices.map((d) => {
          const stats = computeStats(d.series)
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
              <div className="icon">
                <Icon name={d.icon} size={28} />
              </div>
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
