FROM node:22-alpine

WORKDIR /app

COPY package-lock.json ./

COPY package.json ./

COPY . .

RUN npm ci

EXPOSE 3000

CMD ["npm","start" ]

