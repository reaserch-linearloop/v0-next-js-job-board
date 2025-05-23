import * as z from "zod"

export const applicationSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().min(50, { message: "Cover letter must be at least 50 characters" }),
  resumeUrl: z.string().url({ message: "Please enter a valid URL" }),
})
