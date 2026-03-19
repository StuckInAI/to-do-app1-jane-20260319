import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/data-source'
import { Todo, CreateTodoDto, UpdateTodoDto } from '@/lib/entities/Todo'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

// Initialize database on first API call
let dbInitialized = false
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase()
    dbInitialized = true
  }
}

// GET /api/todos - Fetch all todos
export async function GET() {
  try {
    await ensureDbInitialized()
    const todoRepository = (await import('@/lib/data-source')).default.getRepository(Todo)
    const todos = await todoRepository.find({
      order: { createdAt: 'DESC' },
    })
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized()
    const body: CreateTodoDto = await request.json()

    // Validate input
    const todo = plainToClass(Todo, body)
    const errors = await validate(todo, { skipMissingProperties: true })
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Sanitize input (class-validator already handles basic sanitization)
    const todoRepository = (await import('@/lib/data-source')).default.getRepository(Todo)
    const savedTodo = await todoRepository.save(todo)
    return NextResponse.json(savedTodo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}