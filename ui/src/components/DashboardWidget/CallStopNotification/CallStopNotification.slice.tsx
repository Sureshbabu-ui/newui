import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallStopCount } from '../../../types/callStopNotification';

export interface CallStopNotificationState {
  callStopExpiryCount: CallStopCount
}

const initialState: CallStopNotificationState = {
  callStopExpiryCount: {
    Tonightcallstop: null,
    TotalCallStopped: null,
  }
}

const slice = createSlice({
  name: 'callstopnotification',
  initialState,
  reducers: {
    initializeCallStopNotification: () => initialState,
    setCallStopCount: (state, { payload: CallStopCount }: PayloadAction<CallStopCount>) => {
      state.callStopExpiryCount = CallStopCount
    }
  }
})
export const { initializeCallStopNotification, setCallStopCount } = slice.actions;
export default slice.reducer;