FROM node:22.23.5-alpine3.24

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY .npmrc .
COPY .yarnrc.yml .
RUN npm ci
COPY ./server.js ./

CMD ["npm","start"]
