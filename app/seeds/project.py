from app.models import db, environment, SCHEMA, Project
from sqlalchemy.sql import text

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
# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_projects():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.project RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM project"))
    db.session.commit()
