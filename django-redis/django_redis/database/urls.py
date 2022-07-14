from django.urls import path

from database.views import visit_counter


urlpatterns = [
    path('hello-redis/', visit_counter),
]
