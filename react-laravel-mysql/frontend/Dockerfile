
FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install

# Install serve package
RUN npm i -g serve

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]