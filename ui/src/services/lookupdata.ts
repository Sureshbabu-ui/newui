import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard, object } from 'decoders';
import settings from '../config/settings';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import {
  ConfigurationsResponse,
  configurationsResponseDecoder,
  SelectedTableDetails,
  selectedTableDetailsDecoder,
  EntitiesLists,
  entitiesListsDecoder,
  ConfigurationUpdateField,
  LookupDataUpdate,
  UpdateConfigurationResponse,
  updateconfigurationResponseDecoder,
  CreateConfigurationResponse,
  createconfigurationResponseDecoder,
  LookupDataDelete,
  lookupdataDeleteDecoder,
} from '../types/configurations';
import { ConfigurationsUpdateField } from '../types/configuration';

axios.defaults.baseURL = settings.baseApiUrl;

export async function getMasterEntityNames(search?: string, index?: number): Promise<EntitiesLists> {
  let url = `masterdata/get/tablenames?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(entitiesListsDecoder)((await axios.get(url)).data.data);
}

export const getSelectedConfigurations = async (Id: number, search?: string): Promise<SelectedTableDetails> => {
  let url = `masterdata/get/selectedtable?EntityId=${Id}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(selectedTableDetailsDecoder)((await axios.get(url)).data.data);
};

export async function editConfigurations(
  Configurations: ConfigurationsUpdateField
): Promise<Result<ConfigurationsResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('masterdata/update', Configurations);
    return Ok(guard(object({ data: configurationsResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function createLookupData(
  LookupData: ConfigurationUpdateField
): Promise<Result<CreateConfigurationResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('masterdata/create', LookupData);
    return Ok(guard(object({ data: createconfigurationResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function editLookupData(Attribute: LookupDataUpdate ): Promise<Result<UpdateConfigurationResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('masterdata/update', Attribute);
    return Ok(guard(object({ data: updateconfigurationResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function deleteLookupData(Id: number): Promise<Result<LookupDataDelete, GenericErrors>> {
  try {
    const { data } = await axios.put(`masterdata/delete?Id=${Id}`);
    return Ok(guard(object({ data: lookupdataDeleteDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}
