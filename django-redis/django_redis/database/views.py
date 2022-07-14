from django.conf import settings
from django.http import HttpResponse
from redis import Redis

def get_database_connection(host: str, port: str) -> Redis:
    """Returns Redis client"""

    return Redis(host=host, port=int(port))


def visit_counter(request) -> HttpResponse:
    """Connect to redis and increase the visits count for each visit"""

    redis = get_database_connection(settings.HOST, settings.PORT)
    redis.incr('views')
    count = str(redis.get('views'), 'utf-8')
    return HttpResponse("This page has been visited {0} times".format(count))
