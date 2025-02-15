from .db import db, environment, SCHEMA, add_prefix_for_prod
import datetime
from enum import Enum
from sqlalchemy import Numeric


class PriceLevel(Enum):
    INEXPENSIVE = "$"
    MODERATE = "$$"
    EXPENSIVE = "$$$"
    VERY_EXPENSIVE = "$$$$"


class CuisineType(Enum):
    AMERICAN = "AMERICAN"
    CHINESE = "CHINESE"
    ITALIAN = "ITALIAN"
    JAPANESE = "JAPANESE"
    MEXICAN = "MEXICAN"
    INDIAN = "INDIAN"
    THAI = "THAI"
    MEDITERRANEAN = "MEDITERRANEAN"
    KOREAN = "KOREAN"
    VIETNAMESE = "VIETNAMESE"
    GREEK = "GREEK"
    SPANISH = "SPANISH"
    SEAFOOD = "SEAFOOD"
    PIZZA = "PIZZA"
    VEGETARIAN = "VEGETARIAN"
    VEGAN = "VEGAN"
    BREAKFAST = "BREAKFAST"
    FAST_FOOD = "FAST FOOD"
    CARIBBEAN = "CARIBBEAN"
    SOUL_FOOD = "SOUL FOOD"


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    address = db.Column(
        db.String(255),
        nullable=False,
    )
    city = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255), nullable=False)
    zip = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(255), nullable=False, unique=True)
    cuisine_type = db.Column(db.Enum(CuisineType), nullable=False)
    delivery_fee = db.Column(Numeric(10, 2))
    business_hours = db.Column(db.String(255), nullable=False)
    servicing = db.Column(db.Boolean, nullable=False)
    store_image = db.Column(db.Text)  # URL
    description = db.Column(db.Text, nullable=False)
    price_level = db.Column(db.Enum(PriceLevel), nullable=False)
    delivery_time = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    updated_at = db.Column(
        db.DateTime, default=datetime.datetime.now(), onupdate=datetime.datetime.now()
    )

    # RELATIONSHIPS
    users = db.relationship("User", back_populates="restaurants")
    menu_items = db.relationship("MenuItem", back_populates="restaurants", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="restaurants", cascade = "all, delete-orphan")
    orders = db.relationship("Order", back_populates="restaurants", cascade = "all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "ownerId": self.owner_id,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip": self.zip,
            "name": self.name,
            "cuisineType": self.cuisine_type.value if self.cuisine_type else None,
            "deliveryFee": float(self.delivery_fee) if self.delivery_fee else None,
            "businessHours": self.business_hours,
            "servicing": self.servicing,
            "storeImage": self.store_image,
            "description": self.description,
            "priceLevel": self.price_level.value if self.price_level else None,
            "deliveryTime": self.delivery_time,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }
