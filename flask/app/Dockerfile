FROM python:3.7-alpine 
WORKDIR /app 
COPY . /app 
RUN pip3 install -r requirements.txt 
ENTRYPOINT ["python3"] 
CMD ["app.py"]