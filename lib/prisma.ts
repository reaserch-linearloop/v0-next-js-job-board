import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const client = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
})

export const prisma = global.prisma || client

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}
