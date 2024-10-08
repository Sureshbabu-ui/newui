import { useEffect, useState } from "react"
import { ContractDashboardProps, ContractsBookedResponse } from "../../../types/contracts/contractDashboard"
import { getContractDashboardContractsBooked } from "../../../services/contracts/contractDashboard"
import { useTranslation } from "react-i18next"

const ContractsBooked = (props: ContractDashboardProps) => {
    const { t } = useTranslation()
    const [contractsBookedResult, setContractsBookedResult] = useState<ContractsBookedResponse>({
        TotalCount: 0
    })
    const onFilterChange = async () => {
        try {
            const result = await getContractDashboardContractsBooked(props)
            setContractsBookedResult(result)
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
                <div className="fw-bold fs-3">{contractsBookedResult?.TotalCount}</div>
                <div className=" text-size-13 text-muted">{t('contract_dashboard_contracts_booked')}</div>
            </div>
        </div>
    )
}
export default ContractsBooked