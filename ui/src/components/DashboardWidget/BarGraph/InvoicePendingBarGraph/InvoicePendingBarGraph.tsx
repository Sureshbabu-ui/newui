import { useEffect } from "react";
import { useStore } from "../../../../state/storeHooks";
import { store } from "../../../../state/store";
import { getInvoicePendingBarGraphDetails } from "../../../../services/barGraphTabMangement";
import { loadInvoicePendingGraphDetails } from "../BarGraphManagement.slice";
import BarGraph from "../BarGraph";
import { formatBarGraphDetails } from "../../../../helpers/formats";

const InvoicePendingBarGraph = () => {
  const { barGraphDetails, invoicePendingBarGraphDetails } = useStore(({ bargraphmanagement }) => bargraphmanagement);

  useEffect(() => {
    getInvoicePendingBarGraph()
  }, [barGraphDetails.StartDate, barGraphDetails.EndDate, barGraphDetails.RegionId])

  const getInvoicePendingBarGraph = async () => {
    try {
      const InvoicePendingBarGraphDetails = await getInvoicePendingBarGraphDetails(barGraphDetails.StartDate, barGraphDetails.EndDate, barGraphDetails.RegionId)
      store.dispatch((loadInvoicePendingGraphDetails(InvoicePendingBarGraphDetails)))
    } catch (error) {
      console.error(error);
    }
  }
  return (<BarGraph BarGraphDetails={formatBarGraphDetails(invoicePendingBarGraphDetails, "Code", "InvoicePending")} />)
}
export default InvoicePendingBarGraph