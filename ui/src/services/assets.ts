import { Err, Ok, Result } from "@hqoss/monads";
import {
  IsAssetCreated, AssetsDetails, AssetDocumentPreview, AssetsCreation, MultipleAssetsList, isAssetCreatedDecoder, assetsDetailsDecoder, multipleAssetsListDecoder,
  SelectedAsset, selectedAssetDecoder, AssetSiteChangeResponse, assetSiteChangeDecoder, SelectedAssetDetail, AssetEditDetails, assetEditDetailsDecoder, SelectedAssetInfo, IsAssetUpdated, isAssetUpdatedDecoder,
  AssetDetailsForSme,
  assetDetailsForSmeDecoder,
  PreAmcPendingAssetsCount,
  preAmcPendingAssetsCountDecoder,
  assetDetailsForSmeOnlyDecoder,
  AssetDetailsForSmeOnly,
  AssetBulkDeactivation,
  assetBulkDeactivationDecoder,
  MultiplePreAmcContractList,
  multiplePreAmcContractListDecoder,
  MultiplePreAmcSiteWiseList,
  multiplePreAmcSiteWiseListDecoder,
  PreAmcAssetUpdateDetail,
  multiplePreAmcPendingAssetListDecoder,
  MultiplePreAmcPendingAssetList,
  AssetFilter,
  SelectedBackToBackAssetDetails,
  BackToBackAssetsDetails,
  backToBackAssetsDetailsDecoder,
  PreAmcDoneAssetsDetails,
  preAmcDoneAssetsDetailsDecoder,
  SelectedPreAmcDoneAssetDetails,
  AssetCreatedResponse,
  assetCreatedResponseDecoder
} from "../types/assets";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import axios from "axios";
import { guard, object } from "decoders";
import { SelectedAssetsWithAssetId } from "../components/Pages/ContractSubMenu/Assets/AssetsView/AssetTransfer/AssetTransfer.slice";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export async function createAssets(Assets: AssetsCreation): Promise<Result<AssetCreatedResponse, GenericErrors>> {
  try {
    const { data } = await axios.post('contract/asset/create', Assets);
    return Ok(guard(object({ data: assetCreatedResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getAssetList(search?: string | null, index?: number, id?: string, AssetFilter?: AssetFilter): Promise<MultipleAssetsList> {
  let url = `contract/asset/list?Page=${index}&ContractId=${id}`;
  if (search) {
    url += `&Search=${search}`;
  }
  if (AssetFilter) {
    url += `&AssetFilters=${JSON.stringify(AssetFilter)}`;
  }
  return guard(multipleAssetsListDecoder)((await axios.get(url)).data.data);
}

export async function uploadAssetDocument(ContractDocument: AssetDocumentPreview): Promise<Result<AssetsDetails, GenericErrors>> {
  try {
    const formData = new FormData()
    formData.append("ContractId", ContractDocument.ContractId ?? "")
    if (ContractDocument.DocumentFile)
      formData.append("file", ContractDocument.DocumentFile)
    const { data } = await axios.post('contract/asset/bulk/upload/preview', formData);
    return Ok(guard(object({ data: assetsDetailsDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function uploadSelectedAssets(Assets: SelectedAssetDetail[], ContractId: string): Promise<Result<AssetCreatedResponse, GenericErrors>> {
  try {
    const AssetDetails = {
      Assets: Assets, ContractId: ContractId
    }
    const { data } = await axios.post('contract/asset/bulk/upload', AssetDetails);
    return Ok(guard(object({ data: assetCreatedResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getClickedAssetDetails(id: string): Promise<SelectedAsset> {
  return guard(selectedAssetDecoder)((await axios.get(`contract/asset/details?ContractAssetId=${id}`)).data.data);
}

export const changeAssetCustomerSite = async (transfer: SelectedAssetsWithAssetId): Promise<Result<AssetSiteChangeResponse, GenericErrors>> => {
  try {
    const { data } = await axios.put('contract/asset/transfer', transfer);
    return Ok(guard(object({ data: assetSiteChangeDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getEditAssetDetails(Id: string): Promise<AssetEditDetails> {
  return guard(assetEditDetailsDecoder)((await axios.get(`contract/asset/edit/details?Id=${Id}`)).data.data);
}

export async function updateAsset(Assets: SelectedAssetInfo): Promise<Result<IsAssetUpdated, GenericErrors>> {
  try {
    const { data } = await axios.put('contract/asset/update', Assets);
    return Ok(guard(object({ data: isAssetUpdatedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getAssetDetailsForPartRequest(Id: string): Promise<AssetDetailsForSme> {
  return guard(assetDetailsForSmeDecoder)((await axios.get(`contract/asset/details/for/partindentrequest?ServiceRequestId=${Id}`)).data.data);
}

// All PreAmc Pending Assets
export async function getAllPreAmcPendingAssetList(search?: string | null, index?: number, CustomerId?: number | null, ContractId?: number | null, CustomerSiteId?: number | null): Promise<MultiplePreAmcPendingAssetList> {
  let url = `contract/asset/getall/preamcpending/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  if (CustomerId) {
    url += `&CustomerId=${CustomerId}`;
  }
  if (ContractId) {
    url += `&ContractId=${ContractId}`;
  }
  if (CustomerSiteId) {
    url += `&CustomerSiteId=${CustomerSiteId}`;
  }
  return guard(multiplePreAmcPendingAssetListDecoder)((await axios.get(url)).data.data);
}

// PreAmc Pending Assets Count
export async function getAllPreAmcPendingAssetCount(): Promise<PreAmcPendingAssetsCount> {
  const url = `contract/asset/getall/preamcpending/count`;
  return guard(preAmcPendingAssetsCountDecoder)((await axios.get(url)).data.data);
}

export async function getAssetDetailsForSme(SerialNumber: string): Promise<AssetDetailsForSmeOnly> {
  return guard(assetDetailsForSmeOnlyDecoder)((await axios.get(`contract/asset/details/forsme?SerialNumber=${SerialNumber}`)).data.data);
}

// Asset Bulk Deactivation
export const ContractAssetBulkDeactivation = async (AssetIdList: string): Promise<Result<AssetBulkDeactivation, GenericErrors>> => {
  try {
    const { data } = await axios.post('contract/asset/bulk/deactiation', { AssetIdList });
    return Ok(guard(object({ data: assetBulkDeactivationDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

// All PreAmc Contratcts
export async function getAllPreAmcContractsList(search?: string | null, index?: number, CustomerId?: number | null, ContractId?: number | null): Promise<MultiplePreAmcContractList> {
  let url = `contract/asset/preamc/contract/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  if (CustomerId) {
    url += `&CustomerId=${CustomerId}`;
  }
  if (ContractId) {
    url += `&ContractId=${ContractId}`;
  }
  return guard(multiplePreAmcContractListDecoder)((await axios.get(url)).data.data);
}

// All PreAmc Sitewise List
export async function getAllPreAmcSiteWiseList(search?: string | null, index?: number, ContractId?: number | null | string, CustomerSiteId?: number | null): Promise<MultiplePreAmcSiteWiseList> {
  let url = `contract/asset/preamc/sitenamewise/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  if (ContractId) {
    url += `&ContractId=${ContractId}`;
  }
  if (CustomerSiteId) {
    url += `&CustomerSiteId=${CustomerSiteId}`;
  }
  return guard(multiplePreAmcSiteWiseListDecoder)((await axios.get(url)).data.data);
}

export async function updatePreAmc(PreAmcDetails: PreAmcAssetUpdateDetail): Promise<Result<IsAssetUpdated, GenericErrors>> {
  try {
    const { data } = await axios.put('contract/asset/preamc/update', PreAmcDetails);
    return Ok(guard(object({ data: isAssetUpdatedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

// BackToBackAsst Upload
export async function uploadBackToBackAsset(file: File | null): Promise<Result<BackToBackAssetsDetails, GenericErrors>> {
  try {
    const formData = new FormData()
    formData.append("ContractId", "")
    if (file)
      formData.append("file", file)
    const { data } = await axios.post('contract/asset/backtoback/bulk/upload/preview', formData);
    return Ok(guard(object({ data: backToBackAssetsDetailsDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function uploadSelectedBackToBackAssets(AssetDetails: SelectedBackToBackAssetDetails[]): Promise<Result<IsAssetCreated, GenericErrors>> {
  try {
    const { data } = await axios.post('contract/asset/backtoback/bulk/upload', { AssetDetails });
    return Ok(guard(object({ data: isAssetCreatedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

// Pre Amc Pending Asset Upload
export async function uploadPreAmcDoneAsset(file: File | null): Promise<Result<PreAmcDoneAssetsDetails, GenericErrors>> {
  try {
    const formData = new FormData()
    formData.append("ContractId", "")
    if (file)
      formData.append("file", file)
    const { data } = await axios.post('contract/asset/preamcdone/bulk/upload/preview', formData);
    return Ok(guard(object({ data: preAmcDoneAssetsDetailsDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function uploadSelectedPreAmcDoneAssets(AssetDetails: SelectedPreAmcDoneAssetDetails[]): Promise<Result<IsAssetCreated, GenericErrors>> {
  try {
    const { data } = await axios.post('contract/asset/preamcdone/bulk/upload', { AssetDetails });
    return Ok(guard(object({ data: isAssetCreatedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}