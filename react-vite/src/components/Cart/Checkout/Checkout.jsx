import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import TipModal from '../../../context/TipModal';
import ScheduleModal from '../../../context/ScheduleModal';
import { placeOrder, deleteOrder } from '../../../redux/orders';
import { confirmOrderPlacement } from '../../../redux/cart';
import { deductFundsThunk } from '../../../redux/session';
import OrderRestaurant from '../../Orders/OrderRestaurant';
import CartItems from '../CartItems';
import './Checkout.css';

export default function Checkout() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const user = useSelector((state) => state.session.user);
	const { setModalContent } = useModal();
	const currentOrder = useSelector((state) => state.orders.currentOrder);
	const [tip, setTip] = useState(0);
	const [customTipUsed, setCustomTipUsed] = useState(false);
	const [deliveryOption, setDeliveryOption] = useState('standard');
	const [scheduledTime, setScheduledTime] = useState(null);
	const restaurantClosingTime =
		currentOrder?.restaurant?.closingTime || '20:00';
	const [paymentMethod, setPaymentMethod] = useState('credit-card');

	const subtotal = parseInt(currentOrder?.totalCost) || 0;
	const baseDeliveryFee = 6.49;
	const priorityFee = 1.49;
	const taxes = subtotal * 0.1;
	const deliveryFee =
		deliveryOption === 'priority'
			? baseDeliveryFee + priorityFee
			: baseDeliveryFee;
	const orderTotal = subtotal + deliveryFee + taxes;
	const total = subtotal + deliveryFee + taxes + tip;

	const openTipModal = () => {
		setModalContent(
			<TipModal
				orderTotal={orderTotal}
				setTip={setTip}
				setCustomTipUsed={setCustomTipUsed}
			/>
		);
	};

	const openScheduleModal = () => {
		setModalContent(
			<ScheduleModal
				setScheduledTime={setScheduledTime}
				restaurantClosingTime={restaurantClosingTime}
			/>
		);
	};

	const handlePlaceOrder = async () => {
		if (paymentMethod === 'wallet') {
			if (user.wallet < total) {
				alert('Insufficient funds in your wallet.');
				return;
			}

			await dispatch(deductFundsThunk({ id: user.id, amount: total }));
		}

		await dispatch(placeOrder(currentOrder.id));

		dispatch(confirmOrderPlacement());

		setTimeout(() => {
			const updatedOrder = JSON.parse(localStorage.getItem('currentOrder'));
			if (updatedOrder && updatedOrder.status === 'Submitted') {
				navigate('/orders');
			}
		}, 500);
	};

	const handleOrderDeletion = async () => {
		if (currentOrder?.status === 'Active') {
			await dispatch(deleteOrder(currentOrder.id));
			localStorage.removeItem('currentOrder');
		}
	};
	useEffect(() => {
		const handleBeforeUnload = () => handleOrderDeletion();

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			handleOrderDeletion();
		};
	}, []);

	useEffect(() => {
		if (location.pathname !== '/checkout') {
			handleOrderDeletion();
		}
	}, [location.key]);

	useEffect(() => {
		const savedOrder = JSON.parse(localStorage.getItem('currentOrder'));

		if (!currentOrder && savedOrder) {

			localStorage.removeItem('currentOrder');
			navigate('/orders');
		}
	}, [currentOrder, dispatch, navigate]);

	if (!currentOrder) {
		navigate('/orders');
		return null;
	}

	return (
		<div className='checkout-page'>
			<div className='checkout-left'>

				<div className='delivery-section'>
					<h3>Delivery details</h3>
					<div className='address'>
						<p>
							<strong>
								{user?.address || 'Delivery Address Not Provided'}
							</strong>
						</p>
						<p>
							{user?.city
								? `${user.city}, ${user.state}`
								: 'City, State'}
						</p>
					</div>
					<div className='delivery-instructions'>
						<p>
							{user?.deliveryInstructions ||
								'No delivery instructions provided.'}
						</p>
					</div>
				</div>


				<div className='delivery-options'>
					<h3>Delivery options</h3>
					<div
						className={`d-option priority ${
							deliveryOption === 'priority' ? 'selected' : ''
						}`}
						onClick={() => setDeliveryOption('priority')}>
						<span>
							⚡ Priority <span className='faster-badge'>Faster</span>
						</span>
						<span className='extra-fee'>+${priorityFee.toFixed(2)}</span>
						<span>15-30 min</span>
					</div>
					<div
						className={`d-option standard ${
							deliveryOption === 'standard' ? 'selected' : ''
						}`}
						onClick={() => setDeliveryOption('standard')}>
						<span>📦 Standard</span>
						<span>20-35 min</span>
					</div>
					<div
						className={`d-option schedule ${
							deliveryOption === 'schedule' ? 'selected' : ''
						}`}
						onClick={() => {
							setDeliveryOption('schedule');
							openScheduleModal();
						}}>
						<span>⏰ Schedule</span>
						<span>{scheduledTime ? scheduledTime : 'Choose a time'}</span>
					</div>
				</div>


				<div className='payment-section'>
					<h3>Payment</h3>
					<div className='payment-options'>
						<div
							className={`d-option credit-card ${
								paymentMethod === 'credit-card' ? 'selected' : ''
							}`}
							onClick={() => setPaymentMethod('credit-card')}>
							<span>💳 Credit Card</span>
							<span>
								{currentOrder?.paymentMethod || '**** **** **** 1234'}
							</span>
						</div>
						<div
							className={`d-option wallet ${
								paymentMethod === 'wallet' ? 'selected' : ''
							}`}
							onClick={() => setPaymentMethod('wallet')}>
							<span>💰 Credits</span>
							<span>
								Balance: ${parseInt(user?.wallet)?.toFixed(2) || '0.00'}
							</span>
						</div>
					</div>
				</div>


				<button className='confirm-order-btn' onClick={handlePlaceOrder}>
					Place order
				</button>
			</div>


			<div className='checkout-right'>
				<OrderRestaurant restaurantId={currentOrder.restaurant.id} />
				<div className='order-summary'>
					<h4>Cart summary ({currentOrder?.orderItems?.length} item/s)</h4>
					<CartItems items={currentOrder?.orderItems} />
				</div>


				<div className='order-total'>
					<h3>Order total</h3>
					<p>Subtotal: ${subtotal.toFixed(2)}</p>
					<p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>
					<p>Taxes & Other Fees: ${taxes.toFixed(2)}</p>


					<div className='tip-section'>
						<h4>
							Add a tip <span className='tooltip'></span>
						</h4>
						<p>100% of your tip goes to your courier.</p>
						<div className='tip-buttons'>
							{[0.15, 0.2, 0.25, 0.3].map((percentage) => (
								<button
									key={percentage}
									className={
										tip === subtotal * percentage
											? 'selected-tip'
											: ''
									}
									onClick={() => {
										setTip(subtotal * percentage);
										setCustomTipUsed(false);
									}}>
									{`${percentage * 100}%`}
								</button>
							))}
							<button
								className={customTipUsed ? 'selected-tip' : ''}
								onClick={openTipModal}>
								Other
							</button>
						</div>
						<p>Tip: ${tip.toFixed(2)}</p>
					</div>

					<h3>Total: ${total.toFixed(2)}</h3>
				</div>
			</div>
		</div>
	);
}