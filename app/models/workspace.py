from .db import db, environment, SCHEMA, SEED, add_prefix_for_prod
from .project import Project

user_member_workspace = db.Table(
    'user_member_workspace',
    db.Model.metadata,
    db.Column('userId', db.Integer, db.ForeignKey(add_prefix_for_prod('userb.id')), primary_key=True),
    db.Column('workspaceId', db.Integer, db.ForeignKey(add_prefix_for_prod('workspace.id')), primary_key=True)
)

if environment == "production":
    user_member_workspace.schema = SCHEMA


class Workspace(db.Model):
    __tablename__ = 'workspace'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('userb.id'), ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(50), nullable=False, unique=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        self.checkSeed()
        self.projects.append(self.createMyTaskProject())

    def createMyTaskProject(self):
        p = Project(
            owner=self.owner,
            workspace=self,
            name=Project.myTaskProjectName,
        )
        db.session.add(p)
        return p

    owner = db.relationship(
        'User',
        back_populates='workspaces'
    )

    projects = db.relationship(
        "Project",
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
            'projects': [project.id for project in self.projects]
        }
