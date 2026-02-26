"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface UserMenuProps {
  user: {
    name?: string | null
    image?: string | null
  }
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <div className="flex items-center justify-between" data-testid="user-menu">
      <span className="text-sm text-muted-foreground">
        Signed in as <strong>{user.name}</strong>
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut()}
        data-testid="sign-out-btn"
      >
        Sign out
      </Button>
    </div>
  )
}
