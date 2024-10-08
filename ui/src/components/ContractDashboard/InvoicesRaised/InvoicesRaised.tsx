import { useEffect, useState } from "react"
import { ContractDashboardProps, InvoicesRaisedResponse } from "../../../types/contracts/contractDashboard"
import { getContractDashboardInvoicesRaised } from "../../../services/contracts/contractDashboard"
import { useTranslation } from "react-i18next"

const InvoicesRaised = (props: ContractDashboardProps) => {
    const { t } = useTranslation()
    const [InvoicesRaisedResult, setInvoicesRaisedResult] = useState<InvoicesRaisedResponse>({
        TotalCount: 0
    })
    const onFilterChange = async () => {
        try {
            const result = await getContractDashboardInvoicesRaised(props)
            setInvoicesRaisedResult(result)
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
                    <div className="fw-bold fs-3">{InvoicesRaisedResult?.TotalCount}</div>
                    <div className="text-size-13 text-muted">{t('contract_dashboard_invoices_raised')}</div>
                </div>
            </div>
    )
}
export default InvoicesRaised