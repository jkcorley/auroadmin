import { supabase } from "./supabase"
import type { Database } from "./supabase"

// Type aliases for easier use
type LaundromatsTable = Database["public"]["Tables"]["laundromats"]
type DriversTable = Database["public"]["Tables"]["drivers"]
type UsersTable = Database["public"]["Tables"]["users"]
type BookingsTable = Database["public"]["Tables"]["bookings"]
type SupplyOrdersTable = Database["public"]["Tables"]["supply_orders"]
type MachinesTable = Database["public"]["Tables"]["machines"]

export type LaundromatsRow = LaundromatsTable["Row"]
export type DriversRow = DriversTable["Row"]
export type UsersRow = UsersTable["Row"]
export type BookingsRow = BookingsTable["Row"]
export type SupplyOrdersRow = SupplyOrdersTable["Row"]
export type MachinesRow = MachinesTable["Row"]

// Database query functions
export async function getLaundromats() {
  const { data, error } = await supabase.from("laundromats").select("*").order("name")

  if (error) {
    console.error("Error fetching laundromats:", error)
    return []
  }

  return data || []
}

export async function getDrivers() {
  const { data, error } = await supabase.from("drivers").select("*").order("full_name")

  if (error) {
    console.error("Error fetching drivers:", error)
    return []
  }

  return data || []
}

export async function getUsers() {
  const { data, error } = await supabase.from("users").select("*").order("full_name")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data || []
}

export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("booking_creation_timestamp", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data || []
}

export async function getSupplyOrders() {
  const { data, error } = await supabase
    .from("supply_orders")
    .select("*")
    .order("order_timestamp", { ascending: false })

  if (error) {
    console.error("Error fetching supply orders:", error)
    return []
  }

  return data || []
}

export async function getMachines() {
  const { data, error } = await supabase
    .from("machines")
    .select(`
      *,
      participating_laundromats!inner (
        name,
        address,
        phone,
        hours_of_operation
      )
    `)
    .order("machine_id")

  if (error) {
    console.error("Error fetching machines:", error)
    return []
  }

  return data || []
}

export async function getMachinesPaginated(offset = 0, limit = 50): Promise<{ machines: any[]; total: number }> {
  const { data, error, count } = await supabase
    .from("machines")
    .select(`
      machine_id,
      laundromat_id,
      machine_type,
      current_status,
      last_maintenance,
      usage_percentage,
      onboarding_date,
      contract_status,
      payment_terms,
      commission_rate,
      average_monthly_revenue,
      last_revenue_update,
      admin_notes,
      created_at,
      updated_at,
      participating_laundromats(name, address, phone, hours_of_operation)
    `, { count: "exact" })
    .order("machine_id")
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching paginated machines:", error)
    return { machines: [], total: 0 }
  }

  return { machines: data || [], total: count ?? 0 }
}

// Update functions
export async function updateDriverStatus(driverId: string, status: string) {
  const { data, error } = await supabase
    .from("drivers")
    .update({
      current_status: status,
      last_status_update: new Date().toISOString(),
    })
    .eq("driver_id", driverId)
    .select()

  if (error) {
    console.error("Error updating driver status:", error)
    return null
  }

  return data?.[0] || null
}

export async function updateDriverActive(driverId: string, isActive: boolean) {
  const { data, error } = await supabase
    .from("drivers")
    .update({
      is_active: isActive,
      last_status_update: new Date().toISOString(),
    })
    .eq("driver_id", driverId)
    .select()

  if (error) {
    console.error("Error updating driver active status:", error)
    return null
  }

  return data?.[0] || null
}

export async function updateMachineStatus(machineId: string, status: string) {
  const { data, error } = await supabase
    .from("machines")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("machine_id", machineId)
    .select()

  if (error) {
    console.error("Error updating machine status:", error)
    return null
  }

  return data?.[0] || null
}

export async function updateSupplyOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from("supply_orders")
    .update({
      order_status: status,
      last_updated_timestamp: new Date().toISOString(),
    })
    .eq("supply_order_id", orderId)
    .select()

  if (error) {
    console.error("Error updating supply order status:", error)
    return null
  }

  return data?.[0] || null
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const { data, error } = await supabase
    .from("bookings")
    .update({
      current_booking_status: status,
      last_status_update_timestamp: new Date().toISOString(),
    })
    .eq("booking_id", bookingId)
    .select()

  if (error) {
    console.error("Error updating booking status:", error)
    return null
  }

  return data?.[0] || null
}

// Get count of participating laundromats
export async function getParticipatingLaundromatsCount() {
  const { count, error } = await supabase
    .from("participating_laundromats")
    .select("*", { count: "exact", head: true })
  if (error) {
    console.error("Error fetching participating laundromats count:", error)
    return 0
  }
  return count ?? 0
}

// Dashboard stats
export async function getDashboardStats() {
  try {
    // Get laundromat count efficiently
    const { count: laundromatCount, error: laundromatCountError } = await supabase
      .from("participating_laundromats")
      .select("*", { count: "exact", head: true })
    if (laundromatCountError) {
      console.error("Error fetching participating laundromat count:", laundromatCountError)
    }

    // Get participating laundromats count
    const participatingLaundromats = await getParticipatingLaundromatsCount();

    // Get total machines count efficiently
    const { count: totalMachines, error: machinesCountError } = await supabase
      .from("machines")
      .select("*", { count: "exact", head: true })
    if (machinesCountError) {
      console.error("Error fetching machines count:", machinesCountError)
    }

    // Fetch the rest as before
    const [drivers, users, bookings, supplyOrders, machines] = await Promise.all([
      getDrivers(),
      getUsers(),
      getBookings(),
      getSupplyOrders(),
      getMachines(),
    ])

    const totalLaundromats = laundromatCount ?? 0
    const totalUsers = users.length
    const activeDrivers = drivers.filter((d) => d.is_active).length
    const totalDrivers = drivers.length
    const pendingBookings = bookings.filter((b) => b.current_booking_status?.toLowerCase().includes("pending")).length
    const totalBookings = bookings.length
    const pendingOrders = supplyOrders.filter((o) => o.order_status?.toLowerCase().includes("pending")).length
    const totalOrders = supplyOrders.length
    const brokenMachines = machines.filter(
      (m) => m.status?.toLowerCase() === "maintenance" || m.status?.toLowerCase() === "offline",
    ).length

    return {
      totalLaundromats,
      participatingLaundromats,
      totalMachines: totalMachines ?? 0,
      brokenMachines,
      totalUsers,
      activeDrivers,
      totalDrivers,
      pendingBookings,
      totalBookings,
      pendingOrders,
      totalOrders,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      totalLaundromats: 0,
      participatingLaundromats: 0,
      totalMachines: 0,
      brokenMachines: 0,
      totalUsers: 0,
      activeDrivers: 0,
      totalDrivers: 0,
      pendingBookings: 0,
      totalBookings: 0,
      pendingOrders: 0,
      totalOrders: 0,
    }
  }
}
