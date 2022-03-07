
import os
import socket

from flask import Flask
from redis import Redis


app = Flask(__name__)
redis = Redis(host=os.environ.get('REDIS_HOST', 'redis'), port=6379)


@app.route('/')
def hello():
    redis.incr('hits')
    return 'Hi Docker! You have seen %s times and your system is %s.\n' % (redis.get('hits'),socket.gethostname())
