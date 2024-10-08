import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractRevenueRecognitionFilter, ContractRevenueRecognitionList, ContractRevenueRecognitionListDetail } from '../../../../../types/revenueRecognition';

export interface RevenueRecognition {
    revenueRecognitionList: ContractRevenueRecognitionListDetail;
}

const oneMonthBefore = new Date((new Date()).setDate(1))

export interface ContractRevenueRecognitionListState {
    revenueRecognitionList: Option<readonly RevenueRecognition[]>;
    search: any;
    error:string|null;
    filters: ContractRevenueRecognitionFilter
}

const initialState: ContractRevenueRecognitionListState = {
    revenueRecognitionList: None,
    search: null,
    error:null,
    filters: {
        StartDate:  oneMonthBefore.toISOString().split('T')[0],
        EndDate: `${new Date().toISOString().split('T')[0]}`,
    }
};
const slice = createSlice({
    name: 'contractrevenuerecognitionlist',
    initialState,
    reducers: {
        initializeRevenueRecognitionList: () => initialState,

        loadContractRevenueRecognition: (state, { payload: { RevenueRecognitionList } }: PayloadAction<ContractRevenueRecognitionList>) => {
            state.revenueRecognitionList = Some(RevenueRecognitionList.map((revenueRecognitionList) => ({ revenueRecognitionList })));
        },

        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ContractRevenueRecognitionListState['filters']; value: any }>) => {
            state.filters[name] = value;
        },

        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },

        updateError: (state, { payload: error }: PayloadAction<string|null>) => {
            state.error = error;
        }
    },
});

export const { initializeRevenueRecognitionList,updateField,updateError, loadContractRevenueRecognition, setSearch } = slice.actions;
export default slice.reducer;
