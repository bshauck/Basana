# app/seeds/task.py
from app.models import db, Task
# from datetime import datetime
from .createSeeds import getUsers, nextTaskNameDescription, seedUserIds
import random


def seed_tasks():
    users = getUsers()

    for user in users: # Iterate through user's projects
        for workspace in user.workspaces:
            for project in workspace.projects:
                for section in project.sections: # Generate 1-4 tasks/section
                    for _ in range(random.randint(1, 4)):
                        task_name, task_description = nextTaskNameDescription()

                        new_task = Task(
                            owner=user,
                            workspace=workspace,
                            project=project,
                            section=section,
                            title=task_name,
                            description=task_description,
                        )
                        db.session.add(new_task)
    db.session.commit()


def undo_tasks():
    seeded_tasks = Task.query.filter(Task.ownerId.in_(seedUserIds)).all()
    for task in seeded_tasks:
        db.session.delete(task)
    db.session.commit()
