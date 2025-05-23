import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Building2, MapPin } from "lucide-react"
import Link from "next/link"

interface JobCardProps {
  job: {
    id: string
    title: string
    company: string
    location: string
    type: string
    salary: string
    description: string
    createdAt: Date
  }
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold leading-tight">
            <Link href={`/jobs/${job.id}`} className="hover:underline">
              {job.title}
            </Link>
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
          </div>
        </div>
        <Badge variant="outline">{job.type}</Badge>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">{job.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <p className="text-sm font-medium">{job.salary}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Posted {formatDate(job.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
