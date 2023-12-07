from app.models import db, environment, SCHEMA, Project
from sqlalchemy.sql import text

def seed_internal_projects():
    pass
 # Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_internal_projects():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.internal_project RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM internal_project"))
    db.session.commit()
