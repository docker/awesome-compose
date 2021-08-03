FROM python:alpine3.14
RUN addgroup django && adduser -D -h /home/django -s /bin/ash django -G django
WORKDIR /home/django
USER django
COPY requirements.txt /home/django
RUN pip3 install -r requirements.txt --no-cache-dir
COPY . /home/django
EXPOSE 8000
ENTRYPOINT ["python3"] 
CMD ["manage.py", "runserver", "0.0.0.0:8000"]