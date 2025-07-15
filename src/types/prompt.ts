
// Define the prompt type based on the database structure
export type Prompt = {
  id: string;
  name: string;
  content: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
};

// Type for prompt with category name
export type PromptWithCategory = Prompt & {
  categories?: {
    name: string;
  };
};
