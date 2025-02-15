//react-vite/src/redux/store.js
import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import reviewsReducer from "./reviews";
import ordersReducer from './orders';
import menuReducer from "./menuItems";
import errorsReducer from './errors';
import restaurantReducer from './restaurants';
import cartReducer from './cart';


const rootReducer = combineReducers({
	session: sessionReducer,
	orders: ordersReducer,
  menuItems: menuReducer,
	// manage: manageReducer,
	errors: errorsReducer,
  reviews: reviewsReducer,
  // import manageReducer from './manage';
  restaurants: restaurantReducer,
  cart: cartReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;