import uvicorn
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, create_engine, select

from models import Metric
from db_utils import load_data

sqlite_file_name = "metrics.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    with Session(engine) as session:
        # Check if DB is empty
        if not session.exec(select(Metric)).first():
            print("Database is empty. Loading seed data...")
            load_data(session)
    yield


app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:5173", "http://localhost:3000", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/metrics/", response_model=Metric)
def create_metric(metric: Metric, session: Session = Depends(get_session)):
    session.add(metric)
    session.commit()
    session.refresh(metric)
    return metric


@app.get("/metrics/", response_model=List[Metric])
def read_metrics(
    offset: int = 0, limit: int = 100, session: Session = Depends(get_session)
):
    metrics = session.exec(select(Metric).offset(offset).limit(limit)).all()
    return metrics


@app.get("/metrics/{metric_id}", response_model=Metric)
def read_metric(metric_id: int, session: Session = Depends(get_session)):
    metric = session.get(Metric, metric_id)
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    return metric


@app.put("/metrics/{metric_id}", response_model=Metric)
def update_metric(
    metric_id: int, metric: Metric, session: Session = Depends(get_session)
):
    db_metric = session.get(Metric, metric_id)
    if not db_metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    metric_data = metric.model_dump(exclude_unset=True)
    for key, value in metric_data.items():
        setattr(db_metric, key, value)
    session.add(db_metric)
    session.commit()
    session.refresh(db_metric)
    return db_metric


@app.delete("/metrics/{metric_id}")
def delete_metric(metric_id: int, session: Session = Depends(get_session)):
    metric = session.get(Metric, metric_id)
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    session.delete(metric)
    session.commit()
    return {"ok": True}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
