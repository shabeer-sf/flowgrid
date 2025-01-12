import { getOrganization } from "@/actions/organization";
import React from "react";

const Organizations = async ({ params }) => {
  const { orgId } = await params;

  const organization = await getOrganization(orgId);

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1>{organization.name}&apos;s Project</h1>
        </div>

        {/* org switcher */}
        <div className="mb-4">Show org projects</div>
        <div className="mt-8">Show user assigned and reported issues here</div>
    </div>
  );
};

export default Organizations;
