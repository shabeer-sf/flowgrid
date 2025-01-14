import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/ui/Frontend/OrgSwitcher";
import ProjectsList from "@/components/ui/Frontend/ProjectsList";
import React from "react";

const Organizations = async ({ params }) => {
  try {
    if (!params || !params.orgId) {
      throw new Error("Organization ID (orgId) is required in params.");
    }

    const { orgId } = await params;

    const organization = await getOrganization(orgId);

    if (!organization) {
      console.error(`Organization not found for orgId: ${orgId}`);
      return (
        <div className="flex flex-col gap-2 items-center">
          <span className="text-2xl gradient-title-red">
            Organization not found
          </span>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-3">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
          <h1 className="text-5xl font-bold grafient-title pb-2">
            {organization.name}&apos;s Project
          </h1>
          <OrgSwitcher />
        </div>

        {/* Placeholder content */}
        <div className="mb-4">
          <ProjectsList orgId={organization.id} />
        </div>
        <div className="mt-8">Show user-assigned and reported issues here</div>
      </div>
    );
  } catch (error) {
    console.error(
      "Error in Organizations component:",
      error.message,
      error.stack
    );

    // Render a fallback UI for errors
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title-red">
          Failed to load organization data. Please try again later..
        </span>
      </div>
    );
  }
};

export default Organizations;
