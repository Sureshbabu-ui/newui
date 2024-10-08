import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../../../types/error';
import { PartIndentCartDetails, RequestPart, Select, SelectDetails } from '../../../../../../../../types/partIndent';
import { TenantInfoDetails } from '../../../../../../../../types/tenantofficeinfo';
import { SelectTenantOffice } from '../../../../../../../../types/user';
import { PartStockWarrantyCheck, PartStockWarrantyCheckList } from '../../../../../../../../types/partStockDetail';

export interface masterDataList {
    StockType: Select[]
}

export interface PartIndendCartErrors {
    Id: number;
    StockTypeId: number;
    Quantity: number;
}

export interface PartIndentCartState {
    requestPart: RequestPart;
    PartSelectDetails: {
        PartCategory: Select[],
        ServiceEngineers: Select[],
    },
    errorlist: PartIndendCartErrors[];
    masterDataList: masterDataList,
    selectedParts: PartIndentCartDetails[];
    errors: ValidationErrors;
    totalrows: number,
    displayInformationModal: boolean;
    tenantOffices: SelectTenantOffice[];
    PartCategoryList: number[];
    PartCategoryIdList: string;
    PartStocks: PartStockWarrantyCheckList[];
}

export interface tenantOffices {
    tenantOffice: TenantInfoDetails;
}

const initialState: PartIndentCartState = {
    requestPart: {
        ServiceRequestId: 0,
        Remarks: "",
        RequestedBy: 0,
        TenantOfficeId: 0,
        partInfoList: []
    },
    PartStocks: [],
    PartCategoryList: [],
    PartCategoryIdList: '',
    tenantOffices: [],
    PartSelectDetails: {
        PartCategory: [],
        ServiceEngineers: [],
    },
    masterDataList: {
        StockType: []
    },
    selectedParts: [],
    totalrows: 0,
    errors: {},
    errorlist: [],
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partindentcart',
    initialState,
    reducers: {
        initializeRequestPartCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof PartIndentCartState['requestPart']; value: any }>
        ) => {
            state.requestPart[name] = value as never;
        },
        loadMasterData: (state, { payload: { name, value: { SelectDetails } } }: PayloadAction<{ name: keyof PartIndentCartState['masterDataList']; value: SelectDetails }>) => {
            state.masterDataList[name] = SelectDetails.map((masterData) => (masterData))
        },
        addOrRemoveFromCart: (state, { payload: { Part, Action } }: PayloadAction<{ Part: PartIndentCartDetails, Action: string }>) => {
            const existingPart = state.requestPart.partInfoList.find(part => part.Id === Part.Id);
            if (Action == 'remove') {
                if (existingPart) {
                    state.requestPart.partInfoList = state.requestPart.partInfoList.filter(item => item.Id != Part.Id)
                    var index = state.PartCategoryList.indexOf(Part.PartCategoryId);
                    if (index !== -1) {
                        state.PartCategoryList.splice(index, 1);
                    }
                    state.PartCategoryIdList = state.PartCategoryList.join(",");
                }
            } else if (Action == 'add') {
                state.requestPart.partInfoList.push({ ...Part, Quantity: 1 });
                if (state.PartCategoryList.includes(Part.PartCategoryId) == false) {
                    state.PartCategoryList.push(Part.PartCategoryId);
                }
                state.PartCategoryIdList = state.PartCategoryList.join(",");
            }
        },
        addToCart: (state, { payload: { Part, Action } }: PayloadAction<{ Part: PartIndentCartDetails, Action: string }>) => {
            const existingPart = state.requestPart.partInfoList.find(part => part.Id === Part.Id);            
            if (Action == 'remove') {
                if (existingPart) {
                    state.requestPart.partInfoList = state.requestPart.partInfoList.filter(item => item.Id != Part.Id)
                }

            } else if (Action == 'add') {
                state.requestPart.partInfoList.push({ ...Part, Quantity: 1 });
            }
        },
        loadTenantOffices: (state, { payload: { SelectDetails } }: PayloadAction<SelectDetails>) => {
            state.tenantOffices = SelectDetails.map((TenantOfficeInfo) => TenantOfficeInfo);
        },
        loadPartStocks: (state, { payload: { SelectPartStocks } }: PayloadAction<PartStockWarrantyCheck>) => {
            state.PartStocks = SelectPartStocks.map((stocks) => stocks);
        },
        setServiceRequestId: (state, { payload: Id }: PayloadAction<any>) => {
            state.requestPart.ServiceRequestId = Id;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        updatePartErrorList: (state, { payload: errors }: PayloadAction<PartIndendCartErrors[]>) => {
            state.errorlist = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadPartSelectedDetails: (state, { payload: { name, value: { SelectDetails } } }: PayloadAction<{ name: keyof PartIndentCartState['PartSelectDetails']; value: SelectDetails }>) => {
            state.PartSelectDetails[name] = SelectDetails.map((SelectDetails) => SelectDetails);
        },
        setPartQuantity: (state, { payload: { PartId, Quantity } }: PayloadAction<{ PartId: number | string; Quantity: number }>) => {
            const existingPart = state.requestPart.partInfoList.find(part => part.Id == PartId);
            if (existingPart) {
                state.requestPart.partInfoList = state.requestPart.partInfoList.map(part => {
                    if (part.Id == PartId) {
                        part.Quantity = Quantity;
                    }
                    return part;
                });
            }
        },
        setStockType: (state, { payload: { PartId, StockTypeId } }: PayloadAction<{ PartId: number | string; StockTypeId: number }>) => {
            const existingPart = state.requestPart.partInfoList.find(part => part.Id == PartId);
            if (existingPart) {
                state.requestPart.partInfoList = state.requestPart.partInfoList.map(part => {
                    if (part.Id == PartId) {
                        part.StockTypeId = StockTypeId;
                    }
                    return part;

                });
            }
        },
        SetWarrantyReplacement: (state, { payload: { PartId, IsWarrantyReplacement } }: PayloadAction<{ PartId: number | string; IsWarrantyReplacement: boolean }>) => {
            const existingPart = state.requestPart.partInfoList.find(part => part.Id == PartId);
            if (existingPart) {
                state.requestPart.partInfoList = state.requestPart.partInfoList.map(part => {
                    if (part.Id == PartId) {
                        part.IsWarrantyReplacement = IsWarrantyReplacement;
                    }
                    return part;

                });
            }
        },
        updatePartRemarks: (
            state,
            { payload: { id, remarks } }: PayloadAction<{ id: string; remarks: string }>
        ) => {
            state.requestPart.partInfoList = state.requestPart.partInfoList.map(part => {
                if (part.Id == Number(id)) {
                    part.Remarks = remarks;
                }
                return part;
            });
        },
        RemoveFromCart: (state, { payload: { Part, Action } }: PayloadAction<{ Part: PartIndentCartDetails, Action: string }>) => {
            const existingPart = state.requestPart.partInfoList.find(part => part.Id === Part.Id);
            if (Action == 'remove') {
                if (existingPart) {
                    state.requestPart.partInfoList = state.requestPart.partInfoList.filter(item => item.Id != Part.Id)
                }
            }
            var index = state.PartCategoryList.indexOf(Part.PartCategoryId);
            if (index !== -1) {
                state.PartCategoryList.splice(index, 1);
            }
            state.PartCategoryIdList = state.PartCategoryList.join(",");
        },
    },
});

export const {
    initializeRequestPartCreate,
    loadTenantOffices,
    addToCart,
    updateErrors,
    loadPartStocks,
    updatePartRemarks,
    toggleInformationModalStatus,
    updateField,
    setPartQuantity,
    setServiceRequestId,
    loadPartSelectedDetails,
    loadMasterData,
    updatePartErrorList,
    addOrRemoveFromCart,
    setStockType,
    SetWarrantyReplacement,
    RemoveFromCart
} = slice.actions;

export default slice.reducer; 