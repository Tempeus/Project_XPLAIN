import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { topicId } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await supabase.from('bookmarks').upsert({ user_id: user.id, topic_id: topicId })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save bookmark' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { topicId } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('topic_id', topicId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
  }
}
