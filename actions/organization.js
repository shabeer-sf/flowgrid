"use server";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug) {
    // console.log("slugslug:",slug)
    const { userId} = await auth();
    // console.log("userId::",userId)

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }
  // console.log("useruser::",user)
  const response = await clerkClient()


  const organization = await response.organizations.getOrganization({ slug }) 
 
  if (!organization) {
    return null;
  }
  // console.log("onetestonetest",(getOrganizationList))
  const organizationId = organization.id
  const { data: membership } = await response.organizations.getOrganizationMembershipList({ organizationId })
 
// console.log("datadata:",membership)
  const userMembership = membership.find(
    (member) => member?.publicUserData.userId === userId
  );
  if (!userMembership) {
    return null;
  }
  return organization;
// return "hello"
}
