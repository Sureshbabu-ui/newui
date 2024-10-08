import { useEffect, useState } from "react"
import { ContractDashboardProps, InvoicesPendingResponse } from "../../../types/contracts/contractDashboard"
import { getContractDashboardInvoicesPending } from "../../../services/contracts/contractDashboard"
import { useTranslation } from "react-i18next"

const InvoicesPending = (props: ContractDashboardProps) => {
    const { t } = useTranslation()
    const [InvoicesPendingResult, setInvoicesPendingResult] = useState<InvoicesPendingResponse>({
        TotalCount: 0
    })
    const onFilterChange = async () => {
        try {
            const result = await getContractDashboardInvoicesPending(props)
            setInvoicesPendingResult(result)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        onFilterChange()
    }, [props.TenantRegionId, props.TenantOfficeId, props.DateFrom, props.DateTo])
    return (
            <div className="p-0 mt-1 m-0 ">
                <div className="rounded me-2 p-3 bg-light">
                    <div className="fw-bold fs-3">{InvoicesPendingResult?.TotalCount}</div>
                    <div className=" text-size-13 text-muted">{t('contract_dashboard_invoices_pending')}</div>
                </div>
            </div>
    )
}
export default InvoicesPending