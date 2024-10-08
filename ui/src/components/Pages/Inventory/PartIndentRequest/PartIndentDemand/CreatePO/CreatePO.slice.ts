import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../../../../../types/error";
import { CreatePurchaseOrder, Select } from "../../../../../../types/purchaseorder";
import { PartDetail } from "../../../../../../types/part";
import { None, Option, Some } from "@hqoss/monads";
import { SelectDetails, SelectTenantOffice, TenantInfoDetails, TenantOfficeInfo } from "../../../../../../types/tenantofficeinfo";
import { VendorNameList, VendorNames } from "../../../../../../types/vendor";
import { BranchInVendorDetail, BranchInVendorList } from "../../../../../../types/vendorBranch";
import { checkIfSameState } from "../../../../../../helpers/formats";

export interface vendorBranchList {
    vendorbranches: BranchInVendorDetail;
}

export interface vendorList {
    vendornames: VendorNameList;
}

export interface tenantOffices {
    tenantOffice: TenantInfoDetails;
}

export interface CreatePOState {
    errors: ValidationErrors;
    displayInformationModal: boolean;
    vendornames: Option<readonly vendorList[]>;
    createforpurchaseorder: CreatePurchaseOrder;
    partdetail: PartDetail;
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
    ToSite: boolean;
}

const initialState: CreatePOState = {
    errors: {},
    vendornames: None,
    displayInformationModal: false,
    TenantOffices: [],
    vendorbranches: None,
    createforpurchaseorder: {
        DemandId: 0,
        PartId: 0,
        PartIndentRequestId: 0,
        TenantOfficeId: 0,
        VendorId: 0,
        ShipToTenantOfficeInfoId: null,
        BillToTenantOfficeInfoId: 0,
        ShipToCustomerSiteId: null,
        Description: "",
        CgstRate: 0,
        IgstRate: 0,
        SgstRate: 0,
        VendorBranchId: null,
        StockTypeId: 0,
        Price: 0,
        VendorTypeId: null
    },
    CustomerInfoId: 0,
    StockTypes: [],
    VendorTypes: [],
    CustomerSiteList: [],
    BilledToGstNo: "",
    VendorGstNo: "",
    vendorBranchGstNo: "",
    partdetail: {
        Id: 0,
        HsnCode: "",
        MakeName: "",
        OemPartNumber: "",
        PartCategoryName: "",
        PartCode: "",
        PartName: "",
        PartQuantity: 0,
        ProductCategoryName: "",
        GstRate: 0
    },
    DemandQuantity: 0,
    ToSite: false
};

const slice = createSlice({
    name: 'createpurchaseorder',
    initialState,
    reducers: {
        initializeCreatePurchaseOrder: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreatePOState['createforpurchaseorder']; value: any }>
        ) => {
            state.createforpurchaseorder[name] = value as never;
            const { BillToTenantOfficeInfoId, VendorId, VendorBranchId } = state.createforpurchaseorder;
            const vendorGstNo = VendorBranchId ? state.vendorBranchGstNo : state.VendorGstNo;
            const shouldUpdateGstRate = BillToTenantOfficeInfoId && (VendorBranchId || VendorId);

            if (shouldUpdateGstRate) {
                const isSameState = checkIfSameState(vendorGstNo, state.BilledToGstNo);
                state.createforpurchaseorder.CgstRate = isSameState ? state.partdetail.GstRate / 2 : 0;
                state.createforpurchaseorder.SgstRate = isSameState ? state.partdetail.GstRate / 2 : 0;
                state.createforpurchaseorder.IgstRate = isSameState ? 0 : state.partdetail.GstRate;
            }
        },
        loadStockType: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.StockTypes = Select.map((StockTypes) => StockTypes);
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
        loadVendorType: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.VendorTypes = Select.map((VendorTypes) => VendorTypes);
        },
        loadDetailsForPo: (state, { payload: { DemandId, Price, vendorId, vendorTypeId, PartIndentRequestId, TenantOfficeId, PartId, DemandQuantity, StockTypeId, CustomerInfoId } }: PayloadAction<{ PartId: number, DemandId: number, PartIndentRequestId: number, vendorId: number,vendorTypeId: number, Price: number, TenantOfficeId: number, DemandQuantity: number, StockTypeId: number, CustomerInfoId: number }>) => {
            state.createforpurchaseorder.DemandId = DemandId;
            state.createforpurchaseorder.PartIndentRequestId = PartIndentRequestId;
            state.createforpurchaseorder.TenantOfficeId = TenantOfficeId;
            state.createforpurchaseorder.PartId = PartId;
            state.createforpurchaseorder.StockTypeId = StockTypeId;
            state.createforpurchaseorder.VendorId = vendorId;
            state.createforpurchaseorder.VendorTypeId = vendorTypeId;
            state.createforpurchaseorder.Price = Price;
            state.DemandQuantity = DemandQuantity;
            state.CustomerInfoId = CustomerInfoId;
        },
        loadPartDetail: (state, { payload: Details }: PayloadAction<any>) => {
            state.partdetail = Details
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
        setToSite: (state, { payload: siteornot }: PayloadAction<boolean>) => {
            if (siteornot) {
                state.createforpurchaseorder.ShipToTenantOfficeInfoId = null;
                state.createforpurchaseorder.ShipToCustomerSiteId = null;
                if (state.errors['ShipToCustomerSiteId'] || state.errors['ShipToTenantOfficeInfoId'] != null) {
                    state.errors['ShipToCustomerSiteId'] = ''
                    state.errors['ShipToTenantOfficeInfoId'] = ''
                }
            }
            state.ToSite = siteornot
        }
    },
});

export const {
    initializeCreatePurchaseOrder,
    updateField,
    updateErrors,
    toggleInformationModalStatus,
    loadVendorNames,
    loadVendorType,
    loadDetailsForPo,
    loadPartDetail,
    loadTenantOffices,
    loadVendorBranchNames,
    setBillToGst,
    setVendorToGst,
    loadStockType,
    setvendorBranchGst,
    loadCustomerSite,
    setToSite
} = slice.actions;

export default slice.reducer;