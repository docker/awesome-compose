from fastapi import FastAPI
import uvicorn

app = FastAPI(debug=True)


@app.get("/")
def hello_world():
    return {"message": "OK"}


