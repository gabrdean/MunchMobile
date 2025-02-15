const SET_ERROR = 'errors/setError';
const CLEAR_ERROR = 'errors/clearError';

export const setError = (error) => ({
	type: SET_ERROR,
	payload: error,
});

const clearError = () => ({
	type: CLEAR_ERROR,
});

export const handleApiError =
	(actionThunk) =>
		async (dispatch, ...args) => {
			try {
				await dispatch(actionThunk(...args));
			} catch (err) {
			let error;
			if (err.response) {
				error = await err.response.json()
			} else {
				error = {message: 'An unexpected error occurred.'}
			}
			dispatch(setError(error));
		}
	};

const initialState = {};

export default function errorsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_ERROR:
			return { ...state, ...action.payload };
		case CLEAR_ERROR:
			return { ...null };
		default:
			return state;
	}
}
