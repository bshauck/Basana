from app.models import db, environment, SCHEMA, Project
from sqlalchemy.sql import text


def seed_projects():
    one = Project(name='Project 1', ownerId=1, workspaceId=1)
    two = Project(name='Project 2', ownerId=1, workspaceId=1)
    three = Project(name='Project 3', ownerId=1, workspaceId=1)

    projects = [one, two, three]
    db.session.add_all(projects)
    db.session.commit()

def undo_projects():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.project RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM project"))
    db.session.commit()
