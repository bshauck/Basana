# app/seeds/workspace.py
from app.models import  db, Workspace
from .createSeeds import getIds

def seed_workspaces():
    one = Workspace(name='Tiger Team 1', ownerId=1)
    two = Workspace(name='Disgruntled Employees', ownerId=1)
    three = Workspace(name='Gruntled Employees', ownerId=1)

    workspaces = [one, two, three]
    db.session.add_all(workspaces)
    db.session.commit()

def undo_workspaces():
    teams = Workspace.query.filter(Workspace.ownerId.in_(getIds())).all()
    for team in teams:
        db.session.delete(team)
    db.session.commit()
