import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BucketPartStocksList, PartStockDetailListDetail } from '../../../../../../types/partStockDetail';
import { None, Option, Some } from '@hqoss/monads';
import { ValidationErrors } from '../../../../../../types/error';
import { CreateDC } from '../../../../../../types/deliverychallan';
import { ImprestStock } from '../../../../../../types/impreststock';

export interface PartStockDetails {
  partStockDetail: PartStockDetailListDetail;
}

export interface PartBasketItemState {
  deliverychallan: CreateDC;
  impreststock: ImprestStock;
  BasketList: string;
  partStockDetails: Option<readonly PartStockDetails[]>;
  BasketItem: boolean;
  PartStockIdList: number[],
  TransferType: string;
  errors: ValidationErrors;
  errorsDC: ValidationErrors;
  displayInformationModal: boolean;
  PartId: string;
  ReserveLocation: string;
}

const initialState: PartBasketItemState = {
  deliverychallan: {
    DcTypeId: 0,
    DestinationEmployeeId: null,
    DestinationTenantOfficeId: null,
    DestinationVendorId: null,
    LogisticsReceiptDate: null,
    LogisticsReceiptNumber: "",
    LogisticsVendorId: null,
    ModeOfTransport: null,
    partstocks: [],
    DestinationVendorTypeId: null,
    LogisticsVendorTypeId: null,
    TrackingId: "",
    PartIndentDemandNumber: "",
    DCTypeCode: "",
    DestinationCustomerSiteId: null
  },
  ReserveLocation: "",
  impreststock: {
    ContractId: 0,
    CustomerId: 0,
    CustomerSiteId: null,
    PartStockIdList: [],
    Remarks: "",
    ReservedFrom: `${new Date().toISOString().split('T')[0]}`,
    ReservedTo: "",
    IsCustomerSite: false,
    IsbyCourier: "",
    ServiceEngineerId: null
  },
  TransferType: '',
  PartId: "",
  BasketItem: false,
  BasketList: "",
  partStockDetails: None,
  errors: {},
  errorsDC: {},
  displayInformationModal: false,
  PartStockIdList: [],
};
const slice = createSlice({
  name: 'partstockbasket',
  initialState,
  reducers: {
    initializeBasketItemList: () => initialState,
    updateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof PartBasketItemState['deliverychallan']; value: any }>) => {
      state.deliverychallan[name] = value as never;
    },
    updateImprestStockField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof PartBasketItemState['impreststock']; value: any }>) => {
      state.impreststock[name] = value as never;
    },
    updateBasketItem: (state, { payload: { PartStockId, Action } }: PayloadAction<{ PartStockId: number, Action: boolean }>) => {
      const { deliverychallan, impreststock } = state;
      const deliveryIndex = deliverychallan.partstocks.indexOf(PartStockId);
      const imprestIndex = impreststock.PartStockIdList.indexOf(PartStockId);
      if (Action) {
        if (deliveryIndex === -1) deliverychallan.partstocks.push(PartStockId);
        if (imprestIndex === -1) impreststock.PartStockIdList.push(PartStockId);
      } else {
        if (deliveryIndex !== -1) deliverychallan.partstocks.splice(deliveryIndex, 1);
        if (imprestIndex !== -1) impreststock.PartStockIdList.splice(imprestIndex, 1);
      }
      state.BasketList = deliverychallan.partstocks.join(",");
      state.PartStockIdList = deliverychallan.partstocks
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    updateErrorsForDc: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errorsDC = errors;
    },
    clearDeliveryChallan: (state) => {
      state.deliverychallan = {
        ...state.deliverychallan,
        DcTypeId: 0,
        DestinationEmployeeId: null,
        DestinationTenantOfficeId: null,
        DestinationVendorId: null,
        DestinationVendorTypeId: null,
        LogisticsVendorTypeId: null,
        LogisticsReceiptDate: null,
        LogisticsReceiptNumber: "",
        LogisticsVendorId: null,
        ModeOfTransport: null,
        TrackingId: "",
        PartIndentDemandNumber: "",
        DCTypeCode: "",
        DestinationCustomerSiteId: null
      };
    },
    clearImprestStock: (state) => {
      state.impreststock = {
        ...state.impreststock,
        ContractId: 0,
        CustomerId: 0,
        CustomerSiteId: null,
        ServiceEngineerId: null,
        Remarks: "",
        ReservedFrom: `${new Date().toISOString().split('T')[0]}`,
        ReservedTo: ""
      };
    },
    loadPartStockInBasket: (state, { payload: { PartStockInBasket } }: PayloadAction<BucketPartStocksList>) => {
      state.partStockDetails = Some(PartStockInBasket.map((partStockDetail) => ({ partStockDetail })));
    },
    setPartStocks: (state, { payload: data }: PayloadAction<any>) => {
      state.BasketItem = data;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    setDCTypeCode: (state, { payload: code }: PayloadAction<string>) => {
      if (code == "DCN_SITE") {
        state.deliverychallan.DestinationCustomerSiteId = state.impreststock.CustomerSiteId
        state.deliverychallan.DestinationEmployeeId = null;
      } else if (code == "DCN_ENGR") {
        state.deliverychallan.DestinationCustomerSiteId = null;
        state.deliverychallan.DestinationEmployeeId = null;
      }
      state.deliverychallan.DCTypeCode = code;
    },
    setPart: (state, { payload: Id }: PayloadAction<string>) => {
      state.PartId = Id;
    },
    setIsCustomerSite: (state, { payload: status }: PayloadAction<boolean>) => {
      state.impreststock.IsCustomerSite = status;
    },
    setTransfermode: (state, { payload: mode }: PayloadAction<string>) => {
      state.TransferType = mode;
    },
    setReserveLocation: (state, { payload: location }: PayloadAction<string>) => {
      state.ReserveLocation = location;
    },
    setCourierOrNot: (state, { payload: byCourier }: PayloadAction<string>) => {
      state.impreststock.IsbyCourier = byCourier;
    }
  },
});

export const {
  initializeBasketItemList,
  updateBasketItem,
  setDCTypeCode,
  loadPartStockInBasket,
  setPartStocks,
  toggleInformationModalStatus,
  updateField,
  updateErrors,
  setPart,
  setReserveLocation,
  updateErrorsForDc,
  setTransfermode,
  updateImprestStockField,
  clearDeliveryChallan,
  clearImprestStock,
  setIsCustomerSite,
  setCourierOrNot,
} = slice.actions;
export default slice.reducer;
