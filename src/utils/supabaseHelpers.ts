
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Handle Supabase query errors and ensure proper error objects are returned
 */
export const handleQueryError = (error: PostgrestError | null, message: string = "Database query error") => {
  if (error) {
    console.error(message, error);
    throw new Error(`${message}: ${error.message}`);
  }
};

/**
 * Type guard to check if a value is a PostgrestError
 */
export const isPostgrestError = (value: any): value is PostgrestError => {
  return value && typeof value === 'object' && 'code' in value && 'message' in value && 'details' in value;
};

/**
 * Safely handle data extraction from Supabase query responses
 */
export const extractData = <T>(data: T | null, error: PostgrestError | null, errorMessage: string): T => {
  handleQueryError(error, errorMessage);
  
  if (!data) {
    throw new Error(`${errorMessage}: No data returned`);
  }
  
  return data;
};

/**
 * Type guard to check if data exists and is not a Postgrest error
 */
export const isValidData = <T>(data: T | PostgrestError | null): data is T => {
  return data !== null && !isPostgrestError(data);
};

/**
 * Helper function to check and convert string IDs for database queries
 * Returns the string as-is since Supabase handles UUID validation
 */
export function ensureUUID(id: string): string {
  // Simple regex to validate if string looks like a UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!id || typeof id !== 'string') {
    console.error('Invalid ID provided:', id);
    throw new Error('Invalid ID format');
  }
  
  if (!uuidRegex.test(id)) {
    console.warn('ID does not match UUID format:', id);
  }
  
  return id;
}

/**
 * Safe type assertion for database operations
 */
export function asTableRow<T>(data: unknown): T {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data structure');
  }
  return data as T;
}
