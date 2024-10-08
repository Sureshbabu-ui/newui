import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductCategoryDetails } from '../../../../../../types/assetProductCategory';

export interface ProductCategoryDetailState {
  singleproductcategory: ProductCategoryDetails;
}

const initialState: ProductCategoryDetailState = {
  singleproductcategory:{
    Id:0,
    Code:'',
    CategoryName:'',
    PartProductCategoryId:0,
    PartProductCategory:"",
    GeneralNotCovered:null,
    SoftwareNotCovered:null,
    HardwareNotCovered:null
  },
};

const slice = createSlice({
  name: 'productcategorydetails',
  initialState,
  reducers: {
    initializeProductCategoryDetails: () => initialState,
    loadProductCategoryDetails: (state, { payload: ProductCategoryDetails}: PayloadAction<any>) => {
      state.singleproductcategory = ProductCategoryDetails;      
    },
  },
});

export const {
  initializeProductCategoryDetails,
  loadProductCategoryDetails
} = slice.actions;

export default slice.reducer;