import { createClient } from '@supabase/supabase-js'


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 创建并导出 Supabase 客户端，之后在 AuthPage 和 App.jsx 中直接 import 即可使用
export const supabase = createClient(supabaseUrl, supabaseAnonKey)