"use client";
import React, { useState } from "react";
import SprintManager from "./SprintManager";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import statuses from "@/data/status";
import { Button } from "../button";
import { Plus } from "lucide-react";
import CreateIssue from "./CreateIssue";

const SprintBoard = ({ sprints, projectId, orgId }) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status == "ACTIVE") || sprints[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const handleIssueCreated = () => {};
  const onDragEnd = () => {};
  const handleAddIssue = (status) => {
    console.log("statuses",status)
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };
  return (
    <div className="">
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-4 mt-4 bg-slate-900 p-4">
          {statuses?.map((column) => {
            return (
              <Droppable key={column.key} droppableId={column.key}>
                {(provided) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      <h3 className="font-semibold  mb-2 text-center">
                        {column.name}
                      </h3>
                      {provided.placeholder}
                      {column.key == "TODO" &&
                        currentSprint.status !== "COMPLETED" && (
                          <Button
                            onClick={()=>handleAddIssue(column.key)}
                            variant="ghost"
                            className="w-full"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Create Issue
                          </Button>
                        )}
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
      {
        <CreateIssue
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          sprintId={currentSprint.id}
          status={selectedStatus}
          projectId={projectId}
          onIssueCreated={handleIssueCreated}
          orgId={orgId}
        />
      }
    </div>
  );
};

export default SprintBoard;
