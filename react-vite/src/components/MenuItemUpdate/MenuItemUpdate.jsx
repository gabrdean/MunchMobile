import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMenuItem, getMenuItem } from '../../redux/menuItems';
import { useNavigate, useParams } from 'react-router-dom';
import './MenuItemUpdate.css'; // Import the updated CSS

const UpdateMenuItem = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    food_image: '',
    food_type: 'appetizer',
  });

  const menuItem = useSelector((state) => state.menuItems.menuItem);
  const error = useSelector((state) => state.menuItems.error);
  const user = useSelector((state) => state.session.user);

  const hasCheckedAuth = useRef(false); // Ensure we check authorization only once on load

  // Fetch menu item on mount
  useEffect(() => {
    if (id) {
      dispatch(getMenuItem(id));
    }
  }, [dispatch, id]);

  // Set form data when menu item loads
  useEffect(() => {
    if (menuItem && user && menuItem.restaurant_owner_id === user.id) {
      setFormData({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        food_image: menuItem.food_image,
        food_type: menuItem.food_type,
      });
    }
  }, [menuItem, user]);

  // Redirect unauthorized users (only runs once when data first loads)
  useEffect(() => {
    if (!hasCheckedAuth.current && menuItem && user) {
      hasCheckedAuth.current = true; // Mark as checked
      if (menuItem.restaurant_owner_id !== user.id) {
        alert('You are not authorized to update this menu item.');
        navigate(`/menu-items/${id}`); // Redirect to the menu item page
      }
    }
  }, [menuItem, user, navigate, id]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateMenuItem(id, formData))
      .then(() => {
        dispatch(getMenuItem(id)); // Refetch updated menu item
        navigate(`/menu-items/${id}`);
      })
      .catch((error) => {
        console.error('Update failed:', error);
      });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!menuItem || menuItem.restaurant_owner_id !== user?.id) {
    return null; // Don't render if not authorized or still loading
  }

  return (
    <div className="update-menu-item-container">
      <button className="back-button" type="button" onClick={() => navigate(`/menu-items/${id}`)}>
        Back to Menu Items List
      </button>

      <form className="update-menu-item-form" onSubmit={handleSubmit}>
        <h3>Update Menu Item</h3>

        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />
        </div>

        <div>
          <label>Food Image URL:</label>
          <input
            type="text"
            name="food_image"
            value={formData.food_image}
            onChange={handleChange}
            placeholder="Food Image URL"
            required
          />
        </div>

        <div>
          <label>Food Type:</label>
          <select
            name="food_type"
            value={formData.food_type}
            onChange={handleChange}
            required
          >
            <option value="appetizer">Appetizer</option>
            <option value="entree">Entree</option>
            <option value="dessert">Dessert</option>
            <option value="beverage">Beverage</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Update Menu Item
        </button>
      </form>
    </div>
  );
};

export default UpdateMenuItem;