import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import Link from "next/link"

interface RecentJobsProps {
  jobs: {
    id: string
    title: string
    company: string
    createdAt: Date
    applications?: number
  }[]
  userRole: "JOB_SEEKER" | "JOB_PROVIDER"
}

export function RecentJobs({ jobs, userRole }: RecentJobsProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <h3 className="mb-2 text-sm font-medium">No jobs found</h3>
        <p className="text-xs text-muted-foreground">
          {userRole === "JOB_PROVIDER"
            ? "Post your first job to get started"
            : "Browse jobs to find your next opportunity"}
        </p>
        {userRole === "JOB_PROVIDER" && (
          <Button className="mt-4" size="sm" asChild>
            <Link href="/dashboard/jobs/new">Post a Job</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-1">
            <Link href={`/jobs/${job.id}`} className="text-sm font-medium hover:underline">
              {job.title}
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{job.company}</span>
              <span>•</span>
              <span>Posted {formatDate(job.createdAt)}</span>
              {job.applications !== undefined && (
                <>
                  <span>•</span>
                  <span>{job.applications} applications</span>
                </>
              )}
            </div>
          </div>
          {userRole === "JOB_PROVIDER" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/jobs/${job.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  )
}
