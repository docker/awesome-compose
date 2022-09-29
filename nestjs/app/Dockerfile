# syntax=docker/dockerfile:1.4

FROM node:18.10 AS builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:18.10 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
ENV PORT=${PORT}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=builder /app/dist ./dist

HEALTHCHECK --start-period=5s --interval=5m --timeout=2s \
  CMD curl -f http://localhost/${PORT} || exit 1

CMD ["npm", "run", "start:prod"]