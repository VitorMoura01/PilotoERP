from typing import List, Optional
from pydantic import BaseModel

class MenuItemPerformance(BaseModel):
    name: str
    popularity: float
    profitability: float
    category: str  # "Stars", "Plowhorses", "Puzzles", "Dogs"