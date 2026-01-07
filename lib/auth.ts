import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 간단한 비밀번호 인증 (환경 변수에서 관리)
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@example.com",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/api/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

