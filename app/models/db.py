# app/db.py
from flask_sqlalchemy import SQLAlchemy
import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")
SEED = os.environ.get("SEED")

db = SQLAlchemy()

# helper function for adding prefix to foreign key column references in production
def prodify(attr):
    return f"{SCHEMA}.{attr}" if environment == "production" else attr
