from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import InputRequired, Length


class ProjectForm(FlaskForm):
    name=StringField('name', validators=[InputRequired(), Length(max=50)])
