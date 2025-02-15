// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateItemQuantity, removeFromCart } from '../../../redux/cart';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import './CartItems.css';

export default function CartItems({ items }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	// const currentOrder = useSelector((state) => state.orders.currentOrder);

	const handleCartItemClick = (menuItemId) => {
		if (menuItemId) {
			navigate(`/menu-items/${menuItemId}`);
		}
	};

	const handleIncrease = (item) => {
		dispatch(updateItemQuantity(item.id, item.quantity + 1));
	};

	const handleDecrease = (item) => {
		if (item.quantity > 1) {
			dispatch(updateItemQuantity(item.id, item.quantity - 1));
		} else {
			dispatch(removeFromCart(item.id));
		}
	};

	return (
		<div className='cart-items-container'>
			{items && items.length > 0 ? (
				items.map((item) => (
					<div
						key={`${item.id}-${item.name}`}
						className='cart-item'
						onClick={(e) => {
							e.stopPropagation();
							handleCartItemClick(item.menu_item_id);
						}}>
						<img
							src={item.food_image || '/images/cart.jpeg'}
							alt={item.name || 'Menu Item'}
							className='cart-item-image'
						/>

						<div className='cart-item-details'>
							<p className='cart-item-name'>
								{item.name || item.menu_item_name || 'Unavailable Item'}
							</p>
							{item.options && (
								<p className='cart-item-options'>{item.options}</p>
							)}
							{item.extras && (
								<p className='cart-item-extras'>{item.extras}</p>
							)}
							<p className='cart-item-price'>
								${item.price ? item.price.toFixed(2) : '0.00'}
							</p>
						</div>

						<div className='cart-item-quantity-controls'>
							<button
								className='quantity-btn'
								onClick={(e) => {
									e.stopPropagation();
									handleDecrease(item);
								}}>
								{item.quantity > 1 ? <FaMinus color='black'/> : <FaTrash />}
							</button>
							<span className='cart-item-quantity'>
								{item.quantity || 1}
							</span>
							<button
								className='quantity-btn'
								onClick={(e) => {
									e.stopPropagation();
									handleIncrease(item);
								}}>
								<FaPlus />
							</button>
						</div>
					</div>
				))
			) : (
				<p className='empty-cart-message'>No items found.</p>
			)}
		</div>
	);
}
