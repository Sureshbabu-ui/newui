import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import axios from "axios";
import { guard, object } from "decoders";
import { BankGuaranteeCreate, BankGuaranteeCreateResult, bankGuaranteeEditDecoder, BankGuaranteeEditDetails, BankGuaranteeEditResponse, BankGuaranteeList, bankGuaranteeCreateResultDecoder, bankGuaranteeListDecoder, bankGuaranteeEditDetailsDecoder, BankGuaranteeEditDetail } from "../types/contractBankGuarantee";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const bankGuaranteeCreate = async (bankGuarantee: BankGuaranteeCreate): Promise<Result<BankGuaranteeCreateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('contract/bankguarantee/create', bankGuarantee);
        return Ok(guard(object({ data: bankGuaranteeCreateResultDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getBankGuaranteeList = async (ContractId: string): Promise<BankGuaranteeList> => {
    return guard(bankGuaranteeListDecoder)((await axios.get(`contract/bankguarantee/list?ContractId=${ContractId}`)).data.data);
}

export const getBankGuaranteeDetails = async (BankGuaranteeId: number): Promise<BankGuaranteeEditDetails> => {
    return guard(bankGuaranteeEditDetailsDecoder)((await axios.get(`contract/bankguarantee/update/details?BankGuaranteeId=${BankGuaranteeId}`)).data.data);
}

export async function editBankGuarantee(bankGuaranteeDetails: BankGuaranteeEditDetail): Promise<Result<BankGuaranteeEditResponse, GenericErrors>> {
    try {
        const { data } = await axios.post('contract/bankguarantee/update', bankGuaranteeDetails);
        return Ok(guard(object({ data: bankGuaranteeEditDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}