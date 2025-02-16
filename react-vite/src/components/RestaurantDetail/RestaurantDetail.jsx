import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRestaurant } from '../../redux/restaurants';
import { getMenuItems } from '../../redux/menuItems';
import { addToCart } from '../../redux/cart';

import './RestaurantDetail.css';

function RestaurantDetail() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const { currentRestaurant, error } = useSelector(
		(state) => state.restaurants
	);
	const [deliveryMethod, setDeliveryMethod] = useState('delivery');
	const { menuItems } = useSelector((state) => state.menuItems);
	const user = useSelector((state) => state.session.user);
	const cart = useSelector((state) => state.cart);
	const cartItems = cart?.cartItems || [];
	

	useEffect(() => {
		if (id) {
			dispatch(getRestaurant(id));
			dispatch(getMenuItems());
		}
	}, [dispatch, id]);

	if (error) return <div>Error: {error}</div>;
	if (!currentRestaurant?.restaurant) return <div>Loading...</div>;

	const restaurant = currentRestaurant.restaurant;
	const restaurantMenuItems = menuItems.filter(
		(item) => item.restaurantId === parseInt(id)
	);

	const handleAddToCart = (item) => {
		if (!user) {
			alert('You must be logged in to add items to the cart!');
			return;
		}

		// Check if cart has items from a different restaurant
		if (cartItems.length > 0 && cartItems[0].restaurantId !== parseInt(id)) {
			alert(
				'Your cart contains items from a different restaurant. Please clear your cart or complete your existing order first.'
			);
			return;
		}

		const orderData = {
			id: item.id,
			name: item.name,
			price: item.price,
			restaurantId: parseInt(id), // Make sure restaurantId is an integer
			food_image: item.food_image,
			quantity: 1,
		};

		dispatch(addToCart(orderData));
	};

    return (
        
        <div className="restaurant-detail">
            {/* Header Image */}
            <div className="restaurant-hero">
                <img src={restaurant.storeImage} alt={restaurant.name} />
            </div>
            <button className="back-button" onClick={() => navigate(`/`)}>
  <span className="back-arrow">←</span> Back to Restaurants
</button>
    
            {/* Restaurant Name and Search Section */}
            <div className="restaurant-info-section">
            <div className="restaurant-main-info">
                    <h1>{restaurant.name}</h1>
                    <div className="restaurant-details">
                        <span>{restaurant.deliveryTime} min</span>
                        <span>{restaurant.priceLevel}</span>
                        <span className="tag">{restaurant.cuisineType}</span>
                    </div>
                    <div className="location-hours">
                        <p>{restaurant.address}, {restaurant.city}, {restaurant.state} {restaurant.zip}</p>
                        <p className="business-hours-top">{restaurant.businessHours}</p>
                    </div>
                </div>
                
                <div className="search-section">
                    <input 
                        type="search" 
                        className="search-input"
                        placeholder={`Search in ${restaurant.name || 'restaurant'}`}
                        onClick={()=> alert('Feature coming soon')}
					/>
				</div>
			</div>

			{/* Delivery Options */}
			<div className='delivery-header'>
				<div className='delivery-toggle' data-active={deliveryMethod}>
					<button
						className={deliveryMethod === 'delivery' ? 'active' : ''}
                        onClick={() => {
                            setDeliveryMethod('delivery');
                            alert('Set to delivery')
                        }}>
						Delivery
					</button>
					<button
						className={deliveryMethod === 'pickup' ? 'active' : ''}
                        onClick={() => {
                            setDeliveryMethod('pickup');
                            alert('Set for pickup');
                        }}>
						Pickup
					</button>
					<div className='slider'></div>
				</div>

				<button className='group-order-btn' onClick={()=> alert('Feature coming soon')}>
					<span className='icon'>👥</span>
					Group order
				</button>

				<div className='delivery-info'>
					<div className='info-item'>
						<span className='delivery-fee'>
							$
							{restaurant.deliveryFee
								? `${restaurant.deliveryFee} Delivery Fee on $15+`
								: '$0 Delivery Fee on $15+'}
						</span>
						{/* <span className='info-label'>Pricing & fees</span> */}
					</div>

					<div className='info-item'>
						<span className='arrival-time'>
							{restaurant.deliveryTime} min
						</span>
						<span className='info-label' style={{textDecoration: 'none'}}>Earliest arrival</span>
					</div>
				</div>
			</div>

			{/* Menu Section */}
			<div className='menu-section'>
				<h2>Menu</h2>
				{restaurantMenuItems.length > 0 ? (
					<div className='menu-grid'>
						{restaurantMenuItems.map((item) => (
							<div key={item.id} className='menu-item'>
								<Link to={`/menu-items/${item.id}`}>
									<img src={item.food_image} alt={item.name} />
								</Link>
								<div className='menu-item-info'>
									<Link to={`/menu-items/${item.id}`}>
										<h3>{item.name}</h3>
									</Link>
									<p className='price'>${item.price}</p>
									<p className='tag'>{item.food_type}</p>
									{/* <button
                                        className={`add-to-cart-btn ${
                                            cartItems.length > 0 && cartItems[0].restaurantId !== parseInt(id)
                                                ? 'disabled'
                                                : ''
                                        }`}
                                        disabled={cartItems.length > 0 && cartItems[0].restaurantId !== parseInt(id)}
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        {cartItems.length > 0 && cartItems[0].restaurantId !== parseInt(id)
                                            ? 'Items from another restaurant in cart'
                                            : 'Add to Cart'}
                                    </button> */}
									<button
										className={`add-to-cart-btn ${
											!user.address ||
											(cartItems.length > 0 &&
												cartItems[0].restaurantId !== parseInt(id))
												? 'disabled'
												: ''
										}`}
										disabled={
											!user.address ||
											(cartItems.length > 0 &&
												cartItems[0].restaurantId !== parseInt(id))
										}
										onClick={() => handleAddToCart(item)}>
										{!user.address
											? 'Enter address to add'
											: cartItems.length > 0 &&
											cartItems[0].restaurantId !== parseInt(id)
											? 'Items from another restaurant in cart'
											: 'Add to Cart'}
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<p>No menu items available</p>
				)}
			</div>
		</div>
	);
}

export default RestaurantDetail;
