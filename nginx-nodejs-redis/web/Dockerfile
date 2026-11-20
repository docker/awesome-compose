FROM node:26-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY .npmrc .
COPY .yarnrc.yml .
RUN npm ci
COPY ./server.js ./

CMD ["npm","start"]
