from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
import datetime
import enum


class MenuItemEnum(enum.Enum):
    appetizer = "appetizer"
    entree = "entree"
    dessert = "dessert"
    beverage = "beverage"

    @staticmethod
    def to_list():
        return [item.value for item in MenuItemEnum]


class MenuItem(db.Model):
    __tablename__ = "menu_items"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("restaurants.id")), nullable=False
    )
    name = db.Column(db.String, nullable=False)
    food_type = db.Column(db.Enum(MenuItemEnum), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    food_image = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    updated_at = db.Column(
        db.DateTime, default=datetime.datetime.now(), onupdate=datetime.datetime.now()
    )

    # one-to-many: one restaurant can have many menu_items
    restaurants = db.relationship("Restaurant", back_populates="menu_items")
    # one-to-many: one order can have many menu_items
    order_items = db.relationship(
        "OrderItem", back_populates="menu_items", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "restaurantId": self.restaurant_id,
            "name": self.name,
            "food_type": self.food_type.value,
            "description": self.description,
            "price": self.price,
            "food_image": self.food_image,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
