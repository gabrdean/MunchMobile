from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DecimalField, PasswordField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    if email:
        user = User.query.filter(User.email == email).first()
        if user:
            raise ValidationError("Email address is already in use.")


def phone_exists(form, field):
    # Checking if user exists
    phone_number = field.data
    if phone_number:
        user = User.query.filter(User.phone_number == phone_number).first()
        if user:
            raise ValidationError("Phone number is already in use.")



class SignUpForm(FlaskForm):
    first_name = StringField("first Name", validators=[DataRequired()])
    last_name = StringField("last Name")
    phone_number = StringField("phone Number", validators=[phone_exists])
    email = StringField("email", validators=[user_exists, Email()])
    password = PasswordField("password", validators=[DataRequired()])
    wallet = DecimalField('Wallet', validators=[DataRequired()])
