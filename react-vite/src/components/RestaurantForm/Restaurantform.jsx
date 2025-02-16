import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createRestaurant, updateRestaurant, getRestaurant } from '../../redux/restaurants';
import './RestaurantForm.css'

const CUISINE_TYPES = [
    "AMERICAN", "CHINESE", "ITALIAN", "JAPANESE", "MEXICAN", "INDIAN",
    "THAI", "MEDITERRANEAN", "KOREAN", "VIETNAMESE", "GREEK", "SPANISH",
    "SEAFOOD", "PIZZA", "VEGETARIAN", "VEGAN", "BREAKFAST", "FAST_FOOD",
    "CARIBBEAN", "SOUL_FOOD"
];

const formatCuisineType = (type) => {
    return type.split('_')
              .map(word => word.charAt(0) + word.slice(1).toLowerCase())
              .join(' ');
};

const PRICE_LEVELS = {
    "INEXPENSIVE": "$",
    "MODERATE": "$$",
    "EXPENSIVE": "$$$",
    "VERY_EXPENSIVE": "$$$$"
};



// Validation rules
const validateField = (name, value) => {
    switch (name) {
        case 'name':
            if (!value.trim()) return 'Restaurant name is required';
            if (value.length < 2) return 'Name must be at least 2 characters';
            if (value.length > 50) return 'Name must be less than 50 characters';
            return '';

        case 'description':
            if (!value.trim()) return 'Description is required';
            if (value.length < 10) return 'Description must be at least 10 characters';
            if (value.length > 500) return 'Description must be less than 500 characters';
            return '';

        case 'address':
            if (!value.trim()) return 'Address is required';
            if (value.length < 5) return 'Please enter a valid address';
            return '';

        case 'city':
            if (!value.trim()) return 'City is required';
            if (!/^[a-zA-Z\s-]+$/.test(value)) return 'City should only contain letters, spaces, and hyphens';
            return '';

        case 'state':
            if (!value.trim()) return 'State is required';
            if (!/^[A-Z]{2}$/.test(value)) return 'State should be a 2-letter code (e.g., NY)';
            return '';

        case 'zip':
            if (!value) return 'ZIP code is required';
            if (!/^\d{5}$/.test(value)) return 'ZIP code must be 5 digits';
            return '';

        case 'delivery_fee':
            if (value && (isNaN(value) || parseFloat(value) < 0)) return 'Delivery fee must be a positive number';
            return '';

        case 'delivery_time':
            if (value && (isNaN(value) || parseInt(value) < 1 || parseInt(value) > 180)) {
                return 'Delivery time must be between 1 and 180 minutes';
            }
            return '';

        case 'business_hours':
            if (!value.trim()) return 'Business hours are required';
            if (!value.includes(':')) return 'Please use the format: Mon-Fri: 9AM-10PM';
            return '';

        case 'store_image':
            if (!value) return 'Image URL is required';
            try {
                new URL(value);
                return '';
            } catch {
                return 'Please enter a valid URL';
            }

        case 'cuisine_type':
            if (!value) return 'Please select a cuisine type';
            if (!CUISINE_TYPES.includes(value)) return 'Invalid cuisine type selected';
            return '';

        case 'price_level':
            if (!value) return 'Please select a price level';
            if (!Object.keys(PRICE_LEVELS).includes(value)) return 'Invalid price level selected';
            return '';

        default:
            return '';
    }
};

export default function RestaurantForm() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector((state) => state.restaurants.error);
    const currentRestaurant = useSelector((state) => state.restaurants.currentRestaurant);
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        cuisine_type: '',
        delivery_fee: '',
        business_hours: '',
        servicing: true,
        store_image: '',
        price_level: '',
        delivery_time: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            dispatch(getRestaurant(id));
        }
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && currentRestaurant?.restaurant) {
            const restaurant = currentRestaurant.restaurant;
            setFormData({
                name: restaurant.name || '',
                description: restaurant.description || '',
                address: restaurant.address || '',
                city: restaurant.city || '',
                state: restaurant.state || '',
                zip: restaurant.zip || '',
                cuisine_type: restaurant.cuisineType || '',
                delivery_fee: restaurant.deliveryFee || '',
                business_hours: restaurant.businessHours || '',
                servicing: restaurant.servicing !== undefined ? restaurant.servicing : true,
                store_image: restaurant.storeImage || '',
                price_level: restaurant.priceLevel || '',
                delivery_time: restaurant.deliveryTime || ''
            });
        }


        
    }, [currentRestaurant, isEditMode]);


    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        const error = validateField(name, formData[name]);
        setFormErrors(prev => {
            const newErrors = { ...prev };
            if (error && error.trim()) {
                newErrors[name] = error;
            } else {
                delete newErrors[name];  // Remove the key if there's no error
            }
            return newErrors;
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    
        if (touched[name]) {
            const error = validateField(name, newValue);
            setFormErrors(prev => {
                const newErrors = { ...prev };
                if (error && error.trim()) {
                    newErrors[name] = error;
                } else {
                    delete newErrors[name];  // Remove the key if there's no error
                }
                return newErrors;
            });
        }
    };
    const validateForm = () => {
        const errors = {};
        Object.keys(formData).forEach(field => {
            // Skip validation for optional fields if they're empty
            if (field === 'servicing') return;
            if (!['delivery_fee', 'delivery_time'].includes(field) || formData[field]) {
                const error = validateField(field, formData[field]);
                // Only add to errors if there is an actual error message
                if (error && error.trim()) {
                    errors[field] = error;
                }
            }
        });
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submit clicked - starting submission');
        setIsLoading(true);
    
        // Mark all fields as touched
        const allTouched = Object.keys(formData).reduce((acc, key) => ({
            ...acc,
            [key]: true
        }), {});
        setTouched(allTouched);
    
        // Validate all fields
        const errors = validateForm();
        setFormErrors(errors);
    
        if (Object.keys(errors).length === 0) {
            try {
                // Filter out null/empty values
                const submitData = Object.fromEntries(
                    Object.entries(formData).filter(([_, value]) => 
                        value !== null && value !== ''
                    )
                );
                
                console.log('Submitting data:', submitData);
    
                if (isEditMode) {
                    const result = await dispatch(updateRestaurant(id, submitData));
                    if (result) {
                        navigate('/restaurants/manage');
                    }
                } else {
                    const result = await dispatch(createRestaurant(submitData));
                    if (result) {
                        navigate('/restaurants/manage');
                    }
                }
            } catch (err) {
                console.error('Submission error:', err);
                setFormErrors(prev => ({
                    ...prev,
                    submit: err.message || 'Failed to submit restaurant'
                }));
            }
        }
        setIsLoading(false);
        console.log('Form errors:', formErrors);
        console.log('Error keys:', Object.keys(formErrors));
        console.log('Has empty required:', hasEmptyRequired());
        console.log('Form data being submitted:', formData);
    };

    const hasEmptyRequired = () => {
        const requiredFields = [
            'name', 'description', 'address', 'city', 'state', 
            'zip', 'cuisine_type', 'price_level', 'business_hours', 
            'store_image'
        ];
        const emptyFields = requiredFields.filter(field => !formData[field]);
        console.log('Empty required fields:', emptyFields);
        return emptyFields.length > 0;
    };
    

    // Helper function to determine if field has error
    const hasError = (fieldName) => touched[fieldName] && formErrors[fieldName];

    console.log('Submit clicked - starting submission');
    console.log('Current form data:', formData);
    console.log('Form errors:', formErrors);
    console.log('Has empty required:', hasEmptyRequired());
    return (
        <div className='restaurant-form-container'>
            <h2>{isEditMode ? 'Update Restaurant' : 'Create New Restaurant'}</h2>
            
            {error && <div className='error-message'>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor="name">Restaurant Name*</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('name') ? 'error' : ''}
                        required
                    />
                    {hasError('name') && (
                        <div className="error-message">{formErrors.name}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="description">Description*</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('description') ? 'error' : ''}
                        required
                    />
                    {hasError('description') && (
                        <div className="error-message">{formErrors.description}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="address">Street Address*</label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('address') ? 'error' : ''}
                        required
                    />
                    {hasError('address') && (
                        <div className="error-message">{formErrors.address}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="city">City*</label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('city') ? 'error' : ''}
                        required
                    />
                    {hasError('city') && (
                        <div className="error-message">{formErrors.city}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="state">State*</label>
                    <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('state') ? 'error' : ''}
                        required
                    />
                    {hasError('state') && (
                        <div className="error-message">{formErrors.state}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="zip">ZIP Code*</label>
                    <input
                        id="zip"
                        name="zip"
                        type="text"
                        value={formData.zip}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('zip') ? 'error' : ''}
                        required
                    />
                    {hasError('zip') && (
                        <div className="error-message">{formErrors.zip}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="cuisine_type">Cuisine Type*</label>
                    <select
                        id="cuisine_type"
                        name="cuisine_type"
                        value={formData.cuisine_type}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('cuisine_type') ? 'error' : ''}
                        required
                    >
                        <option value="">Select cuisine type</option>
                        {CUISINE_TYPES.map(type => (
                            <option key={type} value={type}>{formatCuisineType(type)}</option>
                        ))}
                    </select>
                    {hasError('cuisine_type') && (
                        <div className="error-message">{formErrors.cuisine_type}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="price_level">Price Level*</label>
                    <select
                        id="price_level"
                        name="price_level"
                        value={formData.price_level}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('price_level') ? 'error' : ''}
                        required
                    >
                        <option value="">Select price level</option>
                        {Object.entries(PRICE_LEVELS).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                    {hasError('price_level') && (
                        <div className="error-message">{formErrors.price_level}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="delivery_fee">Delivery Fee</label>
                    <input
                        id="delivery_fee"
                        name="delivery_fee"
                        type="number"
                        step="0.01"
                        value={formData.delivery_fee}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('delivery_fee') ? 'error' : ''}
                    />
                    {hasError('delivery_fee') && (
                        <div className="error-message">{formErrors.delivery_fee}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="business_hours">Business Hours*</label>
                    <input
                        id="business_hours"
                        name="business_hours"
                        type="text"
                        value={formData.business_hours}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('business_hours') ? 'error' : ''}
                        placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
                        required
                    />
                    {hasError('business_hours') && (
                        <div className="error-message">{formErrors.business_hours}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="delivery_time">Delivery Time (minutes)</label>
                    <input
                        id="delivery_time"
                        name="delivery_time"
                        type="number"
                        value={formData.delivery_time}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('delivery_time') ? 'error' : ''}
                    />
                    {hasError('delivery_time') && (
                        <div className="error-message">{formErrors.delivery_time}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label>
                        <input
                            type="checkbox"
                            name="servicing"
                            checked={formData.servicing}
                            onChange={handleInputChange}
                        />
                        Currently Servicing
                    </label>
                </div>

                <div className='form-group'>
                    <label htmlFor="store_image">Restaurant Image URL*</label>
                    <input
                        id="store_image"
                        name="store_image"
                        type="url"
                        value={formData.store_image}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={hasError('store_image') ? 'error' : ''}
                        placeholder="https://example.com/restaurant-image.jpg"
                        required
                    />
                    {hasError('store_image') && (
                        <div className="error-message">{formErrors.store_image}</div>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading || Object.keys(formErrors).length > 0 || hasEmptyRequired()}
                    className='submit-btn'
                >
                    {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : 
                                (isEditMode ? 'Update Restaurant' : 'Create Restaurant')}
                </button>
            </form>
        </div>
    );
}