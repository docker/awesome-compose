FROM node:bookworm-slim AS runtime
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD npm run dev
