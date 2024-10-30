import 'next-auth'
import 'next-auth/jwt'
import internal from 'stream'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    role: string
    accessToken: string
  }

  interface Session {
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    sub: string
    email: string
    accessToken: string
  }
}
