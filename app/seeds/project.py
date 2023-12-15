# app/seeds/project.py
from app.models import db, Project, Workspace, Section
from .createSeeds import getIds, nextProjectNameDescription, nextSectionName
import random
from datetime import datetime

def seed_projects():
    workspaces_info = Workspace.query.filter(Workspace.ownerId.in_(getIds())).all()
    for user_id in getIds():
        # Randomly select a workspace where the user is a member
        def wsHasId(ws):
            print("WS:, teammates", ws, ws.teammates)
            for i in  range(len(ws.teammates)):
                if ws.teammates[i].id == user_id:
                    return True
            return False

        user_workspaces = [ws for ws in workspaces_info if wsHasId(ws)]
        selected_workspace = random.choice(user_workspaces)

        # Randomly select project name and description
        project_name, project_description = nextProjectNameDescription()

        # Determine public/private status
        is_public = random.choices([True, False], weights=[3, 1], k=1)[0]

        # Select members from workspace teammates
        members = random.sample(selected_workspace.teammates, random.randint(1, len(selected_workspace.teammates)))

        # Create and add project instance
        project = Project(
            ownerId=user_id,
            workspace=selected_workspace,
            name=project_name,
            description=project_description,
            public=is_public,
        )
        # Add members to project
        project.members.extend(members)
        project.addToSectionsSession(Section(project=project, name=nextSectionName(), index=1001, createdAt=datetime.now()  ))
        project.addToSectionsSession(Section(project=project, name=nextSectionName(), index=2001, createdAt=datetime.now()  ))
    db.session.commit()


def undo_projects():
    projects = Project.query.filter(Project.ownerId.in_(getIds())).all()
    for project in projects:
        db.session.delete(project)
    db.session.commit()
