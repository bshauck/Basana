# app/seeds/workspace.py
from app.models import  db, Workspace
from .createSeeds import getUsers, getIds, nextTeamName
import random

def seed_workspaces():
    users = getUsers()
    for user in users:
        if random.choice([True, False]):  # whether to create a new team
            team_size = random.randint(2, 5)
            team_members = random.sample(users, team_size)
            if user not in team_members:
                team_members.append(user)

            # Create new Workspace
            new_workspace = Workspace(name=nextTeamName(), owner=user)

            # Add users to the Workspace
            new_workspace.teammates.extend(team_members)
            db.session.add(new_workspace)
            db.session.commit()


def undo_workspaces():
    teams = Workspace.query.filter(Workspace.ownerId.in_(getIds())).all()
    for team in teams:
        db.session.delete(team)
    db.session.commit()
