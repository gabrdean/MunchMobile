from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User
from app.forms.user_form import UserForm, FundsForm

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/wallet/<int:id>', methods=['PUT', 'PATCH'])
@login_required
def add_funds(id):
    form = FundsForm()
    print("\n FORM", form.data['amount'], "\n")
    """
    Update a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    user.add_funds(form.data['amount'])
    return user.to_dict()
    # user = User.query.get(id)
    # user.update(form.json)
    # return user.to_dict()

@user_routes.route("/wallet/deduct/<int:id>", methods=["PUT", "PATCH"])
@login_required
def deduct_funds(id):
    form = FundsForm()
    amount_to_deduct = form.data["amount"]

    user = User.query.get(id)

    if user.wallet < amount_to_deduct:
        return jsonify({"error": "Insufficient funds"}), 400

    user.wallet -= amount_to_deduct
    return user.to_dict()

@user_routes.route('/<int:id>', methods=['PUT', 'PATCH'])
@login_required
def update_user(id):
    form = UserForm()
    print('\n FORM: ', form.data, '\n')
    """
    Update a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    user.update(form.data)
    return user.to_dict()


@user_routes.route('/pfp/<int:id>', methods=['PUT', 'PATCH'])
@login_required
def update_pfp(id):
    form = UserForm()
    print('\n FORM: ', form.data, '\n')
    # print('\n PFP TYPE:', form.data['profile_image'].keys(), '\n')
    """
    Update a user by id and returns that user in a dictionary
    """
    # user = User.query.get(id)
    # user.update(form.data)
    # return user.to_dict()