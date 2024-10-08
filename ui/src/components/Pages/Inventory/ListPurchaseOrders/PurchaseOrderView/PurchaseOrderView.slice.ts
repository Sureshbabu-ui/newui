import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PurchaseOrderDetail, purchaseOrderDetails } from '../../../../../types/purchaseorder';
import { None, Option, Some } from '@hqoss/monads';

export interface PurchaseOrderState {
    podetails: Option<readonly PurchaseOrderDetail[]>;
}

const initialState: PurchaseOrderState = {
    podetails: None,
};
const slice = createSlice({
    name: 'purchaseorderdetail',
    initialState,
    reducers: {
        initializePurchaseOrder: () => initialState,
        loadSelectedPO: (state, { payload: { PurchaseOrderDetails } }: PayloadAction<purchaseOrderDetails>) => {
            state.podetails = Some(PurchaseOrderDetails.map((item) => item));                        
        }
    },
});

export const { initializePurchaseOrder, loadSelectedPO } = slice.actions;
export default slice.reducer;
