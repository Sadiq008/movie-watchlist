import { createSlice } from "@reduxjs/toolkit";

const watchListSlice = createSlice({
  name: "watchlist",
  initialState: {
    lists: {},
    searchTerms: {},
    watchedMovies: {} // Add this to initial state
  },
  reducers: {
    addToWatchlist: (state, action) => {
      const { userId, movie, searchTerm } = action.payload;

      if (!state.lists[userId]) {
        state.lists[userId] = [];
      }
      if (!state.searchTerms[userId]) {
        state.searchTerms[userId] = {};
      }
      if (!state.watchedMovies[userId]) { // Initialize watchedMovies for user
        state.watchedMovies[userId] = [];
      }

      // Add movie to watchlist if not already present
      if (!state.lists[userId].find((m) => m.id === movie.id)) {
        state.lists[userId].push(movie);

        // Create or update the search term entry
        const term = searchTerm.toLowerCase();
        if (!state.searchTerms[userId][term]) {
          state.searchTerms[userId][term] = [];
        }

        if (!state.searchTerms[userId][term].includes(movie.id)) {
          state.searchTerms[userId][term].push(movie.id);
        }
      }
    },
    removeFromWatchlist: (state, action) => {
      const { userId, movieId } = action.payload;

      // Remove from lists
      state.lists[userId] = state.lists[userId].filter(
        (movie) => movie.id !== movieId
      );

      // Remove from search terms
      Object.keys(state.searchTerms[userId] || {}).forEach((term) => {
        state.searchTerms[userId][term] = state.searchTerms[userId][term].filter(
          (id) => id !== movieId
        );
        // Clean up empty search terms
        if (state.searchTerms[userId][term].length === 0) {
          delete state.searchTerms[userId][term];
        }
      });

      // Remove from watched movies if present
      if (state.watchedMovies[userId]) {
        state.watchedMovies[userId] = state.watchedMovies[userId].filter(
          (id) => id !== movieId
        );
      }
    },
    toggleWatched: (state, action) => {
      const { userId, movieId } = action.payload;
      
      // Initialize watchedMovies array for user if it doesn't exist
      if (!state.watchedMovies[userId]) {
        state.watchedMovies[userId] = [];
      }

      const index = state.watchedMovies[userId].indexOf(movieId);
      if (index === -1) {
        state.watchedMovies[userId].push(movieId);
      } else {
        state.watchedMovies[userId].splice(index, 1);
      }
    }
  }
});

export const { addToWatchlist, removeFromWatchlist, toggleWatched } = watchListSlice.actions;
export default watchListSlice.reducer;