// import { setError } from './errors';
import { createOrder } from './orders';

const LOAD_CART = 'cart/loadCart';
const ADD_TO_CART = 'cart/addToCart';
const REMOVE_FROM_CART = 'cart/removeFromCart';
const UPDATE_CART_ITEM = 'cart/updateCartItem';
const CLEAR_CART = 'cart/clearCart';

const CART_STORAGE_KEY = (userId) => `cartItems_${userId || 'guest'}`;

const loadCartFromStorage = (userId) => {
	const storedCart = localStorage.getItem(CART_STORAGE_KEY(userId));
	return storedCart ? JSON.parse(storedCart) : [];
};

// const loadCartFromStorage = () => {
// 	const storedCart = localStorage.getItem(CART_STORAGE_KEY);
// 	return storedCart ? JSON.parse(storedCart) : [];
// };

export const loadCart = (items) => ({
	type: 'LOAD_CART',
	payload: items,
});

const addCartItem = (item) => ({
	type: ADD_TO_CART,
	payload: item,
});

const removeCartItem = (itemId) => ({
	type: REMOVE_FROM_CART,
	payload: itemId,
});

const updateCartItem = (itemId, quantity) => ({
	type: UPDATE_CART_ITEM,
	payload: { itemId, quantity },
});

const saveCartToStorage = (cartItems, userId) => {
	localStorage.setItem(CART_STORAGE_KEY(userId), JSON.stringify(cartItems));
};

// const saveCartToStorage = (cartItems) => {
// 	localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
// };

const clearCartItems = () => ({
	type: CLEAR_CART,
});

// export const getCart = (state) => state.cart?.cartItems || [];

export const getCart = (userId) => (dispatch) => {
	if (!userId) return;

	const storedCart =
		JSON.parse(localStorage.getItem(`cartItems_${userId}`)) || [];
	dispatch(loadCart(storedCart));
};

export const addToCart =
	(menuItem, quantity = 1) =>
	(dispatch, getState) => {
		const state = getState();
		const userId = state.session?.user?.id || 'guest';
		const existingItem = state.cart.cartItems.find(
			(item) => item.id === menuItem.id
		);

		let updatedCart;
		if (existingItem) {
			dispatch(
				updateItemQuantity(menuItem.id, existingItem.quantity + quantity)
			);
		} else {
			dispatch(addCartItem({ ...menuItem, quantity }));
		}

		updatedCart = [...state.cart.cartItems, { ...menuItem, quantity }];
		saveCartToStorage(updatedCart, userId);
	};

export const removeFromCart = (menuItemId) => (dispatch) => {
	dispatch(removeCartItem(menuItemId));
};

export const updateItemQuantity =
	(menuItemId, quantity) => (dispatch, getState) => {
		const state = getState();
		const userId = state.session?.user?.id || 'guest';
		const existingItem = state.cart.cartItems.find(
			(item) => item.id === menuItemId
		);

		if (existingItem) {
			dispatch(updateCartItem(menuItemId, quantity));

			const updatedCart = state.cart.cartItems.map((item) =>
				item.id === menuItemId ? { ...item, quantity } : item
			);

			saveCartToStorage(updatedCart, userId);
		}
	};

export const checkoutCart = () => async (dispatch, getState) => {
	const state = getState();
	const cartItems = state.cart.cartItems;

	if (cartItems.length === 0) {
		console.warn('Cart is empty, cannot proceed to checkout.');
		return { payload: null };
	}

	let restaurantId = cartItems[0]?.restaurant_id || cartItems[0]?.restaurantId;
	if (!restaurantId && state.orders.currentOrder) {
		restaurantId = state.orders.currentOrder.restaurant?.id;
	}

	if (!restaurantId) {
		// console.error('Cannot create order: Missing restaurant ID');
		return { payload: null };
	}

	const items = cartItems.map((item) => ({
		menu_item_id: item.id,
		quantity: item.quantity,
	}));

	const { payload } = await dispatch(
		createOrder({ restaurant_id: restaurantId, items })
	);

	if (payload) {
		localStorage.setItem('currentOrder', JSON.stringify(payload)); // Save order
	}

	return { payload };
};

export const confirmOrderPlacement = () => (dispatch) => {
	dispatch(clearCartItems());
};
	// dispatch(clearCartItems()); // Clear cart after checkout

export const clearCart = (userId) => (dispatch) => {
	dispatch(clearCartItems());
	localStorage.setItem(CART_STORAGE_KEY(userId), JSON.stringify([]));
};


// const initialState = {
// 	cartItems: loadCartFromStorage() || [],
// };

const initialState = {
	cartItems: loadCartFromStorage(localStorage.getItem('currentUser')) || [],
};

export default function cartReducer(state = initialState, action) {
	let updatedCart;
	const userId = action.userId || 'guest';

	switch (action.type) {
		case LOAD_CART:
			return { ...state, cartItems: action.payload };
		case ADD_TO_CART:
			updatedCart = [...state.cartItems, action.payload];
			saveCartToStorage(updatedCart, userId);
			return { ...state, cartItems: updatedCart };

		case REMOVE_FROM_CART:
			updatedCart = state.cartItems.filter(
				(item) => item.id !== action.payload
			);
			saveCartToStorage(updatedCart, userId);
			return { ...state, cartItems: updatedCart };

		case UPDATE_CART_ITEM:
			updatedCart = state.cartItems.map((item) =>
				item.id === action.payload.itemId
					? { ...item, quantity: action.payload.quantity }
					: item
			);
			saveCartToStorage(updatedCart, userId);
			return { ...state, cartItems: updatedCart };

		case CLEAR_CART:
			localStorage.setItem(
				CART_STORAGE_KEY(localStorage.getItem('currentUser') || 'guest'),
				JSON.stringify([])
			);
			return { ...state, cartItems: [] };

		default:
			return state;
	}
}