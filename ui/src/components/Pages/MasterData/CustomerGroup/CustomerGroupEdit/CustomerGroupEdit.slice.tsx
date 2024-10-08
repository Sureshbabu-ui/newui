import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { CustomerGroupUpdate } from '../../../../../types/customerGroup';

export interface EditCustomerGroupState {
    customergroup: CustomerGroupUpdate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditCustomerGroupState = {
    customergroup: {
        Id:0,
        GroupName: "",
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'customergroupedit',
    initialState,
    reducers: {
        initializeCustomerGroupEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditCustomerGroupState['customergroup']; value: any }>
        ) => {
            state.customergroup[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadDetails: (state, { payload: { Id,GroupName } }: PayloadAction<CustomerGroupUpdate>) => {
            state.customergroup.Id = Id;
            state.customergroup.GroupName = GroupName;
        },
    },
});

export const {
    initializeCustomerGroupEdit,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    loadDetails
} = slice.actions;

export default slice.reducer;