/**
 * Hand-maintained Supabase database types.
 *
 * When you have CLI access run `supabase gen types typescript` to regenerate
 * from the live schema and replace this file.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string | null;
          category: string | null;
          brand: string | null;
          model: string | null;
          year: number | null;
          price: number | null;
          price_negotiable: boolean;
          condition: string | null;
          working_hours: number | null;
          capacity_kg: number | null;
          lift_height_mm: number | null;
          fuel_type: string | null;
          city: string | null;
          district: string | null;
          images: string[] | null;
          contact_name: string | null;
          contact_phone: string | null;
          is_active: boolean;
          view_count: number;
          favorite_count: number;
          message_count: number;
          specs: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description?: string | null;
          category?: string | null;
          brand?: string | null;
          model?: string | null;
          year?: number | null;
          price?: number | null;
          price_negotiable?: boolean;
          condition?: string | null;
          working_hours?: number | null;
          capacity_kg?: number | null;
          lift_height_mm?: number | null;
          fuel_type?: string | null;
          city?: string | null;
          district?: string | null;
          images?: string[] | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          is_active?: boolean;
          view_count?: number;
          favorite_count?: number;
          message_count?: number;
          specs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          user_type: "bireysel" | "kurumsal";
          full_name: string | null;
          company_name: string | null;
          tax_number: string | null;
          phone: string | null;
          city: string | null;
          is_admin: boolean;
          store_slug: string | null;
          store_description: string | null;
          store_logo_url: string | null;
          store_banner_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          user_type: "bireysel" | "kurumsal";
          full_name?: string | null;
          company_name?: string | null;
          tax_number?: string | null;
          phone?: string | null;
          city?: string | null;
          is_admin?: boolean;
          store_slug?: string | null;
          store_description?: string | null;
          store_logo_url?: string | null;
          store_banner_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      favorite_lists: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorite_lists"]["Insert"]>;
      };
      favorite_list_items: {
        Row: {
          id: string;
          favorite_list_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          favorite_list_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorite_list_items"]["Insert"]>;
      };
      listing_conversations: {
        Row: {
          id: string;
          listing_id: string;
          seller_id: string;
          buyer_id: string;
          created_at: string;
          updated_at: string;
          last_message_at: string;
          seller_last_read_at: string | null;
          buyer_last_read_at: string | null;
        };
        Insert: {
          id?: string;
          listing_id: string;
          seller_id: string;
          buyer_id: string;
          created_at?: string;
          updated_at?: string;
          last_message_at?: string;
          seller_last_read_at?: string | null;
          buyer_last_read_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["listing_conversations"]["Insert"]>;
      };
      listing_messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["listing_messages"]["Insert"]>;
      };
      brands: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
      };
      brand_categories: {
        Row: {
          brand_id: number;
          category_slug: string;
        };
        Insert: {
          brand_id: number;
          category_slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["brand_categories"]["Insert"]>;
      };
    };
    Functions: {
      increment_listing_view_count: {
        Args: { listing_id: string };
        Returns: void;
      };
      get_unread_conversation_count: {
        Args: { p_user_id: string };
        Returns: number;
      };
      mark_conversation_read: {
        Args: { p_conversation_id: string };
        Returns: void;
      };
      search_listings: {
        Args: { search_term: string };
        Returns: Database["public"]["Tables"]["listings"]["Row"][];
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
