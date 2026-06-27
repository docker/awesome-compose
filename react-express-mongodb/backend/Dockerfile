FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

COPY package.json ./

COPY . .

RUN npm ci

EXPOSE 3000

CMD ["npm", "start"]