import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    users: JSON.parse(localStorage.getItem('users')) || [],
    error: null
  },
  reducers: {
    login: (state, action) => {
      const email = action.payload;
      const existingUser = state.users.find(user => user.email === email);
      
      if (existingUser) {
        state.currentUser = existingUser;
        localStorage.setItem('currentUser', JSON.stringify(existingUser));
        state.error = null;
      } else {
        state.error = 'User not found. Please create an account.';
      }
    },
    register: (state, action) => {
      const { name, email } = action.payload;
      const existingUser = state.users.find(user => user.email === email);
      
      if (existingUser) {
        state.error = 'Email already exists';
        return;
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        watchlist: []
      };

      state.users.push(newUser);
      state.currentUser = newUser;
      localStorage.setItem('users', JSON.stringify(state.users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('currentUser');
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { login, register, logout, clearError } = userSlice.actions;
export default userSlice.reducer;