# app/seeds/users.py
from app.models import db, User
from .createSeeds import seedNames, seedEmails

# cannot do bulk inserts due to need to encrypt passwords
def seed_users():
    with db.session.no_autoflush:
        for i in range(len(seedNames)):
            nextUser = User(username=seedNames[i], email=seedEmails[i], password='password')
            db.session.add(nextUser)
    db.session.commit()

def undo_users():
    users = User.query.filter(User.email.in_(seedEmails)).all()
    for user in users:
        db.session.delete(user)
    db.session.commit()
