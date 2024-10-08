import { useEffect } from "react";
import { useStore } from "../../../../state/storeHooks";
import { store } from "../../../../state/store";
import { getCollectionPendingBarGraphDetails } from "../../../../services/barGraphTabMangement";
import { loadCollectionPendingGraphDetails } from "../BarGraphManagement.slice";
import BarGraph from "../BarGraph";
import { formatBarGraphDetails } from "../../../../helpers/formats";

const CollectionPendingBarGraph = () => {
  const { barGraphDetails, collectionPendingBarGraphDetails } = useStore(({ bargraphmanagement }) => bargraphmanagement);

  useEffect(() => {
    getCollectionPendingGraph()
  }, [barGraphDetails.StartDate, barGraphDetails.EndDate, barGraphDetails.RegionId])

  const getCollectionPendingGraph = async () => {
    try {
      const TenantLocationDetails = await getCollectionPendingBarGraphDetails(barGraphDetails.StartDate, barGraphDetails.EndDate, barGraphDetails.RegionId)
      store.dispatch((loadCollectionPendingGraphDetails(TenantLocationDetails)))
    } catch (error) {
      console.error(error);
    }
  }

  return (<BarGraph BarGraphDetails={formatBarGraphDetails(collectionPendingBarGraphDetails, "Code", "Amount")} />)
}

export default CollectionPendingBarGraph