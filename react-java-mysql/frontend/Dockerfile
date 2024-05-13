# syntax=docker/dockerfile:1.4

FROM --platform=$BUILDPLATFORM node:lts AS development

WORKDIR /code
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json

RUN npm ci
COPY . /code

ENV CI=true
ENV PORT=3000

CMD [ "npm", "start" ]

FROM development AS dev-envs
RUN apt update && \
    apt install -y git

RUN useradd -s /bin/bash -m vscode && \
groupadd docker && \
usermod -aG docker vscode
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD [ "npm", "start" ]

FROM development AS build

RUN ["npm", "run", "build"]

FROM nginx:1.13-alpine

COPY --from=build /code/build /usr/share/nginx/html
