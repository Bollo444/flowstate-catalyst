import type { Json } from "./database"; // Re-export Json if needed elsewhere

export interface SupabaseSession {
  user: {
    id: string;
    app_metadata: {
      provider?: string; // Make provider optional as it might not always exist
      // Add other relevant app_metadata fields if known
    };
    // Add other relevant user fields if known (e.g., email)
    email?: string;
  };
  // Add other session properties if needed (e.g., access_token)
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
}

// Optionally re-export Json if it's intended to be accessible via this module
export type { Json };
