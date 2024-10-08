import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import axios from "axios";
import { guard, object } from "decoders";
import { AssetSitewiseSummaryList, AssetSummaryCreation, AssetsSummary, IsAssetSummaryCreated, MultipleAssetsSummaryList, ProductCategoryPartnotCoveredList, SelectedAssetSummary, SelectedPartnotCoveredList, SummaryEditResponse, assetSitewiseSummaryListDecoder, isAssetSummaryCreatedDecoder, multipleAssetsSummaryDecoder, productCategoryPartnotCoveredListDecoder, selectedAssetsSummaryDecoder, selectedPartnotCoveredListDecoder, summaryEditResponseDecoder } from "../types/assetsSummary";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function createAssetSummary(Assets: AssetSummaryCreation): Promise<Result<IsAssetSummaryCreated, GenericErrors>> {
  try {
    const { data } = await axios.post('contract/assetsummary/create', Assets);
    return Ok(guard(object({ data: isAssetSummaryCreatedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getAssetSummaryList(search?: string|null, index?: number, id?: string): Promise<MultipleAssetsSummaryList> {
  let url = `contract/assetsummary/list?Page=${index}&ContractId=${id}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(multipleAssetsSummaryDecoder)((await axios.get(url)).data.data);
}

export async function getContractProductCategoryPartnotCovered(Id: number|string): Promise<ProductCategoryPartnotCoveredList> {
  return guard(productCategoryPartnotCoveredListDecoder)((await axios.get(`contract/assetsummary/productcategorypartnotcovered?ProductCategoryId=${Id}`)).data.data);
}

export async function getSelectedPartsNotCovered(ProductCategoryId: string, ContractId: string): Promise<SelectedPartnotCoveredList> {
  return guard(selectedPartnotCoveredListDecoder)((await axios.get(`contract/assetsummary/selected/partnotcovered?ProductCategoryId=${ProductCategoryId}&ContractId=${ContractId}`)).data.data);
}

export async function getSelectedAssetSummary(Id: number): Promise<SelectedAssetSummary> {
  return guard(selectedAssetsSummaryDecoder)((await axios.get(`contract/assetsummary/details?Id=${Id}`)).data.data);
}

export async function editAssetSummary(summary: AssetsSummary): Promise<Result<SummaryEditResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('contract/assetsummary/update', summary);
    return Ok(guard(object({ data: summaryEditResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getSitewiseAssetSummaryList(id: string): Promise<AssetSitewiseSummaryList> {
  const url = `contract/assetsummary/sitewise/list?ContractId=${id}`;
  return guard(assetSitewiseSummaryListDecoder)((await axios.get(url)).data.data);
}