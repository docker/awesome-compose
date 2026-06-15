# syntax=docker/dockerfile:1.4

FROM --platform=$BUILDPLATFORM golang:1.18 AS build

WORKDIR /compose/hello-docker
COPY main.go main.go
RUN CGO_ENABLED=0 go build -o backend main.go

FROM build as dev-envs

RUN apt update && \
apt install -y --no-install-recommends git

RUN useradd -s /bin/bash -m vscode && \
groupadd docker && \
usermod -aG docker vscode

# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD ["go", "run", "main.go"]

FROM scratch
COPY --from=build /compose/hello-docker/backend /usr/local/bin/backend
CMD ["/usr/local/bin/backend"]


