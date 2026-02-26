import { describe, it, expect, vi, beforeEach } from "vitest"

// Set DATABASE_URL so checkDb() doesn't short-circuit with 503
vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost/test")

// Mock the auth module
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}))

// Mock the db module
vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { GET, POST, DELETE } from "@/app/api/todos/route"

const mockedAuth = vi.mocked(auth)

describe("GET /api/todos", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue(null as any)

    const response = await GET()
    expect(response.status).toBe(401)
  })

  it("returns todos for authenticated user", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "user-1", name: "Test", email: "test@test.com" },
      expires: "",
    } as any)

    const mockTodos = [
      { id: "1", userId: "user-1", text: "Test todo", completed: false },
    ]

    const mockFrom = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue(mockTodos),
      }),
    })

    vi.mocked(db.select).mockReturnValue({ from: mockFrom } as any)

    const response = await GET()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data).toEqual(mockTodos)
  })
})

describe("POST /api/todos", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue(null as any)

    const request = new Request("http://localhost/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: "New todo" }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when text is missing", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "user-1", name: "Test", email: "test@test.com" },
      expires: "",
    } as any)

    const request = new Request("http://localhost/api/todos", {
      method: "POST",
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("creates a todo for authenticated user", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "user-1", name: "Test", email: "test@test.com" },
      expires: "",
    } as any)

    const newTodo = {
      id: "new-1",
      userId: "user-1",
      text: "New todo",
      completed: false,
    }

    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([newTodo]),
      }),
    } as any)

    const request = new Request("http://localhost/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: "New todo" }),
    })

    const response = await POST(request)
    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.text).toBe("New todo")
  })
})

describe("DELETE /api/todos", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue(null as any)

    const response = await DELETE()
    expect(response.status).toBe(401)
  })

  it("deletes all todos for authenticated user", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "user-1", name: "Test", email: "test@test.com" },
      expires: "",
    } as any)

    vi.mocked(db.delete).mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    } as any)

    const response = await DELETE()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.ok).toBe(true)
  })
})
