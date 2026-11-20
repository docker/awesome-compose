# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM node:26-alpine AS development

RUN mkdir /project
WORKDIR /project

COPY .npmrc .
COPY .yarnrc.yml .
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
CMD ["npm", "run", "dev"]

FROM development as dev-envs
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
CMD ["npm", "run", "dev"]

