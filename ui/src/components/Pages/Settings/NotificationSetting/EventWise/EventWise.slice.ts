
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  NotificationList, NotificationListResponse, NotificationSelectTitle, NotificationSelectTitleDetails } from '../../../../../types/notificationSetting';

//state
export interface EventWiseState {
  eventTitles:NotificationSelectTitleDetails[],
  notificationSettings: NotificationList[]
  businessEventId:number; 
  isUpdateDisabled: boolean; 
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: EventWiseState = {
  eventTitles:[],
  businessEventId:-1,
  notificationSettings: [],
  isUpdateDisabled: true,
  submitting: false,
  displayInformationModal: false
};

const slice = createSlice({
  name: 'eventwise',
  initialState,
  reducers: {
    initialize: () => initialState,
    updateCheckbox: (
      state,
      { payload: { name, value,status } }: PayloadAction<{ name: keyof EventWiseState['notificationSettings']; value: any,status:boolean }>
    ) => {

      state.notificationSettings.map((item,index)=>{
        if(index==value)
        item[name]=status 
      }) 
    }, 
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof EventWiseState; value: any}>
  ) => {
      state[name] = value as never;
     },
    loadBusinessEventTitles: (state, { payload: { NotificationTitles } }: PayloadAction<NotificationSelectTitle>) => {
      state.eventTitles = NotificationTitles.map((NotificationTitle) => (NotificationTitle));
    },
     loadEventWiseList: (state, { payload: { NotificationList } }: PayloadAction<NotificationListResponse>) => {
      state.notificationSettings = NotificationList.map((List) => List);
    },
    toggleUpdate: (state) => {
      state.isUpdateDisabled = !state.isUpdateDisabled;
    },
    startSubmitting: (state) => {
      state.submitting = true;
    },
    stopSubmitting: (state) => {
      state.submitting = false;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
  }
  }
});

export const { initialize,
  loadBusinessEventTitles,
  loadEventWiseList,
  toggleUpdate,
  startSubmitting,
  stopSubmitting,
  updateCheckbox,
  updateField,
  toggleInformationModalStatus
} = slice.actions;

export default slice.reducer;