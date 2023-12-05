from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import InputRequired, Length


class SectionForm(FlaskForm):
    name=StringField('name', validators=[InputRequired(), Length(max=50)])
    index = IntegerField('index', validators=[InputRequired()])
