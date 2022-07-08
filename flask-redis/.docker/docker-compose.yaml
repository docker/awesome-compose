services:
  redis:
    image: redislabs/redismod
    ports:
      - '6379:6379'
  web:
    build:
      context: .
      target: dev-envs
    stop_signal: SIGINT
    ports:
      - '8000:8000'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    depends_on:
      - redis
