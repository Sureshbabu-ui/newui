import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartIndentDemandDetail } from '../../../../../../types/partindentdemand';

export interface PartIndentDemandDetailState {
  singledemanddetail: PartIndentDemandDetail;
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
    VendorTypeId:0,
    HsnCode: "",
    OemPartNumber: "",
    PartQuantity: 0,
    DemandQuantity: 0,
    PartId: 0,
    RecipientUserId: 0,
    CallCreatedBy: "",
    CallCreatedOn: "",
    TenantOfficeId: 0,
    IsCwhAttentionNeeded: null,
    PartIndentRequestId: 0,
    LocationId: 0,
    POCount: 0,
    GIRNCount: 0,
    StockTypeId: 0,
    CustomerInfoId: 0
  },
};

const slice = createSlice({
  name: 'demanddetail',
  initialState,
  reducers: {
    initializeDemandDetail: () => initialState,
    loadDemandDetail: (state, { payload: Details }: PayloadAction<any>) => {
      state.singledemanddetail = Details
    },
  },
});

export const {
  initializeDemandDetail,
  loadDemandDetail
} = slice.actions;

export default slice.reducer;
