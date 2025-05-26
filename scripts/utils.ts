export async function fetchCSV(url: string): Promise<Record<string, string>[]> {
  const response = await fetch(url)
  const csvText = await response.text()
  
  // Split into lines and remove empty lines
  const lines = csvText.split('\n').filter(line => line.trim())
  
  // Get headers from first line
  const headers = lines[0].split(',').map(header => header.trim())
  
  // Parse data rows
  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim())
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    return row
  })
  
  return data
} 