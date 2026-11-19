# syntax=docker/dockerfile:1.4

FROM node:lts-buster-slim AS development

# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
COPY .npmrc .
COPY .yarnrc.yml .
RUN npm ci

COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
