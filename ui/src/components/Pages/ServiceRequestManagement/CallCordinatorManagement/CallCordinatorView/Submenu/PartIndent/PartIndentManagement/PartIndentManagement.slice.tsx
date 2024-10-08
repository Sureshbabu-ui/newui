import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartRequestable } from '../../../../../../../../types/partIndent';
import { AssetDetail } from '../../../../../../../../types/assets';

export interface PartIndentManagementState {
    error: string;
    selectedStatus: string;
    AssetDetail: AssetDetail;
}

const initialState: PartIndentManagementState = {
    error: "",
    selectedStatus: "1",
    AssetDetail: {
        CategoryName: "",
        IsWarranty: false,
        Make: "",
        ModelName: "",
        ProductSerialNumber: ""
    }
};

const slice = createSlice({
    name: 'partindentmanagement',
    initialState,
    reducers: {
        initializePartIndentManagement: () => initialState,
        loadIsPartRequestable: (state, { payload: PartRequestable }: PayloadAction<PartRequestable>) => {
            if (PartRequestable.IsRequestClosed == true)
                state.error = "partindentmanagement_error_closed"
            else if (PartRequestable.IsComprehensive == false && PartRequestable.IsUnderWarranty == true)
                state.error = "partindentmanagement_error_noncomp_warranty"
            else if (PartRequestable.IsComprehensive == false && PartRequestable.IsUnderWarranty == false)
                state.error = "partindentmanagement_error_noncomp_nonwarranty"
            else if (PartRequestable.IsComprehensive == true && PartRequestable.IsUnderWarranty == true)
                state.error = "partindentmanagement_error_warranty"
        },
        setTabStatus: (state, { payload: status }: PayloadAction<string>) => {
            state.selectedStatus = status;
        },
        loadAssetDetails: (state, { payload: info }: PayloadAction<AssetDetail>) => {
            state.AssetDetail = info
        }
    },
});

export const {
    initializePartIndentManagement,
    loadIsPartRequestable,
    setTabStatus,
    loadAssetDetails
} = slice.actions;

export default slice.reducer;