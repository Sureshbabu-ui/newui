import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../../../../../../types/error";
import { CreatePurchaseOrder, Select } from "../../../../../../../types/purchaseorder";
import { PartDetail } from "../../../../../../../types/part";
import { None, Option, Some } from "@hqoss/monads";
import { SelectDetails, SelectTenantOffice, TenantInfoDetails, TenantOfficeInfo } from "../../../../../../../types/tenantofficeinfo";
import { VendorNameList, VendorNames } from "../../../../../../../types/vendor";
import { BranchInVendorDetail, BranchInVendorList } from "../../../../../../../types/vendorBranch";
import { checkIfSameState } from "../../../../../../../helpers/formats";
import { DemandList } from "../../../../../../../types/partindentdemand";

export interface vendorBranchList {
    vendorbranches: BranchInVendorDetail;
}

export interface vendorList {
    vendornames: VendorNameList;
}

export interface tenantOffices {
    tenantOffice: TenantInfoDetails;
}

export interface PartIndendErrors {
    Id: number;
    StockTypeId: number;
    Price: number;
}

export interface CreateBulkPurchaseOrder {
    PartList: DemandList[];
    VendorId: number;
    VendorTypeId: number | null;
    VendorBranchId: number | null;
    ShipToTenantOfficeInfoId: number;
    BillToTenantOfficeInfoId: number;
    Description: string | null;
}

export interface CreateBulkPOState {
    errors: ValidationErrors;
    errorlist: PartIndendErrors[];
    displayInformationModal: boolean;
    vendornames: Option<readonly vendorList[]>;
    createforpurchaseorder: CreateBulkPurchaseOrder;
    TenantOffices: SelectTenantOffice[],
    vendorbranches: Option<readonly vendorBranchList[]>;
    DemandQuantity: number;
    BilledToGstNo: string;
    VendorGstNo: string;
    vendorBranchGstNo: string;
    StockTypes: Select[];
    VendorTypes: Select[];
    CustomerSiteList: Select[];
    CustomerInfoId: number;
    selectedParts: number[];
    DemandIdList: string;
    IsProceed: boolean;
}

const initialState: CreateBulkPOState = {
    errors: {},
    vendornames: None,
    displayInformationModal: false,
    TenantOffices: [],
    vendorbranches: None,
    errorlist: [],
    createforpurchaseorder: {
        PartList: [],
        VendorId: 0,
        VendorTypeId: null,
        VendorBranchId: null,
        ShipToTenantOfficeInfoId: 0,
        BillToTenantOfficeInfoId: 0,
        Description: ""
    },
    CustomerInfoId: 0,
    StockTypes: [],
    VendorTypes: [],
    CustomerSiteList: [],
    BilledToGstNo: "",
    VendorGstNo: "",
    vendorBranchGstNo: "",
    DemandQuantity: 0,
    DemandIdList: "",
    selectedParts: [],
    IsProceed: false
};

const slice = createSlice({
    name: 'createbulkpo',
    initialState,
    reducers: {
        initializeCreateBulkPurchaseOrder: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateBulkPOState['createforpurchaseorder']; value: any }>
        ) => {
            state.createforpurchaseorder[name] = value as never;
            const { BillToTenantOfficeInfoId, VendorId, VendorBranchId } = state.createforpurchaseorder;
            const vendorGstNo = VendorBranchId ? state.vendorBranchGstNo : state.VendorGstNo;
            const shouldUpdateGstRate = BillToTenantOfficeInfoId && (VendorBranchId || VendorId);
            if (shouldUpdateGstRate) {
                const isSameState = checkIfSameState(vendorGstNo, state.BilledToGstNo);
                state.createforpurchaseorder.PartList = state.createforpurchaseorder.PartList.map(demandinfo => {
                    demandinfo.Cgst = isSameState ? demandinfo.GstRate / 2 : 0;
                    demandinfo.Sgst = isSameState ? demandinfo.GstRate / 2 : 0;
                    demandinfo.Igst = isSameState ? 0 : demandinfo.GstRate;
                    return demandinfo;
                });
            }
        },
        updatePartErrorList: (state, { payload: errors }: PayloadAction<PartIndendErrors[]>) => {
            state.errorlist = errors;
        },
        loadStockType: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.StockTypes = Select.map((StockTypes) => StockTypes);
        },
        loadVendorType: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.VendorTypes = Select.map((VendorTypes) => VendorTypes);
        },
        setBillToGst: (state, { payload: gstno }: PayloadAction<any>) => {
            state.BilledToGstNo = gstno;
        },
        setVendorToGst: (state, { payload: gstno }: PayloadAction<any>) => {
            state.VendorGstNo = gstno;
        },
        setvendorBranchGst: (state, { payload: gstno }: PayloadAction<any>) => {
            state.vendorBranchGstNo = gstno;
        },
        loadVendorNames: (state, { payload: { VendorNames } }: PayloadAction<VendorNames>) => {
            state.vendornames = Some(VendorNames.map((vendornames) => ({ vendornames })));
        },
        loadPartDetail: (state, { payload: Details }: PayloadAction<any>) => {
            state.createforpurchaseorder.PartList = Details
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadTenantOffices: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantOffices = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
        },
        loadVendorBranchNames: (state, { payload: { VendorBranches } }: PayloadAction<BranchInVendorList>) => {
            state.vendorbranches = Some(VendorBranches.map((vendorbranches) => ({ vendorbranches })));
        },
        loadCustomerSite: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.CustomerSiteList = Select.map((sitelist) => sitelist);
        },
        selectParts: (state, { payload: { DemandId, Action } }: PayloadAction<{ DemandId: number, Action: string }>) => {
            const existingPart = state.selectedParts.find(part => part === DemandId);
            if (Action == 'remove') {
                if (existingPart) {
                    state.selectedParts = state.selectedParts.filter(item => item != DemandId)
                }
            } else if (Action == 'add') {
                state.selectedParts.push(DemandId);
            }
            state.DemandIdList = state.selectedParts.join(",");
        },
        setPartQuantity: (state, { payload: { DemandId, Price } }: PayloadAction<{ DemandId: number | string; Price: number }>) => {
            const existingPart = state.createforpurchaseorder.PartList.find(demandinfo => demandinfo.DemandId == DemandId);
            if (existingPart) {
                state.createforpurchaseorder.PartList = state.createforpurchaseorder.PartList.map(demandinfo => {
                    if (demandinfo.DemandId == DemandId) {
                        demandinfo.Price = Price;
                    }
                    return demandinfo;
                });
            }
        },
        setStockType: (state, { payload: { DemandId, StockTypeId } }: PayloadAction<{ DemandId: number | string; StockTypeId: number }>) => {
            const existingPart = state.createforpurchaseorder.PartList.find(demandinfo => demandinfo.DemandId == DemandId);
            if (existingPart) {
                state.createforpurchaseorder.PartList = state.createforpurchaseorder.PartList.map(demandinfo => {
                    if (demandinfo.DemandId == DemandId) {
                        demandinfo.StockTypeId = StockTypeId;
                    }
                    return demandinfo;
                });
            }
        },
        setProceed: (state, { payload: proceed }: PayloadAction<any>) => {
            state.IsProceed = proceed;
        },
        onCloseModal: (state) => {
            state.createforpurchaseorder = {
                ...state.createforpurchaseorder,
                VendorId: 0,
                VendorTypeId: null,
                VendorBranchId: null,
                ShipToTenantOfficeInfoId: 0,
                BillToTenantOfficeInfoId: 0,
                Description: ""
            };
             state.selectedParts = [];
              state.IsProceed = false;
        }
    },
});

export const {
    initializeCreateBulkPurchaseOrder,
    updateField,
    setPartQuantity,
    setStockType,
    updateErrors,
    loadVendorType,
    toggleInformationModalStatus,
    loadVendorNames,
    loadPartDetail,
    loadTenantOffices,
    loadVendorBranchNames,
    setBillToGst,
    setVendorToGst,
    loadStockType,
    setvendorBranchGst,
    loadCustomerSite,
    selectParts,
    updatePartErrorList,
    setProceed,
    onCloseModal
} = slice.actions;

export default slice.reducer;