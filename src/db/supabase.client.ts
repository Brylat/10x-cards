import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

export const DEFAULT_USER_ID = "8ef8146f-9351-4a6c-8267-a3af5204adf6";

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
