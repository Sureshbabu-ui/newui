import axios from "axios";
import { GoodsissuereceivednoteDetail, IndentDemandDetail, IndentDemandDetailList, IsGIRNCreated, IsPartAllocated, IsPartsIssued, PartIndentDemandLogisticsList, UnprocessedDemandList, goodsissuereceivednoteDetailDecoder, indentDemandDetailDecoder, indentDemandDetailListDecoder, isPartAllocatedDecoder, isPartIssuedDecoder, partIndentDemandList, partIndentDemandListDecoder, partIndentDemandLogisticsListDecoder, unprocessedDemandListDecoder } from "../types/partindentdemand";
import { guard, object } from "decoders";
import { GIRNCreate } from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/GoodsIssuedReceivedNote/GINAllocation/GINAllocatePart.slice";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { IssuePartForDemand } from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandAllocated/PartIndentDemandAllocated.slice";
import { CreateDC } from "../types/deliverychallan";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export async function DemandListCWHAttentionNeeded(index: number, search: string): Promise<partIndentDemandList> {
    var url = `partindentdemand/list/cwh/needed?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(partIndentDemandListDecoder)((await axios.get(url)).data.data);
}

export const GINPartAllocation = async (girndata: GIRNCreate): Promise<Result<IsPartAllocated, GenericErrors>> => {
    try {
        const { data } = await axios.post('goodsissuereceivednote/allocate', girndata);
        return Ok(guard(object({ data: isPartAllocatedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function getClickedPartIndendDemand(Id: string): Promise<IndentDemandDetail> {
    return guard(indentDemandDetailDecoder)((await axios.get(`partindentdemand/details?Id=${Id}`)).data.data);
}

export async function DemandListCWHAttentionNotNeeded(index: number, search: string, IsCompleted: boolean): Promise<PartIndentDemandLogisticsList> {
    var url = `partindentdemand/list/cwh/not/needed?Page=${index}&IsCompleted=${IsCompleted}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(partIndentDemandLogisticsListDecoder)((await axios.get(url)).data.data);
}

export const IssuePartsForDemand = async (issueparts: IssuePartForDemand, Mode: string, deliverychallan?: CreateDC): Promise<Result<IsPartsIssued, GenericErrors>> => {
    try {
        const { data } = await axios.post('goodsissuereceivednote/issue/parts', { issueparts, deliverychallan, Mode });
        return Ok(guard(object({ data: isPartIssuedDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function getClickedGinDetail(Id: string): Promise<GoodsissuereceivednoteDetail> {
    return guard(goodsissuereceivednoteDetailDecoder)((await axios.get(`goodsissuereceivednote/details?PartIndentDemandId=${Id}`)).data.data);
}

export async function getUnProcessedDemands(): Promise<UnprocessedDemandList> {
    return guard(unprocessedDemandListDecoder)((await axios.get(`partindentdemand/unprocessed/list`)).data.data);
}

export const downloadGin = async (GinId: number) => {
    const url = `goodsissuereceivednote/generatepdf?GinId=${GinId}`;
    return await axios.get(url, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function getPartIndendDemandList(Id: string): Promise<IndentDemandDetailList> {
    return guard(indentDemandDetailListDecoder)((await axios.get(`partindentdemand/details/for/po?Id=${Id}`)).data.data);
}