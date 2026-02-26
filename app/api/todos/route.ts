import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { todos } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

function checkDb() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    )
  }
  return null
}

export async function GET() {
  const dbError = checkDb()
  if (dbError) return dbError

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userTodos = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, session.user.id))
    .orderBy(todos.createdAt)

  return NextResponse.json(userTodos)
}

export async function POST(request: Request) {
  const dbError = checkDb()
  if (dbError) return dbError

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  if (!body.text || typeof body.text !== "string") {
    return NextResponse.json({ error: "Text is required" }, { status: 400 })
  }

  const [todo] = await db
    .insert(todos)
    .values({
      userId: session.user.id,
      text: body.text,
    })
    .returning()

  return NextResponse.json(todo, { status: 201 })
}

export async function DELETE() {
  const dbError = checkDb()
  if (dbError) return dbError

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await db.delete(todos).where(eq(todos.userId, session.user.id))

  return NextResponse.json({ ok: true })
}
