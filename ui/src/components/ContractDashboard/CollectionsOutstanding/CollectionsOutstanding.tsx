import { useEffect, useState } from "react"
import { CollectionMadeResponse, ContractDashboardProps } from "../../../types/contracts/contractDashboard"
import { getContractDashboardCollectionsOutstanding } from "../../../services/contracts/contractDashboard"
import { useTranslation } from "react-i18next"

const CollectionsOutstanding = (props: ContractDashboardProps) => {
    const { t } = useTranslation()
    const [collectionMadeOutstandingResult, setCollectionOutstandingResult] = useState<CollectionMadeResponse>({
        TotalAmount: 0
    })
    const onFilterChange = async () => {
        try {
            const result = await getContractDashboardCollectionsOutstanding(props)
            setCollectionOutstandingResult(result)
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
                    <div className="fw-bold fs-3">{collectionMadeOutstandingResult?.TotalAmount}</div>
                    <div className="text-size-13 text-muted">{t('contract_dashboard_collections_outstanding')}</div>
                </div>
            </div>
    )
}
export default CollectionsOutstanding