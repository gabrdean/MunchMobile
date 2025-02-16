import  { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMenuItem, getMenuItem } from '../../redux/menuItems';
import { useParams, useNavigate } from 'react-router-dom';
import './MenuItemDelete.css'; // Import the updated CSS

const MenuItemDelete = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuItemName, setMenuItemName] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false); // Track authorization
  const menuItem = useSelector((state) => state.menuItems.menuItem);
  const error = useSelector((state) => state.menuItems.error);
  const user = useSelector((state) => state.session.user); // Logged-in user
  const alertShown = useRef(false); // Track if the alert has been shown

  // Fetch the menu item details when the component mounts or the ID changes
  useEffect(() => {
    if (id) {
      dispatch(getMenuItem(id));
    }
  }, [dispatch, id]);

  // Check if the user owns the restaurant associated with the menu item
  useEffect(() => {
    if (menuItem && user) {
      const restaurantOwnerId = menuItem.restaurant_owner_id; // Ensure this field is included in the API response
      if (user.id === restaurantOwnerId) {
        setIsAuthorized(true); // User is authorized
        setMenuItemName(menuItem.name); // Set the menu item name
      } else {
        if (!alertShown.current) {
          alertShown.current = true; // Mark that the alert has been shown
          alert('You are not authorized to delete this menu item.');
          // Redirect to the item detail page after the alert
          setTimeout(() => {
            navigate(`/menu-items/${id}`);
          }, 1000); // Wait 1 second before redirecting
        }
      }
    }
  }, [menuItem, user, navigate, id]);

  // Handle delete action
  const handleDelete = () => {
    dispatch(deleteMenuItem(id)).then(() => {
      navigate('/menu-items'); // Redirect to the menu items list page after delete
    });
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(`/menu-items/${id}`); // Redirect back to the menu item detail page
  };

  // Display error if any
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // Only render the delete confirmation if the user is authorized
  if (!isAuthorized) {
    return null; // Do not render the delete confirmation page
  }

  return (
    <div className="menu-item-delete-container">
      <h2>Are you sure you want to delete {menuItemName}?</h2>
      <button className="delete-button" onClick={handleDelete}>
        Yes, Delete
      </button>
      <button className="cancel-button" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default MenuItemDelete;