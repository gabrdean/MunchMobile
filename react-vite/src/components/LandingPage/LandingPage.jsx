import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { guestLogin } from '../../redux/session';
function LandingPage() {
	const [address, setAddress] = useState('');
	const [delivery_time, setDeliveryTime] = useState('');
	const [errors, setErrors] = useState({})
	const navigate = useNavigate();
	const user = useSelector((store) => store.session.user);
	const dispatch = useDispatch()

	useEffect(() => {
		if (user) {
			navigate('/home');
		}
	}, [user, navigate]);

	const setGuest = async (e) => {
		e.preventDefault();
		return alert('Feature Coming Soon')

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

		await dispatch(guestLogin(addressObj))
	}

	return (
		<div className='landing-page'>
			<div className='main-content'>
				<h1>Order delivery near you</h1>
				<form onSubmit={(e)=> setGuest(e)}>
					<input
						type='text'
						placeholder='Enter delivery address'
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
					{errors.address && <p>{errors.address}</p>}

					<select
						value={delivery_time}
						onChange={(e) => setDeliveryTime(e.target.value)}>
						<option value='Deliver now'>Deliver now</option>
						<option value='Schedule Later'>Schedule for later</option>
					</select>

					<button className='auth-buttons' type='submit'>Search here</button>
				</form>
				<a href='/login'>Or Sign In</a>
			</div>
		</div>
	);
}

export default LandingPage;
