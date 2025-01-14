"use client";
import { useOrganization } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { Button } from "../button";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/actions/project";
import useFetch from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteProject = ({ projectId }) => {
  const { membership } = useOrganization();
  const router = useRouter();
  const {
    data: deleted,
    loading: isDeleting,
    error,
    fn: deleteProjectFN,
  } = useFetch(deleteProject);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectFN(projectId);
    }
  };

  useEffect(() => {
    if (deleted?.success) {
      toast.error("Project deleted successfully");
      router.refresh();
    }
  }, [deleted]);
  const isAdmin = membership?.role === "org:admin";

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleDelete}
        disabled={isDeleting}
        variant="ghost"
        className={isDeleting ? "animate-pulse" : ""}
      >
        <Trash2 />
      </Button>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </>
  );
};

export default DeleteProject;
