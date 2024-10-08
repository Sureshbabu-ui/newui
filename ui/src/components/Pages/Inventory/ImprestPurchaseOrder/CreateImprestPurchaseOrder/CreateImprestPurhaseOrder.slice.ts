import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { BranchInVendorDetail, BranchInVendorList } from '../../../../../types/vendorBranch';
import { VendorNameList, VendorNames } from '../../../../../types/vendor';
import { SelectTenantOffice, TenantInfoDetails } from '../../../../../types/tenantofficeinfo';
import { None, Option, Some } from '@hqoss/monads';
import { Select, SelectDetails } from '../../../../../types/purchaseorder';
import { ImprestPODetails } from '../../../../../types/part';
import { checkIfSameState } from '../../../../../helpers/formats';

export interface vendorBranchList {
    vendorbranches: BranchInVendorDetail;
}

export interface vendorList {
    vendornames: VendorNameList;
}

export interface tenantOffices {
    tenantOffice: TenantInfoDetails;
}

export interface tenantOffices {
    tenantOffice: TenantInfoDetails;
}

export interface PartErrorList {
    Id: number;
    StockTypeId: number;
    Quantity:number | string;
    Price: number | string;
}
export interface CreateImprestPurchaseOrder {
    PartList: ImprestPODetails[];
    VendorTypeId: number|null;
    VendorId: number;
    VendorBranchId: number | null;
    ShipToTenantOfficeInfoId: number;
    BillToTenantOfficeInfoId: number;
    Description: string | null;
}

export interface ImprestPurchaseOrderState {
    errors: ValidationErrors;
    errorlist: PartErrorList[];
    totalrows: number,
    displayInformationModal: boolean;
    PartCategoryList: number[];
    PartCategoryIdList: string;
    vendornames: Option<readonly vendorList[]>;
    createforpurchaseorder: CreateImprestPurchaseOrder;
    TenantOffices: SelectTenantOffice[],
    StockTypes: Select[];
    VendorTypes: Select[];
    vendorbranches: Option<readonly vendorBranchList[]>;
    proceed: boolean;
    BilledToGstNo: string;
    VendorGstNo:string;
    VendorBranchGstNo: string;
}


const initialState: ImprestPurchaseOrderState = {
    PartCategoryList: [],
    PartCategoryIdList: '',
    TenantOffices: [],
    errors: {},
    StockTypes: [],
    VendorTypes: [],
    vendornames: None,
    displayInformationModal: false,
    vendorbranches: None,
    createforpurchaseorder: {
        PartList: [],
        VendorTypeId: null,
        VendorId: 0,
        VendorBranchId: null,
        ShipToTenantOfficeInfoId: 0,
        BillToTenantOfficeInfoId: 0,
        Description: ""
    },
    errorlist: [],
    totalrows: 0,
    proceed: false,
    BilledToGstNo: '',
    VendorGstNo: '',
    VendorBranchGstNo:''
};

const slice = createSlice({
    name: 'createimprestpo',
    initialState,
    reducers: {
        initializeImprestPurchaseOrder: () => initialState,
        updateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof ImprestPurchaseOrderState['createforpurchaseorder']; value: any }>) => {
            state.createforpurchaseorder[name] = value as never;

            const { BillToTenantOfficeInfoId, VendorId, VendorBranchId, PartList } = state.createforpurchaseorder;
            const vendorGstNo = VendorBranchId ? state.VendorBranchGstNo : state.VendorGstNo;
            const shouldUpdateGstRate = BillToTenantOfficeInfoId && (VendorBranchId || VendorId);

            if (shouldUpdateGstRate) {
                state.createforpurchaseorder.PartList = PartList.map(item => {
                    const status = checkIfSameState(vendorGstNo, state.BilledToGstNo);
                    return {
                        ...item,
                        Cgst: status ? item.GstRate / 2 : 0,
                        Sgst: status ? item.GstRate / 2 : 0,
                        Igst: status ? 0 : item.GstRate,
                    };
                });
            }
        },
        addOrRemoveFromCart: (state, { payload: { Part, Action } }: PayloadAction<{ Part: ImprestPODetails, Action: string }>) => {
            const existingPart = state.createforpurchaseorder.PartList.find(part => part.Id === Part.Id);
            if (Action == 'remove') {
                if(existingPart){
                    state.createforpurchaseorder.PartList = state.createforpurchaseorder.PartList.filter(item => item.Id != Part.Id)   
                }

            } else if (Action == 'add') {
                state.createforpurchaseorder.PartList.push({ ...Part, Quantity: 1 });
            }
        },
        loadVendorNames: (state, { payload: { VendorNames } }: PayloadAction<VendorNames>) => {
            state.vendornames = Some(VendorNames.map((vendornames) => ({ vendornames })));
        },
        loadTenantOffices: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantOffices = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
        },
        updateErrorList: (state, { payload: errors }: PayloadAction<PartErrorList[]>) => {
            state.errorlist = errors;
        },
        loadVendorBranchNames: (state, { payload: { VendorBranches } }: PayloadAction<BranchInVendorList>) => {
            state.vendorbranches = Some(VendorBranches.map((vendorbranches) => ({ vendorbranches })));
        },
        loadStockType: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.StockTypes = Select.map((StockTypes) => StockTypes);
        },
        loadVendorType: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.VendorTypes = Select.map((VendorTypes) => VendorTypes);
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        setBillToGst: (state, { payload: gstno }: PayloadAction<any>) => {
            state.BilledToGstNo = gstno;
        },
        setVendorToGst: (state, { payload: gstno }: PayloadAction<any>) => {
            state.VendorGstNo = gstno;
        },
        setVendorBranchToGst: (state, { payload: gstno }: PayloadAction<any>) => {
            state.VendorBranchGstNo = gstno;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        setPartQuantity: (state, { payload: { PartId, Quantity } }: PayloadAction<{ PartId: number | string; Quantity: number }>) => {
            const existingPart = state.createforpurchaseorder.PartList.find(part => part.Id == PartId);
            if (existingPart) {
                    state.createforpurchaseorder.PartList = state.createforpurchaseorder.PartList.map(part => {
                        if (part.Id == PartId) {
                            part.Quantity = Quantity;
                        }
                        return part;
                    });
            }
        },
        setPartPrice: (state, { payload: { PartId, Price } }: PayloadAction<{ PartId: number | string; Price: number }>) => {
            const existingPart = state.createforpurchaseorder.PartList.find(part => part.Id == PartId);
            if (existingPart) {
                state.createforpurchaseorder.PartList = state.createforpurchaseorder.PartList.map(part => {
                    if (part.Id == PartId) {
                        part.Price = Price;
                    }
                    return part;
                });
            }
        },
        setPartType: (state, { payload: { PartId, StockTypeId } }: PayloadAction<{ PartId: number | string; StockTypeId: number }>) => {
            const existingPart = state.createforpurchaseorder.PartList.find(part => part.Id == PartId);
            if (existingPart) {
                state.createforpurchaseorder.PartList = state.createforpurchaseorder.PartList.map(part => {
                    if (part.Id == PartId) {
                        part.StockTypeId = StockTypeId;
                    }
                    return part;
                });
            }
        },
        setProceed: (state, { payload: status }: PayloadAction<boolean>) => {
            state.proceed = status;
        },
        RemoveFromCart: (state, { payload: { Part, Action } }: PayloadAction<{ Part: ImprestPODetails, Action: string }>) => {
            const existingPart = state.createforpurchaseorder.PartList.find(part => part.Id === Part.Id);
            if (Action == 'remove') {
                if (existingPart) {
                    state.createforpurchaseorder.PartList = state.createforpurchaseorder.PartList.filter(item => item.Id != Part.Id)
                }
            }
        },
    },
});

export const {
    initializeImprestPurchaseOrder,
    setBillToGst,
    setVendorToGst,
    loadTenantOffices,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    setPartType,
    setPartQuantity,
    setPartPrice,
    loadVendorBranchNames,
    loadVendorNames,
    loadVendorType,
    loadStockType,
    setProceed,
    updateErrorList,
    RemoveFromCart,
    addOrRemoveFromCart,
    setVendorBranchToGst
} = slice.actions;

export default slice.reducer; 