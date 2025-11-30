from typing import Optional
from sqlmodel import Field, SQLModel


class Metric(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    value: str
    metric_type: str = Field(default="text")  # text, number, percentage, currency
    color: str = Field(default="blue")  # tailwind color class or hex
    icon: Optional[str] = Field(default=None)  # lucide icon name
