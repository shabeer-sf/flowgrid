"use client";
import React, { useState } from "react";
import { Button } from "../button";
import { zodResolver } from "@hookform/resolvers/zod";
import { sprintSchema } from "@/lib/validators";
import { Controller, useForm } from "react-hook-form";
import { addDays, format } from "date-fns";
import { Card, CardContent } from "../card";
import { Input } from "../input";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar1Icon, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { createSprint } from "@/actions/sprints";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SprintCreationForm = ({
  projectTitle,
  projectId,
  projectKey,
  sprintKey,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });
  const {
    data: project,
    loading: createSprintLoading,
    error,
    fn: createSprintFN,
  } = useFetch(createSprint);
  const onSubmit = async (data) => {
    await createSprintFN(projectId, {
      ...data,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });
    setShowForm(false);
    toast.success("Sprint created successfully");
    router.refresh();
  };
  return (
    <>
      <div className="flex justify-between">
        <h1 className="gradient-title text-5xl mb-8 font-bold">
          {projectTitle}
        </h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "destructive" : "default"}
          className="mt-2"
        >
          {showForm ? "Cancel" : " Create New Sprint"}{" "}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:flex-row gap-4 md:items-end"
            >
              <div className="flex-1">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="name"
                >
                  Sprint Name
                </label>
                <Input
                  {...register("name")}
                  id="name"
                  readOnly
                  className="bg-slate-900"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>
                <Controller
                  control={control}
                  name="dateRange"
                  render={({ field }) => {
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className={cn(
                              "w-full justify-start text-left font-normal bg-slate-950 ",
                              !dateRange && "text-muted-foreground"
                            )}
                            variant="outline"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from && dateRange.to ? (
                              format(dateRange.from, "LLL dd, y") +
                              " - " +
                              format(dateRange.to, "LLL dd, y")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto bg-slate-900"
                          align="start"
                        >
                          <DayPicker
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) => {
                              if (range?.from && range?.to) {
                                setDateRange(range);
                                field.onChange(range);
                              }
                            }}
                            classNames={{
                              chevron: "fill-blue-500",
                              range_start: "bg-blue-700",
                              range_end: "bg-blue-700",
                              range_middle: "bg-blue-400",
                              day_button: "border-none",
                              today: "border-2 border-blue-700",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>
              <Button
                disabled={createSprintLoading}
                className="bg-blue-500 text-white"
                type="submit"
                size="lg"
              >
                {createSprintLoading ? "Creating..." : "Create Sprint"}{" "}
              </Button>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SprintCreationForm;
