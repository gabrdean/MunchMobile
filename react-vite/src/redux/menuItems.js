// ACTION TYPES
const GET_MENU_ITEMS = 'GET_MENU_ITEMS';
const GET_MENU_ITEM = 'GET_MENU_ITEM';
const CREATE_MENU_ITEM = 'CREATE_MENU_ITEM';
const UPDATE_MENU_ITEM = 'UPDATE_MENU_ITEM';
const DELETE_MENU_ITEM = 'DELETE_MENU_ITEM';
const MENU_ERROR = 'MENU_ERROR';
const TOGGLE_LIKE = 'TOGGLE_LIKE'; // Add the toggle like action type


// THUNKS
// Get all menu items
export const getMenuItems = () => async (dispatch) => {
  try {
    const response = await fetch('/api/menu-items');
    const data = await response.json();
    // console.log("Fetched Menu Items:", data); // Debugging log

    dispatch({ type: GET_MENU_ITEMS, payload: data });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    dispatch({ type: MENU_ERROR, payload: error });
  }
};

// Get a specific menu item by id
export const getMenuItem = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/menu-items/${id}`);
    const data = await response.json();
    dispatch({ type: GET_MENU_ITEM, payload: data });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    dispatch({ type: MENU_ERROR, payload: error });
  }
};


// actions/menuItems.js
export const createMenuItem = (menuItemData) => async (dispatch) => {
  const response = await fetch('/api/menu-items/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(menuItemData),
  });

  if (response.ok) {
    const newMenuItem = await response.json();
    dispatch({ type: 'ADD_MENU_ITEM', payload: newMenuItem });
    return newMenuItem; // Return the created item for navigation
  } else {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create menu item');
  }
};

// actions/menuItems.js
export const updateMenuItem = (id, updatedItem) => async (dispatch) => {
  try {
    const response = await fetch(`/api/menu-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch({ type: 'UPDATE_MENU_ITEM', payload: data }); // Dispatch the updated item
      return data; // Return the updated item for navigation
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update menu item');
    }
  } catch (error) {
    console.error('Error updating menu item:', error);
    dispatch({ type: 'MENU_ERROR', payload: error.message });
    throw error;
  }
};

// Delete a menu item
export const deleteMenuItem = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/menu-items/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch({ type: DELETE_MENU_ITEM, payload: id });
    } else {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete menu item');
    }
  } catch (error) {
    console.error('Error deleting menu item:', error);
    dispatch({ type: MENU_ERROR, payload: error.message });
  }
};

// Toggle like on a menu item
export const toggleLike = (itemId) => {
  return {
    type: TOGGLE_LIKE,
    payload: itemId,
  };
};

export const getFavoriteItems = () => async (dispatch, getState) => {
  const likedItemIds = getState().menuItems.likedItems;

  if (likedItemIds.length === 0) {
    dispatch({ type: 'SET_FAVORITE_ITEMS', payload: [] });
    return;
  }

  try {
    const favoriteItems = [];
    for (const id of likedItemIds) {
      try {
        const response = await fetch(`/api/menu-items/${id}`);
        if (!response.ok) {
          console.error(`Failed to fetch menu item ${id}: ${response.statusText}`);
          continue; // Skip this item and continue with the next one
        }
        const item = await response.json();
        favoriteItems.push(item);
      } catch (error) {
        console.error(`Error fetching menu item ${id}:`, error);
      }
    }

    dispatch({ type: 'SET_FAVORITE_ITEMS', payload: favoriteItems });
  } catch (error) {
    console.error('Error fetching favorite items:', error);
    dispatch({ type: 'MENU_ERROR', payload: error.message });
  }
};
const initialState = {
  menuItems: [],
  menuItem: null,
  error: null,
  likedItems: JSON.parse(localStorage.getItem('likedItems')) || [], // Load from localStorage
  favoriteItems: [], // Store full favorite items
};

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MENU_ITEMS:
      return { ...state, menuItems: action.payload, error: null };

    case GET_MENU_ITEM:
      return { ...state, menuItem: action.payload, error: null };

    case CREATE_MENU_ITEM:
      return {
        ...state,
        menuItems: [action.payload, ...state.menuItems], // Add new item at the front
        error: null,
      };

      case UPDATE_MENU_ITEM:
        return {
          ...state,
          menuItems: state.menuItems.map((item) =>
            item.id === action.payload.id ? action.payload : item
          ),
          menuItem: action.payload, // Update the current menu item in state
          error: null,
        };

    case DELETE_MENU_ITEM:
      return {
        ...state,
        menuItems: state.menuItems.filter((item) => item.id !== action.payload),
        error: null,
      };

      case 'SET_FAVORITE_ITEMS':
        return { ...state, favoriteItems: action.payload, error: null };

    case TOGGLE_LIKE:
      const itemId = action.payload;
      const isAlreadyLiked = state.likedItems.includes(itemId);
      
      const updatedLikedItems = isAlreadyLiked
        ? state.likedItems.filter(id => id !== itemId) // Remove if already liked
        : [...state.likedItems, itemId]; // Add if not liked
      
      localStorage.setItem('likedItems', JSON.stringify(updatedLikedItems)); // Save to localStorage
      
      return { ...state, likedItems: updatedLikedItems };

    case MENU_ERROR:
      return { ...state, error: action.payload };
    
    case 'SET_MENU_ITEMS':
      return {
          ...state,
          menuItems: action.payload,
          error: null
      };
    case 'SET_MENU_ITEMS_ERROR':
      return {
            ...state,
            error: action.payload
        };

    default:
      return state;
  }
};

export default menuReducer;