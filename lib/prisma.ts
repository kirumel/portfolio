import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 환경 변수 확인
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
  );
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

