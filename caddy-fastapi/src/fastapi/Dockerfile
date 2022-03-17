FROM python:alpine3.15

WORKDIR /app

# Install curl for healthchecks
RUN apk add curl

# Setup a nonroot user for security
RUN adduser -D nonroot
USER nonroot

# Upgrade pip
RUN pip install --upgrade pip

# Install dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir --upgrade -r requirements.txt

# Copy the app
COPY main.py /app/main.py

# Expose the app's port
EXPOSE 8000

# Run the FastAPI server
ENTRYPOINT ["python", "-m"] 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
