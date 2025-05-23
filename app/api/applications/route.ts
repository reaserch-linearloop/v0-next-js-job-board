import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { applicationSchema } from "@/lib/validations/application"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get("jobId")

  try {
    let applications

    if (session.user.role === "JOB_PROVIDER") {
      // Job providers can see applications for their jobs
      applications = await prisma.application.findMany({
        where: jobId
          ? {
              job: {
                id: jobId,
                userId: session.user.id,
              },
            }
          : {
              job: {
                userId: session.user.id,
              },
            },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              company: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      // Job seekers can only see their own applications
      applications = await prisma.application.findMany({
        where: {
          userId: session.user.id,
          ...(jobId ? { jobId } : {}),
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "JOB_SEEKER") {
    return NextResponse.json({ error: "Only job seekers can apply for jobs" }, { status: 403 })
  }

  try {
    const json = await request.json()
    const validatedData = applicationSchema.parse(json)

    // Check if user has already applied for this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        jobId: validatedData.jobId,
      },
    })

    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied for this job" }, { status: 400 })
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: validatedData.jobId },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const application = await prisma.application.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        status: "PENDING",
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid application data", details: error.errors }, { status: 400 })
    }

    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}
