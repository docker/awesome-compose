FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
COPY .npmrc .
COPY .yarnrc.yml .
RUN npm ci

COPY . /usr/src/app

COPY . .

RUN npm ci

EXPOSE 3000

CMD ["npm", "start"]