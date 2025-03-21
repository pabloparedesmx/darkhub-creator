
// Import the Database type from the correct location
import { Database } from '@/integrations/supabase/types';

// Type for prompt from database
export type Prompt = Database['public']['Tables']['prompts']['Row'];

// Type for prompt with category name
export type PromptWithCategory = Prompt & {
  categories?: {
    name: string;
  };
};
