import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuItems } from '../../redux/menuItems';
import { addToCart } from '../../redux/cart';
import { Link } from 'react-router-dom';
import { FaThumbsUp } from 'react-icons/fa';
import './MenuItemList.css';

const MenuItemList = () => {
	const dispatch = useDispatch();
	const menuItems = useSelector((state) => state.menuItems.menuItems);
	const error = useSelector((state) => state.menuItems.error);
	const isLoading = useSelector((state) => state.menuItems.isLoading);
	const user = useSelector((state) => state.session.user);
	const cart = useSelector(state => state.cart);
	const cartItems = cart?.cartItems || [];

	const [likes, setLikes] = useState({});

	useEffect(() => {
		dispatch(getMenuItems());
	}, [dispatch]);

	useEffect(() => {
		const storedLikes = JSON.parse(sessionStorage.getItem('menuItemLikes')) || {};
		const updatedLikes = { ...storedLikes };

		menuItems.forEach((item) => {
			if (!(item.id in storedLikes)) {
				updatedLikes[item.id] = Math.floor(Math.random() * 100);
			}
		});

		setLikes(updatedLikes);
		sessionStorage.setItem('menuItemLikes', JSON.stringify(updatedLikes));
	}, [menuItems]);

	if (error) {
		return <div className="menu-item-list__error">Error: {error}</div>;
	}

	const handleAddToCart = (item) => {
		if (!user) {
			alert('You must be logged in to add items to the cart!');
			return;
		}
	
		// Check if cart has items from a different restaurant
		if (cartItems.length > 0 && cartItems[0].restaurantId !== item.restaurantId) {
			alert('Your cart contains items from a different restaurant. Please clear your cart or complete your existing order first.');
			return;
		}
	
		const orderData = {
			id: item.id,
			name: item.name,
			price: item.price,
			restaurantId: item.restaurantId,
			food_image: item.food_image,
			quantity: 1,
		};
	
		dispatch(addToCart(orderData));
	};

	return (
		<div className="menu-item-list">
			{user && (
				<Link to='/menu-items/new'>
					<button className="menu-item-list__create-button">Create New Menu Item</button>
				</Link>
			)}

			{menuItems.length === 0 ? (
				<p className="menu-item-list__empty-message">No menu items available.</p>
			) : (
				<div className="menu-item-list__container">
					{menuItems.map((item) => (
						<div className="menu-item-list__item" key={item.id}>
							<h2 className="menu-item-list__restaurant-name">
								<Link to={`/restaurants/${item.restaurantId}`}>
									{item.restaurant_name}
								</Link>
							</h2>

							<h3 className="menu-item-list__item-name">
								<Link to={`/menu-items/${item.id}`}>{item.name}</Link>
							</h3>

							<p className="menu-item-list__item-price">${item.price}</p>
							<p className="menu-item-list__item-likes">
								<FaThumbsUp /> {likes[item.id]}
							</p>
							<img className="menu-item-list__item-image" src={item.food_image} alt={item.name} />

							<button
								className={`menu-item-list__add-to-cart-btn ${
									cartItems.length > 0 && cartItems[0].restaurantId !== item.restaurantId
										? 'disabled'
										: ''
								}`}
								disabled={cartItems.length > 0 && cartItems[0].restaurantId !== item.restaurantId}
								onClick={() => handleAddToCart(item)}
							>
								{cartItems.length > 0 && cartItems[0].restaurantId !== item.restaurantId
									? '⚠️'
									: '+'}
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MenuItemList;