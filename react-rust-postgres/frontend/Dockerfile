FROM node:lts AS development

ENV CI=true
ENV PORT=3000

WORKDIR /code
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
RUN npm ci
COPY . /code

CMD [ "npm", "start" ]

FROM development AS builder

RUN npm run build

FROM nginx:1.13-alpine

COPY --from=builder /code/build /usr/share/nginx/html
