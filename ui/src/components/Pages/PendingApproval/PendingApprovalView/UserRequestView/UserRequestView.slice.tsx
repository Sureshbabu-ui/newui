import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApprovalRequestReviewListDetail, UserApprovalDetail, UserApprovalDetailWithReview } from '../../../../../types/pendingApproval';
import { ValidationErrors } from '../../../../../types/error';

export interface UserReviewDetail {
  Id: null;
  UserId: null;
  ReviewComment: string;
  ReviewedBy: null,
  CreatedOn: null,
  ReviewStatus: string
}

export interface UserApprovalListState {
  selectedApprovals: UserApprovalDetail,
  ReviewList: ApprovalRequestReviewListDetail[],
  ReviewDetails: UserReviewDetail;
  ReviewedJsonDetails: UserReviewDetail[];
  ReviewStatus: string;
  approveModalStatus: boolean;
  rejectModalStatus: boolean;
  requestChangeModalStatus: boolean;
  errors: ValidationErrors;
  isApprovalNeeded: boolean
}

const initialState: UserApprovalListState = {
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
  ReviewList:[],
  ReviewDetails: {
    ReviewComment: '',
    ReviewedBy: null,
    CreatedOn: null,
    Id: null,
    UserId: null,
    ReviewStatus: ''
  },
  ReviewedJsonDetails: [{
    ReviewComment: '',
    ReviewedBy: null,
    CreatedOn: null,
    Id: null,
    UserId: null,
    ReviewStatus: ''
  }],
  ReviewStatus: '',
  approveModalStatus: false,
  rejectModalStatus: false,
  requestChangeModalStatus: false,
  isApprovalNeeded: true,
  errors: {}
};

const slice = createSlice({
  name: 'userrequestview',
  initialState,
  reducers: {
    initializeUserRequestDetails: () => initialState,
    loadSelectedApproval: (
      state,
      { payload: ApprovalRequestDetails }: PayloadAction<UserApprovalDetailWithReview>
    ) => {
      state.selectedApprovals = ApprovalRequestDetails.UserDetail
      state.ReviewList = ApprovalRequestDetails.ApprovalRequestReviewList
    },
    setReviewDetails: (state, { payload: { name, value } }: PayloadAction<{ name: keyof UserApprovalListState['ReviewDetails']; value: any }>
    ) => {
      state.ReviewDetails[name] = value as never;
    },
    loadReviewDetails: (state, { payload: reviewDetails }: PayloadAction<UserReviewDetail[]>) => {
      state.ReviewedJsonDetails = reviewDetails;
    },
    toggleApproveModalStatus: (state) => {
      state.approveModalStatus = !state.approveModalStatus;
    },
    toggleRejectModalStatus: (state) => {
      state.rejectModalStatus = !state.rejectModalStatus;
    },
    toggleRequestChangeModalStatus: (state) => {
      state.requestChangeModalStatus = !state.requestChangeModalStatus;
    },
    isApprovalNeededStatus: (state) => {
      state.isApprovalNeeded = !state.isApprovalNeeded;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    updateReviewStatus: (state, { payload: status }: PayloadAction<string>) => {
      state.ReviewStatus = status;
      state.ReviewDetails.ReviewStatus = status
    },
  },
});

export const {
  initializeUserRequestDetails,
  loadSelectedApproval,
  setReviewDetails,
  updateErrors,
  isApprovalNeededStatus,
  toggleApproveModalStatus,
  toggleRejectModalStatus,
  updateReviewStatus,
  loadReviewDetails,
  toggleRequestChangeModalStatus
} = slice.actions;
export default slice.reducer;
