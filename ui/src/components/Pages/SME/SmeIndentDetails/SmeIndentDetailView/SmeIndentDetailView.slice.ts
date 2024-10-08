import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SelectedPartRequestCommonDetails, SelectedPartRequestInfo } from "../../../../../types/partIndent";

export interface PartIndentRequestDetailState {
    partIndentGeneralDetailsForSme:SelectedPartRequestCommonDetails;
    requestedPartStatus:string
}

const initialState: PartIndentRequestDetailState = {
    partIndentGeneralDetailsForSme: {
        RequestedBy: "",
        CreatedOn: "",
        Id: 0,
        IndentRequestNumber: "",
        Location: "",
        Remarks: "",
        WorkOrderNumber: "",
        CallStatus:"",
        CallcenterRemarks: "",
        CategoryName: "",
        CustomerReportedIssue: "",
        Make: "",
        ModelName: "",
        ProductSerialNumber: "",
        IsWarranty: false,
        AssetProductCategoryId:0,
        ContractId:0,
        ServiceRequestId:0,
        ReviewedBy:"",
        ReviewedOn:"",
        ReviewerComments:""
    },
    requestedPartStatus:""
};

const slice = createSlice({
    name: 'smeindentdetailsview',
    initialState,
    reducers: {  
        initializePartIndentRequestDetail: () => initialState,
        loadSelectedCommonPartIndentDetailsForSme: (state, { payload: indentRequestDetail }: PayloadAction<SelectedPartRequestCommonDetails>) => {
            state.partIndentGeneralDetailsForSme = indentRequestDetail            
        },
        setPartRequestStatus:(state, { payload: requestedPartStatus }: PayloadAction<string>)=>{
            state.requestedPartStatus = requestedPartStatus
        }
    },
});

export const {
   initializePartIndentRequestDetail,
   loadSelectedCommonPartIndentDetailsForSme,
   setPartRequestStatus
} = slice.actions;

export default slice.reducer;