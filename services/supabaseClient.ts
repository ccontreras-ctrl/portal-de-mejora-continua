
import { createClient } from '@supabase/supabase-js';

const initializeSupabase = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dqpxgwsdfclmztslstzh.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_o_849Y7sluUJzXRYz8THNw_1Q6FP8nI';

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase URL or Anon Key is missing');
        return null;
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {

            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    });
};


export const supabase = initializeSupabase();

