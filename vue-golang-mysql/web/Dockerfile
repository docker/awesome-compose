FROM node:16
WORKDIR /web
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
ARG VITE_API_BASE_URL
RUN echo VITE_API_BASE_URL=${VITE_API_BASE_URL} > .env
RUN pnpm build
RUN npm install --global serve
EXPOSE 3000
CMD [ "serve", "-n", "-s", "dist" ]