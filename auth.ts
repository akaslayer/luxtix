import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXT_PUBLIC_SECRET,
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Invalid email or password");
          }

          const data = await response.json();

          const useCookies = cookies();
          useCookies.set("Sid", data.accessToken);
          return {
            id: data.id,
            email: data.email,
            sub: data.email,
            role: data.role,
            accessToken: data.accessToken,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.email) session.user.email = token.email;
      if (token.role) session.user.role = token.role;
      if (token.accessToken) session.user.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if (user && user.email) {
          token.sub = user.email;
          token.email = user.email;
        }
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
  },

  session: { strategy: "jwt", maxAge: 60 * 60 * 1 },
  pages: {
    signIn: "/sign-in",
  },
  jwt: {
    maxAge: 60 * 60 * 1,
  },
  cookies: {
    sessionToken: {
      name: `session-jwt`,
      options: {
        httpOnly: true,
        sameSite: "lax",
      },
    },
  },
});
