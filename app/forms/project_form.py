from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, DateField
from wtforms.validators import InputRequired, Length


class ProjectForm(FlaskForm):
    name=StringField('name', validators=[InputRequired(), Length(max=50)])
    description=StringField('description')
    public=BooleanField('public')
    start=DateField('start')
    due=DateField('due')
    completed=BooleanField('completed')
