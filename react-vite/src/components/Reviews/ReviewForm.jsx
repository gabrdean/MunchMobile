import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReviewThunk, getReviewsForRestThunk } from '../../redux/reviews';
// import Modal from 'react-modal'; // this line giving an error
import { useModal } from '../../context/Modal';
import './Reviews.css';

// Make sure to bind modal to your appElement
// Modal.setAppElement('#root'); // Replace '#root' with your app's root element ID

const ReviewForm = ({ restaurantId, orderId }) => {
	const [reviewText, setReviewText] = useState('');
	const [orderRating, setOrderRating] = useState(0);
	const [restaurantRating, setRestaurantRating] = useState(0);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	// const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
	const { setModalContent, closeModal } = useModal();
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();

		// For testing, hardcoding orderId
		const hardcodedOrderId = orderId || 1; // Use this to avoid null value

		if (!hardcodedOrderId) {
			setErrorMessage('Order ID is missing. Please try again.');
			setSuccessMessage(''); // Clear success message
			return;
		}
		if (!reviewText.trim()) {
			setErrorMessage('Please write a review before submitting.');
			setSuccessMessage(''); // Clear success message
			return;
		}
		if (orderRating === 0 || restaurantRating === 0) {
			setErrorMessage(
				'Please select a rating for both order and restaurant.'
			);
			setSuccessMessage(''); // Clear success message
			return;
		}

		const newReview = {
			restaurant_id: restaurantId,
			order_id: hardcodedOrderId,
			review: reviewText,
			order_rating: orderRating,
			restaurant_rating: restaurantRating,
		};

		try {
			const response = await dispatch(createReviewThunk(newReview));
			if (response && !response.errors) {
				setSuccessMessage('Review submitted successfully!');
				setErrorMessage(''); // Clear error message
				setReviewText('');
				setOrderRating(0);
				setRestaurantRating(0);
				dispatch(getReviewsForRestThunk(restaurantId));
				// setIsModalOpen(false); // Close the modal after successful submission
				closeModal();
			} else {
				setErrorMessage(
					response.errors || 'Failed to submit review. Please try again.'
				);
				setSuccessMessage(''); // Clear success message
			}
		} catch (error) {
			setErrorMessage('An error occurred. Please try again.');
			setSuccessMessage(''); // Clear success message
		}
	};

	const StarRating = ({ rating, setRating, label }) => (
		<div className='star-rating'>
			<label>{label}</label>
			{[1, 2, 3, 4, 5].map((star) => (
				<span
					key={star}
					className={star <= rating ? 'star selected' : 'star'}
					onClick={() => setRating(star)}>
					★
				</span>
			))}
			<span className='rating-value'>{rating}</span>{' '}
			{/* Display the numeric rating */}
		</div>
	);

	const openReviewModal = () => {
		setModalContent(
			<div className='modal-content'>
				<h2>Write a Review</h2>
				<p>Share your Taco Casa review with others.</p>
				<p>
					Tell us below what you tell your friends - the more details, the
					better.
				</p>
				<form onSubmit={handleSubmit}>
					<textarea
						value={reviewText}
						onChange={(e) => setReviewText(e.target.value)}
						placeholder='Some things to consider: items ordered, flavor, quality, and recommendations...'
						required
					/>

					<StarRating
						rating={orderRating}
						setRating={setOrderRating}
						label='Order:'
					/>

					<StarRating
						rating={restaurantRating}
						setRating={setRestaurantRating}
						label='Restaurant:'
					/>

					{successMessage && (
						<p className='success-message'>{successMessage}</p>
					)}
					{errorMessage && <p className='error-message'>{errorMessage}</p>}
					<button type='submit'>Submit Review</button>
					<button type='button' onClick={closeModal}>
						Cancel
					</button>
				</form>
			</div>
		);
	};

	return (
		<>
			<button
				onClick={(event) => {
					{
						openReviewModal;
					}
				}}>
				Write a Review
			</button>
		</>
	);
};

export default ReviewForm;

{
	/* <>
	<button onClick={() => setIsModalOpen(true)}>Write a Review</button>

	<Modal
		isOpen={isModalOpen}
		onRequestClose={() => setIsModalOpen(false)}
		contentLabel='Review Form Modal'
		className='modal'
		overlayClassName='overlay'>
		<h2>Write a Review</h2>
		<p>Share your Taco Casa review with others.</p>
		<p>
			Tell us below what you'd tell your friends - the more details, the
			better.
		</p>
		<form onSubmit={handleSubmit}>
			<textarea
				value={reviewText}
				onChange={(e) => setReviewText(e.target.value)}
				placeholder='Some things to consider: items ordered, flavor, quality, and recommendations...'
				required
			/>

			<StarRating
				rating={orderRating}
				setRating={setOrderRating}
				label='Order:'
			/>

			<StarRating
				rating={restaurantRating}
				setRating={setRestaurantRating}
				label='Restaurant:'
			/>

			{successMessage && <p className='success-message'>{successMessage}</p>}
			{errorMessage && <p className='error-message'>{errorMessage}</p>}
			<button type='submit'>Submit Review</button>
			<button type='button' onClick={() => setIsModalOpen(false)}>
				Cancel
			</button>
		</form>
	</Modal>
</>; */
}
