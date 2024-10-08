import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestPartIndentList, PartIndentRequests, PartIndentDetailForSme, SelectedPartRequestInfo, PartRequestStockAvailability, PartRequestLocationWiseStockAvailability, PartIndentDetailForSmeAll } from '../../../../../types/partIndent';
import { ValidationErrors } from '../../../../../types/error';
import { ProductCategoryPartnotCovered } from '../../../../../types/assetsSummary';

export interface PartIndent {
    partindent: PartIndentRequests;
}

export interface SMEReview {
    Id: number;
    RequestStatus: string;
    ReviewerComments: string;
}

export interface PartIndentRequestState {
    partindent: Option<readonly PartIndent[]>;
    partIndentDetails: PartIndentDetailForSme[],
    selectedPartIndentInfo: SelectedPartRequestInfo,
    currentPage: number;
    search: any;
    AssetProductCategoryId:number;
    totalRows: number;
    perPage: number;
    smereview: SMEReview;
    partAvilability: PartRequestStockAvailability[]
    partLocationWiseAvilability: PartRequestLocationWiseStockAvailability[]
    displayInformationModal: boolean;
    errors: ValidationErrors;
    partAvailabilityStatus: number 
    partCategory: ProductCategoryPartnotCovered[],
}

const initialState: PartIndentRequestState = {
    partindent: None,
    partIndentDetails: [],
    selectedPartIndentInfo: {
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
        ServiceRequestId:null
    },
    currentPage: 1,
    search: null,
    AssetProductCategoryId:0,
    totalRows: 0,
    perPage: 0,
    smereview: {
        Id: 0,
        RequestStatus: '',
        ReviewerComments: ''
    },
    partAvilability: [],
    partLocationWiseAvilability: [],
    errors: {},
    displayInformationModal: false,
    partAvailabilityStatus: 0,
    partCategory: []
};

const slice = createSlice({
    name: 'partindentrequestlist',
    initialState,
    reducers: {
        initializePartIndent: () => initialState,
        loadPartIndent: (state, { payload: { PartIndentRequestList, TotalRows, PerPage } }: PayloadAction<RequestPartIndentList>) => {
            state.partindent = Some(PartIndentRequestList.map((partindent) => ({ partindent })));
            state.totalRows = TotalRows;
            state.perPage = PerPage;
        },
        loadPartIndentDetail: (state, { payload: { PartIndentDetail, selectedPartdetails } }: PayloadAction<{ selectedPartdetails: SelectedPartRequestInfo, PartIndentDetail: PartIndentDetailForSme[] }>) => {
            state.partIndentDetails = PartIndentDetail.map((detail) => detail)
            state.selectedPartIndentInfo = selectedPartdetails
        },
        loadPartAvailbilityDetail: (state, { payload: { partAvilability, partLocationWiseAvilability } }: PayloadAction<{ partAvilability: PartRequestStockAvailability[], partLocationWiseAvilability: PartRequestLocationWiseStockAvailability[] }>) => {
            state.partAvilability = partAvilability.map((partAvailability) => partAvailability)
            state.partLocationWiseAvilability = partLocationWiseAvilability.map((partAvailability) => partAvailability)
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.partindent = None;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
        setAssetProductCategoryId: (state, { payload: Id }: PayloadAction<number>) => {
            state.AssetProductCategoryId = Id;
        },
        setPartAvailabilityStatus: (state, { payload: Id }: PayloadAction<number>) => {
            state.partAvailabilityStatus = Id;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadPartsCategoryNotCovered: (state, { payload: Parts }: PayloadAction<any>) => {
            state.partCategory = Parts;
        }
        
    },
});

export const {
    initializePartIndent,
    loadPartIndent,
    loadPartIndentDetail,
    changePage,
    setSearch,
    toggleInformationModalStatus,
    updateErrors,
    setPartAvailabilityStatus,
    loadPartAvailbilityDetail,
    loadPartsCategoryNotCovered,
    setAssetProductCategoryId,
} = slice.actions;

export default slice.reducer;