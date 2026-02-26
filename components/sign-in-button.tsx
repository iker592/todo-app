"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SignInButton() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Todo App</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          onClick={() => signIn("github")}
          data-testid="sign-in-btn"
        >
          Sign in with GitHub
        </Button>
      </CardContent>
    </Card>
  )
}
