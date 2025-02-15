import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFavoriteItems } from '../../redux/menuItems';
import { Link } from 'react-router-dom';
import './MenuItemsFavorite.css'; // Import the updated CSS

const Favorites = () => {
  const dispatch = useDispatch();
  const favoriteItems = useSelector(state => state.menuItems.favoriteItems); // Get favorite items from Redux store

  useEffect(() => {
    dispatch(getFavoriteItems()); // Dispatch action to fetch favorite items
  }, [dispatch]);

  if (!favoriteItems.length) {
    return (
      <div className="favorites-container">
        <h2 className="no-favorites-message">No favorite items yet!</h2>
      </div>
    );
  }

  

  return (
    <div className="favorites-container">
      <h2>Your Favorites</h2>
      <ul className="favorites-list">
        {favoriteItems.map(item => (
          <li key={item.id}>
            <Link to={`/menu-items/${item.id}`}>
              <img src={item.food_image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>${item.price}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
 
};

export default Favorites;