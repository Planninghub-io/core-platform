
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
 * Provides explicit typecasting to bypass TypeScript's stricter type checking with Supabase
 */
export function ensureUUID(id: string): any {
  // Simple regex to validate if string looks like a UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!id || typeof id !== 'string') {
    console.error('Invalid ID provided:', id);
    throw new Error('Invalid ID format');
  }
  
  if (!uuidRegex.test(id)) {
    console.warn('ID does not match UUID format:', id);
  }
  
  // Return the ID with 'any' type to bypass TypeScript's strict typing
  return id as any;
}

/**
 * Safe type assertion for database operations
 * With improved error handling, null checking and type safety
 */
export function asTableRow<T>(data: unknown): T {
  if (!data || typeof data !== 'object') {
    console.error('Invalid data structure:', data);
    throw new Error('Invalid data structure');
  }
  
  // Check if the data is an error object from Supabase
  if (isPostgrestError(data)) {
    console.error('Postgrest error:', data);
    throw new Error(`Database error: ${data.message}`);
  }
  
  // If data is valid, cast it to the requested type
  return data as T;
}

/**
 * Helper to safely process Supabase data with comprehensive error handling
 */
export function safelyExtractData<T>(data: any, error: PostgrestError | null, defaultValue: T[] = []): T[] {
  try {
    if (error) {
      console.error("Database query error:", error);
      return defaultValue;
    }
    
    if (!data || !Array.isArray(data)) {
      return defaultValue;
    }
    
    return data.map(item => asTableRow<T>(item));
  } catch (e) {
    console.error("Error processing data:", e);
    return defaultValue;
  }
}

/**
 * Process a single data row with error handling
 */
export function safelyExtractSingleRow<T>(data: any, error: PostgrestError | null): T | null {
  try {
    if (error) {
      console.error("Database query error:", error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return asTableRow<T>(data);
  } catch (e) {
    console.error("Error processing data row:", e);
    return null;
  }
}

/**
 * Safe type casting for Supabase query responses
 * Use this when TypeScript complains about type mismatches between Supabase types and app types
 */
export function safeCast<T>(data: any): T {
  return data as unknown as T;
}
