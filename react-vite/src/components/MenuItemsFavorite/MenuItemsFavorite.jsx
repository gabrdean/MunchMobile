import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFavoriteItems } from '../../redux/menuItems';
import { Link } from 'react-router-dom';
import './MenuItemsFavorite.css'; // Import the updated CSS

const Favorites = () => {
  const dispatch = useDispatch();
  const favoriteItems = useSelector(state => state.menuItems.favoriteItems);
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    if (user) {
      dispatch(getFavoriteItems());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="favorites-container">
        <h2 className="no-favorites-message">Please log in to view your favorites.</h2>
      </div>
    );
  }

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