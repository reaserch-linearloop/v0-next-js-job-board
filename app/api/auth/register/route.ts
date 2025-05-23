import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import * as z from "zod"

const userSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  role: z.enum(["JOB_SEEKER", "JOB_PROVIDER"], {
    required_error: "Please select a role",
  }),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = userSchema.parse(json)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await hash(body.password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role,
      },
    })

    // Remove the password from the response
    const { password, ...result } = user

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }

    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
