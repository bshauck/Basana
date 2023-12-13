# app/models/task.py
from .db import db, environment, SCHEMA, prodify


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
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.Integer, db.ForeignKey(prodify('status.id')), nullable=True, default=1)
    public = db.Column(db.Boolean, default=False)
    complete = db.Column(db.Boolean, default=False)
    start = db.Column(db.Date, nullable=True)
    due = db.Column(db.Date, nullable=True)

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
        back_populates='tasks'
    )


    def to_dict(self):
        return {
            'id': self.id,
            'projectId': self.projectId,
            'internalProjectId': self.internalProjectId,
            'ownerId': self.ownerId,
            'sectionId': self.sectionId,
            'workspaceId': self.workspaceId,
            'title': self.title,
            'description': self.description,
            'public': self.public,
            'complete': self.complete,
            'status': self.status,
            'start': self.start,
            'due': self.due,
        }
