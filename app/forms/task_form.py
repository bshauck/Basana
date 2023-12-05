from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, DateField
from wtforms.validators import InputRequired, Length


class TaskForm(FlaskForm):
    name=StringField('name', validators=[InputRequired(), Length(max=50)])
    description = StringField('description')
   # status = db.Column(db.Integer, nullable=True, default=1, db.ForeignKey(add_prefix_for_prod('status.id')))
    start = DateField('start')
    due = DateField('due')
