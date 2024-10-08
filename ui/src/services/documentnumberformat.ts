import axios from "axios";
import { guard, object } from "decoders";
import { dnfListDecoder, DocumentNumberFormatCreate, DocumentNumberFormatEdit, DocumentNumberFormatList, EditNumberFormatResponse, editnumberFormatResponseDecoder, NumberFormatResponse, numberFormatResponseDecoder } from "../types/documentnumberformat";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";

export const getDocumentNumberFormatList = async (search?: number | null, index?: number): Promise<DocumentNumberFormatList> => {
    let url = `documentnumberformat/list?Page=${index}`;
    if (search) {
        url += `&DocumentTypeId=${search}`;
    }
    return guard(dnfListDecoder)((await axios.get(url)).data.data);
}

export async function createDocumentNumberFormat(numberformat: DocumentNumberFormatCreate): Promise<Result<NumberFormatResponse, GenericErrors>> {
    try {
        const { data } = await axios.post("documentnumberformat/create", numberformat);
        return Ok(guard(object({ data: numberFormatResponseDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const EditDocumentNumberFormat = async (city: DocumentNumberFormatEdit): Promise<Result<EditNumberFormatResponse, GenericErrors>> => {
    try {
        const { data } = await axios.put('documentnumberformat/update', city);
        return Ok(guard(object({ data: editnumberFormatResponseDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}