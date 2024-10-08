import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GstTaxRateListDetail, GstTaxRateList } from "../../../../types/GstTaxRate";
import { Option, None,Some } from '@hqoss/monads';

export interface GstTaxRate {
    gsttaxrate: GstTaxRateListDetail;
}

export interface GstTaxRateListState {
    gsttaxrate: Option<readonly GstTaxRate[]>;
    search: string;
}

const initialState: GstTaxRateListState = {
    gsttaxrate: None,
    search: "",
};

const slice = createSlice({
    name: 'gsttaxratelist',
    initialState,
    reducers: {
      gstTaxRateList: () => initialState,
      loadGstTaxRate: (state, { payload: {GstRateList }}: PayloadAction<GstTaxRateList>) => {
        state.gsttaxrate = Some(GstRateList.map((gsttaxrate) => ({ gsttaxrate })));
      },
      setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
        state.search = Searchname;
      },
    },
  });

  export const { gstTaxRateList, loadGstTaxRate,  setSearch } = slice.actions;
export default slice.reducer;