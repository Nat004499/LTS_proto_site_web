import { useMemo, useState } from 'react'
import './App.css'
import { DEVICES } from './data/mockData.js'
import { devicesToCSV, downloadCSV } from './utils/csv.js'
import DeviceList from './components/DeviceList.jsx'
import DeviceDetail from './components/DeviceDetail.jsx'
import { Icon } from './components/Icon.jsx'

const NAV = [
  { id: 'home',    label: 'ACCUEIL',  icon: 'home' },
  { id: 'devices', label: 'APPAREILS', icon: 'devices' },
  { id: 'history', label: 'HISTORIQUE', icon: 'history' },
  { id: 'logs',    label: 'LOGS',     icon: 'logs' },
]

export default function App() {
  const [section, setSection]       = useState('devices')
  const [selectedId, setSelectedId] = useState(DEVICES[0].id)
  const [checkedIds, setCheckedIds] = useState(new Set())

  const selectedDevice = useMemo(
    () => DEVICES.find((d) => d.id === selectedId),
    [selectedId]
  )

  function toggleCheck(id) {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setCheckedIds((prev) => {
      if (prev.size === DEVICES.length) return new Set()
      return new Set(DEVICES.map((d) => d.id))
    })
  }

  function exportSelected() {
    const list = DEVICES.filter((d) => checkedIds.has(d.id))
    if (list.length === 0) return
    const csv = devicesToCSV(list)
    const date = new Date().toISOString().slice(0, 10)
    downloadCSV(`fissuro_export_${list.length}_appareils_${date}.csv`, csv)
  }

  function exportOne(device) {
    const csv = devicesToCSV([device])
    const date = new Date().toISOString().slice(0, 10)
    downloadCSV(`fissuro_${device.id}_${date}.csv`, csv)
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
              devices={DEVICES}
              selectedId={selectedId}
              onSelect={setSelectedId}
              checkedIds={checkedIds}
              onToggleCheck={toggleCheck}
              onToggleAll={toggleAll}
              onExport={exportSelected}
            />
            {selectedDevice ? (
              <DeviceDetail device={selectedDevice} onExportOne={() => exportOne(selectedDevice)} />
            ) : (
              <div className="detail">
                <div className="detail-empty">
                  <div className="big">Aucun appareil sélectionné</div>
                  <div className="hint">Choisissez un fissuromètre dans la liste pour afficher ses mesures.</div>
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
    home:    { title: 'Accueil',     desc: "Tableau de bord global — non implémenté dans ce prototype." },
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
        <div className="panel-header">
          <h3>Section en cours de développement</h3>
        </div>
        <p style={{ color: 'var(--text-2)', margin: 0, lineHeight: 1.6 }}>
          Ce prototype se concentre sur la vue « Appareils ». Revenez à la section précédente pour explorer
          la liste de fissuromètres, leurs courbes et l'export CSV.
        </p>
      </div>
    </div>
  )
}
