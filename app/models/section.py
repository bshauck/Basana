from .db import db, environment, SCHEMA, add_prefix_for_prod

class Section(db.Model):
    __tablename__ = 'section'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    projectId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('project.id')), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    index = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.String(30), nullable=False)

    project = db.relationship(
        'Project',
        back_populates='sections'
    )

    def to_dict(self):
        return {
            'id': self.id,
            'projectId': self.projectId,
            'name': self.name,
            'index': self.index,
            'createdAt': self.createdAt
        }
