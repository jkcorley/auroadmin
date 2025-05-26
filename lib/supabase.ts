import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      laundromats: {
        Row: {
          id: string
          laundromat_id: string
          place_id: string | null
          neighborhood: string | null
          name: string
          latitude: number | null
          longitude: number | null
          rating: number | null
          total_user_ratings: number | null
          address: string | null
          phone: string | null
          hours_of_operation: string | null
          accessible: boolean | null
          photo_reference: string | null
          google_maps_url: string | null
          top_review_text: string | null
          top_review_rating: number | null
          top_review_author: string | null
          original_query: string | null
          borough: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          laundromat_id: string
          place_id?: string | null
          neighborhood?: string | null
          name: string
          latitude?: number | null
          longitude?: number | null
          rating?: number | null
          total_user_ratings?: number | null
          address?: string | null
          phone?: string | null
          hours_of_operation?: string | null
          accessible?: boolean | null
          photo_reference?: string | null
          google_maps_url?: string | null
          top_review_text?: string | null
          top_review_rating?: number | null
          top_review_author?: string | null
          original_query?: string | null
          borough?: string | null
        }
        Update: {
          laundromat_id?: string
          place_id?: string | null
          neighborhood?: string | null
          name?: string
          latitude?: number | null
          longitude?: number | null
          rating?: number | null
          total_user_ratings?: number | null
          address?: string | null
          phone?: string | null
          hours_of_operation?: string | null
          accessible?: boolean | null
          photo_reference?: string | null
          google_maps_url?: string | null
          top_review_text?: string | null
          top_review_rating?: number | null
          top_review_author?: string | null
          original_query?: string | null
          borough?: string | null
        }
      }
      drivers: {
        Row: {
          id: string
          driver_id: string
          full_name: string
          email: string
          phone_number: string
          vehicle_type: string | null
          license_plate: string | null
          current_status: string | null
          is_active: boolean | null
          date_registered: string | null
          last_status_update: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          driver_id: string
          full_name: string
          email: string
          phone_number: string
          vehicle_type?: string | null
          license_plate?: string | null
          current_status?: string | null
          is_active?: boolean | null
          date_registered?: string | null
          last_status_update?: string | null
          admin_notes?: string | null
        }
        Update: {
          driver_id?: string
          full_name?: string
          email?: string
          phone_number?: string
          vehicle_type?: string | null
          license_plate?: string | null
          current_status?: string | null
          is_active?: boolean | null
          date_registered?: string | null
          last_status_update?: string | null
          admin_notes?: string | null
        }
      }
      users: {
        Row: {
          id: string
          user_id: string
          phone_number: number | null
          pin_hash: string | null
          full_name: string
          email: string | null
          default_pickup_address_street: string | null
          default_pickup_address_city: string | null
          default_pickup_address_state: string | null
          default_pickup_address_zip: string | null
          default_delivery_address_street: string | null
          default_delivery_address_city: string | null
          default_delivery_address_state: string | null
          default_delivery_address_zip: string | null
          preferred_laundromat_id: string | null
          user_role: string | null
          account_status: string | null
          date_registered: string | null
          last_login_timestamp: string | null
          admin_notes_user: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          phone_number?: number | null
          pin_hash?: string | null
          full_name: string
          email?: string | null
          default_pickup_address_street?: string | null
          default_pickup_address_city?: string | null
          default_pickup_address_state?: string | null
          default_pickup_address_zip?: string | null
          default_delivery_address_street?: string | null
          default_delivery_address_city?: string | null
          default_delivery_address_state?: string | null
          default_delivery_address_zip?: string | null
          preferred_laundromat_id?: string | null
          user_role?: string | null
          account_status?: string | null
          date_registered?: string | null
          last_login_timestamp?: string | null
          admin_notes_user?: string | null
        }
        Update: {
          user_id?: string
          phone_number?: number | null
          pin_hash?: string | null
          full_name?: string
          email?: string | null
          default_pickup_address_street?: string | null
          default_pickup_address_city?: string | null
          default_pickup_address_state?: string | null
          default_pickup_address_zip?: string | null
          default_delivery_address_street?: string | null
          default_delivery_address_city?: string | null
          default_delivery_address_state?: string | null
          default_delivery_address_zip?: string | null
          preferred_laundromat_id?: string | null
          user_role?: string | null
          account_status?: string | null
          date_registered?: string | null
          last_login_timestamp?: string | null
          admin_notes_user?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          booking_id: string
          user_id: string
          user_full_name_snapshot: string | null
          user_phone_snapshot: string | null
          participating_laundromat_id: string | null
          laundromat_name_snapshot: string | null
          service_type_id: string | null
          service_name_snapshot: string | null
          service_category_id_snapshot: string | null
          booking_creation_timestamp: string | null
          current_booking_status: string | null
          estimated_cost: number | null
          actual_cost: number | null
          payment_status: string | null
          last_status_update_timestamp: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          user_id: string
          user_full_name_snapshot?: string | null
          user_phone_snapshot?: string | null
          participating_laundromat_id?: string | null
          laundromat_name_snapshot?: string | null
          service_type_id?: string | null
          service_name_snapshot?: string | null
          service_category_id_snapshot?: string | null
          booking_creation_timestamp?: string | null
          current_booking_status?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          payment_status?: string | null
          last_status_update_timestamp?: string | null
        }
        Update: {
          booking_id?: string
          user_id?: string
          user_full_name_snapshot?: string | null
          user_phone_snapshot?: string | null
          participating_laundromat_id?: string | null
          laundromat_name_snapshot?: string | null
          service_type_id?: string | null
          service_name_snapshot?: string | null
          service_category_id_snapshot?: string | null
          booking_creation_timestamp?: string | null
          current_booking_status?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          payment_status?: string | null
          last_status_update_timestamp?: string | null
        }
      }
      supply_orders: {
        Row: {
          id: string
          supply_order_id: string
          user_id: string
          user_full_name_snapshot: string | null
          order_timestamp: string | null
          delivery_address_street: string | null
          delivery_address_city: string | null
          delivery_address_state: string | null
          delivery_address_zip: string | null
          subtotal_amount: number | null
          total_order_amount: number | null
          order_status: string | null
          payment_status: string | null
          payment_method_snapshot: string | null
          last_updated_timestamp: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          supply_order_id: string
          user_id: string
          user_full_name_snapshot?: string | null
          order_timestamp?: string | null
          delivery_address_street?: string | null
          delivery_address_city?: string | null
          delivery_address_state?: string | null
          delivery_address_zip?: string | null
          subtotal_amount?: number | null
          total_order_amount?: number | null
          order_status?: string | null
          payment_status?: string | null
          payment_method_snapshot?: string | null
          last_updated_timestamp?: string | null
        }
        Update: {
          supply_order_id?: string
          user_id?: string
          user_full_name_snapshot?: string | null
          order_timestamp?: string | null
          delivery_address_street?: string | null
          delivery_address_city?: string | null
          delivery_address_state?: string | null
          delivery_address_zip?: string | null
          subtotal_amount?: number | null
          total_order_amount?: number | null
          order_status?: string | null
          payment_status?: string | null
          payment_method_snapshot?: string | null
          last_updated_timestamp?: string | null
        }
      }
      machines: {
        Row: {
          id: string
          machine_id: string
          laundromat_id: string
          machine_type: string
          status: string | null
          last_maintenance: string | null
          usage_percentage: number | null
          onboarding_date: string | null
          contract_status: string | null
          payment_terms: string | null
          commission_rate: number | null
          average_monthly_revenue: number | null
          last_revenue_update: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          machine_id: string
          laundromat_id: string
          machine_type: string
          status?: string | null
          last_maintenance?: string | null
          usage_percentage?: number | null
          onboarding_date?: string | null
          contract_status?: string | null
          payment_terms?: string | null
          commission_rate?: number | null
          average_monthly_revenue?: number | null
          last_revenue_update?: string | null
          admin_notes?: string | null
        }
        Update: {
          machine_id?: string
          laundromat_id?: string
          machine_type?: string
          status?: string | null
          last_maintenance?: string | null
          usage_percentage?: number | null
          onboarding_date?: string | null
          contract_status?: string | null
          payment_terms?: string | null
          commission_rate?: number | null
          average_monthly_revenue?: number | null
          last_revenue_update?: string | null
          admin_notes?: string | null
        }
      }
    }
  }
}
