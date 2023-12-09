from flask_wtf import FlaskForm
from wtforms import StringField, EmailField
from wtforms.validators import InputRequired, Email, Length, Optional, ValidationError
# from flask_wtf.file import FileField, FileAllowed
# from .utils import ALLOWED_EXTENSIONS
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[InputRequired(), Length(6, 40, "Username: 6 - 40 characters"),username_exists])
    email = EmailField('email', validators=[InputRequired(), Length(6, 255, "Email:6 - 255 characters"), Email("Invalid email"), user_exists])
    password = StringField('password', Length(6, 255, "Password: 6 - 255 characters"), validators=[InputRequired()])
#    profilePicture = FileField('profile picture', validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
