import axios from "axios";
import { BucketPartStocksList, PartStockDetailCreate, PartStockDetailCreateResult, PartStockDetailList, PartStockWarrantyCheck, bucketPartStocksListDecoder, partStockDetailCreateResultDecoder, partStockDetailListDecoder, partStockWarrantyCheckDecoder } from "../types/partStockDetail";
import { guard, object } from "decoders";
import settings from "../config/settings";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from "@hqoss/monads";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export const getPartStockDetailList = async (partId: string | null, search?: string, index?: number): Promise<PartStockDetailList> => {
  let url = `partstockdetail/list?Page=${index}`;
  if (partId) {
    url += `&PartId=${partId}`;
  }
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(partStockDetailListDecoder)((await axios.get(url)).data.data);
}

export const partStockDetailCreate = async (PartStockDetail: PartStockDetailCreate): Promise<Result<PartStockDetailCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('partstockdetail/create', PartStockDetail);
    return Ok(guard(object({ data: partStockDetailCreateResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getPartStockDetailsInBasket = async (stockidlist: string): Promise<BucketPartStocksList> => {
  return guard(bucketPartStocksListDecoder)((await axios.get(`partstock/basketlist?PartStockBasket=${stockidlist}`)).data.data);
}

export const getPartStockDetailsForPartIndentRequest = async (ServiceRquestId: number, PartCategoryId: string): Promise<PartStockWarrantyCheck> => {
  return guard(partStockWarrantyCheckDecoder)((await axios.get(`partstock/selected/list/for/partindentrequest?ServiceRequestId=${ServiceRquestId}&PartCategoryIdList=${PartCategoryId}`)).data.data);
}