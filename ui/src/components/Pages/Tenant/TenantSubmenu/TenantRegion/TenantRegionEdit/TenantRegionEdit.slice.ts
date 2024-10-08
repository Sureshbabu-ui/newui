import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { Select, SelectDetails, SelectedRegion, TenantRegionsEdit } from '../../../../../../types/tenantRegion';
import { StateDetailsSelect, StatesSelect } from '../../../../../../types/state';
import { CitiesSelect, CityDetailsSelect } from '../../../../../../types/city';
import { ManagersList } from '../../../../../../types/tenantofficeinfo';
import { PostalCodeDetails, PostalCodeList } from '../../../../../../types/postalcode';

export interface EntitiesDetails {
    Id: number;
    FullName: string;
}

export interface UpdateTenantRegionState {
    TenantOffices: Select[],
    tenantRegion: TenantRegionsEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    states: StateDetailsSelect[],
    cities: CityDetailsSelect[],
    Managers: EntitiesDetails[];
    postalcodelist: PostalCodeDetails[];
}

const initialState: UpdateTenantRegionState = {
    TenantOffices: [],
    tenantRegion: {
        Id: 0,
        Code: "",
        RegionName: "",
        Address: "",
        CityId: 0,
        CountryId: 0,
        Email: "",
        GstNumber: "",
        GstStateId: 0,
        ManagerId: 0,
        Mobile: "",
        OfficeName: "",
        Phone: "",
        Pincode: "",
        StateId: 0,
        TenantOfficeId: 0,
        TenantOfficeInfoId: 0,
        IsActive: false,
        Tin: ""
    },
    postalcodelist: [],
    cities: [],
    Managers: [],
    states: [],
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'tenantregionupdate',
    initialState,
    reducers: {
        initializeTenantRegionUpdate: () => initialState,
        loadTenantRegionDetails: (state, { payload: { RegionDetails } }: PayloadAction<SelectedRegion>) => {
            state.tenantRegion = RegionDetails;
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof UpdateTenantRegionState['tenantRegion']; value: any }>
        ) => {
            state.tenantRegion[name] = value as never;
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
        loadTenantOffices: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantOffices = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadStates: (state, { payload: { States } }: PayloadAction<StatesSelect>) => {
            state.states = States.map((States) => States);
        },
        loadCities: (state, { payload: { Cities } }: PayloadAction<CitiesSelect>) => {
            state.cities = Cities.map((Cities) => Cities);
        },
        loadManagers: (state, { payload: { Managers } }: PayloadAction<ManagersList>) => {
            state.Managers = Managers.map((Managers) => Managers);
        },
        loadPostalCodeList: (state, { payload: { PostalCodeList } }: PayloadAction<PostalCodeList>) => {
            state.postalcodelist = PostalCodeList.map((postalcodelist) => postalcodelist);
        },
        clearPostalCodeList: (state) => {
            state.postalcodelist = [];
        },
        initializeTenatRegionUpdate: (state) => {
            state.tenantRegion = initialState.tenantRegion;
        }
    },
});

export const {
    initializeTenantRegionUpdate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    initializeTenatRegionUpdate,
    updateField,
    loadTenantOffices,
    stopSubmitting,
    loadTenantRegionDetails,
    loadCities,
    loadManagers,
    loadStates,
    clearPostalCodeList,
    loadPostalCodeList
} = slice.actions;

export default slice.reducer;