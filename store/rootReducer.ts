import { combineReducers } from '@reduxjs/toolkit';

import authSlice from './slices/authSlice';
import orderSlice from "./slices/orderSlice";
import { productApi } from "./api/productApi";
import { promotionApi } from "./api/promotionApi";
import { cityApi } from "./api/cityApi";
import { roleApi } from './api/roleApi';
import { authApi } from './api/authApi';
import { productGradeApi } from './api/productGradeApi';
import { pageApi } from './api/pageApi';

export const rootReducer = combineReducers({
  auth: authSlice,
  order: orderSlice,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [promotionApi.reducerPath]: promotionApi.reducer,
  [cityApi.reducerPath]: cityApi.reducer,
  [roleApi.reducerPath]: roleApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [productGradeApi.reducerPath]: productGradeApi.reducer,
  [cityApi.reducerPath]: cityApi.reducer,
  [pageApi.reducerPath]: pageApi.reducer,
});
