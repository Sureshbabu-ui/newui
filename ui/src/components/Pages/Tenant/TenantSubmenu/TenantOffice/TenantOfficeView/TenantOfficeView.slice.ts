import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedTenantOffice, TenantOfficeView } from '../../../../../../types/tenantofficeinfo';

export interface SelectedTenantOfficeState {
    selectedLocationDetails: TenantOfficeView
}

const initialState: SelectedTenantOfficeState = {
    selectedLocationDetails: {
        Id:0,
        TenantOfficeId:0,
        TenantOfficeName:"",
        TenantOfficeType:"",
        City:"",
        State:"",
        Country:"",
        Code:"",
        Address:"",
        Pincode:"",
        Phone:"",
        Mobile:"",
        GstState:"",
        GstNumber:"",
        RegionName:"",
        GeoLocation:"",
        IsVerified:false,
        Tin:"",
        Email:"",
        Manager:"",
        CreatedBy:"",
        CreatedOn:"",
        EffectiveFrom:"",
        EffectiveTo:""
    },
};
const slice = createSlice({
    name: 'locationDetails',
    initialState,
    reducers: {
        initializeTenantOfficeLocation: () => initialState,
        loadSelectedLocation: (
            state,
            { payload: { LocationDetails } }: PayloadAction<SelectedTenantOffice>
        ) => {
            state.selectedLocationDetails = LocationDetails            
        },
    },
});

export const { initializeTenantOfficeLocation, loadSelectedLocation } = slice.actions;
export default slice.reducer;
