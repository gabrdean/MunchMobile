import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {getRestaurant} from '../../../redux/restaurants'
import './OrderRestaurant.css';


export default function OrderRestaurant({ restaurantId }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const restaurantFromStore = useSelector(
		(state) => state.restaurants.currentRestaurant
	);
	const currentOrder = useSelector((state) => state.orders.currentOrder);

	const getRestaurantData = () => {
		if (location.pathname === '/checkout') {
			return currentOrder?.restaurant;
		}
		return restaurantFromStore?.restaurant;
	};

	const restaurant = getRestaurantData();

	useEffect(() => {
		if (location.pathname !== '/checkout') {
			dispatch(getRestaurant(restaurantId));
		}
	}, [dispatch, restaurantId, location.pathname]);

	return (
		<div
			className='restaurant-header'
			onClick={() => navigate(`/restaurants/${restaurant.id}`)}>
			<img
				src={
					restaurant?.image ||
					restaurant?.storeImage ||
					'/images/cart.jpeg'
				}
				alt={restaurant?.name || 'Unknown Restaurant'}
				className='restaurant-img'></img>
			<div className='restaurant-info'>
				<h3>{restaurant?.name || 'Restaurant Name Not Available'}</h3>
				<p className='restaurant-address'>
					{restaurant?.address
						? `${restaurant.address}, ${restaurant.city || ''}`
						: 'Address Not Available'}
				</p>
			</div>
			<span className='arrow'>➜</span>
		</div>
	);
}
