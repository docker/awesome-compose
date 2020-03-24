FROM node:13.10.1-alpine

RUN mkdir /project
WORKDIR /project

COPY . .

RUN npm install -g @vue/cli
RUN yarn install
ENV HOST=0.0.0.0
CMD ["yarn", "run", "serve"]
