'use client'

import { Todo } from '@/lib/entities/Todo'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onUpdate: (id: number, updates: Partial<Todo>) => void
  onDelete: (id: number) => void
}

export default function TodoList({ todos, onUpdate, onDelete }: TodoListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
          formatDate={formatDate}
        />
      ))}
    </div>
  )
}