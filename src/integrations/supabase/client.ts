// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yzwozlxcoexeuondbytt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6d296bHhjb2V4ZXVvbmRieXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDkyMjAsImV4cCI6MjA2MzUyNTIyMH0.ze382cimi-VYPssAWbts8_f9FYWYpFjnElMOFFgzQMA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);