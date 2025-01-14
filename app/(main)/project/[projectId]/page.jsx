import { getProject } from "@/actions/project";
import SprintBoard from "@/components/ui/Frontend/SprintBoard";
import SprintCreationForm from "@/components/ui/Frontend/SprintCreationForm";
import { notFound } from "next/navigation";
import React from "react";

const Projects = async ({ params }) => {
  const { projectId } = await params;

  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }
  // console.log(project.sprints)

  return (
    <div className="container mx-auto">
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project?.sprints?.length + 1}
      />
      {project.sprints.length > 0 ? <SprintBoard sprints={project.sprints} projectId={projectId} orgId={project.organizationId} /> : <div>Create Project</div>}
    </div>
  );
};

export default Projects;
