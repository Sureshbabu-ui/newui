import { useEffect } from "react";
import { useStore } from "../../../../state/storeHooks";
import { store } from "../../../../state/store";
import { getContractBarGraphDetails } from "../../../../services/barGraphTabMangement";
import { loadContractBarGraphDetails } from "../BarGraphManagement.slice";
import BarGraph from "../BarGraph";
import { formatBarGraphDetails } from "../../../../helpers/formats";

export function ContractBarGraph() {
  const { barGraphDetails, contractBarGraphDetails } = useStore(({ bargraphmanagement }) => bargraphmanagement);

  useEffect(() => {
    getContractBarGraph()
  }, [barGraphDetails.StartDate, barGraphDetails.EndDate, barGraphDetails.RegionId])

  const getContractBarGraph = async () => {
    try {
      const TenantLocationDetails = await getContractBarGraphDetails(barGraphDetails.StartDate, barGraphDetails.EndDate, barGraphDetails.RegionId)
      store.dispatch((loadContractBarGraphDetails(TenantLocationDetails)))
    } catch (error) {
      console.error(error);
    }
  }

  return (<BarGraph BarGraphDetails={formatBarGraphDetails(contractBarGraphDetails,"Code","ContractCount")} />)
}