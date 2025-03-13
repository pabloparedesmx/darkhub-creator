
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://knrpakvzbpvpfuzlyoxj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucnBha3Z6YnB2cGZ1emx5b3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4OTQ0MDQsImV4cCI6MjA1NzQ3MDQwNH0.uYRX3K_RBsMZNNoY1Vo9tXWMtGInul6sPZ3lgrpmaP4';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
