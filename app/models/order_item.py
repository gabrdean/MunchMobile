from .db import db, environment, SCHEMA, add_prefix_for_prod
import datetime


class OrderItem(db.Model):
    __tablename__ = "order_items"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("orders.id")), nullable=False
    )
    menu_item_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("menu_items.id")), nullable=False
    )
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(
        db.Numeric(10, 2), nullable=False
    )  # Stores price at the time of purchase
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    updated_at = db.Column(
        db.DateTime, default=datetime.datetime.now(), onupdate=datetime.datetime.now()
    )

    order = db.relationship("Order", back_populates="order_items")
    menu_items = db.relationship("MenuItem", back_populates="order_items")

    def to_dict(self):
        return {
            "id": self.id,
            "orderId": self.order_id,
            "menuItemId": self.menu_item_id,
            "quantity": self.quantity,
            "price": float(self.price),
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }
