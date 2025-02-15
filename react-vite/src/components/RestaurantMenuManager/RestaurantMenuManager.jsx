// RestaurantMenuManager.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import './RestaurantMenuManager.css';
import MenuItemCreate from '../MenuItemCreate';
import UpdateMenuItem from '../MenuItemUpdate/MenuItemUpdate';
import DeleteMenuItem from '../MenuItemDelete';

const RestaurantMenuManager = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { restaurantId } = useParams();
    const menuItems = useSelector(state => state.menuItems.menuItems);
    const user = useSelector(state => state.session.user);
    const error = useSelector(state => state.menuItems.error);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchMenuItems = async () => {
            try {
                const response = await fetch(`/api/manage/${restaurantId}/menu`);
                if (!response.ok) {
                    throw new Error('Failed to fetch menu items');
                }
                const data = await response.json();
                dispatch({ type: 'SET_MENU_ITEMS', payload: data.menu_items });
            } catch (error) {
                dispatch({ type: 'SET_MENU_ITEMS_ERROR', payload: error.message });
            }
        };

        fetchMenuItems();
    }, [dispatch, restaurantId, user, navigate]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <div className="header-container">
                <div className="create-button-position">
                    <NavLink to="/menu-items/new" element={<MenuItemCreate />}>
                        <button className="auth-buttons">Create New Menu Item</button>
                    </NavLink>
                </div>
                <h1>Manage Menu</h1>
            </div>

            {menuItems.length === 0 ? (
                <p>No menu items available.</p>
            ) : (
                <div className="menu-container">
                    {menuItems.map(item => (
                        <div key={item.id} className="menu-item">
                            <img 
                                src={item.food_image} 
                                alt={item.name} 
                            />
                            <h3>{item.name}</h3>
                            <p>${item.price}</p>
                            
                            <div className="menu-item-actions">
                                <NavLink 
                                    to={`/menu-items/${item.id}/update`}
                                    element={<UpdateMenuItem />}
                                    className="auth-buttons"
                                >
                                    Edit
                                </NavLink>
                                <NavLink 
                                    to={`/menu-items/${item.id}/delete`}
                                    element={<DeleteMenuItem />}
                                    className="delete-button"
                                >
                                    Delete
                                </NavLink>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantMenuManager;