from .db import db, environment, SCHEMA, add_prefix_for_prod
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
        db.session.commit() # because I need to create a project with the right ownerId
        self.projects.append(self.createMyTaskProject(self.ownerId))

    def createMyTaskProject(self, userId):
        return Project(
                    ownerId=userId,
                    workspaceId=self.id,
                    name=Project.myTaskProjectName,
                    color=None,
                    status=None,
                    icon=None,
                    view=None,
                    description=None,
                    public=None,
                    start=None,
                    due=None,
                    completed=False
                )

    def myTaskProjectFor(self, userId):
        if None == self.projects:
            self.projects = []
        elif len(self.projects) == 0:
            # check db; then create if not found
            exists = Project.query.filter_by(name=self.myTaskProjectName, ownerId=userId, workspaceId=self.id).first()
            if exists:
                self.projects.append(exists)
            else: # create
                p = self.createMyTaskProject(userId)
                self.projects.append(p)
        for i in range(len(self.projects)):
            if self.projects[i].name == self.myTaskProjectName and self.projects[i].ownerId == userId and self.projects[i].workspaceId == self.id:
                return self.projects[i]
        return None

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

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'ownerId': self.ownerId,
            'teammates': [teammate.id for teammate in self.teammates],
            'projects': [project.id for project in self.projects]
        }
