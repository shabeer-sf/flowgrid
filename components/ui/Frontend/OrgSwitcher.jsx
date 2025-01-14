"use client";
import {
  OrganizationSwitcher,
  SignedIn,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";

const OrgSwitcher = () => {
  const pathname = usePathname();
  const { isLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  if (!isLoaded || !isUserLoaded) {
    return null;
  }
  return (
    <div>
      <SignedIn>
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements:{
                organizationSwitcherTrigger:"border border-gray-300 rounded-md px-5 py-2",
                organizationSwitcherTriggerIcon:"text-white"
            }
          }}
          afterCreateOrganizationUrl={"/organization/:slug"}
          afterSelectOrganizationUrl={"/organization/:slug"}
          createOrganizationMode={
            pathname === "/onboarding" ? "navigation" : "modal"
          }
        
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;
