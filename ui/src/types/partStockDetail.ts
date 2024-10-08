import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface PartStockDetailListDetail {
  Id: number;
  PartCode: string | null;
  PartName: string | null;
  SerialNumber: string | null;
  Rate: number
  OfficeName: string | null;
  RoomName: string | null;
  BinName: string | null;

}

export const partStockDetailListDetailDecoder: Decoder<PartStockDetailListDetail> = object({
  Id: number,
  PartCode: string,
  PartName: string,
  SerialNumber: nullable(string),
  Rate: number,
  OfficeName: string,
  RoomName: nullable(string),
  BinName: nullable(string),
});

export interface PartStockDetailList {
  PartStockDetails: PartStockDetailListDetail[];
  TotalRows: number;
  PerPage: number;
}

export const partStockDetailListDecoder: Decoder<PartStockDetailList> = object({
  PartStockDetails: array(partStockDetailListDetailDecoder),
  TotalRows: number,
  PerPage: number
});

export interface BucketPartStocksList {
  PartStockInBasket: PartStockDetailListDetail[];
}

export const bucketPartStocksListDecoder: Decoder<BucketPartStocksList> = object({
  PartStockInBasket: array(partStockDetailListDetailDecoder)
});

export interface PartStockDetailCreate {
  ProductCategoryId: number | null;
  PartCategoryId: number | null;
  PartId: number | null;
  Quantity: number | null;
}

export interface PartStockDetailCreateResult {
  IsPartStockDetailCreated: Boolean;
}

export const partStockDetailCreateResultDecoder: Decoder<PartStockDetailCreateResult> = object({
  IsPartStockDetailCreated: boolean,
});

export interface PartStockWarrantyCheckList {
 SerialNumber: string | null;
  PartWarrantyExpiryDate: string | null;
  StockType:string;
  InstalledOn:string;
}

export const partStockWarrantyCheckListDecoder: Decoder<PartStockWarrantyCheckList> = object({
  SerialNumber: nullable(string),
  PartWarrantyExpiryDate: nullable(string),
  StockType: string,
  InstalledOn:string
});

export interface PartStockWarrantyCheck {
  SelectPartStocks: PartStockWarrantyCheckList[];
}

export const partStockWarrantyCheckDecoder: Decoder<PartStockWarrantyCheck> = object({
  SelectPartStocks: array(partStockWarrantyCheckListDecoder)
});