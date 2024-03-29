import { Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import alertReducer from "./alert/alertSlice";
import rootSaga from "./rootSaga";
import authReducer from "./auth/authSlice";
import layoutReducer from "./layout/layoutSlice";
import productReducer from "./organizer/product/productSlice";
import modalReducer from "./modal/modalSlice";
import consignmentReducer from "./organizer/consignment/consignmentSlice";
import organizerReducer from "./organizer/info/organizerSlice";
import chainsReducer from "./organizer/chains/chainsSlice";
import publicConsignmentReducer from "./public/consignment/consignmentSlice";
import dashboardReducer from "./dashboard/dashboardSlice";
import publicOrderReducer from "./public/order/orderSlice";
import orderReducer from "./organizer/order/orderSlice";

const reducers = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  layout: layoutReducer,
  product: productReducer,
  modal: modalReducer,
  consignment: consignmentReducer,
  organizer: organizerReducer,
  chains: chainsReducer,
  publicConsignment: publicConsignmentReducer,
  dashboard: dashboardReducer,
  publicOrder: publicOrderReducer,
  order: orderReducer,
});

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
