FROM node:14.17.3-alpine3.14

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY .npmrc .
COPY .yarnrc.yml .
RUN npm ci
COPY ./server.js ./

CMD ["npm","start"]
