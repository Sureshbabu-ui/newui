import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { TenantRegionsCreate } from '../../../../../../types/tenantRegion';
import { StateDetailsSelect, StatesSelect } from '../../../../../../types/state';
import { CitiesSelect, CityDetailsSelect } from '../../../../../../types/city';
import { ManagersList } from '../../../../../../types/tenantofficeinfo';
import { PostalCodeDetails, PostalCodeList } from '../../../../../../types/postalcode';

export interface EntitiesDetails {
    Id: number;
    FullName: string;
}

export interface CreateTenantRegionState {
    tenantRegion: TenantRegionsCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    states: StateDetailsSelect[],
    cities: CityDetailsSelect[],
    Managers: EntitiesDetails[];
    pincodecheck: boolean;
    postalcodelist: PostalCodeDetails[];
}

const initialState: CreateTenantRegionState = {
    cities: [],
    states: [],
    Managers: [],
    tenantRegion: {
        Code: "",
        RegionName: "",
        TenantId: "",
        OfficeName: "",
        GeoLocation: "",
        Address: "",
        CityId: null,
        StateId: null,
        CountryId: null,
        Pincode: "",
        Phone: "",
        Email: "",
        Mobile: "",
        ManagerId: "",
        GstNumber: "",
        GstStateId: null,
        Tin: "",
    },
    postalcodelist: [],
    pincodecheck: false,
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'tenantregioncreate',
    initialState,
    reducers: {
        initializeTenantRegionCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateTenantRegionState['tenantRegion']; value: any }>
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
        loadStates: (state, { payload: { States } }: PayloadAction<StatesSelect>) => {
            state.states = States.map((States) => States);
        },
        loadCities: (state, { payload: { Cities } }: PayloadAction<CitiesSelect>) => {
            state.cities = Cities.map((Cities) => Cities);
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadManagers: (state, { payload: { Managers } }: PayloadAction<ManagersList>) => {
            state.Managers = Managers.map((Managers) => Managers);
        },
        setPincodeCheck: (state, { payload: value }: PayloadAction<boolean>) => {
            state.pincodecheck = value;
        },
        loadPostalCodeList: (state, { payload: { PostalCodeList } }: PayloadAction<PostalCodeList>) => {
            state.postalcodelist = PostalCodeList.map((postalcodelist) => postalcodelist);
        },
        clearPostalCodeList: (state) => {
            state.postalcodelist = [];
            state.tenantRegion.CityId = null;
            state.tenantRegion.CountryId = null;
            state.tenantRegion.StateId = null;
            state.tenantRegion.Pincode = ""
        },
        initializeTenatRegionCreate: (state) => {
            state.tenantRegion = initialState.tenantRegion;
        }
    },
});

export const {
    initializeTenantRegionCreate,
    updateErrors,
    startSubmitting,
    initializeTenatRegionCreate,
    toggleInformationModalStatus,
    updateField,
    loadCities,
    loadStates,
    loadManagers,
    stopSubmitting,
    clearPostalCodeList,
    loadPostalCodeList,
    setPincodeCheck
} = slice.actions;

export default slice.reducer;