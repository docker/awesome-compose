FROM python:3.9.11-alpine3.14
WORKDIR /code
COPY . /code
RUN apk add --update alpine-sdk
RUN pip install -r requirements.txt --no-cache-dir
