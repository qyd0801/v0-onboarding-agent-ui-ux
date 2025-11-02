import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Query for matching employee
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .eq('password', password) // Plain text comparison for demo
      .single()

    if (error || !employee) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return employee profile
    return NextResponse.json({
      success: true,
      user: {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        project: employee.project,
        role: employee.role,
        manager_email: employee.manager_email,
        joinedDate: new Date(employee.created_at).toLocaleDateString(),
      },
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

