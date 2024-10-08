import axios from 'axios';
import { MultipleLookupDetails, multipleLookupDetailsDecoder } from '../types/lookup';
import { guard } from 'decoders';

export async function getLookupList(): Promise<MultipleLookupDetails> {
    var url = `masterdata/list`;
    return guard(multipleLookupDetailsDecoder)((await axios.get(url)).data.data);
  }