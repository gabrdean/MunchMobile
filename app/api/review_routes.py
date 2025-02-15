from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models import db, Review, User, Restaurant
from datetime import datetime

review_routes = Blueprint("reviews", __name__)


# Helper function for error responses
def error_response(message, status_code):
    return jsonify({"error": message}), status_code


# Helper function for success responses
def success_response(message, data=None, status_code=200):
    response = {"message": message}
    if data is not None:
        response["data"] = data
    return jsonify(response), status_code


@review_routes.route("/user")
@login_required
def get_user_reviews():
    reviews = Review.query.filter(Review.user_id == current_user.id).all()
    return success_response(
        "User reviews retrieved", [review.to_dict() for review in reviews]
    )


# Create a new review (Only logged-in users can create a review)

@review_routes.route("/", methods=["POST"])
@login_required
def create_review():
    data = request.get_json()

    # Validation (Check for missing required fields)
    if not data.get("restaurant_id") or not data.get("order_id"):
        return error_response("Missing required fields", 400)

    # Check if the referenced restaurant exists
    restaurant = Restaurant.query.get(data["restaurant_id"])
    if not restaurant:
        return error_response("Invalid restaurant ID", 400)

    # Validate order_rating and restaurant_rating to be between 1 and 5
    if not (1 <= data["order_rating"] <= 5) or not (
        1 <= data["restaurant_rating"] <= 5
    ):
        return error_response("Ratings must be between 1 and 5", 400)

    # Create the new review with the logged-in user's ID
    new_review = Review(
        restaurant_id=data["restaurant_id"],
        user_id=current_user.id,  # Ensuring only the logged-in user can create a review
        order_id=data["order_id"],
        review=data.get("review"),
        order_rating=data["order_rating"],
        restaurant_rating=data["restaurant_rating"],
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )

    try:
        db.session.add(new_review)
        db.session.commit()

        # Return the full review object in the response
        return success_response(
            "Review created successfully",
            new_review.to_dict(),  # Include the full review object
            201,
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)

"""
{
    "restaurant_id": 1,
    "order_id": 10,
    "review": "The food was amazing and the service was great!",
    "order_rating": 5,
    "restaurant_rating": 4
}
"""

# Get a review by its ID
@review_routes.route("/<int:id>", methods=["GET"])
# @login_required
def get_review(id):
    review = Review.query.get(id)
    if review:
        print("Review Found:", review.to_dict())
        return success_response("Review retrieved successfully", review.to_dict())
    else:
        return error_response("Review not found", 404)


# Update a review by its ID (Only the owner of the review can update it)

@review_routes.route("/<int:id>", methods=["PUT"])
@login_required
def update_review(id):
    data = request.get_json()

    # Check if at least one field is provided for update
    if not any(key in data for key in ["review", "order_rating", "restaurant_rating"]):
        return error_response("At least one field (review, order_rating, or restaurant_rating) is required for update", 400)

    review = Review.query.get(id)
    if not review:
        return error_response("Review not found", 404)

    # Ensure only the owner of the review can update it
    if review.user_id != current_user.id:
        return error_response("You are not authorized to update this review", 403)

    # Update fields if provided
    if "review" in data:
        review.review = data["review"]
    if "order_rating" in data:
        if not (1 <= data["order_rating"] <= 5):
            return error_response("Order rating must be between 1 and 5", 400)
        review.order_rating = data["order_rating"]
    if "restaurant_rating" in data:
        if not (1 <= data["restaurant_rating"] <= 5):
            return error_response("Restaurant rating must be between 1 and 5", 400)
        review.restaurant_rating = data["restaurant_rating"]

    review.updated_at = datetime.now()

    try:
        db.session.commit()
        # Return the updated review object in the response
        return success_response(
            "Review updated successfully",
            review.to_dict(),  # Include the full updated review object
        )
    except Exception as e:
        db.session.rollback()
        return error_response(f"Failed to update review: {str(e)}", 500)
"""
{
    "review": "Updated review: The food was even better the second time!",
    "order_rating": 5,
    "restaurant_rating": 5
}"""



# Delete a review by its ID (Only the owner of the review can delete it)
@review_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_review(id):
    review = Review.query.get(id)
    if not review:
        return error_response("Review not found", 404)

    # Ensure only the owner of the review can delete it
    if review.user_id != current_user.id:
        return error_response("You are not authorized to delete this review", 403)

    try:
        db.session.delete(review)
        db.session.commit()
        return success_response("Review deleted successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


# Get all reviews for a specific restaurant
@review_routes.route("/restaurant/<int:restaurant_id>", methods=["GET"])
@login_required
def get_reviews_for_restaurant(restaurant_id):
    reviews = Review.query.filter_by(restaurant_id=restaurant_id).all()
    if reviews:
        return success_response(
            "Reviews retrieved successfully", [review.to_dict() for review in reviews]
        )
    else:
        return success_response("No reviews found for this restaurant", [])

