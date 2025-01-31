"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createIssue(projectId, data) {
    console.log("data",data)
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;
  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId || null,
      projectId: projectId,
      sprintId: data.sprintId,
      reporterId: user.id,
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });
  return issue;
}
