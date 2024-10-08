import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { Configurations, ManagersList, TenantOfficeCreate } from '../../../../../../types/tenantofficeinfo';
import { RegionNames } from '../../../../../../types/tenantRegion';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../../types/masterData';
import { StateDetailsSelect, StatesSelect } from '../../../../../../types/state';
import { CitiesSelect, CityDetailsSelect } from '../../../../../../types/city';
import { PostalCodeDetails, PostalCodeList } from '../../../../../../types/postalcode';

export interface CreateTenantOfficeState {
    entitiesList: Configurations;
    states: StateDetailsSelect[],
    cities: CityDetailsSelect[],
    tenantofficetypes: valuesInMasterDataByTableDetailsSelect[];
    tenantOffice: TenantOfficeCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    pincodecheck: boolean;
    postalcodelist: PostalCodeDetails[];
}

const initialState: CreateTenantOfficeState = {
    entitiesList: {
        Managers: [],
        TenantRegions: []
    },
    tenantOffice: {
        TenantId: "",
        Code: "",
        OfficeName: "",
        OfficeTypeId: "",
        RegionId: 0,
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
    cities: [],
    states: [],
    tenantofficetypes: [],
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'tenantofficecreate',
    initialState,
    reducers: {
        initializeTenantOfficeCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateTenantOfficeState['tenantOffice']; value: any }>
        ) => {
            state.tenantOffice[name] = value;
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
        setPincodeCheck: (state, { payload: value }: PayloadAction<boolean>) => {
            state.pincodecheck = value;
        },
        loadPostalCodeList: (state, { payload: { PostalCodeList } }: PayloadAction<PostalCodeList>) => {
            state.postalcodelist = PostalCodeList.map((postalcodelist) => postalcodelist);
        },
        clearPostalCodeList: (state) => {
            state.postalcodelist = [];
            state.tenantOffice.CityId = null;
            state.tenantOffice.CountryId = null;
            state.tenantOffice.StateId = null;
            state.tenantOffice.Pincode = ""
        },
        initializeOfficeCreate: (state) => {
            state.tenantOffice = initialState.tenantOffice;
        },
    },
});

export const {
    initializeTenantOfficeCreate,
    initializeOfficeCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    loadManagers,
    loadTenantRegions,
    stopSubmitting,
    loadMasterData,
    loadStates,
    loadCities,
    setPincodeCheck,
    loadPostalCodeList,
    clearPostalCodeList
} = slice.actions;

export default slice.reducer;