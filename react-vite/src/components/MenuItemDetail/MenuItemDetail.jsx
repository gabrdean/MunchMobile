import React, { useEffect, useState } from 'react';
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
  const likedItems = useSelector(state => state.menuItems.likedItems);
  const error = useSelector(state => state.menuItems.error);
  const user = useSelector(state => state.session.user);

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getMenuItem(id));
    }
  }, [dispatch, id]);

  if (error) return <div>Error: {error}</div>;
  if (!menuItem) return <div>Loading...</div>;

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      restaurantId: menuItem.restaurantId,
      food_image: menuItem.food_image,
      quantity,
    }));
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
    dispatch(toggleLike(menuItem.id));
    dispatch(getFavoriteItems());
  };

  const isLiked = likedItems.includes(menuItem.id);

  return (
    <div className="menu-item-detail-container">
      <button className="back-button" onClick={() => navigate('/menu-items')}>
        Back to Menu Items List
      </button>

      <div className="menu-item-detail">
        <div>
          <img src={menuItem.food_image} alt={menuItem.name} />
          <div className="heart-button-container">
            <button
              className={`like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleToggleLike}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
          </div>
        </div>

        <div className="menu-item-details">
          <h2>{menuItem.name}</h2>
          <p> ${menuItem.price}</p>
          <p>{menuItem.description}</p>
          <p>{menuItem.food_type}</p>

          {user && (
            <>
              <div className="quantity-selector">
                <button onClick={decreaseQuantity}>-</button>
                <span>{quantity}</span>
                <button onClick={increaseQuantity}>+</button>
              </div>

              <button className="add-to-cart-button" onClick={handleAddToCart}>
                + Add {quantity} to Cart
              </button>

              {message && <p className="confirmation-message">{message}</p>}

              <div className="update-delete-buttons">
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