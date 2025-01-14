"use client";
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organization";
import useFetch from "@/hooks/use-fetch";
import { issueSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { Button } from "../button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../drawer";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { toast } from "sonner";

const CreateIssue = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  const {
    data: newIssue,
    loading: createIssueLoading,
    error,
    fn: createIssueFN,
  } = useFetch(createIssue);
  const {
    data: users,
    loading: usersLoading,
    fn: fetchUsers,
  } = useFetch(getOrganizationUsers);

  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
      toast.success("Issue added successfully");
    }
  }, [newIssue, createIssueLoading]);

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId);
    }
  }, [orgId, isOpen]);

  console.log("status",status)
  const onSubmit = async (data) => {
    await createIssueFN(projectId, {
      ...data,
      status: status,
      sprintId: sprintId,
    });
  };
  return (
    <div>
      <Drawer open={isOpen} onClose={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create New Issue</DrawerTitle>
          </DrawerHeader>
          {usersLoading && (
            <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input {...register("title")} id="title" />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.title.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="assigneeId"
                className="block text-sm font-medium mb-1"
              >
                Assignee
              </label>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.length > 0 &&
                          users.map((user) => (
                            <SelectItem value={user.id} key={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.assigneeId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.assigneeId.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => {
                  return (
                    <MDEditor value={field.value} onChange={field.onChange} />
                  );
                }}
              />
            </div>
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium mb-1"
              >
                Priority
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
            <Button
              disabled={createIssueLoading}
              className="bg-blue-500 text-white"
              type="submit"
              size="lg"
            >
              {createIssueLoading ? "Creating..." : "Create Issue"}
            </Button>
            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CreateIssue;
