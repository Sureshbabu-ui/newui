import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventDetail, EventConditionListView, EventConditionListDetail } from '../../../../types/ApprovalWorkflow/eventCondition';

export interface EventConditions {
  eventConditionDetails: EventConditionListDetail;
}

export interface EventConditionsListState {
  eventConditionList: Option<readonly EventConditions[]>;
  eventDetail:EventDetail
  search: any;
  totalRows: number;
  LastSequence:number
}

const initialState: EventConditionsListState = {
  eventConditionList: None,
  eventDetail:{
    EventId:null,
    EventGroupName:null,
    EventName:null
  },
  search: null,
  totalRows: 0,
  LastSequence:0
};
const slice = createSlice({
  name: 'eventconditionlist',
  initialState,
  reducers: {
    initializeEventConditionListView: () => initialState,
    loadEventConditionDetails: (state, { payload: { EventConditionList,EventDetail, TotalRows} }: PayloadAction<EventConditionListView>) => {
      state.eventConditionList= Some(EventConditionList.map((eventConditionDetails) => ({ eventConditionDetails })));
      state.eventDetail=EventDetail;
      state.totalRows = TotalRows;
      },

    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeEventConditionListView,  loadEventConditionDetails, setSearch } = slice.actions;
export default slice.reducer;