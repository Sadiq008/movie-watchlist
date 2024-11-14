import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    searchResults: [],
    currentSearchTerm: '', // Add this line
    searchHistory: [],
    loading: false,
    error: null
  },
  reducers: {
    setMovies: (state, action) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCurrentSearchTerm: (state, action) => { // Add this reducer
      state.currentSearchTerm = action.payload;
    },
    addToSearchHistory: (state, action) => {
      state.currentSearchTerm = action.payload; // Update current search term
      if (!state.searchHistory.includes(action.payload)) {
        state.searchHistory.unshift(action.payload);
        if (state.searchHistory.length > 10) {
          state.searchHistory.pop();
        }
      }
    }
  }
});

export const { 
  setMovies, 
  setLoading, 
  setError, 
  addToSearchHistory,
  setCurrentSearchTerm 
} = movieSlice.actions;

export default movieSlice.reducer;