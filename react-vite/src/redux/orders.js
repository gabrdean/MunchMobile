import { csrfFetch } from './csrf';
import { setError } from './errors';
import {clearCart} from './cart';

const LOAD_USER_ORDERS = 'orders/loadUserOrders';
const LOAD_USER_ORDER = 'orders/loadUserOrder';
const LOAD_USER_ORDERS_4_REST = 'orders/loadUserOrders4Rest';
const CLEAR_CURRENT_ORDER = 'orders/clearCurrentOrder';

const ADD_ORDER = 'orders/addOrder';
const UPDATE_ORDER = 'orders/updateOrder';
const SUBMIT_ORDER = 'orders/submitOrder';
const REMOVE_ORDER = 'orders/removeOrder';

const loadUserOrders = (orders) => ({
	type: LOAD_USER_ORDERS,
	payload: orders,
});

export const loadUserOrder = (order) => ({
	type: LOAD_USER_ORDER,
	payload: order,
});
const loadUserOrders4Rest = (orders) => ({
	type: LOAD_USER_ORDERS_4_REST,
	payload: orders,
});

export const clearCurrentOrder = () => ({ type: CLEAR_CURRENT_ORDER });

const addOrder = (order) => ({ type: ADD_ORDER, payload: order });
const updateOrder = (order) => ({ type: UPDATE_ORDER, payload: order });
const submitOrder = (order) => ({ type: SUBMIT_ORDER, payload: order });
const removeOrder = (orderId) => ({ type: REMOVE_ORDER, payload: orderId });

export const getUserOrders = () => async (dispatch) => {
	try {
		const response = await csrfFetch('/api/orders/');
		if (!response.ok) throw response;

		const data = await response.json();

		if (data.orders.length === 0) {
			dispatch(loadUserOrders([]));
			return;
		}

		dispatch(loadUserOrders(data.orders));
	} catch (error) {
		const errorMessage = await error.json();
		dispatch(setError(errorMessage.errors));
	}
};

export const getUserOrder = (orderId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/orders/${orderId}`);
		if (!response.ok) throw response;

		const data = await response.json();
		dispatch(loadUserOrder(data));
	} catch (error) {
		const errorMessage = await error.json();
		dispatch(setError(errorMessage));
	}
};

export const getUserOrders4Rest = (restaurantId) => async (dispatch) => {
	try {
		const response = await csrfFetch(
			`/api/orders/restaurant/${restaurantId}`
		);
		if (!response.ok) throw response;

		const data = await response.json();
		dispatch(loadUserOrders4Rest(data.orders));
	} catch (error) {
		const errorMessage = await error.json();
		dispatch(setError(errorMessage));
	}
};

export const createOrder = (orderData) => async (dispatch) => {
	try {
		const response = await csrfFetch('/api/orders/', {
			method: 'POST',
			body: JSON.stringify({
				...orderData,
				status: 'Active',
			}),
		});
		if (!response.ok) throw response;

		const newOrder = await response.json();

		const fullOrderResponse = await csrfFetch(`/api/orders/${newOrder.id}`);
		if (!fullOrderResponse.ok) throw fullOrderResponse;

		const fullOrder = await fullOrderResponse.json();

		dispatch(addOrder(fullOrder));
		return { payload: fullOrder };
	} catch (error) {
		const errorMessage = await error.json();
		dispatch(setError(errorMessage));
	}
};

export const editOrder = (orderId, orderData) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/orders/${orderId}`, {
			method: 'PUT',
			body: JSON.stringify(orderData),
		});
		if (!response.ok) throw response;

		const data = await response.json();
		dispatch(updateOrder(data));
	} catch (error) {
		const errorMessage = await error.json();
		dispatch(setError(errorMessage));
	}
};

export const placeOrder = (orderId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/orders/${orderId}/submit`, {
			method: 'PUT',
		});

		if (!response.ok) {
			const errorMessage = await response.json();
			throw new Error(errorMessage.message);
		}

		const data = await response.json();
		dispatch(submitOrder(data));

		const orderResponse = await csrfFetch(`/api/orders/${orderId}`);
		if (!orderResponse.ok) throw orderResponse;

		const updatedOrder = await orderResponse.json();
		dispatch(loadUserOrder(updatedOrder));
		localStorage.setItem('currentOrder', JSON.stringify(updatedOrder));


		dispatch(clearCart(localStorage.getItem('currentUser').id));
		await dispatch(getUserOrders());
	} catch (error) {
		const err = (await error.json()) || error.message;
		dispatch(setError(err));
	}
};

export const deleteOrder = (orderId) => async (dispatch, getState) => {
	try {
		// console.log(`Attempting to delete order ${orderId}`);
		const response = await csrfFetch(`/api/orders/${orderId}`, {
			method: 'DELETE',
		});

		if (!response.ok) throw response;

		// console.log(`Order ${orderId} deleted successfully`);
		dispatch(removeOrder(orderId));
		localStorage.removeItem('currentOrder');

		const { orders } = getState();
		if (orders.currentOrder?.id === orderId) {
			// console.log(`Clearing currentOrder for ${orderId}`);
			dispatch(clearCurrentOrder());
		}

		await dispatch(getUserOrders());
	} catch (error) {
		// console.error(`Error deleting order ${orderId}:`, error);
		dispatch(setError(await error.json()));
	}
};

const initialState = {
	userOrders: [],
	currentOrder: JSON.parse(localStorage.getItem('currentOrder')) || null,
	userOrdersForRestaurant: [],
};

export default function ordersReducer(state = initialState, action) {
	switch (action.type) {
		case CLEAR_CURRENT_ORDER:
			localStorage.removeItem('currentOrder');
			return { ...state, currentOrder: null };
		case LOAD_USER_ORDERS:
			return {
				...state,
				userOrders: Array.isArray(action.payload)
					? action.payload.sort(
							(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
					)
					: [],
			};
		case LOAD_USER_ORDER:
			localStorage.setItem('currentOrder', JSON.stringify(action.payload));
			return {
				...state,
				currentOrder: action.payload,
			};
		case LOAD_USER_ORDERS_4_REST:
			return { ...state, userOrdersForRestaurant: action.payload };
		case ADD_ORDER:
			return {
				...state,
				userOrders: [action.payload, ...state.userOrders].sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				),
				currentOrder: action.payload,
			};
		case UPDATE_ORDER:
			return {
				...state,
				userOrders: state.userOrders.map((order) =>
					order.id === action.payload.id ? action.payload : order
				),
			};
		case SUBMIT_ORDER:
			if (!action.payload) return state;

			return {
				...state,
				userOrders: state.userOrders
					.map((order) =>
						order.id === action.payload.id
							? { ...order, status: 'Submitted' }
							: order
					)
					.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
				currentOrder: action.payload,
			};
		case REMOVE_ORDER: {
			// console.log(`Removing order ${action.payload} from Redux state`);

			const updatedUserOrders = state.userOrders.filter(
				(order) => order.id !== action.payload
			);

			const updatedCurrentOrder =
				state.currentOrder?.id === action.payload
					? null
					: state.currentOrder;

			if (updatedCurrentOrder === null) {
				localStorage.removeItem('currentOrder');
			}

			return {
				...state,
				userOrders: updatedUserOrders,
				currentOrder: updatedCurrentOrder,
			};
		}
		default:
			return state;
	}
}
