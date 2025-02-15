from app.models import db, OrderItem, environment, SCHEMA, MenuItem, Order
from sqlalchemy.sql import text


def seed_order_items():
    order_items = []
    orders = Order.query.all()
    menu_items = MenuItem.query.all()

    # Group menu items by restaurant
    menu_items_by_restaurant = {}
    for item in menu_items:
        if item.restaurant_id not in menu_items_by_restaurant:
            menu_items_by_restaurant[item.restaurant_id] = []
        menu_items_by_restaurant[item.restaurant_id].append(item)

    for order in orders:
        if order.restaurant_id not in menu_items_by_restaurant:
            continue  # Skip orders with no menu items available

        available_menu_items = menu_items_by_restaurant[order.restaurant_id]
        selected_items = available_menu_items[:3]  # Select first 3 items for variety

        total_cost = 0
        for menu_item in selected_items:
            quantity = 1  # Default quantity
            total_cost += menu_item.price * quantity

            order_items.append(
                OrderItem(
                    order_id=order.id,
                    menu_item_id=menu_item.id,
                    quantity=quantity,
                    price=menu_item.price,
                )
            )

        # Update the order's total_cost
        order.total_cost = total_cost

    db.session.add_all(order_items)
    db.session.commit()


def undo_order_items():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.order_items RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM order_items"))

    db.session.commit()
