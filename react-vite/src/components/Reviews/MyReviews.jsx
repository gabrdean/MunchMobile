import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserReviewsThunk, deleteReviewThunk } from '../../redux/reviews';
import './MyReviews.css';

export default function MyReviews() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.session.user);
	const reviews = useSelector((state) => state.reviews.userReviews || []);

	useEffect(() => {
		if (user) dispatch(getUserReviewsThunk());
	}, [dispatch, user]);

	if (!user) {
		navigate('/login');
		return null;
	}

	const handleDelete = async (reviewId) => {
		if (window.confirm('Are you sure you want to delete this review?')) {
			await dispatch(deleteReviewThunk(reviewId));
			dispatch(getUserReviewsThunk()); // Refresh after deletion
		}
	};

	return (
		<div className='my-reviews-container'>
			<h2>My Reviews</h2>
			{reviews.length === 0 ? (
				<p>No reviews yet, tell us what you think.</p>
			) : (
				reviews.map((review) => (
					<div key={review.id} className='review-card'>
						<h3
							onClick={() =>
								navigate(`/restaurants/${review.restaurant_id}`)
							}
							className='restaurant-name'>
							{review.restaurant_name || 'Unknown Restaurant'}
						</h3>
						<p>
							<strong>Order Rating:</strong> {review.order_rating} ⭐
						</p>
						<p>
							<strong>Restaurant Rating:</strong>{' '}
							{review.restaurant_rating} ⭐
						</p>
						<p>{review.review}</p>
						<p className='review-date'>
							Reviewed on:{' '}
							{new Date(review.created_at).toLocaleDateString()}
						</p>
						<div className='my-reviews-actions'>
							<button
								onClick={() => navigate(`/reviews/edit/${review.id}`)}>
								Edit
							</button>
							<button
								onClick={() => handleDelete(review.id)}
								className='review-delete-btn'>
								Delete
							</button>
						</div>
					</div>
				))
			)}
		</div>
	);
}
