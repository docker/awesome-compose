FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

COPY package.json ./

# Install dependecies
#RUN npm set progress=false \
#    && npm config set depth 0 \
#    && npm i install
COPY .npmrc .
COPY .yarnrc.yml .
RUN npm ci

RUN npm ci

EXPOSE 3000

CMD ["npm","start"]

