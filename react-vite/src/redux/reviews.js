//react-vite/src/redux/reviews.js
// ========================== ACTION TYPE CONSTANTS ==========================
const GET_USER_REVIEWS = 'reviews/getUserReviews';
const GET_REVIEWS_FOR_REST = 'reviews/getReviewsForRest';
const GET_SINGLE_REVIEW = 'reviews/getSingleReview';
const CREATE_REVIEW = 'reviews/createReview';
const UPDATE_REVIEW = 'reviews/updateReview';
const DELETE_REVIEW = 'reviews/deleteReview';

// ========================== ACTION CREATORS ================================
const getUserReviews = (reviews) => ({
  type: GET_USER_REVIEWS,
  reviews,
});


const getReviewsForRest = (reviews) => ({
  type: GET_REVIEWS_FOR_REST,
  reviews,
});

const getSingleReview = (review) => ({
  type: GET_SINGLE_REVIEW,
  review,
});

const createReview = (review) => ({
  type: CREATE_REVIEW,
  review,
});

const updateReview = (review) => ({
  type: UPDATE_REVIEW,
  review,
});

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});



// ========================== THUNKS =====================================

// THUNK: GET ALL REVIEWS FOR A RESTAURANT

export const getUserReviewsThunk = () => async (dispatch) => {
	try {
		const res = await fetch(`/api/reviews/user`);
		if (!res.ok) throw await res.json();

		const data = await res.json();
		dispatch(getUserReviews(data.reviews));
	} catch (error) {
		console.error('Error fetching user reviews:', error);
	}
};

export const getReviewsForRestThunk = (restaurantId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/reviews/restaurant/${restaurantId}`);
    if (!res.ok) {
      const errors = await res.json();
      throw errors;
    }
    const reviews = await res.json();
    const adjustedReviews = reviews.data.map((review) => ({
      ...review,
      order_rating: review.orderRating,
      restaurant_rating: review.restaurantRating,
    }));
    dispatch(getReviewsForRest(adjustedReviews));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// THUNK: GET A SINGLE REVIEW
export const getSingleReviewThunk = (reviewId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/reviews/${reviewId}`);
    if (!res.ok) {
      const errors = await res.json();
      throw errors;
    }
    const review = await res.json();
    dispatch(getSingleReview(review.data));
  } catch (error) {
    console.error('Error fetching single review:', error);
    throw error;
  }
};

// THUNK: CREATE A REVIEW
export const createReviewThunk = (reviewData) => async (dispatch) => {
  try {
    const { restaurant_id, order_id, review, order_rating, restaurant_rating } = reviewData;

    const res = await fetch(`/api/reviews/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant_id,
        order_id,
        review,
        order_rating,
        restaurant_rating,
      }),
    });

    if (!res.ok) {
      const errors = await res.json();
      throw errors;
    }

    const newReview = await res.json();
    dispatch(createReview(newReview.data));
    dispatch(getReviewsForRestThunk(restaurant_id));
    return newReview;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};


// THUNK: UPDATE A REVIEW
export const updateReviewThunk = (updatedReview) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reviews/${updatedReview.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedReview),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(updateReview(data));
      return data;
    } else {
      throw new Error("Failed to update review");
    }
  } catch (error) {
    console.error("Error updating review:", error);
  }
};

// THUNK: DELETE A REVIEW
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errors = await res.json();
      throw errors;
    }

    const data = await res.json();
    dispatch(deleteReview(reviewId));
    return data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// ========================== REDUCER =====================================

const initialState = {
	allReviewsForRest: [],
	userReviews: [],
	singleReview: {},
	loading: false,
	error: null,
};

export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_REVIEWS:
      return { ...state, userReviews: action.reviews, loading: false, error: null };
    case GET_REVIEWS_FOR_REST:
      return { ...state, allReviewsForRest: action.reviews, loading: false, error: null };
    case GET_SINGLE_REVIEW:
      return { ...state, singleReview: action.review, loading: false, error: null };
    case CREATE_REVIEW:
      return {
        ...state,
        allReviewsForRest: [...state.allReviewsForRest, action.review],
        loading: false,
        error: null,
      };
      case UPDATE_REVIEW:
        return {
          ...state,
          allReviewsForRest: state.allReviewsForRest.map((rev) =>
            rev.id === action.review.id ? { ...rev, ...action.review } : rev
          ),
          loading: false,
          error: null,
        };
      case DELETE_REVIEW:
      return {
        ...state,
        allReviewsForRest: state.allReviewsForRest.filter(
          (rev) => rev.id !== action.reviewId
        ),
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}
