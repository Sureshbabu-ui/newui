import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface PartStockListDetail {
  Id: number | null;
  PartCode: string | null;
  PartName: string | null;
  Quantity: number;
  UpdatedOn: string | null;
}

export const partStockListDetailDecoder: Decoder<PartStockListDetail> = object({
  Id: number,
  PartCode: string,
  PartName: string,
  Quantity: number,
  UpdatedOn: nullable(string),
});

export interface PartStockList {
  PartStocks: PartStockListDetail[];
  TotalRows: number;
  PerPage: number;
}

export const partStockListDecoder: Decoder<PartStockList> = object({
  PartStocks: array(partStockListDetailDecoder),
  TotalRows: number,
  PerPage: number
});

export interface PartStockCreate {
  ProductCategoryId: number | null;
  PartCategoryId: number | null;
  PartId: number | null;
  Quantity: number | null;
}

export interface PartStockCreateResult {
  IsPartStockCreated: Boolean;
}

export const partStockCreateResultDecoder: Decoder<PartStockCreateResult> = object({
  IsPartStockCreated: boolean,
});

export interface SelectedPartStockList {
  PartStockId: number;
  PartCode: string;
  PartName: string;
  SerialNumber: string;
  Rate: number;
  RoomName: string | null;
  BinName: string | null;
  TenantOffice: string;
  PartWarrantyExpiryDate: string | null;
  StockType: string;
}

export const selectedpartStockListDecoder: Decoder<SelectedPartStockList> = object({
  PartStockId: number,
  PartCode: string,
  PartName: string,
  SerialNumber: string,
  Rate: number,
  RoomName: nullable(string),
  BinName: nullable(string),
  TenantOffice: string,
  PartWarrantyExpiryDate: nullable(string),
  StockType: string,
});

export interface PartStocktDataList {
  SelectPartStocks: SelectedPartStockList[];
}

export const partStockDataListDecoder: Decoder<PartStocktDataList> = object({
  SelectPartStocks: array(selectedpartStockListDecoder),
});

export interface PartStockInfo {
  PartStockId: number;
}

export interface PartStockFilter {
  TenantRegionId: number;
  TenantOfficeId: number;
  PartType: number;
  Make: number;
  ProductCategory: number;
  PartCategory: number;
  SubCategory: number;
  StockRoom: number;
  IsUnderWarranty: boolean;
}
export interface PartStockListForGin {
  PartStockId: number;
  PartCode: string;
  PartName: string;
  SerialNumber: string;
  Rate: number;
  RoomName: string | null;
  BinName: string | null;
  TenantOffice: string;
  PartWarrantyExpiryDate: string | null;
  StockType: string;
  AgingInDays: number;
}

export const partStockListForGinDecoder: Decoder<PartStockListForGin> = object({
  PartStockId: number,
  PartCode: string,
  PartName: string,
  SerialNumber: string,
  Rate: number,
  RoomName: nullable(string),
  BinName: nullable(string),
  TenantOffice: string,
  PartWarrantyExpiryDate: nullable(string),
  StockType: string,
  AgingInDays: number
});

export interface PartStocktDataListForGIN {
  SelectPartStocks: PartStockListForGin[];
}

export const partStocktDataListForGINDecoder: Decoder<PartStocktDataListForGIN> = object({
  SelectPartStocks: array(partStockListForGinDecoder),
});

export interface PartDetails {
  TenantOffice?: string | null;
  Barcode?: string | null;
  DemandNumber?: string | null;
  WarrantyPeriod?: string | null;
  WorkOrderNumber?: string | null;
  PartWarrantyExpiryDate?: string | null;
  PoNumber?: string | null;
  PoDate?: string | null;
  PartCode?: string | null;
  PartType?: string | null;
  Description?: string | null;
  Vendor?: string | null;
  GrnNumber?: string | null;
  PartValue?: number | null;
}

export const partDetailsDecoder: Decoder<PartDetails> = object({
  TenantOffice: nullable(string),
  Barcode: nullable(string),
  DemandNumber: nullable(string),
  WarrantyPeriod: nullable(string),
  WorkOrderNumber: nullable(string),
  PartWarrantyExpiryDate: nullable(string),
  PoNumber: nullable(string),
  PoDate: nullable(string),
  PartCode: nullable(string),
  PartType: nullable(string),
  Description: nullable(string),
  Vendor: nullable(string),
  GrnNumber: nullable(string),
  PartValue: nullable(number)
});

export interface PartDetailsForSme {
  PartDetail: PartDetails;
}

export const partDetailForSmeDecoder: Decoder<PartDetailsForSme> = object({
  PartDetail: partDetailsDecoder,
});

export interface BarcodeReport {
  DateFrom: string;
  DateTo: string;
  TenantRegionId: number;
  TenantOfficeId: number;
  IsUnderWarranty: boolean | null;
}

export interface ConsumptionSummaryReport {
  DateFrom: string;
  DateTo: string;
  TenantRegionId: number;
  TenantOfficeId: number;
}

export interface ConsumptionReport {
  DateFrom: string;
  DateTo: string;
  TenantRegionId: number;
  TenantOfficeId: number;
}