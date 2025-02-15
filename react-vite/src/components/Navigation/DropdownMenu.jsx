import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { thunkLogout } from '../../redux/session';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import OpenModalMenuItem from './OpenModalMenuItem';
import SignupFormModal from '../SignupFormModal';
// import { useModal } from "../../context/Modal";
import './Navigation.css';

function DropdownMenu({ user }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// const ulRef = useRef(null);
	const menuRef = useRef(null);
	// const location = useLocation();
	// const { closeModal } = useModal();
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const closeMenu = () => {
		setMenuOpen(false);
	};

	const logout = (e) => {
		e.preventDefault();
		dispatch(thunkLogout());
		// closeModal();
		closeMenu();
	};

	const handleRestaurantClick = () => {
		if (!user) {
			navigate('/login');
		} else if (user.restaurantOwner) {
			navigate('/restaurants/manage');
		} else {
			navigate('/restaurants/new');
		}
		// closeModal();
		closeMenu();
	};

	const getButtonText = () => {
		if (!user) return 'Add your restaurant';
		if (user.restaurantOwner) return 'Manage your restaurants';
		return 'Add your restaurant';
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				closeMenu();
			}
		}

		function handleEscape(event) {
			if (event.key === 'Escape') {
				closeMenu();
			}
		}

		if (menuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('keydown', handleEscape);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	}, [menuOpen]);

	return (
		<div className='burger-container' ref={menuRef}>
			{/* Burger Icon */}
			<button onClick={toggleMenu} className='menu-button'>
				<img src='../../icons/menu.png' alt='Menu' className='icon' />
			</button>
			{/* Dropdown Menu */}
			<div className={`menu-dropdown ${menuOpen ? 'open' : 'closed'}`}>
				{user && !user.guestAccount ? (
					<>
						<li>
							<div className='profile'>
								<img
									src='/icons/user.png'
									alt='User'
									className='icon'
								/>
								<div className='profile-info'>
									<h4>
										{user.firstName} {user.lastName}
									</h4>
									<a href='/account'>Manage account</a>
								</div>
							</div>
						</li>
						<li className='user-li'>
							<NavLink to='/orders' className='y' onClick={closeMenu}>
								<i className='fa-sharp fa-solid fa-suitcase-rolling'></i>
								Orders
							</NavLink>
						</li>
						<li className='user-li'>
							<NavLink to='/favorites' className='y' onClick={closeMenu}>
								<i className='fa-sharp fa-solid fa-heart'></i>
								Favorites
							</NavLink>
						</li>
						<li className='user-li'>
							<NavLink to='/wallet' className='y' onClick={closeMenu}>
								<i className='fa-sharp fa-solid fa-wallet'></i>
								Wallet
							</NavLink>
						</li>
						<li className='user-li'>
							<NavLink to='/reviews' className='y' onClick={closeMenu}>
								<i className='fa-sharp fa-solid fa-wallet'></i>
								Reviews
							</NavLink>
						</li>
						<li className='user-li'>
							<NavLink
								to='/menu-items'
								className='y'
								onClick={closeMenu}>
								<i className='fa-sharp fa-solid fa-pizza-slice'></i>
								Menu Items
							</NavLink>
						</li>
						<li className='user-li'>
							<button className='auth-buttons' onClick={logout}>
								Sign out
							</button>
						</li>
						<li className='user-li'>
							<button
								className='auth-buttons'
								onClick={handleRestaurantClick}>
								{getButtonText()}
							</button>
						</li>
					</>
				) : (
					<ul className='align-buttons'>
						{!user?.guestAccount ? (
							<>
								<li>
									<NavLink to='/login' onClick={closeMenu}>
										<button className='auth-buttons z'>Log in</button>
									</NavLink>
								</li>
								<li>
									<NavLink to='/signup' onClick={closeMenu}>
										<button className='auth-buttons z'>
											Sign up
										</button>
									</NavLink>
								</li>
								<li>
									<button
										className='auth-buttons'
										onClick={handleRestaurantClick}>
										{getButtonText()}
									</button>
								</li>
							</>
						) : (
							<>
								<li>
									<div className='profile'>
										<img
											src='/icons/user.png'
											alt='User'
											className='icon'
										/>
										<div className='profile-info'>
											<h4>
												{user.firstName} {user.lastName}
											</h4>
										</div>
									</div>
								</li>
								<li className='user-li'>
									<label htmlFor='mdbt'>
										<NavLink
											to='/orders'
											className='y'
											onClick={closeMenu}>
											<i className='fa-sharp fa-solid fa-suitcase-rolling'></i>
											Orders
										</NavLink>
										<OpenModalMenuItem
											className='mdbt'
											modalComponent={SignupFormModal}
										/>
									</label>
								</li>
								<li className='user-li'>
									<NavLink
										to='/favorites'
										className='y'
										onClick={closeMenu}>
										<i className='fa-sharp fa-solid fa-heart'></i>
										Favorites
									</NavLink>
								</li>
								<li className='user-li'>
									<NavLink
										to='/wallet'
										className='y'
										onClick={closeMenu}>
										<i className='fa-sharp fa-solid fa-wallet'></i>
										Wallet
									</NavLink>
								</li>
								<li className='user-li'>
									<NavLink
										to='/reviews'
										className='y'
										onClick={closeMenu}>
										<i className='fa-sharp fa-solid fa-wallet'></i>
										Reviews
									</NavLink>
								</li>
								<li>
									<NavLink to='/login' onClick={closeMenu}>
										<button className='auth-buttons y'>Log in</button>
									</NavLink>
								</li>
								<li>
									<NavLink to='/signup' onClick={closeMenu}>
										<button className='auth-buttons y'>
											Sign up
										</button>
									</NavLink>
								</li>
							</>
						)}
					</ul>
				)}
			</div>
		</div>
	);
}

export default DropdownMenu;

// let content = (
// 	<div className='menu-dropdown' ref={ulRef}>
// 		<li>
// 			<NavLink to='/login' onClick={closeModal}>
// 				Log in
// 			</NavLink>
// 		</li>
// 		<li>
// 			<NavLink to='/signup' onClick={closeModal}>
// 				Sign up
// 			</NavLink>
// 		</li>
// 		<li>
// 			<button className='auth-buttons' onClick={handleRestaurantClick}>
// 				{getButtonText()}
// 			</button>
// 		</li>
// 	</div>
// );
// if (user) {
//   content = (
// 		<div className='menu-dropdown' ref={ulRef}>
// 			<li>
// 				<div className='profile'>
// 					<img src='/icons/user.png' alt='' className='icon' />
// 					<div className='profile-info'>
// 						<h4>
// 							{user.firstName} {user.lastName}
// 						</h4>
// 						<a href='/account'>Manage account</a>
// 					</div>
// 				</div>
// 			</li>
// 			<li>
// 				<NavLink to={`/orders`} onClick={closeModal}>
// 					Orders
// 				</NavLink>
// 			</li>
// 			<li>
// 				<NavLink to={`/favorites`} onClick={closeModal}>
// 					Favorites
// 				</NavLink>
// 			</li>
// 			<li>
// 				<NavLink to={`/wallet`} onClick={closeModal}>
// 					Wallet
// 				</NavLink>
// 			</li>
// 			<li>
// 				<NavLink to={`/menu-items`} onClick={closeModal}>
// 					Menu Items
// 				</NavLink>
// 			</li>
// 			<li>Meal Plan</li>
// 			<li>Help</li>
// 			<li>Promotions</li>
// 			<li>Invite a friend</li>
// 			<li>
// 				<button className='auth-buttons' onClick={logout}>Sign out</button>
// 			</li>
// 			<li>
// 				<button onClick={handleRestaurantClick} className='link-button auth-buttons'>
// 					{getButtonText()}
// 				</button>
// 			</li>
// 			{/* Show Add New Restaurant button only on manage restaurants page */}
// 			{location.pathname === '/restaurants/manage' && (
// 				<li>
// 					<NavLink to={'/restaurants/new'} onClick={closeModal}>
// 						Add New Restaurant
// 					</NavLink>
// 				</li>
// 			)}
// 		</div>
// 	);
// }

// const MenuContent = ({
// 	user,
// 	closeModal,
// 	handleRestaurantClick,
// 	getButtonText,
// }) => (
// 	<div className='menu-dropdown'>
// 		{user ? (
// 			<>
// 				<li>
// 					<div className='profile'>
// 						<img src='/icons/user.png' alt='' className='icon' />
// 						<div className='profile-info'>
// 							<h4>
// 								{user.firstName} {user.lastName}
// 							</h4>
// 							<a href='/account'>Manage account</a>
// 						</div>
// 					</div>
// 				</li>
// 				<li>
// 					<NavLink to='/orders' onClick={closeModal}>
// 						Orders
// 					</NavLink>
// 				</li>
// 				<li>
// 					<NavLink to='/favorites' onClick={closeModal}>
// 						Favorites
// 					</NavLink>
// 				</li>
// 				<li>
// 					<NavLink to='/wallet' onClick={closeModal}>
// 						Wallet
// 					</NavLink>
// 				</li>
// 				<li>
// 					<NavLink to='/menu-items' onClick={closeModal}>
// 						Menu Items
// 					</NavLink>
// 				</li>
// 				<li>
// 					<button className='auth-buttons' onClick={logout}>
// 						Sign out
// 					</button>
// 				</li>
// 				<li>
// 					<button
// 						className='link-button auth-buttons'
// 						onClick={handleRestaurantClick}>
// 						{getButtonText()}
// 					</button>
// 				</li>
// 			</>
// 		) : (
// 			<>
// 				<li>
// 					<NavLink to='/login' onClick={closeModal}>
// 						Log in
// 					</NavLink>
// 				</li>
// 				<li>
// 					<NavLink to='/signup' onClick={closeModal}>
// 						Sign up
// 					</NavLink>
// 				</li>
// 				<li>
// 					<button onClick={handleRestaurantClick}>
// 						{getButtonText()}
// 					</button>
// 					</li>
// 					{location.pathname == '/restaurants/manage' && (
// 						<li>
// 							<NavLink to={'/restaurants/new'} onClick={closeModal}>
// 								Add New Restaurant
// 							</NavLink>
// 						</li>
// 					)}
// 			</>
// 		)}
// 	</div>
// );

// return (
// 	<>
// 		{user && (
// 			<OpenModalMenuItem
// 				itemText={
// 					<img src='../../icons/menu.png' alt='' className='icon' />
// 				}
// 				modalComponent={
// 					<MenuContent
// 						user={user}
// 						closeModal={closeModal}
// 						handleRestaurantClick={handleRestaurantClick}
// 						getButtonText={getButtonText}
// 					/>
// 				}
// 			/>
// 		)}
// 	</>
// );

// return (
//   <OpenModalMenuItem
//     itemText={<img src="../../icons/menu.png" alt="" className='icon' />}
//     modalComponent={content}
//   />
// );
