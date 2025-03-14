
import { Database } from '@/lib/database.types';

// Type for category from database
export type Category = Database['public']['Tables']['categories']['Row'];

// Type for course from database with badges
export type DbCourse = Database['public']['Tables']['courses']['Row'] & {
  badges: Array<'pro' | 'free' | 'tutorial'>;
  toolName?: string;
};

// Type for user profiles
export type UserProfile = Database['public']['Tables']['profiles']['Row'];

// Type for tools
export type Tool = Database['public']['Tables']['tools']['Row'];

// Type for course-tools relationships
export type CourseTool = Database['public']['Tables']['course_tools']['Row'];
