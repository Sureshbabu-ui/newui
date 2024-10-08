import axios from "axios";
import { PartDetailsForSme, PartStockCreate, PartStockCreateResult, PartStockList, PartStocktDataList, PartStocktDataListForGIN, partDetailForSmeDecoder, partStockCreateResultDecoder, partStockDataListDecoder, partStockListDecoder, partStocktDataListForGINDecoder } from "../types/partStock";
import { guard, object } from "decoders";
import settings from "../config/settings";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from "@hqoss/monads";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export const getPartStockList = async (search?: any,filter?: any, index?: number): Promise<PartStockList> => {
  const {TenantRegionId,TenantOfficeId,PartType,Make,ProductCategory,PartCategory,SubCategory,StockRoom,IsUnderWarranty} = filter;
  let url = `partstock/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }if  (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if  (PartType) {
    url += `&PartType=${PartType}`;
  } if  (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  } if  (Make) {
    url += `&Make=${Make}`;
  } if  (ProductCategory) {
    url += `&ProductCategory=${ProductCategory}`;
  } if  (PartCategory) {
    url += `&PartCategory=${PartCategory}`;
  } if  (SubCategory) {
    url += `&SubCategory=${SubCategory}`;
  } if  (StockRoom) {
    url += `&StockRoom=${StockRoom}`;
  } if  (IsUnderWarranty) {
    url += `&IsUnderWarranty=${IsUnderWarranty}`;
  }
  return guard(partStockListDecoder)((await axios.get(url)).data.data);
}

export const partStockCreate = async (PartStock: PartStockCreate): Promise<Result<PartStockCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('partstock/create', PartStock);
    return Ok(guard(object({ data: partStockCreateResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getSelectedPartStockList = async (PartIndentDemandId: number, stocktypeid: number): Promise<PartStocktDataListForGIN> => {
  return guard(partStocktDataListForGINDecoder)((await axios.get(`partstock/selected/list/for/gin?PartIndentDemandId=${PartIndentDemandId}&StockTypeId=${stocktypeid}`)).data.data);
}

export const getPartStocksForIssue = async (PartIndentDemandId: number): Promise<PartStocktDataList> => {
  return guard(partStockDataListDecoder)((await axios.get(`partstock/list/for/issue?PartIndentDemandId=${PartIndentDemandId}`)).data.data);
}

export const getPartDetailsForSme = async (BarCode: string): Promise<PartDetailsForSme> => {
  return guard(partDetailForSmeDecoder)((await axios.get(`partstock/details/forsme?BarCode=${BarCode}`)).data.data);
}