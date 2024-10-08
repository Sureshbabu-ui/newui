import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryChallanDetails, DeliveryChallanInfo } from '../../../../../types/deliverychallan';

export interface DeliveryChallanInfoState {
    dcdetails: DeliveryChallanDetails
}

const initialState: DeliveryChallanInfoState = {
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
        DcTypeCode:""
    },
};
const slice = createSlice({
    name: 'deliverychallandetail',
    initialState,
    reducers: {
        initializeDeliveryChallanInfo: () => initialState,
        loadSelectedDC: (state, { payload: { DeliveryChallanDetails } }: PayloadAction<DeliveryChallanInfo>) => {
            state.dcdetails = DeliveryChallanDetails
        },
    },
});

export const { initializeDeliveryChallanInfo, loadSelectedDC } = slice.actions;
export default slice.reducer;
