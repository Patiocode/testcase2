import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all codes
export async function GET() {
  try {
    const codes = await prisma.generatedCode.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(codes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch codes' },
      { status: 500 }
    )
  }
}

// POST new code
export async function POST(request) {
  try {
    const { title, htmlCode, cssCode, jsCode, type } = await request.json()
    
    const newCode = await prisma.generatedCode.create({
      data: {
        title,
        htmlCode,
        cssCode,
        jsCode,
        type
      }
    })
    
    return NextResponse.json(newCode, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create code' },
      { status: 500 }
    )
  }
}