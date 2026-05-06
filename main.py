from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from routes import routes
import models
from database import engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the static assets (CSS/JS)
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

# Serve the React App on the root URL
@app.get("/")
async def serve_frontend():
    return FileResponse("frontend/dist/index.html")

# Serve the React App for the unlock page
@app.get("/unlock/{short_code}")
async def serve_unlock_page(short_code: str):
    return FileResponse("frontend/dist/index.html")

# Include the API router (which handles /shorten-link, /analytics, and /{short_code} catch-all)
app.include_router(router=routes.router)

models.Base.metadata.create_all(bind=engine)