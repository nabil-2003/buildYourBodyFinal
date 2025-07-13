import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    loginError: null,
    signupError: null,
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      if(action.payload.user) {
        state.isAuthenticated = true;
        state.loginError = null;
        state.signupError = null;
      }
      
      // Handle error states
      if (action.payload.loginError !== undefined) {
        state.loginError = action.payload.loginError;
      }
      
      if (action.payload.signupError !== undefined) {
        state.signupError = action.payload.signupError;
      }
    },
    
    loading: (state, action) => {  
      state.loading = action.payload.loading;
    },
    
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loginError = null;
      state.signupError = null;
      state.loading = false;
    },
    
    clearErrors: (state) => {
      state.loginError = null;
      state.signupError = null;
    }
  }
});

export const { setUser, loading, logout, clearErrors } = userSlice.actions;
export default userSlice.reducer;