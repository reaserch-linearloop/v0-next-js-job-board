import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentJobs } from "@/components/dashboard/recent-jobs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserDashboardData } from "@/lib/data"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const { user, stats, recentJobs } = await getUserDashboardData(session.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
        </div>
        {user.role === "JOB_PROVIDER" && (
          <Link href="/dashboard/jobs/new">
            <Button>Post a New Job</Button>
          </Link>
        )}
      </div>

      <DashboardStats stats={stats} userRole={user.role} />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{user.role === "JOB_PROVIDER" ? "Your Posted Jobs" : "Recent Jobs"}</CardTitle>
            <CardDescription>
              {user.role === "JOB_PROVIDER"
                ? "Manage your job listings"
                : "Latest job opportunities that match your profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentJobs jobs={recentJobs} userRole={user.role} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{user.role === "JOB_PROVIDER" ? "Applicant Stats" : "Your Applications"}</CardTitle>
            <CardDescription>
              {user.role === "JOB_PROVIDER" ? "Overview of applications to your jobs" : "Track your job applications"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.role === "JOB_PROVIDER" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Applications</span>
                  <span className="font-medium">{stats.totalApplications}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>New Applications</span>
                  <span className="font-medium">{stats.newApplications}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Active Applications</span>
                  <span className="font-medium">{stats.activeApplications}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Interviews Scheduled</span>
                  <span className="font-medium">{stats.interviews}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
