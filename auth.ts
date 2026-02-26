import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: process.env.DATABASE_URL ? DrizzleAdapter(db) : undefined,
  providers: [GitHub],
  session: {
    strategy: process.env.DATABASE_URL ? "database" : "jwt",
  },
  callbacks: {
    session({ session, user, token }) {
      if (user) {
        session.user.id = user.id
      } else if (token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
