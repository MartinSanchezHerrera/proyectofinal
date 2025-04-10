import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kamambwebuoqukbmfxdy.supabase.co';
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbWFtYndlYnVvcXVrYm1meGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2OTgwMDAsImV4cCI6MjA1NDI3NDAwMH0.XP11L5JZDKoisdDaQIhSesbEnKxYqegaSnTZABH5yqo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})