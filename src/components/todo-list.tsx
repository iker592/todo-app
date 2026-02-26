import { useEffect, useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddTodo } from "@/components/add-todo"
import { TodoItem } from "@/components/todo-item"
import {
  type Todo,
  getTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
} from "@/lib/store"

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  const refresh = useCallback(async () => {
    setTodos(await getTodos())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleAdd = async (text: string) => {
    await addTodo(text)
    await refresh()
  }

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTodo(id, completed)
    await refresh()
  }

  const handleDelete = async (id: string) => {
    await deleteTodo(id)
    await refresh()
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Todo List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AddTodo onAdd={handleAdd} />
        <div className="divide-y">
          {todos.length === 0 && (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state">
              No todos yet. Add one above!
            </p>
          )}
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
