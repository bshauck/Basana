# app/seeds/createSeeds.py
# from app.app_factory import create_app
# from flask import current_app
from app.models import db, User

seedNames = \
[
# Adds a demo user, you can add other users here if you want
'Demo Lition',
'Alex Thoo',
# 'Andrei Vorobev',
# 'Ann Mulling',
# 'Brian Kiesel',
# 'Cory Campbell',
# 'Hector Crespo',
# 'Khuong Nguyen',
# 'Malcolm Caleb',
# 'Mason Austin',
# 'Matt Kim',
# 'Mugil Choi',
# 'Nina Bell',
# 'Peang Ngo',
# 'Peter Dinh',
# 'Quinn Bush',
# 'Rae Tsui',
# 'Roderick Johnson',
# 'Ryan Fournier',
# 'Sophia Tsau',
# 'Sophie Yang',
# 'Viviane Le',
# 'Zohaib Rajan',
]
seedEmails = [n.split(' ')[0].lower() + '@aa.io' for n in seedNames]
seedUserIds = []

def getIds():
    global seedUserIds
    if len(seedUserIds) == 0:
        # app = create_app()  # Create a Flask app instance
        # with current_app.app_context():  # Create an application context
        with db.session.no_autoflush:
            tuples = db.session.query(User.id).filter(User.email.in_(seedEmails)).all()
            seedUserIds = [t[0] for t in tuples]
            print("emails:", seedEmails)
            print("Seed ids", seedUserIds)
    return seedUserIds
