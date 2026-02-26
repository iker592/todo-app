import { Elysia, t } from "elysia"
import { cors } from "@elysiajs/cors"

interface Todo {
  id: string
  text: string
  completed: boolean
}

const todos: Todo[] = []

const app = new Elysia()
  .use(cors())
  .group("/api", (app) =>
    app
      .get("/todos", () => todos)
      .post(
        "/todos",
        ({ body }) => {
          const todo: Todo = {
            id: crypto.randomUUID(),
            text: body.text,
            completed: false,
          }
          todos.push(todo)
          return todo
        },
        { body: t.Object({ text: t.String() }) }
      )
      .patch(
        "/todos/:id",
        ({ params, body }) => {
          const todo = todos.find((t) => t.id === params.id)
          if (!todo) return new Response("Not found", { status: 404 })
          if (body.text !== undefined) todo.text = body.text
          if (body.completed !== undefined) todo.completed = body.completed
          return todo
        },
        {
          body: t.Object({
            text: t.Optional(t.String()),
            completed: t.Optional(t.Boolean()),
          }),
        }
      )
      .delete("/todos", () => {
        todos.length = 0
        return { ok: true }
      })
      .delete("/todos/:id", ({ params }) => {
        const index = todos.findIndex((t) => t.id === params.id)
        if (index === -1) return new Response("Not found", { status: 404 })
        todos.splice(index, 1)
        return { ok: true }
      })
  )
  .listen(3001)

console.log(`Elysia server running at http://localhost:3001`)

export type App = typeof app
