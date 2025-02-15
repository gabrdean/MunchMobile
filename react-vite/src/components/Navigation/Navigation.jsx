import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useState} from "react";
import DropdownMenu from "./DropdownMenu";
import { guestLogin, editUserThunk } from '../../redux/session';
import "./Navigation.css";
import Cart from '../Cart';

function Navigation() {
  	const user = useSelector((store) => store.session.user);
	const [deliveryType, setDeliveryType] = useState('delivery');
  	const [search, setSearch] = useState('');
	const [address, setAddress] = useState('');
	const [errors, setErrors] = useState({})
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch()
	const isCheckoutPage = location.pathname === '/checkout';
  // const location = useLocation().pathname.split('/');

	if (isCheckoutPage) {
		return (
			<div className='checkout-navbar'>
				<button className='back-to-store' onClick={() => navigate(-1)}>
					← Back to store
				</button>
				<h1
					className='checkout-title'
					onClick={() => navigate('/home')}
					style={{ cursor: 'pointer' }}>
					NomNow
				</h1>
			</div>
		);
	}
	const setGuest = async (e) => {
		e.preventDefault();
		

		const split = address.split(',')
		if(split.length !== 4){
			return setErrors({
				address: "Address must by ADDRESS, CITY, STATE, ZIP, seperated by commas"
			})
		}
		const addressObj = {
			address: split[0],
			city: split[1],
			state: split[2],
			zip: split[3]
		}

		let server
		if(user && !user.guest){
			addressObj.id = user.id
			server = await dispatch(editUserThunk(addressObj))
		}else{
			return alert('Must login to add address')
		}
		
		if(server){
			console.log(server)
		}
	}

  // console.log('DELIVERY TYPE:', deliveryType);
  console.log('USER', user)
  return (
		<div className='navContainer'>
			<ul className='nav'>
				<li>{user ? <DropdownMenu user={user} /> : <DropdownMenu />}</li>
				<li>
					<NavLink to='/'>NomNow</NavLink>
				</li>
				{user && user.address && user.city && user.state && user.zip ? (
					<li className='delivery-type'>
						{deliveryType === 'delivery' ? (
							<button className='selected'>Delivery</button>
						) : (
							<button
								className='travel-option'
								onClick={(e) => {
									e.preventDefault();
									setDeliveryType('delivery');
								}}>
								Delivery
							</button>
						)}

						{deliveryType === 'pickup' ? (
							<button className='selected'>Pickup</button>
						) : (
							<button
								className='travel-option'
								onClick={(e) => {
									e.preventDefault();
									setDeliveryType('pickup');
								}}>
								Pickup
							</button>
						)}
					</li>
				) : (
					<>
					<li className='delivery-type'>
						<input 
							type="text" 
							placeholder='Enter delivery address'
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
						{address && (
							<button onClick={(e)=> setGuest(e)}>
								Add address
							</button>
						)}
					</li>
					{errors.address && <p>{errors.address}</p>}
					</>
				)}

				<li>
					<input
						type='search'
						placeholder='Search NomNow'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</li>
				<li className='user-actions'>
					{user?.address && (
						<li className='cart-nav'>
							<Cart />
						</li>
					)}
					{!user && (
						<li>
							<NavLink to='/login'>
								<button className='auth-buttons'>Log in</button>
							</NavLink>
							<NavLink to='/signup'>
								<button className='auth-buttons'>Sign up</button>
							</NavLink>
						</li>
					)}
				</li>
			</ul>
		</div>
  );
}

export default Navigation;
