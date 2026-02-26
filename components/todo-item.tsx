"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 py-2" data-testid="todo-item">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={(checked) => onToggle(todo.id, checked === true)}
        data-testid="todo-checkbox"
      />
      <span
        className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}
        data-testid="todo-text"
      >
        {todo.text}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(todo.id)}
        data-testid="delete-btn"
      >
        ✕
      </Button>
    </div>
  )
}
