from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime




class Section(db.Model):
    __tablename__ = 'section'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    projectId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('project.id')), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    index = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.String(24), nullable=False)

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


user_member_project = db.Table(
    'user_member_project',
    db.Model.metadata,
    db.Column('userId', db.Integer, db.ForeignKey(add_prefix_for_prod('user.id')), primary_key=True),
    db.Column('projectId', db.Integer, db.ForeignKey(add_prefix_for_prod('project.id')), primary_key=True)
)

user_member_workspace = db.Table(
    'user_member_workspace',
    db.Model.metadata,
    db.Column('userId', db.Integer, db.ForeignKey(add_prefix_for_prod('user.id')), primary_key=True),
    db.Column('workspaceId', db.Integer, db.ForeignKey(add_prefix_for_prod('workspace.id')), primary_key=True)
)

class Project(db.Model):
    __tablename__ = 'project'
    myTaskProjectName = "My tasks"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        db.session.commit() # because I need to create sections with the right projectId
        self.createSectionsForMyTask()


    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('user.id')), nullable=False)
    workspaceId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('workspace.id')), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    color = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('color.id')))
    status = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('status.id')))
    icon = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('project_icon.id')))
    view = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('view_type.id')))
    description = db.Column(db.Text)
    public = db.Column(db.Boolean)
    start = db.Column(db.String(24))
    due = db.Column(db.String(24))
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
            'completed': self.completed
        }


class Workspace(db.Model):
    __tablename__ = 'workspace'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
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
        cascade="all, delete-orphan"
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
            'ownerId': self.ownerId
        }



class User(db.Model, UserMixin):
    __tablename__ = 'user'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashedPassword = db.Column(db.String(255), nullable=False)
    # profilePictureUrl = db.Column(db.String(255), nullable=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        db.session.commit() # because I need to create a workspace with the right ownerId
        if len(self.workspaces) == 0 and Workspace.query.filter_by(name=self.username + "'s team").first() is None :
            self.workspaces.append(Workspace(ownerId=self.id, name=self.username + "'s team"))

    ownedProjects = db.relationship(
        "Project",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    projects = db.relationship(
        "Project",
        secondary=user_member_project,
        back_populates="members",
    )

    workspaces = db.relationship(
        "Workspace",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    teams = db.relationship(
        "Workspace",
        secondary=user_member_workspace,
        back_populates="teammates",
    )

    @property
    def password(self):
        return self.hashedPassword

    @password.setter
    def password(self, password):
        self.hashedPassword = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
