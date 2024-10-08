import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  PartIndentList, ServiceRequestPartIndentList, PartIndentDetails } from '../../../../../../../types/partIndent';

export interface ServiceRequestPartIndent {
    partindent: PartIndentList;
}

export interface ServiceRequestPartIndentDetailList {
    Id:number|string,
    Details: PartIndentDetails[];
}
export interface PartIndentRequestState {
    partindent: Option<readonly ServiceRequestPartIndent[]>;
    partIndentDetails:ServiceRequestPartIndentDetailList[],
}
 
const initialState: PartIndentRequestState = {
    partindent: None,
    partIndentDetails:[],
};

const slice = createSlice({
    name: 'partindentlist',  
    initialState,
    reducers: {
        initializePartIndent: () => initialState,
        loadPartIndent: (state, { payload: { PartIndentRequestList } }: PayloadAction<ServiceRequestPartIndentList>) => {
            state.partindent = Some(PartIndentRequestList.map((partindent) => ({ partindent })));
        },
        loadPartIndentDetail: (state, { payload: PartIndentDetail }: PayloadAction<ServiceRequestPartIndentDetailList>) => {
            state.partIndentDetails.push(PartIndentDetail)
        } 
    },   
});

export const {
    initializePartIndent,
    loadPartIndent,
    loadPartIndentDetail
} = slice.actions;

export default slice.reducer;