FROM python:3.8

WORKDIR /app

RUN apt update

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "--host", "0.0.0.0", "--port", "8000", "src.app:app"]