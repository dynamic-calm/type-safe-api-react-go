package main

import (
	"context"
	"net/http"
	"time"

	"github.com/dynamic-calm/type-safe-go-react/api"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
)

type jobQueueServer struct {
	api.JobQueueServer
}

const port = "8080"

func main() {
	grpcSrv := grpc.NewServer()
	jobQueueSrv := &jobQueueServer{}
	api.RegisterJobQueueServer(grpcSrv, jobQueueSrv)
	wrappedGrpc := grpcweb.WrapServer(
		grpcSrv,
		grpcweb.WithOriginFunc(func(origin string) bool {
			// Allow all origins, DO NOT do this in production
			return true
		}),
	)
	println("Listening on port: " + port)
	http.ListenAndServe(":"+port, wrappedGrpc)
}

func (jqs *jobQueueServer) SubmitJob(
	ctx context.Context,
	request *api.SubmitJobRequest,
) (*api.SubmitJobResponse, error) {
	time.Sleep(2 * time.Second)
	return &api.SubmitJobResponse{JobId: "id-1", Type: request.Type}, nil
}

func (jqs *jobQueueServer) StreamJobStatus(
	req *api.JobStatusRequest,
	streamer grpc.ServerStreamingServer[api.JobStatusResponse],
) error {
	status := "running"
	for i := range 10 {
		if i == 9 {
			status = "completed"
		}

		time.Sleep(500 * time.Millisecond)
		streamer.Send(&api.JobStatusResponse{
			JobId:    req.JobId,
			Status:   status,
			Progress: int32(i+1) * 10,
		})
	}
	return nil
}
