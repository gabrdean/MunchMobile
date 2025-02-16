import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { getReviewsForRestThunk } from '../../redux/reviews';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import './Reviews.css';

const Reviews = () => {
  const { restaurantId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');
  const initialRestaurantName = queryParams.get('restaurantName');

  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.allReviewsForRest);
  const loading = useSelector((state) => state.reviews.loading);  // Loading state from Redux
  const error = useSelector((state) => state.reviews.error);      // Error state from Redux

  const [restaurantName, setRestaurantName] = useState(initialRestaurantName);

  useEffect(() => {
    if (!restaurantName && restaurantId) {
      fetch(`/api/restaurants/${restaurantId}`)
        .then((response) => response.json())
        .then((data) => setRestaurantName(data.restaurant.name))
        .catch((error) => console.error('Error fetching restaurant name:', error));
    }
  }, [restaurantId, restaurantName]);

  useEffect(() => {
    if (restaurantId) {
      dispatch(getReviewsForRestThunk(restaurantId));
    }
  }, [dispatch, restaurantId]);

  if (loading) {
    return <div>Loading reviews...</div>;  // Display loading message or spinner
  }

  if (error) {
    return <div>Error: {error}</div>;  // Display error message if there's an issue
  }

  return (
    <div className="reviews-container">
      <h2>Reviews for {restaurantName || `Restaurant ${restaurantId}`}</h2>

      <ReviewForm restaurantId={restaurantId} orderId={orderId || 1} />
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default Reviews;
