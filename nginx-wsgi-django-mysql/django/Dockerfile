FROM python:3.9-alpine

COPY /sample/ /home/sample/
WORKDIR /home/sample/

RUN apk update && \
	apk add --no-cache bash gcc musl-dev mariadb-connector-c-dev

RUN pip install --upgrade pip && \
	pip install -r requirements.txt

EXPOSE 8000

CMD ["gunicorn","-w","2", \
	"--bind","0.0.0.0:8000", \ 
	"sample.wsgi:application"]