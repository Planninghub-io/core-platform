
// Main extractor file - now refactored to use specialized extractors
import { 
  extractEventDetails,
  extractTitle,
  extractDateTime,
  extractLocation,
  checkMissingFields
} from './extractors/index.ts';
import type { EventData } from './types.ts';

// Re-export all functions
export {
  extractEventDetails,
  extractTitle,
  extractDateTime,
  extractLocation,
  checkMissingFields
};
