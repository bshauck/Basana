from app.models import db, environment, SCHEMA, Workspace
from sqlalchemy.sql import text


def seed_workspaces():
    one = Workspace(name='WS 1', ownerId=1)
    two = Workspace(name='WS 2', ownerId=1)
    three = Workspace(name='WS 3', ownerId=1)

    workspaces = [one, two, three]
    db.session.add_all(workspaces)
    db.session.commit()

def undo_workspaces():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.workspace RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM workspace"))
    db.session.commit()
