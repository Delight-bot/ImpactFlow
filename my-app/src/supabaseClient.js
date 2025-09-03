import { createClient } from '@supabase/supabase-js'

// Replace with your actual values
const supabaseUrl = "https://adzcofatgeejxwmcsobh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkemNvZmF0Z2Vlanh3bWNzb2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjgzMzcsImV4cCI6MjA3MjI0NDMzN30.7EnrN8Zl5ekFLr1CktbVqGG-2rsHvCjtMCd9tUhbS8Q"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
