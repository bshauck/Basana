from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .section import Section
from .enum import Color, ProjectIcon
from random import choice


user_member_project = db.Table(
    'user_member_project',
    db.Model.metadata,
    db.Column('userId', db.Integer, db.ForeignKey(add_prefix_for_prod('userb.id')), primary_key=True),
    db.Column('projectId', db.Integer, db.ForeignKey(add_prefix_for_prod('project.id')), primary_key=True)
)

if environment == "production":
    user_member_project.schema = SCHEMA


class Project(db.Model):
    __tablename__ = 'project'
    myTaskProjectName = "My tasks"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        db.session.commit() # because I need to create sections with the right projectId
        self.createSectionsForMyTask()
        self.color = choice(range(1, Color.maxIndex+1))
        self.icon = choice(range(1, ProjectIcon.maxIndex+1))


    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('userb.id')), nullable=False)
    workspaceId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('workspace.id'), ondelete='CASCADE'),nullable=False)
    name = db.Column(db.String(50), nullable=False)
    color = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('color.id')), default=1)
    status = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('status.id')), default=5)
    icon = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('project_icon.id')), default=1)
    view = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('view_type.id')), default=1)
    description = db.Column(db.Text, nullable=True)
    public = db.Column(db.Boolean, default=False)
    start = db.Column(db.Date, nullable=True)
    due = db.Column(db.Date, nullable=True)
    completed = db.Column(db.Boolean, default=False)

    sections = db.relationship(
        'Section',
        back_populates='project'
    )

    members = db.relationship(
        "User",
        secondary=user_member_project,
        back_populates="projects",
    )

    owner = db.relationship(
        'User',
        back_populates='ownedProjects'
    )

    workspace = db.relationship(
        'Workspace',
        back_populates='projects'
    )

    def createSectionsForMyTask(self):
        if self.name == self.myTaskProjectName:
            timeNow = datetime.now()
            self.sections.append(Section(projectId=self.id, name="Recently assigned", index=0, createdAt=timeNow))
            self.sections.append(Section(projectId=self.id, name="Do today", index=1, createdAt=timeNow))
            self.sections.append(Section(projectId=self.id, name="Do next week", index=2, createdAt=timeNow))
            self.sections.append(Section(projectId=self.id, name="Do later", index=3, createdAt=timeNow))

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
            'members': [member.id for member in self.members],
            'sections': [section.id for section in self.sections]
        }
