import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedTenant, SelectedTenantDetails } from '../../../../../types/tenant';

export interface TenantList {
  SelectedTenant: SelectedTenantDetails;
}

export interface TenantProfileState {
  singletenant: Option<readonly TenantList[]>;
}

const initialState: TenantProfileState = {
    singletenant:None,
};

const slice = createSlice({
  name: 'tenantprofile',
  initialState,
  reducers: {
    initializeTenantProfile: () => initialState,
    loadTenantDetails: (state, { payload: { TenantDetails } }: PayloadAction<SelectedTenant>) => {
      state.singletenant = Some(TenantDetails.map((SelectedTenant) => ({ SelectedTenant })));
    },
  },
});

export const {
    initializeTenantProfile,
    loadTenantDetails
} = slice.actions;
export default slice.reducer;
