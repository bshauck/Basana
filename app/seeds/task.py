from app.models import db, environment, SCHEMA, Task
from sqlalchemy.sql import text
from datetime import datetime

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



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_tasks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.task RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM task"))
    db.session.commit()
