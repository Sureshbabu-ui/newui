import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetsList} from '../../../../../../types/assets';
import { MultipleCustomerSites } from '../../../../../../types/customer';
import { ValidationErrors } from '../../../../../../types/error';

export interface AssetListForTransfer {
    asset: AssetsList;
}

export interface CustomerDetails {
    Id: number;
    SiteName: string;
}

export interface SelectedAssetsWithAssetId{
    AssetIdList:string;
    CustomerSiteId:number | string;
}

export interface SelectedAssetsListState {
    CustomerSiteId: CustomerDetails[];
    selectedList: SelectedAssetsWithAssetId;
    errors: ValidationErrors;
    assets: Option<readonly AssetListForTransfer[]>;
    AssetIdList: string;
    currentPage: number;
    search: any;
    totalRows: number;
    createAssetsModalStatus: boolean;
    displayInformationModal: boolean;
}

const initialState: SelectedAssetsListState = {
    CustomerSiteId: [],
    selectedList: {
    AssetIdList:'',
    CustomerSiteId:0
    },
    assets: None,
    AssetIdList: '',
    errors: {},
    currentPage: 1,
    search: null,
    totalRows: 0,
    createAssetsModalStatus: false,
    displayInformationModal: false,
};
const slice = createSlice({
    name: 'assettransfer',
    initialState,
    reducers: {
        initializeAssetsListForTransfer: () => initialState,
        loadCustomerSites: (state, { payload: { ContractCustomerSites } }: PayloadAction<MultipleCustomerSites>) => {
            state.CustomerSiteId = ContractCustomerSites.map((customerSite) => customerSite);
        },
        loadSelectedAssets: (state, { payload: selectedassets }: PayloadAction<AssetsList[]>) => {
            state.assets = Some(selectedassets.map((asset) => ({ asset })));
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.assets = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
            state.currentPage = 1;
        },
        changeAssetSite: (state, { payload: site }: PayloadAction<string>) => {
            state.selectedList.AssetIdList = site;
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof SelectedAssetsListState['selectedList']; value: any }>
        ) => {
            state.selectedList[name] = value;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        }
    },
});

export const { initializeAssetsListForTransfer, toggleInformationModalStatus, changeAssetSite, updateErrors, loadCustomerSites, updateField,loadSelectedAssets, changePage, setSearch } = slice.actions;
export default slice.reducer;