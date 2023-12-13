# app/seeds/task.py
from app.models import db, Task
from datetime import datetime
from .createSeeds import seedUserIds

# workspaceId=1,
# ownerId=1,
# internalProjectId=1,
# sectionId=1,
# title='This is the very first task',
# description='it is a very nice task; once you get to know it',
# public=False,
# due=datetime.now()

def createTask(title, description, section):
    task = Task(
        workspaceId=1,
        ownerId=1,
        internalProjectId=1,
        sectionId=section,
        title=title,
        description=description,
        public=False,
        due=datetime.now())
    db.session.add(task)
def createTaskInUnsorted(title, description):
    createTask(title, description, section=1)

def createTaskInToday(title, description):
    createTask(title, description, section=2)

def createTaskInUpcoming(title, description):
    createTask(title, description, section=3)

def createTaskInLater(title, description):
    createTask(title, description, section=4)


def seed_tasks():
    createTaskInUnsorted(
        title='This is the very first task',
        description='it is a very nice task; once you get to know it')
    createTaskInUnsorted(
        title='This is the second task',
        description='It is a very cranky tasl.')
    createTaskInUnsorted(
        title='This is the third task',
        description="I could tell you about it, but then I'd have to kill you1")
    db.session.commit()
    createTaskInToday(
        title='This is the 4th task',
        description="I could tell you about it, but then I'd have to kill you1!")
    createTaskInToday(
        title='This is the 5th task',
        description='It is a very hairy task; you can follow a path for it')
    createTaskInToday(
        title='This is the 6th task',
        description='Also very cranky!')
    db.session.commit()

def undo_tasks():
    seeded_tasks = Task.query.filter(Task.ownerId.in_(seedUserIds)).all()
    for task in seeded_tasks:
        db.session.delete(task)
    db.session.commit()
