import { Err, Ok, Result } from "@hqoss/monads";
import { ContractDocumentData, ContractDocumentCreation, MultipleContractDocumentList, contractDocumentDataDecoder, multipleContractDocumentListDecoder, ContractDocumentDownload, contractDocumentDownloadDecoder } from "../types/contractDocument";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import axios from "axios";
import { guard, object} from "decoders";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function createContractDocument(ContractDocument: ContractDocumentCreation): Promise<Result<ContractDocumentData, GenericErrors>> {
  try {
    const formData = new FormData()
    formData.append("ContractId", ContractDocument.ContractId)
    formData.append("DocumentDescription", ContractDocument.DocumentDescription ?? '')
    formData.append("DocumentCategoryId", ContractDocument.DocumentCategoryId)
    if (ContractDocument.DocumentFile)
      formData.append("DocumentFile", ContractDocument.DocumentFile)
    const { data } = await axios.post('contract/document/create', formData);
    return Ok(guard(object({ data: contractDocumentDataDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
} 

export async function getContractDocumentList(search?: string, index?: number, id?: string): Promise<MultipleContractDocumentList> {
  let url = `contract/document/list?ContractId=${id}&Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(multipleContractDocumentListDecoder)((await axios.get(url)).data.data);
}

export async function downloadContractDocument(DocumentId: string): Promise<ContractDocumentDownload> {
  const url = `contract/document/download?DocumentId=${DocumentId}`;
  return guard(contractDocumentDownloadDecoder)((await axios.get(url)).data.data);
}