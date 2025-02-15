from app.models import db, Order, environment, SCHEMA
from sqlalchemy.sql import text


def seed_orders():
    users = [1, 2, 3, 4, 5]  # 5 users
    restaurants = [1, 2, 3, 4, 5, 6]  # 6 restaurants

    orders = []
    order_id = 1

    for user in users:
        for restaurant in restaurants:
            order = Order(
                id=order_id,  # Ensure IDs align with order_items
                restaurant_id=restaurant,
                user_id=user,
                total_cost=0,  # This will be updated later
                status="Completed",
                promo=None,
            )
            orders.append(order)
            order_id += 1

    db.session.add_all(orders)
    db.session.commit()


def undo_orders():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM orders"))

    db.session.commit()
