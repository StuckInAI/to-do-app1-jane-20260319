import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/data-source'
import { Todo, UpdateTodoDto } from '@/lib/entities/Todo'
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

// GET /api/todos/[id] - Get a specific todo (not used in UI but added for completeness)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDbInitialized()
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      )
    }

    const todoRepository = (await import('@/lib/data-source')).default.getRepository(Todo)
    const todo = await todoRepository.findOne({ where: { id } })
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(todo)
  } catch (error) {
    console.error('Error fetching todo:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    )
  }
}

// PUT /api/todos/[id] - Update a todo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDbInitialized()
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      )
    }

    const body: UpdateTodoDto = await request.json()
    const todoRepository = (await import('@/lib/data-source')).default.getRepository(Todo)
    const existingTodo = await todoRepository.findOne({ where: { id } })
    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    // Merge updates
    const updatedTodo = Object.assign(existingTodo, body)
    updatedTodo.updatedAt = new Date()

    // Validate
    const errors = await validate(updatedTodo, { skipMissingProperties: true })
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    const savedTodo = await todoRepository.save(updatedTodo)
    return NextResponse.json(savedTodo)
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDbInitialized()
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      )
    }

    const todoRepository = (await import('@/lib/data-source')).default.getRepository(Todo)
    const todo = await todoRepository.findOne({ where: { id } })
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    await todoRepository.remove(todo)
    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
}