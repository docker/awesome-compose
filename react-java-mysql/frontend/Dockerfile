FROM node:10

RUN mkdir /project
WORKDIR /project

COPY . .

RUN yarn install
CMD ["yarn", "run", "start"]
