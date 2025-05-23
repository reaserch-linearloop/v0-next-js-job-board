import * as z from "zod"

export const jobSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
  type: z.string({
    required_error: "Please select a job type",
  }),
  category: z.string({
    required_error: "Please select a job category",
  }),
  experience: z.string({
    required_error: "Please select an experience level",
  }),
  salary: z.string().min(1, {
    message: "Salary is required",
  }),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters",
  }),
  requirements: z.array(z.string()),
  responsibilities: z.array(z.string()),
  status: z.enum(["DRAFT", "ACTIVE", "CLOSED"]).default("ACTIVE").optional(),
})
