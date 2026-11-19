FROM node:20-slim

WORKDIR /usr/src/app

# Install dependencies first to leverage Docker layer caching
COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
