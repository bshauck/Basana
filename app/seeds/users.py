from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

# cannot do bulk inserts due to need to encrypt passwords
# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password')
    alex = User(username='alex', email='alex@aa.io', password='password')
    ali = User(username='ali', email='ali@aa.io', password='password')
    andrei = User(username='andrei', email='andrei@aa.io', password='password')
    ann = User(username='ann', email='ann@aa.io', password='password')
    # bill = User(username='bill', email='bill@aa.io', password='password')
    # brian = User(username='brian', email='brian@aa.io', password='password')
    # brian = User(username='brian', email='brian@aa.io', password='password')
    # cory = User(username='cory', email='cory@aa.io', password='password')
    # hector = User(username='hector', email='hector@aa.io', password='password')
    # khuong = User(username='khuong', email='khuong@aa.io', password='password')
    # malcolm = User(username='malcolm', email='malcolm@aa.io', password='password')
    # mason = User(username='mason', email='mason@aa.io', password='password')
    # matt = User(username='matt', email='matt@aa.io', password='password')
    # min = User(username='min', email='min@aa.io', password='password')
    # nina = User(username='nina', email='nina@aa.io', password='password')
    # peang = User(username='peang', email='peang@aa.io', password='password')
    # peter = User(username='peter', email='peter@aa.io', password='password')
    # quinlan = User(username='quinlan', email='quinlan@aa.io', password='password')
    # rae = User(username='rae', email='rae@aa.io', password='password')
    # roderick = User(username='roderick', email='roderick@aa.io', password='password')
    # sophia = User(username='sophia', email='sophia@aa.io', password='password')
    # sophie = User(username='sophie', email='sophie@aa.io', password='password')
    # toney = User(username='toney', email='toney@aa.io', password='password')
    # zohaib = User(username='zohaib', email='zohaib@aa.io', password='password')
    # viviane = User(username='viviane', email='viviane@aa.io', password='password')
    # yoseph = User(username='yoseph', email='yoseph@aa.io', password='password')

    users = [demo, alex, ali, andrei, ann]
    # users = [demo, alex, ali, andrei, ann, bill, brian, cory, hector, khuong, malcolm, mason, matt, min, nina, peang, peter, quinlan, rae, roderick, sophia, sophie, toney, zohaib, viviane, yoseph]
    db.session.add_all(users)
    db.session.flush()
    # db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.userb RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM userb"))
    db.session.commit()
