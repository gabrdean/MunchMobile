from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Review(db.Model):
    __tablename__ = "reviews"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("restaurants.id")), nullable=False
    )
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    order_id = db.Column(db.Integer, nullable=False)
    review = db.Column(db.Text, nullable=True)
    order_rating = db.Column(db.Integer, nullable=False)
    restaurant_rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    users = db.relationship("User", back_populates="reviews")
    restaurants = db.relationship("Restaurant", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "restaurantId": self.restaurant_id,
            "userId": self.user_id,
            "orderId": self.order_id,
            "review": self.review,
            "orderRating": self.order_rating,
            "restaurantRating": self.restaurant_rating,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }
