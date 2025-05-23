import { prisma } from "@/lib/prisma"

export async function getJobs(query = "") {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { company: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    })

    return jobs
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return []
  }
}

export async function getJobById(id: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return job
  } catch (error) {
    console.error("Error fetching job:", error)
    return null
  }
}

export async function getUserDashboardData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error("User not found")
    }

    let stats = {}
    let recentJobs = []

    if (user.role === "JOB_PROVIDER") {
      // Get stats for job provider
      const totalJobs = await prisma.job.count({
        where: { userId },
      })

      const activeJobs = await prisma.job.count({
        where: { userId, status: "ACTIVE" },
      })

      const totalApplications = await prisma.application.count({
        where: {
          job: {
            userId,
          },
        },
      })

      const newApplications = await prisma.application.count({
        where: {
          job: {
            userId,
          },
          status: "PENDING",
        },
      })

      stats = {
        totalJobs,
        activeJobs,
        totalApplications,
        newApplications,
      }

      // Get recent jobs for job provider
      recentJobs = await prisma.job.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          _count: {
            select: { applications: true },
          },
        },
      })

      recentJobs = recentJobs.map((job) => ({
        ...job,
        applications: job._count.applications,
      }))
    } else {
      // Get stats for job seeker
      const activeApplications = await prisma.application.count({
        where: {
          userId,
          status: { in: ["PENDING", "REVIEWING"] },
        },
      })

      const interviews = await prisma.application.count({
        where: {
          userId,
          status: "INTERVIEW",
        },
      })

      stats = {
        activeApplications,
        interviews,
      }

      // Get recent jobs for job seeker (recommended jobs)
      recentJobs = await prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    }

    return {
      user,
      stats,
      recentJobs,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return {
      user: { role: "JOB_SEEKER" },
      stats: {},
      recentJobs: [],
    }
  }
}
