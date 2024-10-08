import axios from "axios";
import { guard, object } from "decoders";
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { CreateGRNDetailResponse, CreateGRNResponse, CreateGoodsReceivedNote, GRNDList, GRNDetail, GRNList, GoodsReceivedNoteDetail, GrnTransactionTypes, ListOfPartReturns, createGRNDetailResponseDecoder, createGRNResponseDecoder, grnDetailDecoder, grnListDecoder, grnTransactionTypesDecoder, grndListDecoder, listOfPartReturnsDecoder } from "../types/goodsreceivednote";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getGRNList = async (search?: string, index?: number): Promise<GRNList> => {
  let url = `goodsreceivednote/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(grnListDecoder)((await axios.get(url)).data.data);
}

export async function getGrnTransactionTypes(): Promise<GrnTransactionTypes> {
  return guard(grnTransactionTypesDecoder)((await axios.get(`goodsreceivednote/transactiontypes`)).data.data);
}

export async function GoodsReceivedNoteCreate(grn: CreateGoodsReceivedNote): Promise<Result<CreateGRNResponse, GenericErrors>> {
  try {
    const { data } = await axios.post('goodsreceivednote/create', grn);
    return Ok(guard(object({ data: createGRNResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function GoodsReceivedNoteDetailCreate(grndetaillist: GoodsReceivedNoteDetail[], GrnId: string, IsGrnCompleted: boolean, GrnTransactionTypeCode: string): Promise<Result<CreateGRNDetailResponse, GenericErrors>> {
  try {
    const response = await axios.post(`goodsreceivednote/detail/create?GrnId=${GrnId}&IsGrnCompleted=${IsGrnCompleted}&GrnTransactionTypeCode=${GrnTransactionTypeCode}`, grndetaillist);
    return Ok(guard(object({ data: createGRNDetailResponseDecoder }))(response.data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getGRNDetails(id: any): Promise<GRNDetail> {
  return guard(grnDetailDecoder)((await axios.get(`goodsreceivednote/detail?GoodsReceivedNoteId=${id}`)).data.data);
}

export const getGRNDList = async (GrnId: string, search?: string, index?: number): Promise<GRNDList> => {
  let url = `goodsreceivednote/detail/list?Page=${index}&GrnId=${GrnId}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(grndListDecoder)((await axios.get(url)).data.data);
}

export const getAllPartReturns = async (search?: string, index?: number): Promise<ListOfPartReturns> => {
  let url = `servicerequest/partreturn/list/for/grn?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(listOfPartReturnsDecoder)((await axios.get(url)).data.data);
}