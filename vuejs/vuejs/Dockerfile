FROM node:14.18.2-alpine

RUN mkdir /project
WORKDIR /project

COPY . .

RUN yarn global add @vue/cli
RUN yarn install
ENV HOST=0.0.0.0
CMD ["yarn", "run", "serve"]
