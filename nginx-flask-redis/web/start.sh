#!/bin/bash

gunicorn -c app/config.py app.app:app
