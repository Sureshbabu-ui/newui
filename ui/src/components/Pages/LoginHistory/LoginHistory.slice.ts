import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { boolean, object } from 'decoders';
import { Interface } from 'readline';
import { GenericErrors } from '../../../types/error';
import { UserEditTemplate } from '../../../types/user';

export interface HistroyState{
  LoginHistory: Option<readonly []>
}

const initialState: HistroyState = {
  LoginHistory:None
};

const slice = createSlice({
  name: 'userhistory',
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
