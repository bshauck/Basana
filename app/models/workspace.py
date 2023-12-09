from .db import db, environment, SCHEMA, SEED, prodify
from .project import Project
from .internalProject import InternalProject

user_member_workspace = db.Table(
    'user_member_workspace',
    db.Model.metadata,
    db.Column('userId', db.Integer, db.ForeignKey(prodify('userb.id'), ondelete='CASCADE'), primary_key=True),
    db.Column('workspaceId', db.Integer, db.ForeignKey(prodify('workspace.id'), ondelete='CASCADE'), primary_key=True))

if environment == "production":
    user_member_workspace.schema = SCHEMA


class Workspace(db.Model):
    __tablename__ = 'workspace'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey(prodify('userb.id'), ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(50), nullable=False, unique=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        self.checkSeed()
        self.internalProjects.append(self.createMyTaskProject())

    def createMyTaskProject(self):
        p = InternalProject(
            owner=self.owner,
            ownerId=self.ownerId,
            workspace=self,
            name=InternalProject.myTaskProjectName)
        db.session.add(p)
        return p

    owner = db.relationship(
        'User',
        back_populates='workspaces'
    )

    internalProjects = db.relationship(
        "InternalProject",
        back_populates="workspace",
        cascade="all, delete",
        passive_deletes=True,
    )

    projects = db.relationship(
        "Project",
        back_populates="workspace",
        cascade="all, delete",
        passive_deletes=True,
    )

    tasks = db.relationship(
        "Task",
        back_populates="workspace",
        cascade="all, delete",
        passive_deletes=True,
    )

    teammates = db.relationship(
        "User",
        secondary=user_member_workspace,
        back_populates="teams",
    )

    def checkSeed(self):
        if (SEED):
            db.session.commit()

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'ownerId': self.ownerId,
            'teammates': [teammate.id for teammate in self.teammates],
            'projects': [project.id for project in self.projects],
            'internalProjects': [internalProject.id for internalProject in self.internalProjects],
            'tasks': [task.id for task in self.tasks],
        }
