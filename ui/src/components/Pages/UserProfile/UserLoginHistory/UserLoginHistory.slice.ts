import { None, Option, Some } from '@hqoss/monads';
import { createSlice } from '@reduxjs/toolkit';

export interface HistroyState{
  LoginHistory: Option<readonly []>
}

const initialState: HistroyState = {
  LoginHistory:None
};

const slice = createSlice({
  name: 'userloginhistory',
  initialState,
  reducers: {
    initializeLoginHistoryList: () => initialState,
    setLoginHistory: (state, { payload: loginhistory }) => {
      state.LoginHistory = Some(loginhistory.history);  
    }
  },
});

export const { initializeLoginHistoryList, setLoginHistory } = slice.actions;

export default slice.reducer;
