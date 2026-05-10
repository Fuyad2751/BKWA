import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const examId = searchParams.get('exam_id');
  const roll = searchParams.get('roll');
  const schoolId = searchParams.get('school_id');

  if (!examId) {
    return NextResponse.json({ error: 'পরীক্ষা ID প্রয়োজন' }, { status: 400 });
  }

  let query = supabase
    .from('results')
    .select(`
      *,
      students!inner(name_bn, class, roll, school_id),
      schools!inner(name_bn)
    `)
    .eq('exam_id', examId);

  if (roll) query = query.eq('students.roll', roll);
  if (schoolId) query = query.eq('school_id', schoolId);

  const { data, error } = await query.order('rank', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}