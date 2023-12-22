# app/models/section.py
from .db import db, environment, SCHEMA, prodify
from datetime import datetime

class Section(db.Model):
    __tablename__ = 'section'
    initialIndexStep = 1000

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        self.createdAt = datetime.now()
        self.index = self.index if self.index else self.currentMaxIndex() + self.initialIndexStep

    id = db.Column(db.Integer, primary_key=True)
    projectId = db.Column(db.Integer, db.ForeignKey(prodify('project.id'), ondelete='CASCADE'), nullable=True)
    internalProjectId = db.Column(db.Integer, db.ForeignKey(prodify('internal_project.id'), ondelete='CASCADE'), nullable=True)
    name = db.Column(db.String(50), nullable=False)
    index = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.TIMESTAMP(timezone=True), nullable=False)

    project = db.relationship(
        'Project',
        back_populates='sections'
    )

    tasks = db.relationship(
        "Task",
        back_populates="section",
        cascade="all, delete",
        passive_deletes=True
    )

    internalProject = db.relationship(
        'InternalProject',
        back_populates='sections'
    )

    def currentMaxIndex(self):
        """
        Returns the current max index for the section's project
        """
        return max([t.index for t in self.tasks]) if len(self.tasks)  else 0

    def to_dict(self):
        return {
            'id': self.id,
            'projectId': self.projectId,
            'internalProjectId': self.internalProjectId,
            'name': self.name,
            'index': self.index,
            'createdAt': self.createdAt,
            'tasks': [t.to_dict() for t in self.tasks] if self.tasks else [],
        }
