import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserReviewsThunk } from '../../redux/reviews';
import './MyReviews.css';

export default function MyReviews() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews.userReviews || []);
  const restaurants = useSelector((state) => state.restaurants.restaurants || []);

  // Fetch user reviews when the user is available
  useEffect(() => {
    if (user) {
      dispatch(getUserReviewsThunk());
    }
  }, [dispatch, user]);

  // Debugging log to check if reviews are populated
  console.log('User Reviews:', reviews);

  // Redirect to login if there's no user
  if (!user) {
    navigate('/login');
    return null;
  }

  // Handle "See More" button click
  const handleSeeMore = (orderId, restaurantId) => {
    navigate(`/reviews/restaurant/${restaurantId}?orderId=${orderId}`);
  };

  return (
    <div className="my-reviews-container">
      <h2>My Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet, tell us what you think.</p>
      ) : (
        reviews.map((review) => {
          // Find the restaurant for this review
          const restaurant = restaurants.find(
            (r) => r.id === review.restaurantId
          );

          console.log('Review:', review); // Log the entire review object
          console.log('Restaurant:', restaurant); // Log the corresponding restaurant

          return (
            <div key={review.id} className="review-card">
              <h3
                onClick={() => navigate(`/restaurants/${review.restaurantId}`)} // Use restaurantId
                className="restaurant-name">
                {restaurant?.name || 'Unknown Restaurant'}
              </h3>
              <p>
                <strong>Order Rating:</strong> {review.orderRating} ⭐ {/* Use orderRating */}
              </p>
              <p>
                <strong>Restaurant Rating:</strong> {review.restaurantRating} ⭐ {/* Use restaurantRating */}
              </p>
              <p>{review.review}</p>
              <p className="review-date">
                Reviewed on:{' '}
                {new Date(review.createdAt).toLocaleDateString()} {/* Use createdAt */}
              </p>
              <div className="my-reviews-actions">
                {/* Show "See More" button only if orderId exists */}
                {review.orderId && (
                  <button
                    className="see-more-btn"
                    onClick={() =>
                      handleSeeMore(review.orderId, review.restaurantId)
                    }>
                    See More
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}