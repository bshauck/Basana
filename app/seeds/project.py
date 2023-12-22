# app/seeds/project.py

from app.models import db, Project, Workspace, Section
from .createSeeds import getIds, getUsers, nextProjectNameDescription, nextSectionName
from random import choice, choices, randint, sample
from datetime import datetime

def seed_projects():
    workspaces = Workspace.query.filter(Workspace.ownerId.in_(getIds())).all()
    for user in getUsers():
        # Select a workspace whose members include user
        def wsHasId(ws):
            print("WS:, teammates", ws, ws.teammates)
            return any(m.id == user.id for m in ws.teammates)

        userTeams = [w for w in workspaces if wsHasId(w)]
        if user.email == 'demo@aa.io':
            times = 5
            selected = userTeams
            demo = user
        else:
            times = 1
            selected = [choice(userTeams)]

        while len(selected):
            ws = selected.pop()
            for _ in range(times):
                project_name, project_description = nextProjectNameDescription()
                is_public = choices([True, False], weights=[3, 1], k=1)[0]
                members = sample(ws.teammates, randint(1, len(ws.teammates)))
                # Create and add project instance
                project = Project(
                    ownerId=user.id,
                    workspace=ws,
                    name=project_name,
                    description=project_description,
                    public=is_public,
                )
                # Add members to project
                project.members.extend(members)
                project.addToSectionsSession(Section(project=project, name=nextSectionName(), index=1001, createdAt=datetime.now()  ))
                project.addToSectionsSession(Section(project=project, name=nextSectionName(), index=2001, createdAt=datetime.now()  ))
    db.session.commit()
    print("demo projects: ", demo.projects)

def undo_projects():
    projects = Project.query.filter(Project.ownerId.in_(getIds())).all()
    for project in projects:
        db.session.delete(project)
    db.session.commit()
