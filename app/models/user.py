from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


user_member_workspace = db.Table(
    'user_member_workspace',
    db.Model.metadata,
    db.Column('userId', db.Integer, db.ForeignKey(add_prefix_for_prod('user.id')), primary_key=True),
    db.Column('workspaceId', db.Integer, db.ForeignKey(add_prefix_for_prod('workspace.id')), primary_key=True)
)


class Workspace(db.Model):
    __tablename__ = 'workspace'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False, unique=True)

    owner = db.relationship(
        'User',
        back_populates='workspaces'
    )

    members = db.relationship(
        "User",
        secondary=user_member_workspace,
        back_populates="teams",
    )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'ownerId': self.ownerId
        }



class User(db.Model, UserMixin):
    __tablename__ = 'user'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashedPassword = db.Column(db.String(255), nullable=False)
    # profilePictureUrl = db.Column(db.String(255), nullable=True)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        self.workspaces.append(Workspace(name=f"{self.username}'s team"))

    workspaces = db.relationship(
        "Workspace",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    teams = db.relationship(
        "Workspace",
        secondary=user_member_workspace,
        back_populates="members",
    )

    @property
    def password(self):
        return self.hashedPassword

    @password.setter
    def password(self, password):
        self.hashedPassword = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
