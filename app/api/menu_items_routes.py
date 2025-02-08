from flask import Blueprint, request
from ..models.menu_items import MenuItem
from ..models import db
from ..forms.menu_item_form import MenuItemForm
from flask_login import login_required
import datetime
import json

menu_item_routes = Blueprint('menu_items', __name__)

### Get menu item: GET /api/menu-items/:menu_item_id
@menu_item_routes.route('/<int:id>', methods=['GET'])
def get_menu_item(id):
    """
    Gets the details of a menu item
    """
    menu_item = MenuItem.query.get(id)

    # if menu_item.id:
    return menu_item.to_dict()
    # else:
        # return { "error": "Menu item couldn't be found" }, 404



### Update menu item: PUT /api/menu-items/:menu_item_id/update
@menu_item_routes.route('/<int:id>/update', methods=['PUT'])
@login_required
def update_menu_item(id):
    """
    Updates a menu item
    """
    form = MenuItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        item_to_update = MenuItem.query.get(id)
        item_to_update.name = form.data['name']
        item_to_update.foodType = form.data['foodType']
        item_to_update.description = form.data['description']
        item_to_update.price = form.data['price']
        item_to_update.foodImage = form.data['foodImage']
        item_to_update.updatedAt = datetime.datetime.now()
        db.session.commit()
        res = item_to_update.to_dict()
        return res
    if form.errors:
        return { "errors": form.errors }, 400


### Delete menu item: DELETE /api/menu-items/:menu_item_id/delete
@menu_item_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_menu_item(id):
    """
    Deletes a menu item
    """
    item_to_delete = MenuItem.query.get(id)
    db.session.delete(item_to_delete)
    db.session.commit()
    item_to_delete = MenuItem.query.get(id)
    if item_to_delete == None:
        res = {
        "message": "Successfully deleted menu item",
        "id": id
        }
        return res




# ==>>> this is working on the __init__ but not here whyy ??

# @app.route("/menu-items/<int:item_id>")
# def get_menu_item(item_id):
#     item = MenuItem.query.get(item_id)
#     if item is None:
#         return jsonify({"error": "Menu item not found"}), 404

#     return jsonify({
#         "id": item.id,
#         "restaurantId": item.restaurantId,
#         "name": item.name,
#         "foodType": item.foodType.value if isinstance(item.foodType, Enum) else str(item.foodType),
#         "description": item.description,
#         "price": str(item.price),  # Fix Decimal issue
#         "foodImage": item.foodImage,
#         "createdAt": item.createdAt.isoformat() if item.createdAt else None,
#         "updatedAt": item.updatedAt.isoformat() if item.updatedAt else None
#     })
