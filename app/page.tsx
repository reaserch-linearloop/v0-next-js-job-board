import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getJobs } from "@/lib/data"
import { Search } from "lucide-react"
import Link from "next/link"

export default async function Home({
  searchParams,
}: {
  searchParams: { query?: string }
}) {
  const query = searchParams.query || ""
  const jobs = await getJobs(query)

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Find Your Dream Job</h1>
        <p className="mb-8 text-xl text-muted-foreground">Browse thousands of job listings from top companies</p>
        <form className="mx-auto flex max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search jobs..." name="query" defaultValue={query} className="pl-8" />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Job Listings</h2>
          <Link href="/jobs">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="mb-2 text-xl font-medium">No jobs found</h3>
            <p className="text-muted-foreground">Try adjusting your search or check back later for new listings</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
