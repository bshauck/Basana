from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Task(db.Model):
    __tablename__ = 'task'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    projectId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('project.id'), ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('status.id')), nullable=True, default=1)
    start = db.Column(db.Date, nullable=True)
    due = db.Column(db.Date, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'projectId': self.projectId,
            'description': self.description,
            'start': self.start,
            'due': self.due,
        }
