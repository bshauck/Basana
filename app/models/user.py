from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from .workspace import Workspace, user_member_workspace
from .project import user_member_project

class User(db.Model, UserMixin):
    __tablename__ = 'userb'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashedPassword = db.Column(db.String(255), nullable=False)
    # profilePictureUrl = db.Column(db.String(255), nullable=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        db.session.commit() # because I need to create a workspace with the right ownerId
        if len(self.workspaces) == 0 and Workspace.query.filter_by(name=self.username + "'s team").first() is None :
            self.workspaces.append(Workspace(ownerId=self.id, name=self.username + "'s team"))

    ownedProjects = db.relationship(
        "Project",
        back_populates="owner",
        cascade="all, delete"
    )

    projects = db.relationship(
        "Project",
        secondary=user_member_project,
        back_populates="members",
    )

    workspaces = db.relationship(
        "Workspace",
        back_populates="owner",
        cascade="all, delete"
    )

    teams = db.relationship(
        "Workspace",
        secondary=user_member_workspace,
        back_populates="teammates",
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
            'email': self.email,
            'teams': [team.id for team in self.teams],
            'projects': [project.id for project in self.projects],
            'ownedProjects': [project.id for project in self.ownedProjects],
            'workspaces': [workspace.id for workspace in self.workspaces]
        }
