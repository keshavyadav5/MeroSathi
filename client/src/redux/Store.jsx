import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import authReducer from './authSlice';
import uploadReducer from './UploadSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { adminApi } from './AdminSlice';
import cartReducer from './Cartslice'


const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const rootReducer = combineReducers({
  user: authReducer,
  upload: uploadReducer,
  cart: cartReducer,
  [adminApi.reducerPath]: adminApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(adminApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export default store;
