import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getJobById } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { Building2, Calendar, Globe, MapPin } from "lucide-react"
import { notFound } from "next/navigation"
import ApplyButton from "@/components/apply-button"

export default async function JobPage({
  params,
}: {
  params: { id: string }
}) {
  const job = await getJobById(params.id)

  if (!job) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {job.company}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {job.type}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Posted {formatDate(job.createdAt)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none dark:prose-invert">
                <h2>Job Description</h2>
                <p>{job.description}</p>

                <h2>Requirements</h2>
                <ul>
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>

                <h2>Responsibilities</h2>
                <ul>
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Apply for this position</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p>Ready to apply for this exciting opportunity? Click the button below to submit your application.</p>
              <ApplyButton jobId={job.id} />
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Job Overview</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Salary Range</div>
                  <div>{job.salary}</div>
                  <div className="text-muted-foreground">Experience</div>
                  <div>{job.experience}</div>
                  <div className="text-muted-foreground">Category</div>
                  <div>{job.category}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
