import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { CreateDC, masterDataList, Select, SelectDetails, vendorList } from '../../../../../../types/deliverychallan';
import { VendorNames } from '../../../../../../types/vendor';
import { None, Option, Some } from '@hqoss/monads';

export interface CreateDeliveryChallanState {
    deliverychallan: CreateDC;
    masterDataList: masterDataList,
    displayInformationModal: boolean;
    errors: ValidationErrors;
    vendornames: Option<readonly vendorList[]>;
    EngineersList: Select[];
}

const initialState: CreateDeliveryChallanState = {
    EngineersList: [],
    masterDataList: {
        DCType: [],
        TransportationMode: [],
        VendorTypes:[]
    },
    deliverychallan: {
        DcTypeId: 0,
        LogisticsVendorTypeId:null,
        DestinationVendorTypeId:null,
        DestinationEmployeeId: null,
        DestinationTenantOfficeId: null,
        DestinationVendorId: null,
        LogisticsReceiptDate: null,
        LogisticsReceiptNumber: "",
        LogisticsVendorId: null,
        ModeOfTransport: null,
        partstocks: [],
        TrackingId: "",
        PartIndentDemandNumber: "",
        DCTypeCode: "",
        DestinationCustomerSiteId: null
    },
    vendornames: None,
    displayInformationModal: false,
    errors: {}
};

const slice = createSlice({
    name: 'deliverychallanforgin',
    initialState,
    reducers: {
        initializeDemandDetail: () => initialState,
        loadMasterData: (state, { payload: { name, value: { SelectDetails } } }: PayloadAction<{ name: keyof CreateDeliveryChallanState['masterDataList']; value: SelectDetails }>) => {
            state.masterDataList[name] = SelectDetails.map((masterData) => (masterData))
        },
        loadVendorNames: (state, { payload: { VendorNames } }: PayloadAction<VendorNames>) => {
            state.vendornames = Some(VendorNames.map((vendornames) => ({ vendornames })));
        },
        updatedcField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof CreateDeliveryChallanState['deliverychallan']; value: any }>) => {
            state.deliverychallan[name] = value as never;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        setDCTypeCode: (state, { payload: code }: PayloadAction<string>) => {
            state.deliverychallan.DCTypeCode = code;
        },
        loadServiceEngineers: (state, { payload: { SelectDetails } }: PayloadAction<SelectDetails>) => {
            state.EngineersList = SelectDetails.map((ServiceEngineers) => ServiceEngineers);
        },
    },
});

export const {
    initializeDemandDetail,
    updatedcField,
    toggleInformationModalStatus,
    updateErrors,
    loadMasterData,
    loadVendorNames,
    setDCTypeCode,
    loadServiceEngineers
} = slice.actions;

export default slice.reducer;
