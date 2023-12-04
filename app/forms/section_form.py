from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import InputRequired, Length


class SectionForm(FlaskForm):
    name=StringField('name', validators=[InputRequired(), Length(max=50)])
    index = db.Column(db.Integer, nullable=False)
