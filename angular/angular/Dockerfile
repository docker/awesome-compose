# syntax=docker/dockerfile:1.4

FROM --platform=$BUILDPLATFORM node:26-slim AS builder

RUN mkdir /project
WORKDIR /project

COPY .npmrc .
COPY .yarnrc.yml .
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]

FROM builder as dev-envs

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

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
