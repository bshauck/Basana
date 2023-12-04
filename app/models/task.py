from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Task(db.Model):
    __tablename__ = 'task'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    projectId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('project.id')), nullable=False)
    description = db.Column(db.Text)
    start = db.Column(db.String(24))
    due = db.Column(db.String(24))

    def to_dict(self):
        return {
            'id': self.id,
            'projectId': self.projectId,
             'view': self.view,
            'description': self.description,
            'start': self.start,
            'due': self.due,
        }
