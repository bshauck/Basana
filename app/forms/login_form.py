from flask_wtf import FlaskForm
from wtforms import StringField, EmailField
from wtforms.validators import InputRequired, Email, Length, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if not user:
        raise ValidationError('Email provided not found.')


def password_matches(form, field):
    # Checking if password matches
    password = field.data
    email = form.data['email']
    user = User.query.filter(User.email == email).first()
    if not user:
        raise ValidationError('No such user exists.')
    if not user.check_password(password):
        raise ValidationError('Password was incorrect.')


class LoginForm(FlaskForm):
    email = EmailField('email', validators=[InputRequired(), Length(6, 255,"Email: 6 - 255 characters"), Email(message="Email format: username@domain.extension"), user_exists])
    password = StringField('password', validators=[InputRequired(), Length(6, 255,"Password: 6 - 255 characters"), password_matches])
