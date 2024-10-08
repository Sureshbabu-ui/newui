import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventConditionMasterListDetail, EventConditionMasterList } from '../../../../types/ApprovalWorkflow/eventConditionMaster';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../types/masterData';

export interface EventConditionMasterListState {
  eventConditionMasters: EventConditionMasterListDetail[];
  approvalEventList: valuesInMasterDataByTableDetailsSelect[];
  approvalEventId :number|null
}

const initialState: EventConditionMasterListState = {
  eventConditionMasters: [],
  approvalEventList:[],
  approvalEventId: null,
  };
const slice = createSlice({
  name: 'eventconditionmasterlist',
  initialState,
  reducers: {
    initializeEventConditionMasterList: () => initialState,
    loadEventConditionMasters: (state, { payload: { EventConditionMasters} }: PayloadAction<EventConditionMasterList>) => {
      state.eventConditionMasters = EventConditionMasters;
    },
    loadApprovalEvents: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
        state.approvalEventList= MasterData.map(MasterData => MasterData);
    },
      updateField: (
        state,
        { payload: { name, value } }: PayloadAction<{ name: keyof EventConditionMasterListState; value: any }>
      ) => {
        state[name] = value as never;
      },
  },
});

export const { initializeEventConditionMasterList,loadEventConditionMasters, loadApprovalEvents,updateField } = slice.actions;
export default slice.reducer;