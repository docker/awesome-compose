FROM golang:1.13 AS build

WORKDIR /compose/hello-docker
COPY main.go main.go
RUN CGO_ENABLED=0 go build -o backend main.go

FROM scratch
COPY --from=build /compose/hello-docker/backend /usr/local/bin/backend
CMD ["/usr/local/bin/backend"]


