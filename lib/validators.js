import { optional, z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less."),
  description: z
    .string()
    .max(500, "Project description must be 500 characters or less."),
  key: z
    .string()
    .min(2, "Project key must be atleast 2 characters.")
    .max(10, "Project name must be 10 characters or less."),
});
export const sprintSchema = z.object({
  name: z
    .string()
    .min(1, "Sprint name is required")
    .max(100, "Project name must be 100 characters or less."),
  startDate: z.date(),
  endDate: z.date(),
});

export const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  assigneeId: z.string().cuid("Please select assignee"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENt"]),
});
