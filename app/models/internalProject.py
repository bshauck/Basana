from .db import db, environment, SCHEMA, prodify, SEED
from .section import Section
from datetime import datetime


class InternalProject(db.Model):
    __tablename__ = 'internal_project'
    myTaskProjectName = "My tasks"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        self.createSectionsForMyTask()

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey(prodify('userb.id')), nullable=False)
    workspaceId = db.Column(db.Integer, db.ForeignKey(prodify('workspace.id'), ondelete='CASCADE'),nullable=False)
    name = db.Column(db.String(50), nullable=False)

    sections = db.relationship(
        'Section',
        back_populates='internalProject',
        cascade="all, delete",
        passive_deletes=True
    )

    tasks = db.relationship(
        'Task',
        back_populates='internalProject',
        cascade="all, delete",
        passive_deletes=True
    )

    owner = db.relationship(
        'User',
        back_populates='internalProjects'
    )

    workspace = db.relationship(
        'Workspace',
        back_populates='internalProjects'
    )

    def addSectionsNamed(self, names):
        timeNow = datetime.now()
        for i in range(len(names)):
            self.addToSectionsSession(Section(internalProject=self, name=names[i], index=i * 1000 + 1, createdAt=timeNow))

    def addToSectionsSession(self, section):
        self.sections.append(section)
        db.session.add(section)

    def createSectionsForMyTask(self):
        self.addSectionsNamed(( "Untitled section", "Recently assigned", "Do today", "Do next week", "Do later" ))

    def name(self):
        return self.myTaskProjectName

    def to_dict(self):
        return {
            'id': self.id,
            'ownerId': self.ownerId,
            'workspaceId': self.workspaceId,
            'sections': [section.id for section in self.sections]
        }
