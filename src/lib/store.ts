export interface Todo {
  id: string
  text: string
  completed: boolean
}

const STORAGE_KEY = "todos"

function loadFromStorage(): Todo[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveToStorage(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

async function tryApi<T>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getTodos(): Promise<Todo[]> {
  const apiTodos = await tryApi<Todo[]>("/api/todos")
  if (apiTodos) return apiTodos
  return loadFromStorage()
}

export async function addTodo(text: string): Promise<Todo> {
  const apiTodo = await tryApi<Todo>("/api/todos", {
    method: "POST",
    body: JSON.stringify({ text }),
  })
  if (apiTodo) return apiTodo

  const todo: Todo = { id: crypto.randomUUID(), text, completed: false }
  const todos = loadFromStorage()
  todos.push(todo)
  saveToStorage(todos)
  return todo
}

export async function toggleTodo(id: string, completed: boolean): Promise<void> {
  const apiResult = await tryApi("/api/todos/" + id, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  })
  if (apiResult) return

  const todos = loadFromStorage()
  const todo = todos.find((t) => t.id === id)
  if (todo) {
    todo.completed = completed
    saveToStorage(todos)
  }
}

export async function deleteTodo(id: string): Promise<void> {
  const apiResult = await tryApi("/api/todos/" + id, {
    method: "DELETE",
  })
  if (apiResult) return

  const todos = loadFromStorage().filter((t) => t.id !== id)
  saveToStorage(todos)
}
