import { useState, useEffect } from 'react'; // Import useEffect
import { useDispatch, useSelector } from 'react-redux';
import { deleteReviewThunk, updateReviewThunk } from '../../redux/reviews';
import Modal from 'react-modal';
import './Reviews.css';

Modal.setAppElement('#root');

const ReviewItem = ({ review }) => {
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.session.user?.id);

  const [updatedReviewText, setUpdatedReviewText] = useState(review.review);
  const [updatedOrderRating, setUpdatedOrderRating] = useState(review.order_rating);
  const [updatedRestaurantRating, setUpdatedRestaurantRating] = useState(review.restaurant_rating);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use useEffect to sync local state with the review prop
  useEffect(() => {
    setUpdatedReviewText(review.review);
    setUpdatedOrderRating(review.order_rating);
    setUpdatedRestaurantRating(review.restaurant_rating);
  }, [review]); // Run this effect whenever the review prop changes

  const handleSave = () => {
    const updatedReview = {
      id: review.id,
      review: updatedReviewText,
      order_rating: updatedOrderRating,
      restaurant_rating: updatedRestaurantRating,
    };

    dispatch(updateReviewThunk(updatedReview)).then(() => {
      setIsModalOpen(false);
      // Update the local state to reflect the changes immediately
      setUpdatedReviewText(updatedReview.review);
      setUpdatedOrderRating(updatedReview.order_rating);
      setUpdatedRestaurantRating(updatedReview.restaurant_rating);
    });
  };

  const StarRating = ({ rating, setRating, label }) => (
    <div className="star-rating">
      <label>{label}</label>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'star selected' : 'star'}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
      <span className="rating-value">{rating}</span> {/* Display the numeric rating */}
    </div>
  );

  return (
		<div className='review-item'>
			<p>{updatedReviewText}</p>
			<div className='rating-container'>
				<div className='rating-item'>
					<span>Order ★ {updatedOrderRating}</span>
				</div>
				<div className='rating-item'>
					<span>Restaurant ★ {updatedRestaurantRating}</span>
				</div>
			</div>
			{review.userId === loggedInUserId && (
				<div className='review-actions'>
					<button onClick={() => dispatch(deleteReviewThunk(review.id))}>
						Delete
					</button>
					<button onClick={() => setIsModalOpen(true)}>Update</button>
				</div>
			)}

			<Modal
				isOpen={isModalOpen}
				onRequestClose={() => setIsModalOpen(false)}
				contentLabel='Update Review Modal'
				className='modal'
				overlayClassName='review-overlay'>
				<h2>Update Review</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSave();
					}}>
					<textarea
						value={updatedReviewText}
						onChange={(e) => setUpdatedReviewText(e.target.value)}
						placeholder='Update your review...'
						required
					/>

					<StarRating
						rating={updatedOrderRating}
						setRating={setUpdatedOrderRating}
						label='Order:'
					/>

					<StarRating
						rating={updatedRestaurantRating}
						setRating={setUpdatedRestaurantRating}
						label='Restaurant:'
					/>

					<button className='review-buttons' type='submit'>
						Save Changes
					</button>
					<button
						className='review-buttons'
						type='button'
						onClick={() => setIsModalOpen(false)}>
						Cancel
					</button>
				</form>
			</Modal>
		</div>
  );
};

export default ReviewItem;