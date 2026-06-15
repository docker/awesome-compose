# syntax=docker/dockerfile:1.4

FROM python:3.13-slim AS builder
EXPOSE 8000
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
COPY requirements.txt /app
RUN pip3 install -r requirements.txt --no-cache-dir
RUN useradd -m appuser && chown appuser:appuser /app
COPY --chown=appuser:appuser . /app
USER appuser
CMD ["sh", "-c", "python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000"]

FROM builder AS dev-envs
USER root
RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*
USER appuser
CMD ["sh", "-c", "python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000"]
