FROM python:3.6-alpine3.7
EXPOSE 5000
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/
ENV FLASK_APP hello.py
CMD flask run --host=0.0.0.0
