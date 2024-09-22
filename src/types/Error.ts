//import type { PostgrestError } from '@supabase/supabase-js'

// Example of third-party type error
export type PostgrestError = {
  message: string
  details: string
  hint: string
  code: string
}

export interface ExtendedPostgrestError extends PostgrestError {
  statusCode?: number
}

export interface CustomError extends Error {
  customCode?: number
}
