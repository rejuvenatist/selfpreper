// src/lib/supabase.js
//
// 全站唯一的 Supabase 客户端。
// Publishable Key 本来就是设计成可以放在前端代码里的（只有匿名权限），
// 真正的数据安全靠 Supabase 后台的 RLS（行级安全策略）来保证。

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ejqpmoonebmenfdozetx.supabase.co'
const supabaseKey = 'sb_publishable_3gieUZVRjhci8n9F3y-SAQ_H2hfwseQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
