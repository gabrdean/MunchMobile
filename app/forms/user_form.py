from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FileField, PasswordField
from wtforms.validators import Email
from flask_wtf.file import FileAllowed


class UserForm(FlaskForm):
    first_name = StringField("first Name")
    last_name = StringField("last Name")
    phone_number = StringField("phone Number")
    email = StringField("email", validators=[Email()])
    password = PasswordField("password")
    address = StringField("address")
    city = StringField("city")
    state = StringField("state")
    zip = IntegerField("zip")
    profile_image = FileField('profile image', validators=[FileAllowed(['jpg', 'jpeg', 'png', 'webp'])])

class FundsForm(FlaskForm):
    amount = IntegerField("amount")