// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hfzrjiawfshsajiiisel.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmenJqaWF3ZnNoc2FqaWlpc2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTE2NDEsImV4cCI6MjA1MzU2NzY0MX0.rDUWorAaP7va50MPBpqbzCg4KISAEHo1Li5JbCpdD8U";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);