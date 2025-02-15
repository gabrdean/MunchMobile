import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import "./index.css";

const store = configureStore();
const isStrictMode = import.meta.env.VITE_STRICT_MODE === 'true';

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  isStrictMode ? (
		<React.StrictMode>
			<ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
		</React.StrictMode>
	) : (
		<ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
	)
);
