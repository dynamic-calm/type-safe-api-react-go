"use client";

import { useState, type ComponentProps } from "react";

import {
  JobType,
  type SubmitJobResponse,
  type JobStatusResponse,
} from "@/lib/api/job-queue";

import jobQueueClient from "@/lib/api/client";

export default function Home() {
  const [job, setJob] = useState<SubmitJobResponse | null>(null);
  const [statuses, setStatuses] = useState<JobStatusResponse[]>([]);

  async function handleSubmitJob() {
    if (job) {
      setJob(null);
      return;
    }

    const response = await jobQueueClient.SubmitJob({ type: JobType.encode });
    setJob(response);
  }

  function handleStreamJobStatus() {
    if (statuses.length > 0) {
      setStatuses([]);
      return;
    }

    const jobId = job?.jobId ?? "some-id";
    const observable = jobQueueClient.StreamJobStatus({ jobId });

    observable.subscribe((status) => {
      setStatuses((prev) => [...prev, status]);
    });
  }

  const latestProgress = statuses.at(-1)?.progress;

  return (
    <main className="flex h-full items-center justify-center">
      <div className="flex w-full max-w-80 flex-col gap-2">
        <Button onClick={handleSubmitJob}>
          ˙{job ? `Got job id: ${job.jobId}` : "Submit job"}
        </Button>
        <Button onClick={handleStreamJobStatus}>
          {statuses.length > 0 ? `${latestProgress}%` : "Stream Job Status"}
        </Button>
      </div>
    </main>
  );
}

function Button({ children, ...props }: ComponentProps<"button">) {
  return (
    <button
      className="w-full cursor-pointer border border-neutral-800 bg-neutral-900 px-5 py-1 text-neutral-400 uppercase transition-colors duration-150 hover:bg-neutral-800 hover:active:bg-neutral-900"
      {...props}
    >
      {children}
    </button>
  );
}
