import axios from "axios";
import { TableNameList, ValuesInMasterDataByTable, tableNameListDecoder, valuesInMasterDataByTableDecoder } from "../types/masterData";
import { guard } from "decoders";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

  export const getBaseTableNamesListForDropDown = async (): Promise<TableNameList> => {
    const url = `masterdata/get/basetablenames`;
    return guard(tableNameListDecoder)((await axios.get(url)).data.data);
  }

  export function getValuesInMasterDataByTable(EntityName: string): ValuesInMasterDataByTable {
    const MasterData = localStorage.getItem('bsmasterdata');
    if (MasterData) {
      try {
        const parsedData = JSON.parse(MasterData);

        if (parsedData && typeof parsedData === 'object' && parsedData[EntityName]) {
          return { MasterData: parsedData[EntityName] };
        } else {
          return { MasterData: [] };
        }
      } catch (error) {
        return { MasterData: [] };
      }
    }
  
    return { MasterData: [] };
  }
  