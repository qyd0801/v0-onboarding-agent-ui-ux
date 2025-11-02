import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, project, role, manager_email } = body

    // Validate required fields
    if (!name || !email || !password || !project || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = getServiceSupabase()

    // Check if employee already exists
    const { data: existingEmployee } = await supabase
      .from('employees')
      .select('id')
      .eq('email', email)
      .single()

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 409 }
      )
    }

    // Insert new employee
    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          name,
          email,
          password, // Plain text for demo purposes
          project,
          role,
          manager_email: manager_email || null,
          onboarding_status: 'active',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create employee' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      employee: data 
    })

  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

