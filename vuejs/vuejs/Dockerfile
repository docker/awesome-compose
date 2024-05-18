# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM node:14.4.0-alpine AS development

RUN mkdir /project
WORKDIR /project

COPY . .

RUN yarn global add @vue/cli
RUN yarn install
ENV HOST=0.0.0.0
CMD ["yarn", "run", "serve"]

FROM development as dev-envs
RUN apt update && \
apt add git

RUN addgroup -S docker && \
adduser -S --shell /bin/bash --ingroup docker vscode
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD ["yarn", "run", "serve"]

