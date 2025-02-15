from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models.db import db
from app.models import Order, OrderItem, MenuItem
from datetime import timezone

order_routes = Blueprint("orders", __name__)


# Get all orders for the current user
# @order_routes.route("/")
# @login_required
# def get_orders():
#     orders = Order.query.filter_by(user_id=current_user.id).all()
#     if not orders:
#         return {"message": "No orders found"}, 404

#     return jsonify({"orders": [order.to_dict() for order in orders]}), 200


@order_routes.route("/")
@login_required
def get_orders():
    # Include orders with status 'Submitted' as well
    orders = Order.query.filter(Order.user_id == current_user.id).all()

    if not orders:
        return jsonify({"orders": [], "message": "No orders found"}), 200  # Return empty list instead of 404

    formatted_orders = []
    for order in orders:
        restaurant = order.restaurants
        restaurant_data = (
            {
                "id": restaurant.id,
                "name": restaurant.name,
                "image": restaurant.store_image,
                "address": restaurant.address,
                "city": restaurant.city,
            }
            if restaurant
            else {
                "id": None,
                "name": "Unknown",
                "address": "Unknown Address",
                "city": "Unknown City",
                "image": None,
            }
        )

        formatted_orders.append(
            {
                "id": order.id,
                "createdAt": order.created_at.astimezone(timezone.utc).isoformat()
                if order.created_at
                else None,
                "updatedAt": order.updated_at.astimezone(timezone.utc).isoformat()
                if order.updated_at
                else None,
                "status": order.status,
                "totalCost": float(order.total_cost),
                "restaurant": restaurant_data,
                "orderItems": [
                    {
                        "id": item.id,
                        "menu_item_id": item.menu_item_id,
                        "menu_item_name": item.menu_items.name,
                        "quantity": item.quantity,
                        "price": float(item.price),
                        "restaurant_id": item.menu_items.restaurants.id,
                        "food_image": item.menu_items.food_image,
                    }
                    for item in order.order_items
                ],
            }
        )

    return jsonify({"orders": formatted_orders}), 200


# Get details of a specific order made by the user
# @order_routes.route("/<int:order_id>")
# @login_required
# def get_order(order_id):
#     order = Order.query.get(order_id)
#     if not order:
#         return {"message": "Order not found"}, 404
#     if order.user_id != current_user.id:
#         return {"message": "Unauthorized"}, 403

#     return jsonify(order.to_dict()), 200


@order_routes.route("/<int:order_id>")
@login_required
def get_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404
    if order.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    # Get restaurant details
    restaurant = order.restaurants  # Assuming a one-to-one relationship
    restaurant_data = (
        {
            "id": restaurant.id,
            "name": restaurant.name,
            "address": restaurant.address,
            "city": restaurant.city,
            "image": restaurant.store_image,
        }
        if restaurant
        else {
            "id": None,
            "name": "Unknown",
            "address": "Unknown Address",
            "city": "Unknown City",
            "image": None,
        }
    )

    # Get order items with menu item names
    order_items = [
        {
            "id": item.id,
            "menu_item_id": item.menu_item_id,  # Include menu_item_id
            "menu_item_name": item.menu_items.name,
            "quantity": item.quantity,
            "price": float(item.price),
            "restaurant_id": order.restaurant_id,
            "food_image": item.menu_items.food_image,
        }
        for item in order.order_items
    ]

    # Return full order details
    return jsonify(
        {
            "id": order.id,
            "createdAt": order.created_at.astimezone(timezone.utc).isoformat()
            if order.created_at
            else None,
            "updatedAt": order.updated_at.astimezone(timezone.utc).isoformat()
            if order.updated_at
            else None,
            "status": order.status,
            "totalCost": float(order.total_cost),
            "restaurant": restaurant_data,
            "orderItems": [
                {
                    "id": item.id,
                    "menu_item_id": item.menu_item_id,  # Ensure menu_item_id is included
                    "menu_item_name": item.menu_items.name,
                    "quantity": item.quantity,
                    "price": float(item.price),
                    "restaurant_id": item.menu_items.restaurants.id,
                    "food_image": item.menu_items.food_image,
                }
                for item in order.order_items
            ],
        }
    ), 200


# Get all orders for the current user at a specific restaurant
@order_routes.route("/restaurant/<int:restaurant_id>")
@login_required
def get_orders_by_restaurant(restaurant_id):
    orders = Order.query.filter_by(
        user_id=current_user.id, restaurant_id=restaurant_id
    ).all()

    if not orders:
        return {"message": "No orders found for this restaurant."}, 404

    return jsonify({"orders": [order.to_dict() for order in orders]}), 200


# Create a new order in the cart (status = Active) and add items to it
@order_routes.route("/", methods=["POST"])
@login_required
def create_order():
    data = request.get_json()
    restaurant_id = data.get("restaurant_id")
    items = data.get("items", [])  # List of {"menu_item_id": X, "quantity": Y}
    promo = data.get("promo", None)

    if not restaurant_id:
        return {"message": "Restaurant ID is required"}, 400

    # Validate that all menu items belong to the same restaurant
    menu_item_ids = [int(item["menu_item_id"]) for item in items]

    menu_items = MenuItem.query.filter(MenuItem.id.in_(menu_item_ids)).all()

    if not menu_items:
        return {"message": "Invalid menu items provided."}, 400

    # Ensure all items belong to the same restaurant
    restaurant_ids = {menu_item.restaurant_id for menu_item in menu_items}
    if len(restaurant_ids) > 1 or restaurant_id not in restaurant_ids:
        return {"message": "All items must be from the same restaurant."}, 400

    # Verify that all items are from the same restaurant
    for menu_item in menu_items:
        if int(menu_item.restaurants.id) != int(restaurant_id):
            return {"message": "All items must be from the same restaurant."}, 400

    total_cost = sum(
        menu_item.price * int(item["quantity"])
        for menu_item, item in zip(menu_items, items)
    )

    if not total_cost:
        return jsonify({"message": "Order must have a valid total cost."}), 400

    new_order = Order(
        user_id=current_user.id,
        restaurant_id=restaurant_id,
        status="Active",
        promo=promo,
        total_cost=total_cost,  # Set the total_cost here
    )

    db.session.add(new_order)
    db.session.flush()  # Get order ID before adding items

    # Add items to order
    order_items = []
    for item in items:
        menu_item = MenuItem.query.get(item["menu_item_id"])
        quantity = item["quantity"]

        order_items.append(
            OrderItem(
                order_id=new_order.id,
                menu_item_id=menu_item.id,
                quantity=quantity,
                price=menu_item.price,
            )
        )

    db.session.add_all(order_items)
    db.session.commit()

    return jsonify(new_order.to_dict()), 201


"""
example request body: {
    "restaurant_id": "1",
    "items": [
        {
            "menu_item_id": "2",
            "quantity": "2"
        },
        {
            "menu_item_id": "3",
            "quantity": "1"
        }
    ]
    "promo": "DISCOUNT10"
}
"""


# Modify items in an order while it's in the cart (status = Active)
@order_routes.route("/<int:order_id>", methods=["PUT"])
@login_required
def update_order_items(order_id):
    order = Order.query.get(order_id)
    if not order:
        return {"message": "Order not found"}, 404
    if order.user_id != current_user.id:
        return {"message": "Unauthorized"}, 403
    if order.status != "Active":
        return {"message": "Cannot modify items in a completed order."}, 403

    data = request.get_json()
    items = data.get("items", [])

    if not isinstance(items, list):
        return {"message": "Invalid request. 'items' must be a list."}, 400

    total_cost = 0

    # Process new or updated items
    for item in items:
        menu_item = MenuItem.query.get(item["menu_item_id"])
        quantity = item["quantity"]

        order_item = OrderItem.query.filter_by(
            order_id=order.id, menu_item_id=menu_item.id
        ).first()

        if order_item:
            if quantity > 0:
                order_item.quantity = quantity  # Update quantity
            else:
                db.session.delete(order_item)  # Remove item if quantity is 0
        else:
            db.session.add(
                OrderItem(
                    order_id=order.id,
                    menu_item_id=menu_item.id,
                    quantity=quantity,
                    price=menu_item.price,
                )
            )

        total_cost += menu_item.price * quantity

    order.total_cost = total_cost  # Recalculate total
    db.session.commit()

    return jsonify(order.to_dict()), 200


"""
{
    "items": [
        {
            "menu_item_id": 2,
            "quantity": 3
        },
        {
            "menu_item_id": 5,
            "quantity": 3
        }
    ]
}
"""


# User finalizes the order (status = Submitted).
@order_routes.route("/<int:order_id>/submit", methods=["PUT"])
@login_required
def complete_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404
    if order.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    if order.status != "Active":
        return jsonify(
            {"message": "Order cannot be completed. Already processed or canceled."}
        ), 403

    order.status = "Submitted"
    db.session.commit()

    # Fetch the updated order from the database again
    updated_order = Order.query.get(order_id)
    return jsonify(updated_order.to_dict()), 200  # ✅ Return the updated order object

    # return jsonify(
    #     {
    #         "id": order.id,
    #         "status": order.status,
    #         "totalCost": float(order.total_cost),
    #         "restaurant": {
    #             "id": order.restaurants.id,
    #             "name": order.restaurants.name,
    #             "address": order.restaurants.address,
    #             "city": order.restaurants.city,
    #             "image": order.restaurants.store_image,
    #         },
    #         "orderItems": [
    #             {
    #                 "id": item.id,
    #                 "menu_item_id": item.menu_item_id,
    #                 "menu_item_name": item.menu_items.name,
    #                 "quantity": item.quantity,
    #                 "price": float(item.price),
    #                 "restaurant_id": item.menu_items.restaurants.id,
    #             }
    #             for item in order.order_items
    #         ],
    #     }
    # ), 200


# deletes order
@order_routes.route("/<int:order_id>", methods=["DELETE"])
@login_required
def delete_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return {"message": "Order not found"}, 404
    if order.user_id != current_user.id:
        return {"message": "Unauthorized"}, 403

    # Delete all associated order items first
    OrderItem.query.filter_by(order_id=order.id).delete()
    db.session.delete(order)
    db.session.commit()

    return {"message": "Successfully deleted order"}, 200


# # possible future routes

# # Cancels an order. If still in cart (Active), it's deleted. Otherwise, it's marked as Canceled
# @order_routes.route("/<int:order_id>/cancel", methods=["PUT"])
# @login_required
# def cancel_order(order_id):
#     order = Order.query.get(order_id)
#     if not order:
#         return {"message": "Order not found"}, 404
#     if order.user_id != current_user.id:
#         return {"message": "Unauthorized"}, 403

#     if order.status == "Active":
#         # If still in cart mode, remove completely
#         db.session.delete(order)
#         db.session.commit()
#         return {"message": "Order successfully removed from cart"}, 200

#     if order.status == "Completed":
#         return {"message": "Cannot cancel a completed order"}, 403

#     # Mark order as canceled
#     order.status = "Canceled"
#     db.session.commit()

#     return jsonify(
#         {"message": "Order successfully canceled", "order": order.to_dict()}
#     ), 200


# # Update an existing order's status or promo
# @order_routes.route("/<int:order_id>", methods=["PUT"])
# @login_required
# def update_order(order_id):
#     order = Order.query.get(order_id)
#     if not order:
#         return {"message": "Order not found"}, 404
#     if order.user_id != current_user.id:
#         return {"message": "Unauthorized"}, 403

#     data = request.get_json()
#     order.status = data.get("status", order.status)
#     order.promo = data.get("promo", order.promo)

#     db.session.commit()

#     return jsonify(order.to_dict()), 200


# # creates empty cart as a new order
# @order_routes.route("/", methods=["POST"])
# @login_required
# def create_order():
#     data = request.get_json()
#     restaurant_id = data.get("restaurant_id")
#     promo = data.get("promo", None)

#     if not restaurant_id:
#         return {"message": "Restaurant ID is required"}, 400

#     new_order = Order(
#         user_id=current_user.id,
#         restaurant_id=restaurant_id,
#         status="Active",  # Cart mode
#         promo=promo,
#     )

#     db.session.add(new_order)
#     db.session.commit()

#     return jsonify(new_order.to_dict()), 201

# # Create a new order with multiple menu items
# @order_routes.route("/", methods=["POST"])
# @login_required
# def create_order():
#     data = request.get_json()
#     items = data.get(
#         "items"
#     )  # Expected format: [{"menu_item_id": 1, "quantity": 2}, {...}]
#     promo = data.get("promo", None)

#     if not items or not isinstance(items, list):
#         return {
#             "message": "Invalid request. 'items' must be a list of menu items."
#         }, 400

#     total_cost = 0
#     order_items = []

#     # Validate menu items and calculate total cost
#     for item in items:
#         menu_item_id = item.get("menu_item_id")
#         quantity = item.get("quantity", 1)

#         menu_item = MenuItem.query.get(menu_item_id)
#         if not menu_item:
#             return {"message": f"Menu item with ID {menu_item_id} not found"}, 404

#         total_cost += menu_item.price * quantity

#         order_items.append(
#             OrderItem(menu_item_id=menu_item_id, quantity=quantity, price=menu_item.price)
#         )

#     # Create order
#     new_order = Order(
#         user_id=current_user.id,
#         restaurant_id=menu_item.restaurant_id,
#         total_cost=total_cost,
#         promo=promo,
#     )
#     db.session.add(new_order)
#     db.session.flush()

#     # Add items to order
#     for order_item in order_items:
#         order_item.order_id = new_order.id
#         db.session.add(order_item)

#     db.session.commit()

#     return jsonify(new_order.to_dict()), 201
