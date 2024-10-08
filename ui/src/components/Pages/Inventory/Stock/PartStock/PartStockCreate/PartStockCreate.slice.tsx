import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { PartStockCreate} from '../../../../../../types/partStock';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../../types/masterData';

export interface CreatePartStockState {
    partStock: PartStockCreate;
    partSelectDetails: {
        ProductCategory: valuesInMasterDataByTableDetailsSelect[],
        PartCategory:valuesInMasterDataByTableDetailsSelect[],
        Part:valuesInMasterDataByTableDetailsSelect[],
    }
    errors: ValidationErrors;
    submitting: boolean; 
    displayInformationModal: boolean; 
}

const initialState: CreatePartStockState = {
    partStock: {
        ProductCategoryId:null,
        PartCategoryId:null,
        PartId:null,
        Quantity:null,
      },
partSelectDetails:{
    ProductCategory:[],
    PartCategory:[],
    Part:[]
},
    errors: {},
    submitting: false,
    displayInformationModal: false,
};
 
const slice = createSlice({
    name: 'partstockcreate',
    initialState,
    reducers: {
        initializePartStockCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreatePartStockState['partStock']; value: number }>
        ) => {
            state.partStock[name] = value;
        },

        loadPartSelectDetails: (state, { payload: { name,value } }: PayloadAction<{name: keyof CreatePartStockState['partSelectDetails'];value:valuesInMasterDataByTableSelect}>) => {
            state.partSelectDetails[name] = value.MasterData;
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

        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializePartStockCreate,
    loadPartSelectDetails,
    updateErrors, 
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;