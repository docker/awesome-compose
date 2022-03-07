FROM python

COPY . /

RUN pip install -r requirements.txt && pip install gunicorn
RUN /usr/local/bin/python -m pip install --upgrade pip
ENTRYPOINT ["/start.sh"]
