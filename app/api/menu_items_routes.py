from flask import Blueprint, request
from ..models.menu_items import MenuItem
from ..models import db
from ..forms.menu_item_form import MenuItemForm
from .. models.restaurants import Restaurant
from ..models.user import User
from flask_login import login_required,current_user
from datetime import datetime
from flask import jsonify
from flask_cors import CORS

menu_item_routes = Blueprint('menu_items', __name__)
# api/menu-items/


@menu_item_routes.route('/<int:id>', methods=['GET'])
def get_menu_item(id):
    menu_item = MenuItem.query.get(id)
    if menu_item:
        restaurant = Restaurant.query.get(menu_item.restaurant_id)
        return jsonify({
            **menu_item.to_dict(),
            "restaurant_owner_id": restaurant.owner_id,  # Include restaurant owner ID
        }), 200
    else:
        return jsonify({"error": "Menu item not found"}), 404




### Get all-menu item # api/menu-items
@menu_item_routes.route('/', methods=['GET'])
def get_menu_items():
    menu_items = (
        db.session.query(MenuItem, Restaurant.name)
        .join(Restaurant, MenuItem.restaurant_id == Restaurant.id)
        .all()
    )

    return jsonify([
        {**item.to_dict(), "restaurant_name": restaurant_name}
        for item, restaurant_name in menu_items
    ]), 200




@menu_item_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_menu_item(id):
    """
    Updates a menu item and returns the updated item.
    """
    menu_item = MenuItem.query.get(id)
    if not menu_item:
        return jsonify({"error": "Menu item not found"}), 404

    # Check if the logged-in user owns the restaurant
    restaurant = Restaurant.query.get(menu_item.restaurant_id)
    if restaurant.owner_id != current_user.id:
        return jsonify({"error": "Unauthorized: You do not own this restaurant"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request, JSON data required"}), 400

    # Update the menu item fields
    menu_item.name = data.get("name", menu_item.name)
    menu_item.description = data.get("description", menu_item.description)
    menu_item.price = data.get("price", menu_item.price)
    menu_item.food_image = data.get("food_image", menu_item.food_image)
    menu_item.food_type = data.get("food_type", menu_item.food_type)
    menu_item.updated_at = datetime.now()

    try:
        db.session.commit()
        return jsonify(menu_item.to_dict()), 200  # Return the updated menu item
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500




@menu_item_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_menu_item(id):
    """
    Delete a menu item if the logged-in user owns the restaurant.
    """
    menu_item = MenuItem.query.get(id)

    if not menu_item:
        return jsonify({"error": "Menu item not found"}), 404

    # Fetch the restaurant associated with the menu item
    restaurant = Restaurant.query.get(menu_item.restaurant_id)

    # Check if the logged-in user owns the restaurant
    if restaurant.owner_id != current_user.id:
        return jsonify({"error": "Unauthorized: You do not own this restaurant"}), 403

    try:
        db.session.delete(menu_item)
        db.session.commit()
        return jsonify({"message": "Menu item deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500



@menu_item_routes.route('/', methods=['POST'])
@login_required
def create_menu_item():
    """
    Creates a new menu item for the logged-in user's restaurant.
    """
    form = MenuItemForm(meta={'csrf': False})  # Disable CSRF for API
    data = request.get_json()  # Extract JSON body

    if not data:
        return jsonify({"error": "Invalid request, JSON data required"}), 400

    restaurant_name = data.get("restaurant_name")
    if not restaurant_name:
        return jsonify({"error": "restaurant_name is required"}), 400

    # Look up the restaurant by name
    restaurant = Restaurant.query.filter_by(name=restaurant_name).first()
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404

    # Check if the logged-in user is the owner of the restaurant
    if restaurant.owner_id != current_user.id:
        return jsonify({"error": "Unauthorized: You are not the owner of this restaurant"}), 403

    if form.validate_on_submit():
        new_item = MenuItem(
            restaurant_id=restaurant.id,  # Use the ID of the found restaurant
            name=data.get("name"),
            food_type=data.get("food_type"),
            description=data.get("description"),
            price=data.get("price"),
            food_image=data.get("food_image"),
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

        try:
            db.session.add(new_item)
            db.session.commit()
            return jsonify(new_item.to_dict()), 201  # Return created item with status 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({"errors": form.errors}), 400
