import { useState } from 'react'
import './App.css'
import { DEVICES as INITIAL_DEVICES, createDevice } from './data/mockData.js'
import { devicesToCSV, downloadCSV } from './utils/csv.js'
import DeviceList from './components/DeviceList.jsx'
import DeviceDetail from './components/DeviceDetail.jsx'
import { Icon } from './components/Icon.jsx'

const NAV = [
  { id: 'home',    label: 'ACCUEIL',   icon: 'home' },
  { id: 'devices', label: 'APPAREILS', icon: 'devices' },
  { id: 'history', label: 'HISTORIQUE', icon: 'history' },
  { id: 'logs',    label: 'LOGS',      icon: 'logs' },
]

export default function App() {
  const [section, setSection]       = useState('devices')
  const [devices, setDevices]       = useState(INITIAL_DEVICES)
  const [selectedId, setSelectedId] = useState(INITIAL_DEVICES[0].id)
  const [checkedIds, setCheckedIds] = useState(new Set())

  const selectedDevice = devices.find((d) => d.id === selectedId) || null

  function toggleCheck(id) {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  function toggleAll() {
    setCheckedIds((prev) =>
      prev.size === devices.length ? new Set() : new Set(devices.map((d) => d.id))
    )
  }

  function addDevice({ id, location, model }) {
    const trimmed = id.trim()
    if (!trimmed) return
    if (devices.some((d) => d.id === trimmed)) {
      alert(`L'identifiant "${trimmed}" existe déjà.`)
      return
    }
    const dev = createDevice({ id: trimmed, location, model })
    setDevices((prev) => [...prev, dev])
    setSelectedId(dev.id)
  }

  function removeChecked() {
    if (checkedIds.size === 0) return
    if (!confirm(`Supprimer ${checkedIds.size} appareil(s) ?`)) return
    const remaining = devices.filter((d) => !checkedIds.has(d.id))
    setDevices(remaining)
    if (checkedIds.has(selectedId)) {
      setSelectedId(remaining[0]?.id ?? null)
    }
    setCheckedIds(new Set())
  }

  function exportSelected() {
    const list = devices.filter((d) => checkedIds.has(d.id))
    if (list.length === 0) return
    const date = new Date().toISOString().slice(0, 10)
    downloadCSV(`fissuro_export_${list.length}_appareils_${date}.csv`, devicesToCSV(list))
  }
  function exportOne(device) {
    const date = new Date().toISOString().slice(0, 10)
    downloadCSV(`fissuro_${device.id}_${date}.csv`, devicesToCSV([device]))
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" />
          <span>FISSURO MONITOR · v0.1</span>
        </div>
        <div className="user">L. Contino — Session 12.05.2026</div>
      </header>

      <nav className="sidebar">
        {NAV.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${section === item.id ? 'active' : ''}`}
            onClick={() => setSection(item.id)}
          >
            <Icon name={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {section === 'devices' ? (
          <>
            <DeviceList
              devices={devices}
              selectedId={selectedId}
              onSelect={setSelectedId}
              checkedIds={checkedIds}
              onToggleCheck={toggleCheck}
              onToggleAll={toggleAll}
              onExport={exportSelected}
              onAdd={addDevice}
              onRemoveChecked={removeChecked}
            />
            {selectedDevice ? (
              <DeviceDetail device={selectedDevice} onExportOne={() => exportOne(selectedDevice)} />
            ) : (
              <div className="detail">
                <div className="detail-empty">
                  <div className="big">Aucun appareil</div>
                  <div className="hint">Ajoute un fissuromètre depuis le bouton « + ».</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <Placeholder section={section} />
        )}
      </main>
    </div>
  )
}

function Placeholder({ section }) {
  const labels = {
    home:    { title: 'Accueil',     desc: 'Tableau de bord global — non implémenté dans ce prototype.' },
    history: { title: 'Historique',  desc: 'Historique des relevés et des alertes — à venir.' },
    logs:    { title: 'Logs système', desc: 'Journal d\'événements et erreurs — à venir.' },
  }
  const l = labels[section]
  return (
    <div className="detail" style={{ gridColumn: '1 / -1' }}>
      <div className="detail-header">
        <div>
          <h1>{l.title}</h1>
          <div className="subtitle">{l.desc}</div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header"><h3>Section en cours de développement</h3></div>
        <p style={{ color: 'var(--text-2)', margin: 0, lineHeight: 1.6 }}>
          Ce prototype se concentre sur la vue « Appareils ».
        </p>
      </div>
    </div>
  )
}