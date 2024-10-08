import { useEffect, useState } from "react"
import { ContractDashboardProps, RevenueRecognitionResponse } from "../../../types/contracts/contractDashboard"
import { getContractDashboardRevenueRecognition } from "../../../services/contracts/contractDashboard"
import { useTranslation } from "react-i18next"

const RevenueRecognition = (props: ContractDashboardProps) => {
    const { t } = useTranslation()
    const [RevenueRecognitionResult, setRevenueRecognitionResult] = useState<RevenueRecognitionResponse>({
        TotalValue: 0
    })
    const onFilterChange = async () => {
        try {
            const result = await getContractDashboardRevenueRecognition(props)
            setRevenueRecognitionResult(result)
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
                <div className="fw-bold fs-3">{RevenueRecognitionResult?.TotalValue}</div>
                <div className="text-size-13 text-muted">{t('contract_dashboard_revenue_recognition')}</div>
            </div>
        </div>
    )
}
export default RevenueRecognition