'use client'

import { Todo } from '@/lib/entities/Todo'
import { useState } from 'react'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: number, updates: Partial<Todo>) => void
  onDelete: (id: number) => void
  formatDate: (date: Date) => string
}

export default function TodoItem({ todo, onUpdate, onDelete, formatDate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = async () => {
    if (!editTitle.trim()) {
      alert('Title is required')
      return
    }
    setIsUpdating(true)
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      })
      setIsEditing(false)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleToggleComplete = async () => {
    setIsUpdating(true)
    try {
      await onUpdate(todo.id, { completed: !todo.completed })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return
    setIsDeleting(true)
    try {
      await onDelete(todo.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={`bg-white border rounded-lg p-4 ${todo.completed ? 'opacity-75' : ''}`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            maxLength={255}
            disabled={isUpdating}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            maxLength={1000}
            disabled={isUpdating}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsEditing(false)
                setEditTitle(todo.title)
                setEditDescription(todo.description || '')
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating || !editTitle.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={handleToggleComplete}
                disabled={isUpdating}
                className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="text-gray-600 mt-1">{todo.description}</p>
                )}
                <div className="text-sm text-gray-500 mt-2">
                  <span>Created: {formatDate(todo.createdAt)}</span>
                  {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                    <span className="ml-4">Updated: {formatDate(todo.updatedAt)}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isUpdating || isDeleting}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Status: <span className={`font-medium ${todo.completed ? 'text-green-600' : 'text-blue-600'}`}>
              {todo.completed ? 'Completed' : 'Active'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}