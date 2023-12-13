# app/seeds/project.py
from app.models import db, Project
from .createSeeds import getIds

def seed_projects():
    one = Project(name='Project 1', ownerId=1, workspaceId=1)
    two = Project(name='Project 2', ownerId=1, workspaceId=1)
    three = Project(name='Project 3', ownerId=1, workspaceId=1)
    # four = Project(name='Project 1', ownerId=1, workspaceId=2)
    # five = Project(name='Project 2', ownerId=1, workspaceId=2)
    # six = Project(name='Project 3', ownerId=1, workspaceId=2)
    # seven = Project(name='Project 1', ownerId=1, workspaceId=3)
    # eight = Project(name='Project 2', ownerId=1, workspaceId=3)
    # nine = Project(name='Project 3', ownerId=1, workspaceId=3)

    projects = [one, two, three]
    # projects = [one, two, three, four, five, six, seven, eight, nine]
    db.session.add_all(projects)
    db.session.commit()

def undo_projects():
    projects = Project.query.filter(Project.ownerId.in_(getIds())).all()
    for project in projects:
        db.session.delete(project)
    db.session.commit()
