from .db import db, environment, SCHEMA, prodify
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
        if len(self.workspaces) == 0 and Workspace.query.filter_by(name=self.username + "'s team").first() is None :
            w = Workspace(owner=self, name=self.username + "'s team")
            self.workspaces.append(w)
            db.session.add(w)

    projects = db.relationship(
        "Project",
        back_populates="owner",
        cascade="all, delete",
        passive_deletes=True
    )

    tasks = db.relationship(
        "Task",
        back_populates="owner",
        cascade="all, delete",
        passive_deletes=True
    )

    internalProjects = db.relationship(
        "InternalProject",
        back_populates="owner",
        cascade="all, delete",
        passive_deletes=True
    )

    collaborations = db.relationship(
        "Project",
        secondary=user_member_project,
        back_populates="collaborators",
        cascade="all, delete",
        passive_deletes=True
    )

    workspaces = db.relationship(
        "Workspace",
        back_populates="owner",
        cascade="all, delete",
        passive_deletes=True
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
            'colloborations': [project.id for project in self.collaborations],
            'workspaces': [workspace.id for workspace in self.workspaces],
            'internalProjects': [internalProject.id for internalProject in self.internalProjects],
            'tasks': [task.id for task in self.tasks],
        }
