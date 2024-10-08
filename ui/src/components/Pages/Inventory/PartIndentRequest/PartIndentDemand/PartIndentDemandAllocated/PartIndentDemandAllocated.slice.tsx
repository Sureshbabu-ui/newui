import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GinDetail, PartIndentDemandDetail } from '../../../../../../types/partindentdemand';
import { PartStocktDataList, SelectedPartStockList } from '../../../../../../types/partStock';
import { ValidationErrors } from '../../../../../../types/error';
import { DeliveryChallanDetails, DeliveryChallanInfo } from '../../../../../../types/deliverychallan';

export interface IssuePartForDemand {
  PartIndentDemandId: number;
  Remarks: string;
}

export interface PartIndentDemandDetailState {
  singledemanddetail: PartIndentDemandDetail;
  PartStocks: SelectedPartStockList[];
  issueparts: IssuePartForDemand;
  displayInformationModal: boolean;
  errors: ValidationErrors;
  gindetail: GinDetail;
  currentPage: number;
  totalRows: number;
  perPage: number;
  dcdetails: DeliveryChallanDetails
}

const initialState: PartIndentDemandDetailState = {
  singledemanddetail: {
    Id: 0,
    DemandDate: "",
    DemandNumber: "",
    PartIndentRequestNumber: "",
    Remarks: "",
    TenantOfficeName: "",
    UnitOfMeasurement: "",
    WorkOrderNumber: "",
    PartName: "",
    PartCode: "",
    Recipient: "",
    CLPartCount: 0,
    OLPartCount: 0,
    CWHPartCount: 0,
    Price: 0,
    VendorId: 0,
    HsnCode: "",
    OemPartNumber: "",
    PartQuantity: 0,
    DemandQuantity: 0,
    PartId: 0,
    RecipientUserId: 0,
    CallCreatedBy: "",
    CallCreatedOn: "",
    TenantOfficeId: 0,
    VendorTypeId: null,
    IsCwhAttentionNeeded: null,
    PartIndentRequestId: 0,
    LocationId: 0,
    POCount: 0,
    GIRNCount: 0,
    StockTypeId: 0,
    CustomerInfoId: 0
  },
  dcdetails: {
    Id: 0,
    DcDate: "",
    DcNumber: "",
    DcType: "",
    IssuedEmployee: "",
    SourceTenantOffice: "",
    DestinationEmployee: "",
    DestinationTenantOffice: "",
    DestinationVendor: "",
    LogisticsReceiptDate: "",
    LogisticsReceiptNumber: "",
    LogisticsVendor: "",
    ModeOfTransport: "",
    PartIndentDemandNumber: "",
    TrackingId: "",
    DcTypeCode: ""
  },
  gindetail: {
    AllocatedOn: "",
    Id: 0,
    GinDate: "",
    GinNumber: "",
    Remarks: "",
    TenantOffice: "",
    ReceivedOn: "",
    RecipientUser: "",
    DeliveryChallanId: 0
  },
  displayInformationModal: false,
  issueparts: {
    PartIndentDemandId: 0,
    Remarks: "",
  },
  currentPage: 1,
  totalRows: 0,
  perPage: 10,
  errors: {},
  PartStocks: [],
};

const slice = createSlice({
  name: 'partallocateddemand',
  initialState,
  reducers: {
    initializeDemandDetail: () => initialState,
    loadDemandDetail: (state, { payload: Details }: PayloadAction<any>) => {
      state.singledemanddetail = Details
    },
    loadGinDetail: (state, { payload: gindetail }: PayloadAction<any>) => {
      state.gindetail = gindetail
    },
    loadSelectedDC: (state, { payload: { DeliveryChallanDetails } }: PayloadAction<DeliveryChallanInfo>) => {
      state.dcdetails = DeliveryChallanDetails
    },
    loadPartStocks: (state, { payload: { SelectPartStocks } }: PayloadAction<PartStocktDataList>) => {
      state.PartStocks = SelectPartStocks;
      state.totalRows = SelectPartStocks.length;
    },
    updateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof PartIndentDemandDetailState['issueparts']; value: any }>) => {
      state.issueparts[name] = value as never;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.PartStocks = [];
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    }
  },
});

export const {
  initializeDemandDetail,
  loadDemandDetail,
  loadPartStocks,
  loadSelectedDC,
  updateField,
  toggleInformationModalStatus,
  updateErrors,
  loadGinDetail,
  changePage
} = slice.actions;

export default slice.reducer;
