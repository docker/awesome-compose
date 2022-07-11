# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

ENV NPM_CONFIG_CACHE /npm-cache

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/npm-cache \
    npm ci

COPY ./server.js ./

CMD ["npm", "start"]

FROM builder as dev-envs

RUN <<EOF
apk update
apk add git
EOF

RUN <<EOF
addgroup -S docker
adduser -S --shell /bin/bash --ingroup docker vscode
EOF

# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /

CMD ["npm", "start"]
