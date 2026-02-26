import { auth } from "@/auth"
import { TodoList } from "@/components/todo-list"
import { SignInButton } from "@/components/sign-in-button"
import { UserMenu } from "@/components/user-menu"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {session?.user ? (
        <div className="w-full max-w-lg space-y-4">
          <UserMenu user={session.user} />
          <TodoList />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  )
}
