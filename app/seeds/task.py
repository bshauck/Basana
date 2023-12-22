# app/seeds/task.py

from app.models import db, Task
from datetime import datetime, timezone, timedelta
from .createSeeds import getUsers, nextTaskNameDescription, seedUserIds
from random import randint, choices


# Have 3/4s of tasks generated be assigned to workspace owner,
# and 1/4 to other members of the team, if any.
# have 1/8 of tasks have due date in past, 1/8 today, and 1/4
# next week, and 1/4 beyond next week


def seed_tasks():
    today = datetime.now(timezone.utc)

    users = getUsers()
    demo = next((user for user in users if user.email == 'demo@aa.io'), None)

    for user in users: # Iterate through user's projects
        for workspace in user.workspaces:
            for project in workspace.projects:
                for section in project.sections: # Generate 1-4 tasks/section
                    for _ in range(randint(1, 4)):
                        task_name, task_description = nextTaskNameDescription()
                        newWeek = timedelta(days=randint(1,8))
                        old = today - newWeek
                        soon = today + newWeek
                        later = today + timedelta(days=randint(9,30))
                        nextDate = choices([old, today, soon, later], weights=[2, 2, 5, 5], k=1)[0]

                        new_task = Task(
                            owner=user,
                            workspace=workspace,
                            project=project,
                            section=section,
                            assignee=demo.id,
                            due=nextDate,
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
