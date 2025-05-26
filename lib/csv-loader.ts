// CSV data URLs provided by the user
const CSV_URLS = {
  laundromats:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20All_NYC_Laundromats%20%282%29-yyEal8I5JygvTmtU5hCS9aL4bR1Z0h.csv",
  machines:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Participating_Laundromats-abD7V3gcgW0p1TzupcxwgdaOuH19m5.csv", // Using participating laundromats as machines placeholder
  drivers:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Drivers_List-IVdkjFvFzAgfbz7NyvoKBU36wuYSOI.csv",
  users:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Users_List-ZKAMEZ8j1l97urF4kGTES84v9nr92F.csv",
  bookings:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Bookings_List-aVO427jA0B0MjcqVmenVK2FOOJJP7K.csv",
  supplyOrders:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Supply_Orders-qk6AVHChqNIj3VKuVV0Tr7y1nYsUR7.csv",
  orderItems:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Order_Items-zZudmf6ZVNERKgDRmTKIZpo3aJZOia.csv",
  serviceTypes:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Service_Types-7hgYccwESuior1szcQi63iZAcKppAX.csv",
  serviceCategories:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Service_Categories%20%281%29-TQM8x73GpjcbFHQSwhqoPQ82I6v36O.csv",
  products:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Laundry_Care_Products%20%281%29-56tqXD5b4jirG6Lytv7yJMGGM7K3tM.csv",
  participating_laundromats:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Participating_Laundromats-abD7V3gcgW0p1TzupcxwgdaOuH19m5.csv",
}

function parseCSV(csvText: string): Record<string, any>[] {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((header) => header.replace(/"/g, "").trim())
  const data: Record<string, any>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((value) => value.replace(/"/g, "").trim())
    const row: Record<string, any> = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || null
    })

    data.push(row)
  }

  return data
}

export async function loadCSV(type: keyof typeof CSV_URLS): Promise<Record<string, any>[]> {
  try {
    const url = CSV_URLS[type]
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }

    const csvText = await response.text()
    return parseCSV(csvText)
  } catch (error) {
    console.error(`Error loading CSV for ${type}:`, error)
    return []
  }
}

// Cache for CSV data to avoid repeated fetches
const csvCache = new Map<string, Record<string, any>[]>()

export async function getCachedCSV(type: keyof typeof CSV_URLS): Promise<Record<string, any>[]> {
  if (csvCache.has(type)) {
    return csvCache.get(type)!
  }

  const data = await loadCSV(type)
  csvCache.set(type, data)
  return data
}
