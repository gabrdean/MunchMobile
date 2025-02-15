import { useNavigate } from 'react-router-dom';
import './OrderItems.css';

export default function OrderItems({ item }) {
	const navigate = useNavigate();
	const handleOrderItemClick = (menuItemId) => {
		if (menuItemId) {
			navigate(`/menu-items/${menuItemId}`);
		}
	};

	return (
		<div
			className='order-item'
			onClick={(e) => {
				e.stopPropagation();
				handleOrderItemClick(item.menu_item_id);
			}}
			style={{
				cursor: 'pointer',
			}}>
			<div className='order-item-details'>
				<span className='quantity'>{item.quantity}x </span>
				<span className='item-name'>
					{item.name || item.menu_item_name || 'Unnamed Item'}
				</span>
			</div>
			{item.customizations && (
				<p className='customizations'>{item.customizations}</p>
			)}
		</div>
	);
}
