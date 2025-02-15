from flask_wtf import FlaskForm
from wtforms import SelectField, StringField, FloatField, TextAreaField
from wtforms.validators import DataRequired, Length, URL


item_types = ["appetizer", "entree", "dessert", "beverage"]


class MenuItemForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    food_type = SelectField("food_type", choices=item_types, validators=[DataRequired()])
    description = TextAreaField("Description")
    price = FloatField("Price", validators=[DataRequired()])
    food_image = StringField(
        "food_image URL", validators=[DataRequired(), URL(), Length(min=1, max=255)]
    )
    restaurant_name = StringField("Restaurant Name", validators=[DataRequired()])  # New field for restaurant name