import { configureStore } from "@reduxjs/toolkit";
import movieReducer from './movieSlice';
import watchlistReducer from './watchListSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    watchlist: watchlistReducer,
    user: userReducer
  }
});