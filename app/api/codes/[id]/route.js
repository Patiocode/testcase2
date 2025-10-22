import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single code by ID
export async function GET(request, { params }) {
  try {
    const code = await prisma.generatedCode.findUnique({
      where: { id: params.id }
    })
    
    if (!code) {
      return NextResponse.json(
        { error: 'Code not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(code)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch code' },
      { status: 500 }
    )
  }
}

// UPDATE code by ID
export async function PUT(request, { params }) {
  try {
    const { title, htmlCode, cssCode, jsCode } = await request.json()
    
    const updatedCode = await prisma.generatedCode.update({
      where: { id: params.id },
      data: { title, htmlCode, cssCode, jsCode }
    })
    
    return NextResponse.json(updatedCode)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update code' },
      { status: 500 }
    )
  }
}

// DELETE code by ID
export async function DELETE(request, { params }) {
  try {
    await prisma.generatedCode.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Code deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete code' },
      { status: 500 }
    )
  }
}