
import { Database } from '@/lib/database.types';

// Type for category from database
export type Category = Database['public']['Tables']['categories']['Row'];

// Type for course from database with badges
export type DbCourse = Database['public']['Tables']['courses']['Row'] & {
  badges: Array<'pro' | 'free'>;
  toolName?: string;
  toolIcon?: string;
  short_description?: string; // Explicitly add short_description property
};

// Type for user profiles
export type UserProfile = Database['public']['Tables']['profiles']['Row'];

// Type for tools
export type Tool = {
  id: string;
  name: string;
  url: string;
  description: string;
  favicon: string;
  icon?: string;
  has_pro_perk: boolean;
  created_at: string;
  updated_at: string;
};

// Type for workshops
export type Workshop = {
  id: string;
  title: string;
  description: string | null;
  expert_name: string;
  expert_profile_image: string | null;
  date: string;
  registration_url: string;
  timezone: string;
  is_recorded: boolean;
  created_at: string;
  updated_at: string;
};
