import json
from sqlmodel import Session, select
from models import Metric

SEED_FILE = "seed_data.json"


def dump_data(session: Session, file_path: str = SEED_FILE):
    """Export all metrics to a JSON file."""
    metrics = session.exec(select(Metric)).all()
    data = [metric.model_dump() for metric in metrics]

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Exported {len(data)} metrics to {file_path}")


def load_data(session: Session, file_path: str = SEED_FILE) -> bool:
    """Load metrics from a JSON file into the database. Returns True if data was loaded."""
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Seed file {file_path} not found.")
        return False

    if not data:
        print("Seed file is empty.")
        return False

    count = 0
    for item in data:
        # We verify if the item already exists by ID if ID is present,
        # or we could just append. Since this is 'seed' logic usually run on empty DB,
        # we will assume we can just insert.
        # However, to be safe, let's reset ID to None so DB autoincrements,
        # or keep it if we want to preserve exact IDs. Preserving IDs is better for consistency.

        metric = Metric.model_validate(item)

        # Check if exists to avoid unique constraint errors if run on non-empty DB
        if metric.id is not None:
            existing = session.get(Metric, metric.id)
            if existing:
                continue

        session.add(metric)
        count += 1

    session.commit()
    print(f"Imported {count} metrics from {file_path}")
    return True
