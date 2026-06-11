import { createSlice } from '@reduxjs/toolkit';

const stored = JSON.parse(localStorage.getItem('authUser') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: stored?.user || null, token: stored?.token || null },
  reducers: {
    setCredentials(state, { payload }) {
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('authUser', JSON.stringify(payload));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authUser');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
