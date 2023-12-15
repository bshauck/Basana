# app/seeds/enums.py
from app.models import db, environment, SCHEMA, Color, ProjectIcon, Status, ViewType
from sqlalchemy.sql import insert, text

def seed_colors():
    colors = ['DeepPink', 'DarkGreen', 'Blue', 'DarkRed', 'LightSeaGeen', 'Chocolate', 'OrangeRed', 'Indigo', 'DarkGray', 'LightPink', 'DarkSeaGreen', 'DeepSkyBlue', 'IndianRed', 'MediumTurquoise', 'Bisque', 'Orange', 'DarkViolet', 'Beige', 'transparent']
    dicts = [{'name': color } for color in colors]
    db.session.execute(insert(Color), dicts)
    # commit in seed_enums()

def seed_status():
    statuses = ['Pending', 'Approved', 'Rejected', 'Changes requested', 'On track', 'At risk', 'Off track', 'On hold', 'Completed']
    dicts = [{'state': state } for state in statuses]
    db.session.execute(insert(Status), dicts)
    # commit in seed_enums()

def seed_view_types():
    types = ['list', 'board', 'calendar', 'timeline']
    dicts = [{'type': type } for type in types]
    db.session.execute(insert(ViewType), dicts)
    # commit in seed_enums()

def seed_project_icons():
    icons = ['list', 'table-lines', 'bars-progress', 'calendar', 'space-awesome', 'users', 'chart-columns', 'galactic-republic', 'baby', 'lightbulb', 'globe', 'gear', 'rectangle-list', 'cake-candles', 'calendar-check', 'bullseye', 'repeat', 'bullhorn', 'far fa-comments', 'suitcase', 'list-check', 'school-flag', 'puzzle-piece', 'chart-pie', 'arrow-upright-dots', 'gauge', 'far fa-bookmark', 'person-running', 'basket-shopping', 'arrrow-trend up', 'ticket', 'heart-circle-plus', 'box-archive']
    dicts = [{'icon': icon } for icon in icons]
    db.session.execute(insert(ProjectIcon), dicts)
    # commit in seed_enums()

def seed_enums():
    with db.session.no_autoflush:
        seed_colors()
        seed_status()
        seed_view_types()
        seed_project_icons()
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_enums():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.color RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.project_icon RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.status RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.view_type RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM color"))
        db.session.execute(text("DELETE FROM project_icon"))
        db.session.execute(text("DELETE FROM status"))
        db.session.execute(text("DELETE FROM view_type"))
    # db.session.query(Color).delete()
    # db.session.query(ProjectIcon).delete()
    # db.session.query(Status).delete()
    # db.session.query(ViewType).delete()
    db.session.commit()
