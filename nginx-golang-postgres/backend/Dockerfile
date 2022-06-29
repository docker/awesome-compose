# syntax=docker/dockerfile:1.4

FROM --platform=$BUILDPLATFORM golang:1.18 AS build
WORKDIR /go/src/github.com/org/repo
COPY go.* .
COPY . .

ENV CGO_ENABLED=0
RUN go build -o server .

FROM build as dev-envs

RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD ["go", "run", "main.go"]

FROM alpine:3.12
EXPOSE 8000
COPY --from=build /go/src/github.com/org/repo/server /server
CMD ["/server"]
