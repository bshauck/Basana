# app/models/task.py
from .db import db, environment, SCHEMA, prodify

user_member_task = db.Table(
    'user_member_task',
    db.Model.metadata,
    db.Column('userId', db.Integer, db.ForeignKey(prodify('userb.id'), ondelete='CASCADE'), primary_key=True),
    db.Column('taskId', db.Integer, db.ForeignKey(prodify('task.id'), ondelete='CASCADE'), primary_key=True)
)

if environment == "production":
    user_member_task.schema = SCHEMA


class Task(db.Model):
    __tablename__ = 'task'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    workspaceId = db.Column(db.Integer, db.ForeignKey(prodify('workspace.id'), ondelete='CASCADE'), nullable=False)
    ownerId = db.Column(db.Integer, db.ForeignKey(prodify('userb.id'), ondelete='CASCADE'), nullable=False)
    projectId = db.Column(db.Integer, db.ForeignKey(prodify('project.id'), ondelete='CASCADE'), nullable=True)
    internalProjectId = db.Column(db.Integer, db.ForeignKey(prodify('internal_project.id'), ondelete='CASCADE'), nullable=True)
    sectionId = db.Column(db.Integer, db.ForeignKey(prodify('section.id'), ondelete='CASCADE'), nullable=False)
    assignee = db.Column(db.Integer, db.ForeignKey(prodify('userb.id')), nullable=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    statusId = db.Column(db.Integer, db.ForeignKey(prodify('status.id')), nullable=True, default=1)
    completed = db.Column(db.Boolean, default=False)
    start = db.Column(db.TIMESTAMP(timezone=True), nullable=True)
    due = db.Column(db.TIMESTAMP(timezone=True), nullable=True)

    section = db.relationship(
        'Section',
        back_populates='tasks'
    )

    project = db.relationship(
        'Project',
        back_populates='tasks'
    )

    internalProject = db.relationship(
        'InternalProject',
        back_populates='tasks'
    )

    workspace = db.relationship(
        'Workspace',
        back_populates='tasks'
    )

    owner = db.relationship(
        'User',
        back_populates='tasks',
        foreign_keys=[ownerId]
    )

    collaborators = db.relationship(
        "User",
        secondary=user_member_task,
        back_populates="collaborations",
        primaryjoin=(user_member_task.c.taskId == id),
        secondaryjoin="User.id == user_member_task.c.userId",
    )


    def to_dict(self):
        return {
            'id': self.id,
            'projectId': self.projectId,
            'internalProjectId': self.internalProjectId,
            'ownerId': self.ownerId,
            'sectionId': self.sectionId,
            'assignee': self.assignee,
            'workspaceId': self.workspaceId,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'statusId': self.statusId,
            'start': self.start,
            'due': self.due,
            'collaborators': [collaborator.id for collaborator in self.collaborators],
        }
