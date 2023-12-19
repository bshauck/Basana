# app/models/db.py
from flask_sqlalchemy import SQLAlchemy
import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

db = SQLAlchemy()

# helper function for adding prefix to foreign key column references in production
def prodify(attr):
    return f"{SCHEMA}.{attr}" if environment == "production" else attr

def qprodify(attr):
    return f'"${prodify(attr)}"' if environment == "production" else attr
