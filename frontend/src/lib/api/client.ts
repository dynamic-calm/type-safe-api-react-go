import { GrpcWebImpl, JobQueueClientImpl } from "@/lib/api/job-queue";

const grpc = new GrpcWebImpl("http://localhost:8080", { debug: true });
const jobQueueClient = new JobQueueClientImpl(grpc);

export default jobQueueClient;
