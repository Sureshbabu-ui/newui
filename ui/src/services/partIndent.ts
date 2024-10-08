import axios from "axios";
import { ContractPartIndentCount, IsPartRequestable, IsSmeReviewed, PartCategoryList, PartCategoryNameList, PartIndentCartDetails, PartIndentCartList, PartIndentDetails, PartIndentDetailsForSme, PartIndentDetailsForSmeList, PartIndentDetailsForSmeView, PartIndentStatusCountResponse, PartRequestEditDetail, PartRequestEditDetails, PartRequestResult, PartRequestStockAvailabilityDetails, PartRequestUpdate, PartSubCategoryNameList, RequestPart, RequestPartIndentList, RequestPartIndentListDecoder, ServiceRequestPartIndentList, ServiceRequestPartIndentListDecoder, contractPartIndentCountDecoder, isPartRequestableDecoder, isSmeReviewedDecoder, partCategoryListDecoder, partCategoryNameListDecoder, partIndentCartListDecoder, partIndentDetailsDecoder, partIndentDetailsForSmeDecoder, partIndentDetailsForSmeListDecoder, partIndentDetailsForSmeViewDecoder, partIndentStatusCountResponseDecoder, partRequestEditDetailsDecoder, partRequestResultDecoder, partRequestStockAvailabilityDetailsDecoder, partRequestUpdateDecoder, partSubCategoryNameListDecoder } from "../types/partIndent";
import { guard, object } from "decoders";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { setupInterceptorsTo } from "../interceptor";
import settings from "../config/settings";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const partIndentList = async (Id: Number): Promise<ServiceRequestPartIndentList> => {
    const url = `servicerequest/partindent/list?ServiceRequestId=${Id}`;
    return guard(ServiceRequestPartIndentListDecoder)((await axios.get(url)).data.data);
}

export async function approvalPartIndentList(index: number, search: string, AssetProductCategoryId?: number): Promise<RequestPartIndentList> {
    var url = `partindent/approval/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    if (AssetProductCategoryId != 0) {
        url += `&AssetProductCategoryId=${AssetProductCategoryId}`;
    }
    return guard(RequestPartIndentListDecoder)((await axios.get(url)).data.data);
}

export const RequestPartCreate = async (partIndent: RequestPart): Promise<Result<PartRequestResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('servicerequest/partindent/create', partIndent );
        return Ok(guard(object({ data: partRequestResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getClickedPartRequestDetails = async (Id: number): Promise<PartIndentDetails[]> => {
    const response = await axios.get(`servicerequest/partindent/detail?PartIndentRequestId=${Id}`);
    const responseData = response.data.data;
    return responseData.map(item => guard(partIndentDetailsDecoder)(item));
}

export const checkIsPartRequestable = async (ServiceRequestId: Number): Promise<IsPartRequestable> => {
    return guard(isPartRequestableDecoder)((await axios.get(`servicerequest/partindent/requestable?ServiceRequestId=${ServiceRequestId}`)).data.data);
}

export const getServiceRequestPartList = async (ContractId: number | null, AssetProductCategoryId?: number, search?: string, searchWith?: string, index?: number, partCategoryId?: number, partSubCategoryId?: number): Promise<PartIndentCartList> => {
    let url = `part/list/by/servicerequest?AssetProductCategoryId=${AssetProductCategoryId}&&ContractId=${ContractId}&&Page=${index}`;
    if (search && searchWith) {
        url += `&Search=${search}&SearchWith=${searchWith}`;
    }
    if (partCategoryId) {
        url += `&partCategoryId=${partCategoryId}`;
    }
    if (partSubCategoryId && partSubCategoryId > 0) {
        url += `&partSubCategoryId=${partSubCategoryId}`;
    }
    return guard(partIndentCartListDecoder)((await axios.get(url)).data.data);
}

export const getServiceRequestPartCategory = async (ServiceRequestId: number): Promise<PartCategoryNameList> => {
    var url = `servicerequest/partcategorylist/byservicerequest?ServiceRequestId=${ServiceRequestId}`;
    return guard(partCategoryNameListDecoder)((await axios.get(url)).data.data);
}

export const getServiceRequestPartSubCategory = async (AssetProductCategoryId?: any, PartCategoryId?: any): Promise<PartSubCategoryNameList> => {
    var url = `servicerequest/partsubcategorylist/byservicerequest?AssetProductCategoryId=${AssetProductCategoryId}&&PartCategoryId=${PartCategoryId}`;
    return guard(partSubCategoryNameListDecoder)((await axios.get(url)).data.data);
}

export const reviewPartIndent = async (approvaldetails): Promise<Result<IsSmeReviewed, GenericErrors>> => {
    try {
        const { data } = await axios.post('partindent/sme/review', approvaldetails);
        return Ok(guard(object({ data: isSmeReviewedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getContractPartIndentCount = async (ContractId: string): Promise<ContractPartIndentCount> => {
    return guard(contractPartIndentCountDecoder)((await axios.get(`partindent/contract/${ContractId}/get/dashboard/count`)).data.data);
}

export const getClickedSmePartRequestDetails = async (Id: number): Promise<PartIndentDetails[]> => {
    const response = await axios.get(`servicerequest/partindent/sme/approved/detail?PartIndentRequestId=${Id}`);
    const responseData = response.data.data;
    return responseData.map(item => guard(partIndentDetailsDecoder)(item));
}

//part Intend details for sme
export const getSelectedPartRequestDetails = async (Id: number): Promise<PartIndentDetailsForSme> => {
    return guard(partIndentDetailsForSmeDecoder)((await axios.get(`partindent/requestdetail?PartIndentRequestId=${Id}`)).data.data);
}

//part Intend details for sme
export const getSelectedPartRequestDetailsForSmeIndentDetails = async (Id: number): Promise<PartIndentDetailsForSmeView> => {
    return guard(partIndentDetailsForSmeViewDecoder)((await axios.get(`partindent/get/detailforsme?PartIndentRequestId=${Id}`)).data.data);
}

// Part Request stock Availability details
export const partRequestStockAvialability = async (Id: number): Promise<PartRequestStockAvailabilityDetails> => {
    return guard(partRequestStockAvailabilityDetailsDecoder)((await axios.get(`partindent/request/stock/availability?PartIndentRequestId=${Id}`)).data.data);
}

// Part Request Update details
export const partRequestUpdateDetails = async (Id: number): Promise<PartRequestEditDetails> => {
    return guard(partRequestEditDetailsDecoder)((await axios.get(`partindent/update/details?PartIndentRequestDetailId=${Id}`)).data.data);
}

//Part Indent request details ALl
export const getAllPartIndentRequestDetails = async (index: number,reqStatus:string): Promise<PartIndentDetailsForSmeList> => {
    var url = `partindent/getalldetails?Page=${index}`;
    if (reqStatus) {
        url += `&reqStatus=${reqStatus}`;
    }
    return guard(partIndentDetailsForSmeListDecoder)((await axios.get(url)).data.data);
}

//Part Indent request details status count
export const getAllPartIndentRequestDetailsStatusCount = async (): Promise<PartIndentStatusCountResponse> => {
    return guard(partIndentStatusCountResponseDecoder)((await axios.get(`partindent/getstatuscount`)).data.data);
}