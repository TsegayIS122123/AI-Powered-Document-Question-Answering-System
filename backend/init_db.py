# backend/init_db.py
from app.core.database import engine, Base
from app.models import document, question
# from app.models import embedding  # Only if you created it

Base.metadata.create_all(bind=engine)
print("Tables created successfully!")