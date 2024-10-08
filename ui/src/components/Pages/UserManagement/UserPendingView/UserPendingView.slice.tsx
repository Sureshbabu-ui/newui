import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { UserPendingDetail, UserPendingDetailWithReview } from '../../../../types/user';
import { ApprovalRequestReviewListDetail } from '../../../../types/pendingApproval';

export interface UserPendingDetailState {
  selectedApprovals: UserPendingDetail,
  ReviewDetails: ApprovalRequestReviewListDetail[];
  errors: ValidationErrors;
  SelectedId:number|null;
}

const initialState: UserPendingDetailState = {
  selectedApprovals: {
    Id: 0,
    CaseId: 0,
    FullName:'',
    EmployeeCode:'',
    Email:'',
    Phone:'',
    TableName: '',
    FetchTime: '', 
    Content: '',
    UserCategory: "",
    Division: "",
    Department: "",
    EngagementType: "",
    Gender: "",
    Designation: "",
    ReportingManager: "",
    Location: "",
    ServiceEngineerType: "",
    ServiceEngineerLevel: "",
    ServiceEngineerCategory: "",
    Country: "",
    State: "",
    City: "",
    UserRole: "",
    ReviewStatus: '',
    ReviewStatusName:'',
    CreatedBy: 0,
    CreatedOn: '',
    CreatedUserName: '',
    DocumentUrl:"",
    ContractNumber:"",
    CustomerName:"",
    CustomerSite:"",
    BudgetedAmount:null,
    CustomerAgreedAmount:null,
    StartDate:null,
    EndDate:null,
    EngineerAddress:null,
    EngineerGeolocation:null,
    EngineerPincode:null,
    UserGrade:""
  },
  SelectedId:null,
  ReviewDetails:[],
  errors: {}
};

const slice = createSlice({
  name: 'userpendingrequestview',
  initialState,
  reducers: {
    initializeUserPendingDetails: () => initialState,
    loadSelectedApproval: (
      state,
      { payload: ApprovalRequestDetails }: PayloadAction<UserPendingDetailWithReview>
    ) => {
      state.selectedApprovals = ApprovalRequestDetails.UserPendingDetail
      state.ReviewDetails = ApprovalRequestDetails.ApprovalRequestReviewList
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    setSelectedIdForPendingView: (state, { payload: Id }: PayloadAction<number|null>) => {
      state.SelectedId = Id;
    },
  },
});

export const {
  initializeUserPendingDetails,
  loadSelectedApproval,
  updateErrors,
  setSelectedIdForPendingView
} = slice.actions;
export default slice.reducer;
