FROM node:19-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 5000

COPY . .

CMD ["npm","start"]
