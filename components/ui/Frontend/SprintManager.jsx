"use client";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { Badge } from "../badge";
import useFetch from "@/hooks/use-fetch";
import { updateSprintstatus } from "@/actions/sprints";
import { BarLoader } from "react-spinners";

const SprintManager = ({ sprint, setSprint, sprints, projectId }) => {
  const [status, setStatus] = useState(sprint.status);
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

  const canEnd = status === "ACTIVE";

  const {
    data: updatedStatus,
    loading,
    error,
    fn: updateStatus,
  } = useFetch(updateSprintstatus);

  useEffect(() => {
    if (updatedStatus && updatedStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint,
      });
    }
  }, [updatedStatus,loading]);

  const handleSprintChange = (value) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
  };

  const getStatusText = () => {
    if (status === "COMPLETED") {
      return "Sprint Ended";
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  const handleStatusChange = (newStatus) => {
    updateStatus(sprint.id, newStatus);
  };

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-900 self-start max-md:max-w-[60vw]">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((spr) => {
              return (
                <SelectItem value={spr.id} key={spr.id}>
                  {spr.name} ({format(spr.startDate, "MMM d, yyyy")}) to (
                  {format(spr.endDate, "MMM d, yyyy")})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {canStart && (
          <Button
            disabled={loading}
            onClick={() => handleStatusChange("ACTIVE")}
            className="bg-green-900 text-white"
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            disabled={loading}
            onClick={() => handleStatusChange("COMPLETED")}
            variant={"destructive"}
          >
            End Sprint
          </Button>
        )}
      </div>
      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7"  />}
      {getStatusText() && (
        <Badge className={"mt-3 ml-1 self-start"}>{getStatusText()}</Badge>
      )}
    </>
  );
};

export default SprintManager;
