import { PostgrestError } from "@supabase/supabase-js";
import { AppError } from "../types/error";

export const handleSupabaseError = (error: PostgrestError): AppError => {
  return {
    code: `SUPABASE_${error.code}`,
    message: error.message,
    details: {
      hint: error.hint,
      details: error.details,
    },
  };
};
