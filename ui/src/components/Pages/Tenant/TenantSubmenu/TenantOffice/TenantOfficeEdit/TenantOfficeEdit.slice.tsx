import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { Configurations, ManagersList, TenantOfficeEdit, TenantOfficeEditDetails } from '../../../../../../types/tenantofficeinfo';
import { RegionNames } from '../../../../../../types/tenantRegion';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../../types/masterData';
import { StateDetailsSelect, StatesSelect } from '../../../../../../types/state';
import { CitiesSelect, CityDetailsSelect } from '../../../../../../types/city';
import { PostalCodeDetails, PostalCodeList } from '../../../../../../types/postalcode';

export interface TenantOfficeEditState {
    entitiesList: Configurations;
    states: StateDetailsSelect[],
    cities: CityDetailsSelect[],
    tenantofficetypes: valuesInMasterDataByTableDetailsSelect[];
    tenantOffice: TenantOfficeEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    postalcodelist: PostalCodeDetails[];
}

const initialState: TenantOfficeEditState = {
    entitiesList: {
        Managers: [],
        TenantRegions: []
    },
    tenantOffice: {
        Id: 0,
        TenantOfficeId: 0,
        Address: "",
        OfficeName: "",
        Code: "",
        CityId: 0,
        StateId: 0,
        CountryId: 0,
        Pincode: "",
        Phone: "",
        Email: "",
        Mobile: "",
        ManagerId: 0,
        GstNumber: "",
        GstStateId: 0,
        Tin: "",
    },
    postalcodelist: [],
    cities: [],
    states: [],
    tenantofficetypes: [],
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'tenantofficeedit',
    initialState,
    reducers: {
        initializeTenantOfficeEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof TenantOfficeEditState['tenantOffice']; value: any }>
        ) => {
            state.tenantOffice[name] = value as never;
        },
        loadTenantOfficeDetails: (state, { payload: { LocationDetails } }: PayloadAction<TenantOfficeEditDetails>) => {
            state.tenantOffice = LocationDetails;
        },
        loadMasterData: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
            state.tenantofficetypes = MasterData.map((Data) => Data);
        },
        loadStates: (state, { payload: { States } }: PayloadAction<StatesSelect>) => {
            state.states = States.map((States) => States);
        },
        loadCities: (state, { payload: { Cities } }: PayloadAction<CitiesSelect>) => {
            state.cities = Cities.map((Cities) => Cities);
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
        loadManagers: (state, { payload: { Managers } }: PayloadAction<ManagersList>) => {
            state.entitiesList.Managers = Managers.map((Managers) => Managers);
        },
        loadTenantRegions: (state, { payload: { RegionNames } }: PayloadAction<RegionNames>) => {
            state.entitiesList.TenantRegions = RegionNames.map((TenantRegions) => TenantRegions);
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadPostalCodeList: (state, { payload: { PostalCodeList } }: PayloadAction<PostalCodeList>) => {
            state.postalcodelist = PostalCodeList.map((postalcodelist) => postalcodelist);
        },
        clearPostalCodeList: (state) => {
            state.postalcodelist = [];
        },
        initializeTenantOfficeUpdate: (state) => {
            state.tenantOffice = initialState.tenantOffice;
        },
    },
});

export const {
    initializeTenantOfficeEdit,
    updateErrors,
    loadTenantOfficeDetails,
    initializeTenantOfficeUpdate,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    loadManagers,
    loadTenantRegions,
    stopSubmitting,
    loadMasterData,
    loadStates,
    loadCities,
    loadPostalCodeList,
    clearPostalCodeList
} = slice.actions;

export default slice.reducer;