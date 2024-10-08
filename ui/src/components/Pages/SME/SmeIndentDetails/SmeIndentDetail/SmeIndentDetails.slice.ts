import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartIndentDetailForSmeAll, PartIndentDetailsForSmeList } from '../../../../../types/partIndent';
import { ValidationErrors } from '../../../../../types/error';

export interface PartIndent {
    partindent: PartIndentDetailForSmeAll;
}

export interface PartIndentRequestDetailState {
    partIndentDetails: PartIndentDetailForSmeAll[];
    currentPage: number;
    search: any;
    totalRows: number;
    perPage: number; 
    reqStatus:string;
    stockTypeId:number;
    displayInformationModal: boolean;
    errors: ValidationErrors; 
}

const initialState: PartIndentRequestDetailState = {
    partIndentDetails:[],   
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage: 0,
    reqStatus:"",
    stockTypeId:0,
    errors: {},
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partindentrequestdetailslist',
    initialState,
    reducers: {
        initializePartIndentDetails: () => initialState,
        loadPartIndentDetails: (state, { payload: { PartIndentRequestDetailsList, TotalRows, PerPage } }: PayloadAction<PartIndentDetailsForSmeList>) => {
            state.partIndentDetails = PartIndentRequestDetailsList.map((item) => item);
            state.totalRows = TotalRows;
            state.perPage = PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
        },
        setReqStatus:(state, { payload: Statusname }: PayloadAction<string>) => {
            state.reqStatus = Statusname;
        },
        setStockTypeId:(state, { payload: StockTypeId }: PayloadAction<number>) => {
            state.stockTypeId = StockTypeId;
        },
    },
});

export const {
    initializePartIndentDetails,
    loadPartIndentDetails,
    changePage,
    setReqStatus,
    setStockTypeId
} = slice.actions;

export default slice.reducer;