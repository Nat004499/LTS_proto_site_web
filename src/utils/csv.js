// Génère un CSV à partir d'une liste d'appareils sélectionnés.
// Une ligne par mesure ; les appareils sont identifiés par leur id/serial.
export function devicesToCSV(devices) {
  const header = ['device_id', 'serial', 'model', 'location', 'date', 'value_um', 'temperature_C']
  const rows = [header.join(',')]
  for (const d of devices) {
    for (const p of d.series) {
      rows.push(
        [
          d.id,
          d.serial,
          esc(d.model),
          esc(d.location),
          p.date,
          p.value,
          p.temperature,
        ].join(',')
      )
    }
  }
  return rows.join('\n')
}

function esc(s) {
  if (s == null) return ''
  const str = String(s)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

export function downloadCSV(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
