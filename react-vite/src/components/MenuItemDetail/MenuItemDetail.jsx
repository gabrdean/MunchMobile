import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuItem, toggleLike, getFavoriteItems } from '../../redux/menuItems';
import { addToCart } from '../../redux/cart';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './MenuItemDetail.css'; // Import the updated CSS

const MenuItemDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItem = useSelector(state => state.menuItems.menuItem);
  const likedItems = useSelector(state => state.menuItems.likedItems); // This is now an object
  const error = useSelector(state => state.menuItems.error);
  const user = useSelector(state => state.session.user);

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const cart = useSelector(state => state.cart);
  const cartItems = cart?.cartItems || [];
  
  useEffect(() => {
    if (id) {
      dispatch(getMenuItem(id));
    }
  }, [dispatch, id]);

  if (error) return <div>Error: {error}</div>;
  if (!menuItem) return <div>Loading...</div>;

  // const increaseQuantity = () => setQuantity(prev => prev + 1);
  // const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    // Check if the cart already has items and if those items belong to a different restaurant
    if (cartItems.length > 0 && cartItems[0].restaurantId !== menuItem.restaurantId) {
      alert('Your cart contains items from a different restaurant. Please clear your cart or complete your existing order first.');
      return;
    }

    // Proceed to add the item to the cart
    dispatch(addToCart({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      restaurantId: menuItem.restaurantId, // Correctly pass the restaurantId
      food_image: menuItem.food_image,
      quantity,
    }));

    // Reset the quantity and show a confirmation message
    setQuantity(1);
    setMessage(`${quantity} ${menuItem.name} added to cart!`);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleToggleLike = () => {
    if (!user) {
      // Show alert if the user is not logged in
      alert('You must be logged in to add items to the favorites');
      return;
    }
    dispatch(toggleLike(menuItem.id, user.id)); // Pass user ID
    dispatch(getFavoriteItems());
  };

  // Get the liked items for the current user
  const userLikedItems = likedItems[user?.id] || [];
  const isLiked = userLikedItems.includes(menuItem.id); // Check if the item is liked by the current user

  return (
    <div className="menu-item-detail-container">
      <button className="back-button" onClick={() => navigate(`/restaurants/${menuItem.restaurantId}`)}>
        <span className="back-arrow">←</span> Back to Restaurant
      </button>

			<div className='menu-item-detail'>
				<div>
					<img src={menuItem.food_image} alt={menuItem.name} />
					<div className='heart-button-container'>
						<button
							className={`like-button ${isLiked ? 'liked' : ''}`}
							onClick={handleToggleLike}>
							{isLiked ? '❤️' : '🤍'}
						</button>
					</div>
				</div>

        <div className="menu-item-details">
          <h2>{menuItem.name}</h2>
          <p>${menuItem.price}</p>
          <p>{menuItem.description}</p>
          <p>{menuItem.food_type}</p>

					{user && (
						<>
							{/* <div className="quantity-selector">
                <button onClick={decreaseQuantity}>-</button>
                <span>{quantity}</span>
                <button onClick={increaseQuantity}>+</button>
              </div> */}

							<button
								className='add-to-cart-button'
								onClick={handleAddToCart}>
								{user.address ? 'Add to Cart' : 'Enter address to add'}
							</button>

							{message && (
								<p className='confirmation-message'>{message}</p>
							)}

							<div className='update-delete-buttons'>
								<Link to={`/menu-items/${menuItem.id}/update`}>
									<button>Update</button>
								</Link>
								<Link to={`/menu-items/${menuItem.id}/delete`}>
									<button>Delete</button>
								</Link>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
  );
};

export default MenuItemDetail;
