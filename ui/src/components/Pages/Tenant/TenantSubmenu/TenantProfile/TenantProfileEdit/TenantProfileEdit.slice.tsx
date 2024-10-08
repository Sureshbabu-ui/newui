import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { TenantSelectDetails, TenantUpdate, TenantUpdateDetails, SelectDetails } from '../../../../../../types/tenant';
import { PostalCodeDetails, PostalCodeList } from '../../../../../../types/postalcode';

export interface EditTenantProfileState {
    tenant: TenantUpdateDetails;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    selectDetails: TenantSelectDetails;
    postalcodelist: PostalCodeDetails[];
}

const initialState: EditTenantProfileState = {
    tenant: {
        CWHAddress: "",
        GRCAddress: "",
        HOAddress: "",
        Id: 0,
        Name: "",
        NameOnPrint: "",
        PanNumber: "",
        Pincode: "",
        TenantId: 0,
        Address: "",
        City: 0,
        Country: 0,
        State: 0,
        CWHId:0,
        GRCId:0,
        HDOFId:0
    },
    selectDetails: {
        Cities: [],
        Countrys: [],
        States: []
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
    postalcodelist:[]
};

const slice = createSlice({
    name: 'tenantprofileedit',
    initialState,
    reducers: {
        initializeTenantEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditTenantProfileState['tenant']; value: any }>
        ) => {
            state.tenant[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadTenantEditDetails: (state, { payload: { TenantDetails } }: PayloadAction<TenantUpdate>) => {
            state.tenant = TenantDetails
        },
        loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof EditTenantProfileState['selectDetails']; value: SelectDetails }>) => {
            state.selectDetails[name] = Select.map((selectDetails) => (selectDetails))
        },
        loadTenantProfilePostalCodeList: (state, { payload: { PostalCodeList } }: PayloadAction<PostalCodeList>) => {
            state.postalcodelist = PostalCodeList.map((postalcodelist) => postalcodelist);
        },
        clearTenantProfilePostalCodeList: (state) => {
            state.postalcodelist = [];
        }
    },
});

export const {
    initializeTenantEdit,
    updateErrors,
    toggleInformationModalStatus,
    loadTenantEditDetails,
    updateField,
    loadSelectDetails,
    clearTenantProfilePostalCodeList,
    loadTenantProfilePostalCodeList
} = slice.actions;

export default slice.reducer;