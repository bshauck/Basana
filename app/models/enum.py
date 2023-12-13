# app/models/enum.py
from .db import db, environment, SCHEMA

# Originally, dark-pink dark-green dark-blue dark-red dark-teal dark-brown dark-orange dark-purple dark-warm-gray light-pink light-green light-blue light-red light-teal light-brown light-orange light-purple light-warm-gray none
class Color(db.Model):
    """Data model for colors. Really should be an enum, but SQLAlchemy doesn't support that easily."""
    __tablename__ = 'color'
    maxIndex = 19

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15), nullable=False, unique=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }


#'list' 'board' 'calendar' 'timeline'
class ViewType (db.Model):
    """Data model for ways to display task lists. Really should be an enum, but SQLAlchemy doesn't support that easily."""
    __tablename__ = 'view_type'
    maxIndex = 4

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(8), nullable=False, unique=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.type,
        }


#('Pending', 'Approved', 'Rejected', 'Changes requested')
#('On track', 'At risk', 'Off track', 'On hold', 'Completed')
class Status (db.Model):
    """Data model for project or task status. Really should be an enum, but SQLAlchemy doesn't support that easily."""
    __tablename__ = 'status'
    maxIndex = 9

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.String(17), nullable=False, unique=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.state
        }


class ProjectIcon (db.Model):
    """Data model for project icons. Really should be an enum, but SQLAlchemy doesn't support that easily."""
    __tablename__ = 'project_icon'
    maxIndex = 33

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    icon = db.Column(db.String(20), nullable=False, unique=True)

    def to_dict(self):
        return {
            'id': self.id,
            'icon': self.icon,
        }
