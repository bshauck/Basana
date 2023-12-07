from .db import db, environment, SCHEMA, prodify, SEED
from datetime import datetime
from .section import Section
from .enum import Color, ProjectIcon
from random import choice


user_member_project = db.Table(
    'user_member_project',
    db.Model.metadata,
    db.Column('userId', db.Integer, db.ForeignKey(prodify('userb.id'), ondelete='CASCADE'), primary_key=True),
    db.Column('projectId', db.Integer, db.ForeignKey(prodify('project.id'), ondelete='CASCADE'), primary_key=True)
)

if environment == "production":
    user_member_project.schema = SCHEMA


class Project(db.Model):
    __tablename__ = 'project'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        self.createInternalSection()
        self.color = choice(range(1, Color.maxIndex+1))
        self.icon = choice(range(1, ProjectIcon.maxIndex+1))
        self.checkSeedDemo()


    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey(prodify('userb.id')), nullable=False)
    workspaceId = db.Column(db.Integer, db.ForeignKey(prodify('workspace.id'), ondelete='CASCADE'),nullable=False)
    name = db.Column(db.String(50), nullable=False)
    color = db.Column(db.Integer, db.ForeignKey(prodify('color.id')), default=1)
    status = db.Column(db.Integer, db.ForeignKey(prodify('status.id')), default=5)
    icon = db.Column(db.Integer, db.ForeignKey(prodify('project_icon.id')), default=1)
    view = db.Column(db.Integer, db.ForeignKey(prodify('view_type.id')), default=1)
    description = db.Column(db.Text, nullable=True)
    public = db.Column(db.Boolean, default=False)
    start = db.Column(db.Date, nullable=True)
    due = db.Column(db.Date, nullable=True)
    completed = db.Column(db.Boolean, default=False)

    collaborators = db.relationship(
        "User",
        secondary=user_member_project,
        back_populates="collaborations",
    )

    owner = db.relationship(
        'User',
        back_populates='projects'
    )

    sections = db.relationship(
        'Section',
        back_populates='project',
        cascade="all, delete",
        passive_deletes=True,
    )

    tasks = db.relationship(
        'Task',
        back_populates='project',
        cascade="all, delete",
        passive_deletes=True,
    )

    workspace = db.relationship(
        'Workspace',
        back_populates='projects'
    )

    def addToSectionsSession(self, section):
        self.sections.append(section)
        db.session.add(section)

    def checkSeedDemo(self):
        if SEED == 1:
            self.addToSectionsSession(Section(project=self, name="Demo", index=1000, createdAt=datetime.now()))

    def createInternalSection(self):
        self.addToSectionsSession(Section(project=self, name="Untitled section", index=1, createdAt=datetime.now()))

    def internalSectionName(self):
        return "Untitled section"

    def maxSectionIndex(self):
        return max([section.index for section in self.sections]) if len(self.sections)  else 0

    def to_dict(self):
        return {
            'id': self.id,
            'ownerId': self.ownerId,
            'workspaceId': self.workspaceId,
            'name': self.name,
            'color': self.color,
            'status': self.status,
            'icon': self.icon,
            'view': self.view,
            'description': self.description,
            'public': self.public,
            'start': self.start,
            'due': self.due,
            'completed': self.completed,
            'collaborators': [member.id for member in self.collaborators],
            'sections': [section.id for section in self.sections],
            'tasks': [task.id for task in self.tasks]
        }
