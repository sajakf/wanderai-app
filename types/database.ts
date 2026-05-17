export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type UserRole = 'user' | 'admin'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type TripStatus = 'draft' | 'published' | 'archived'
export type DocumentType = 'passport' | 'visa'
export type NotificationType = 'booking' | 'payment' | 'flight_alert' | 'system' | 'promo'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string
          email: string | null
          name: string
          role: UserRole
          avatar_url: string | null
          passport_data: Json | null
          preferences: Json | null
          last_seen: string | null
          disabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      trips: {
        Row: {
          id: string
          country: string
          city: string
          date_from: string
          date_to: string
          price_from: number
          currency: string
          cover_image_url: string | null
          international_flight: Json | null
          domestic_flight: Json | null
          hotel: Json | null
          restaurants: Json[] | null
          shops: Json[] | null
          highlights: string[] | null
          status: TripStatus
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['trips']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['trips']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          trip_id: string | null
          is_custom: boolean
          itinerary: Json | null
          status: BookingStatus
          payment_status: PaymentStatus
          payment_ref: string | null
          total_amount: number
          currency: string
          invoice_url: string | null
          whatsapp_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      messages: {
        Row: {
          id: string
          user_id: string
          booking_id: string | null
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      documents: {
        Row: {
          id: string
          user_id: string
          type: DocumentType
          storage_url: string
          extracted_data: Json | null
          uploaded_at: string
        }
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'uploaded_at'>
        Update: Partial<Database['public']['Tables']['documents']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      admin_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          target_type: string
          target_id: string
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_logs']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['admin_logs']['Insert']>
      }
    }
  }
}

/* ── Convenience types ── */
export type User = Database['public']['Tables']['users']['Row']
export type Trip = Database['public']['Tables']['trips']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
