import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { locationSettingDetails } from '../../../../types/locationSetting';
import { ValidationErrors } from '../../../../types/error';
import { TenantOfficeInfo } from '../../../../types/tenantofficeinfo';
import { TenantInfoDetails } from '../../../../types/tenantofficeinfo';

export interface tenantOffices {
    tenantOffice:TenantInfoDetails ;
}

export interface LocationSettingDetailsState {
    locationSetting: locationSettingDetails;
    tenantOffices: Option<readonly tenantOffices[]>;
    isUpdateDisabled: boolean;
    errors: ValidationErrors;
    displayInformationModal: boolean;
    submitting: boolean;
    selectLoading:boolean;
}

const initialState: LocationSettingDetailsState = {
    locationSetting: {
        Id: 0,
        LocationId: 0,  
        LastAmcInvoiceNumber: 0,
        LastPaidJobInvoiceNumber: 0,
        LastContractNumber: 0,
        LastReceiptNumber: 0,
        LastSaleInvoiceNumber: 0,
        LastWorkOrderNumber: 0
    },
    tenantOffices: None,
    isUpdateDisabled: true,
    errors: {},
    submitting: false,
    displayInformationModal: false,
    selectLoading:false,
};

const slice = createSlice({
    name: 'locationsetting',
    initialState,
    reducers: {
        initializeLocationSetting: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof LocationSettingDetailsState['locationSetting']; value: any }>
        ) => {
            state.locationSetting[name] = value;
        },
        toggleUpdate: (state) => {
            state.isUpdateDisabled = !state.isUpdateDisabled;
        },

        loadTenantOffices: (state, { payload: { TenantOfficeInfo } }: PayloadAction<TenantOfficeInfo>) => {
            state.tenantOffices = Some(TenantOfficeInfo.map((tenantOffice) => ({ tenantOffice })));
        },
        loadLoactionSettingDetails: (state, { payload: LocationSetting }: PayloadAction<locationSettingDetails>) => {
            state.locationSetting = LocationSetting
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        startSubmitting: (state) => {
            state.submitting = true;
          },
          stopSubmitting: (state) => {
            state.submitting = false;
          },
          startSelectLoading: (state) => {
            state.selectLoading = true;
          },
          stopSelectLoading: (state) => {
            state.selectLoading = false;
          },},
});

export const {
    initializeLocationSetting,
    loadLoactionSettingDetails,
    loadTenantOffices,
    updateField,
    toggleUpdate,
    updateErrors,
    toggleInformationModalStatus,
    startSubmitting,
    stopSubmitting,
    startSelectLoading,
    stopSelectLoading
} = slice.actions;

export default slice.reducer;