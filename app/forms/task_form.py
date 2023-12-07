from flask_wtf import FlaskForm
from wtforms import StringField, DateField, TextAreaField, BooleanField
from wtforms.validators import InputRequired, Length


class TaskForm(FlaskForm):
    title=StringField('title', validators=[InputRequired(), Length(max=50)])
    description = TextAreaField('description')
    # start = DateField('start')
    # due = DateField('due')
    complete = BooleanField('complete')
    public = BooleanField('public')
