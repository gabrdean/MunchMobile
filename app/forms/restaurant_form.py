from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    SelectField,
    TextAreaField,
    IntegerField,
    DecimalField,
    BooleanField,
    URLField,
)
from wtforms.validators import DataRequired, Length, NumberRange, URL, Optional
from app.models.restaurants import CuisineType, PriceLevel


class RestaurantForm(FlaskForm):
    name = StringField(
        "Restaurant Name", validators=[DataRequired(), Length(min=1, max=255)]
    )

    address = StringField(
        "Address",
        validators=[DataRequired(message="Street Adress is Required"), Length(max=255)],
    )

    city = StringField(
        "City", validators=[DataRequired(message="Select a City"), Length(max=255)]
    )

    state = StringField(
        "State",
        validators=[
            DataRequired(message="Please Select a CuisineType"),
            Length(max=255),
        ],
    )

    zip = IntegerField(
        "ZIP Code", validators=[DataRequired(), NumberRange(min=1, max=99999)]
    )

    cuisine_type = SelectField(
        "Cuisine Type",
        choices=[(c.name, c.value) for c in CuisineType],  # Store as Enum keys
        validators=[DataRequired()],
    )
    
    price_level = SelectField(
        "Price Level",
        choices=[(p.name, p.value) for p in PriceLevel],  # Store as Enum keys
        validators=[DataRequired()],
    )

    delivery_fee = DecimalField("Delivery Fee", validators=[Optional()], places=2)

    business_hours = StringField(
        "Business Hours", validators=[DataRequired(), Length(max=255)]
    )

    servicing = BooleanField("Currently servicing", default=True)

    store_image = URLField("Store Image URL", validators=[Optional(), URL()])

    description = TextAreaField("Description", validators=[DataRequired()])

    delivery_time = IntegerField(
        "Delivery Time (minutes)", validators=[Optional(), NumberRange(min=1)]
    )

    def to_dict(self):
        return {
            "name": self.name.data,
            "address": self.address.data,
            "city": self.city.data,
            "state": self.state.data,
            "zip": self.zip.data,
            "cuisine_type": self.cuisine_type.data,
            "delivery_fee": float(self.delivery_fee.data)
            if self.delivery_fee.data
            else None,
            "business_hours": self.business_hours.data,
            "servicing": self.servicing.data,
            "store_image": self.store_image.data,
            "description": self.description.data,
            "price_level": self.price_level.data,
            "delivery_time": self.delivery_time.data,
        }
