import { useEffect } from "react";
import { useStore } from "../../../../state/storeHooks";
import { store } from "../../../../state/store";
import BarGraph from "../BarGraph";
import { getCollectionMadeBarGraphDetails } from "../../../../services/barGraphTabMangement";
import { loadCollectionMadeGraphDetails } from "../BarGraphManagement.slice";
import { formatBarGraphDetails } from "../../../../helpers/formats";

const CollectionMadeGraph = () => {
  const { barGraphDetails, collectionMadeBarGraphDetails } = useStore(({ bargraphmanagement }) => bargraphmanagement);

  useEffect(() => {
    getCollectionMadeGraph()
  }, [barGraphDetails.StartDate, barGraphDetails.EndDate, barGraphDetails.RegionId])

  const getCollectionMadeGraph = async () => {
    try {
      const TenantLocationDetails = await getCollectionMadeBarGraphDetails(barGraphDetails.StartDate, barGraphDetails.EndDate, barGraphDetails.RegionId)
      store.dispatch((loadCollectionMadeGraphDetails(TenantLocationDetails)))
    } catch (error) {
      console.error(error);
    }
  }

  return (<BarGraph BarGraphDetails={formatBarGraphDetails(collectionMadeBarGraphDetails, "Code", "Amount")} />)
}

export default CollectionMadeGraph