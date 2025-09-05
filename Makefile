.PHONY: compile

compile:
	protoc job-queue.proto \
		--go_out=./backend/api \
		--go-grpc_out=./backend/api \
		--go_opt=paths=source_relative \
		--go-grpc_opt=paths=source_relative \
		--plugin=./frontend/node_modules/.bin/protoc-gen-ts_proto \
		--ts_proto_out=./frontend/src/lib/api \
		--ts_proto_opt=esModuleInterop=true,importSuffix=.js,outputClientImpl=grpc-web