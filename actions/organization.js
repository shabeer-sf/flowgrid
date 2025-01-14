"use server";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug) {
  try {
    if (!slug) {
      throw new Error("Organization slug is required.");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: User not authenticated.");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error(
        `User not found in the database for clerkUserId: ${userId}`
      );
    }

    // Fetch Clerk organization details
    const response = await clerkClient();
    if (!response.organizations) {
      throw new Error("Failed to initialize Clerk organizations API.");
    }

    const organization = await response.organizations.getOrganization({ slug });
    if (!organization) {
      throw new Error(`No organization found with slug: "${slug}"`);
    }

    const organizationId = organization.id;
    const { data: membership } =
      await response.organizations.getOrganizationMembershipList({
        organizationId,
      });

    if (!membership || !Array.isArray(membership)) {
      throw new Error(
        `Failed to fetch organization membership list for organizationId: ${organizationId}`
      );
    }

    const userMembership = membership.find(
      (member) => member?.publicUserData?.userId === userId
    );

    if (!userMembership) {
      throw new Error(
        `User is not a member of the organization with slug: "${slug}".`
      );
    }

    return organization; // Successfully fetched organization
  } catch (error) {
    console.error("Error in getOrganization:", error.message, error.stack);
    throw new Error(
      `An error occurred while fetching the organization: ${error.message}`
    );
  }
}

export async function getOrganizationUsers(orgId) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  const response = await clerkClient();

  if (!user) {
    throw new Error("User not found");
  }
  const organizationMembership =
    await response.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });
  // console.log("ResponseResponse",response)
  const userIds = organizationMembership.data.map(
    (membership) => membership.publicUserData.userId
  );

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  return users;
}
