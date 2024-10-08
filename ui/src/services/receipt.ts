import axios from 'axios';
import { guard } from 'decoders';
import { ReceiptList, receiptListDecoder,   ReceiptViewDetails, receiptViewDetailsDecoder } from '../types/receipt';

export const getReceiptList=async(search: string, page: Number): Promise<ReceiptList> =>{
  var url = `receipt/list?Page=${page}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(receiptListDecoder)((await axios.get(url)).data.data);
}

export const getReceiptDetails = async (ReceiptId: string): Promise<ReceiptViewDetails> => {
  const url = `receipt/get/details?ReceiptId=${ReceiptId}`;
 return guard(receiptViewDetailsDecoder)((await axios.get(url)).data.data); 
}