from app.models import db, User, environment, SCHEMA, Project, Workspace
from sqlalchemy.sql import text


def seed_workspaces():
    one = Workspace(name='WS 1', ownerId=1)
    two = Workspace(name='WS 2', ownerId=1)
    three = Workspace(name='WS 3', ownerId=1)

    workspaces = [one, two, three]
    db.session.add_all(workspaces)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_workspaces():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.workspace RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM workspace"))
    db.session.commit()
