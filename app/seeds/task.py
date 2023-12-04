from app.models import db, User, environment, SCHEMA, Project, Workspace
from sqlalchemy.sql import text

# cannot do bulk inserts due to need to encrypt passwords
# Adds a demo user, you can add other users here if you want
def seed_tasks():
    pass

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
