# app/models/project.py
from .db import db, environment, SCHEMA, prodify
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
        self.colorId = choice(range(1, Color.maxIndex))
        self.iconId = choice(range(1, ProjectIcon.maxIndex+1))
        self.createInternalSection()


    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey(prodify('userb.id')), nullable=False)
    workspaceId = db.Column(db.Integer, db.ForeignKey(prodify('workspace.id'), ondelete='CASCADE'),nullable=False)
    name = db.Column(db.String(50), nullable=False)
    colorId = db.Column(db.Integer, db.ForeignKey(prodify('color.id')), default=1)
    statusId = db.Column(db.Integer, db.ForeignKey(prodify('status.id')), default=5)
    iconId = db.Column(db.Integer, db.ForeignKey(prodify('project_icon.id')), default=1)
    viewId = db.Column(db.Integer, db.ForeignKey(prodify('view_type.id')), default=1)
    description = db.Column(db.Text, nullable=True)
    public = db.Column(db.Boolean, default=False)
    start = db.Column(db.TIMESTAMP(timezone=True), nullable=True)
    due = db.Column(db.TIMESTAMP(timezone=True), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    icon_subquery = db.select([ProjectIcon.icon]).where(ProjectIcon.id == iconId)
    icon = db.column_property(icon_subquery.as_scalar())
    color_subquery = db.select([Color.name]).where(Color.id == colorId)
    color = db.column_property(color_subquery.as_scalar())

    members = db.relationship(
        "User",
        secondary=user_member_project,
        back_populates="memberships",
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

    def createInternalSection(self):
        self.addToSectionsSession(Section(project=self, projectId=self.id, name="Untitled section", index=1, createdAt=datetime.now()))

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
            'statusId': self.statusId,
            'iconId': self.iconId,
            'colorId': self.colorId,
            'color': self.color,
            'icon': self.icon,
            'viewId': self.viewId,
            'description': self.description,
            'public': self.public,
            'start': self.start,
            'due': self.due,
            'completed': self.completed,
            'members': [member.id for member in self.members],
            'sections': [section.id for section in self.sections],
            'tasks': [task.id for task in self.tasks]
        }
