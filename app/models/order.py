from .db import db, environment, SCHEMA, add_prefix_for_prod
import datetime
from sqlalchemy import Enum


class Order(db.Model):
    __tablename__ = "orders"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("restaurants.id")), nullable=False
    )
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    total_cost = db.Column(
        db.Numeric(10, 2), nullable=False
    )  # Matches `totalCost` in your schema
    status = db.Column(
        Enum("Submitted", "Completed", "Canceled", "Active", name="order_status"),
        nullable=False,
        default="Active",
    )
    promo = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    updated_at = db.Column(
        db.DateTime, default=datetime.datetime.now(), onupdate=datetime.datetime.now()
    )

    users = db.relationship("User", back_populates="orders")
    restaurants = db.relationship("Restaurant", back_populates="orders")
    order_items = db.relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "restaurantId": self.restaurant_id,
            "userId": self.user_id,
            "totalCost": float(self.total_cost),
            "status": self.status,
            "promo": self.promo,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
            "orderItems": [
                item.to_dict() for item in self.order_items
            ],  # Include order items
        }
