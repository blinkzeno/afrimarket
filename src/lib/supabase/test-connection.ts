import { createClient as createBrowserClient } from './client'

export async function testConnection() {
  try {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.from('_postgis_seeds').select('*').limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, message: 'Connected to Supabase!' }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false, error: String(err) }
  }
}
