import { createClient } from "@supabase/supabase-js"
import { fetchCSV } from "./utils"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateParticipatingLaundromats() {
  console.log("Starting participating laundromats migration...")

  try {
    // 1. Create the participating_laundromats table
    const { error: createTableError } = await supabase.rpc('create_participating_laundromats_table')
    if (createTableError) {
      console.error("Error creating participating_laundromats table:", createTableError)
      return
    }

    // 2. Fetch the CSV data
    const csvData = await fetchCSV("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Auro%20Backend%20Data%20-%20Participating_Laundromats-abD7V3gcgW0p1TzupcxwgdaOuH19m5.csv")

    // 3. Transform the data
    const participatingLaundromats = csvData.map((row: Record<string, string>) => ({
      laundromat_id: row["Participating Laundromat ID"],
      name: row["Laundromat Name"],
      address: row["Address"],
      phone_number: row["Phone Number"],
      hours_of_operation: row["Hours of Operation"],
      contact_person: row["Contact Person"],
      contact_email: row["Contact Email"],
      onboarding_date: row["Onboarding Date"] ? new Date(row["Onboarding Date"]).toISOString().split("T")[0] : null,
      contract_status: row["Contract Status"],
      payment_terms: row["Payment Terms"],
      commission_rate: row["Commission Rate"] ? Number.parseFloat(row["Commission Rate"]) : null,
      average_monthly_revenue: row["Average Monthly Revenue"] ? Number.parseFloat(row["Average Monthly Revenue"]) : null,
      last_revenue_update: row["Last Revenue Update"] ? new Date(row["Last Revenue Update"]).toISOString().split("T")[0] : null,
      admin_notes: row["Admin Notes"]
    }))

    // 4. Insert the data
    const { error: insertError } = await supabase
      .from("participating_laundromats")
      .insert(participatingLaundromats)

    if (insertError) {
      console.error("Error inserting participating laundromats:", insertError)
      return
    }

    console.log(`Successfully migrated ${participatingLaundromats.length} participating laundromats`)

    // 5. Create machines for each participating laundromat
    const machines = []
    for (const laundromat of participatingLaundromats) {
      const machinesPerLocation = Math.floor(Math.random() * 8) + 8 // 8-15 machines per location
      const machineTypes = ["Washer", "Dryer", "Combo"]
      const statuses = ["Online", "Offline", "Maintenance"]

      for (let i = 0; i < machinesPerLocation; i++) {
        machines.push({
          machine_id: `MCH_${laundromat.laundromat_id}_${(i + 1).toString().padStart(2, "0")}`,
          laundromat_id: laundromat.laundromat_id,
          machine_type: machineTypes[i % machineTypes.length],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          last_maintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          usage_percentage: Math.floor(Math.random() * 100),
          onboarding_date: laundromat.onboarding_date,
          contract_status: laundromat.contract_status,
          payment_terms: laundromat.payment_terms,
          commission_rate: laundromat.commission_rate,
          average_monthly_revenue: laundromat.average_monthly_revenue,
          last_revenue_update: laundromat.last_revenue_update,
          admin_notes: laundromat.admin_notes
        })
      }
    }

    // 6. Insert machines in batches
    const batchSize = 100
    for (let i = 0; i < machines.length; i += batchSize) {
      const batch = machines.slice(i, i + batchSize)
      const { error: machinesError } = await supabase
        .from("machines")
        .insert(batch)

      if (machinesError) {
        console.error(`Error inserting machines batch ${i / batchSize + 1}:`, machinesError)
        return
      }

      console.log(`Successfully inserted batch ${i / batchSize + 1} (${batch.length} machines)`)
    }

    console.log(`Successfully migrated ${machines.length} machines`)
    console.log("Migration completed successfully!")

  } catch (error) {
    console.error("Migration failed:", error)
  }
}

// Run the migration
migrateParticipatingLaundromats() 