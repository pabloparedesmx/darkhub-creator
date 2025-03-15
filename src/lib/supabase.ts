import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://knrpakvzbpvpfuzlyoxj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucnBha3Z6YnB2cGZ1emx5b3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4OTQ0MDQsImV4cCI6MjA1NzQ3MDQwNH0.uYRX3K_RBsMZNNoY1Vo9tXWMtGInul6sPZ3lgrpmaP4';

// Create a custom storage implementation that falls back to memory storage if localStorage is not available
const createCustomStorage = () => {
  const inMemoryStorage = new Map<string, string>();
  
  // Check if localStorage is available
  const isLocalStorageAvailable = () => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Use localStorage if available, otherwise use in-memory storage
  const storageAvailable = isLocalStorageAvailable();
  
  return {
    getItem: (key: string): string | null => {
      try {
        if (storageAvailable) {
          return localStorage.getItem(key);
        }
        return inMemoryStorage.get(key) || null;
      } catch (error) {
        console.warn('Storage access error:', error);
        return inMemoryStorage.get(key) || null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        if (storageAvailable) {
          localStorage.setItem(key, value);
        }
        inMemoryStorage.set(key, value);
      } catch (error) {
        console.warn('Storage access error:', error);
        inMemoryStorage.set(key, value);
      }
    },
    removeItem: (key: string): void => {
      try {
        if (storageAvailable) {
          localStorage.removeItem(key);
        }
        inMemoryStorage.delete(key);
      } catch (error) {
        console.warn('Storage access error:', error);
        inMemoryStorage.delete(key);
      }
    }
  };
};

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createCustomStorage(),
    persistSession: true,
    autoRefreshToken: true,
  },
});
