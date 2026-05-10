import { createClient } from '@supabase/supabase-js'

// নিচের Anon Key টি প্রকাশ্যে ব্যবহার করা যায়, তাই এটি নিরাপদ।
const supabaseUrl = 'https://myzbkvbclmvgomcwtxha.supabase.co'
const supabaseAnonKey = 'sb_publishable_cBw5T6573Sowdl1trMcEyA_yHCKaFlx'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

export const db = {
  getSchools: async () => {
    const { data } = await supabase.from('schools').select('*').order('name_bn')
    return data || []
  },
  getSchool: async (id: string) => {
    const { data } = await supabase.from('schools').select('*').eq('id', id).single()
    return data
  },
  getStudents: async (schoolId?: string) => {
    let query = supabase.from('students').select('*, schools(name_bn)')
    if (schoolId) query = query.eq('school_id', schoolId)
    const { data } = await query.order('roll')
    return data || []
  }
}