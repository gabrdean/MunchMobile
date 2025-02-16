import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserRestaurants, deleteRestaurant, reactivateRestaurant } from '../../redux/restaurants';
import './ManageRestaurants.css';

function ManageRestaurants() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { restaurants, error } = useSelector(state => state.restaurants);
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(getUserRestaurants());
    }, [dispatch, user, navigate, location]);

    const handleDelete = async (id) => {
        const choice = window.confirm(
            'How would you like to handle this restaurant?\n\n' +
            '1. Click OK to mark as inactive (Recommended)\n' +
            '2. Click Cancel to see permanent deletion options'
        );

        if (choice) {
            try {
                await dispatch(deleteRestaurant(id, 'soft'));
                dispatch(getUserRestaurants());
            } catch (error) {
                alert(error.message || 'Failed to deactivate restaurant');
            }
        } else {
            const confirmHard = window.confirm(
                'WARNING: This will permanently delete the restaurant and ALL related data including orders and menu items.\n\n' +
                'This action cannot be undone. Are you sure you want to proceed?'
            );

            if (confirmHard) {
                try {
                    const result = await dispatch(deleteRestaurant(id, 'hard'));
                    if (result) {
                        dispatch(getUserRestaurants());
                    }
                } catch (error) {
                    alert(error.message || 'Failed to delete restaurant');
                }
            }
        }
    };

    const handleReactivate = async (restaurant) => {
        try {
            await dispatch(reactivateRestaurant(restaurant.id));
            dispatch(getUserRestaurants());
            alert('Restaurant successfully reactivated!');
        } catch (error) {
            alert(error.message || 'Failed to reactivate restaurant');
        }
    };

    const handleUpdate = (id) => {
        navigate(`/restaurants/${id}/update`);
    };

    if (!user) return null;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="manage-restaurants">
            <h1>My Restaurants</h1>
            {restaurants && restaurants.length > 0 ? (
                <div className="restaurants-grid">
                    {restaurants.map(restaurant => (
                        <div key={restaurant.id} className="restaurant-card">
                            <div className="restaurant-image">
                                <img
                                    src={restaurant.storeImage || '/placeholder.jpg'}
                                    alt={restaurant.name}
                                />
                            </div>
                            <div className="restaurant-info">
                                <h2>{restaurant.name}</h2>
                                <div className={`status-badge ${restaurant.servicing ? 'active' : 'inactive'}`}>
                                    {restaurant.servicing ? 'Active' : 'Inactive'}
                                </div>
                                <div className="button-group">

                                    <button className="auth-buttons" onClick={() => handleUpdate(restaurant.id)}>
                                        Update Info
                                    </button>
                                    <button className="auth-buttons" onClick={() => navigate(`/restaurants/${restaurant.id}/menu`)}>
                                        Update Menu
                                    </button>
                                    {restaurant.servicing ? (
                                        <button className="auth-buttons" onClick={() => handleDelete(restaurant.id)}>
                                            Deactivate/Delete
                                        </button>
                                    ) : (
                                        <button className="auth-buttons" onClick={() => handleReactivate(restaurant)}>
                                            Reactivate
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No restaurants found</p>
            )}
            <button
                className="auth-buttons add-restaurant-button"
                onClick={() => navigate('/restaurants/new')}
            >
                Add New Restaurant
            </button>
        </div>
    );
}

export default ManageRestaurants;