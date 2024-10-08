import { useEffect, useState } from "react"
import { getContractDashboardCollectionMade } from '../../../services/contracts/contractDashboard';
import { CollectionMadeResponse, ContractDashboardProps } from '../../../types/contracts/contractDashboard';
import { useTranslation } from "react-i18next";
import { startPreloader, stopPreloader } from "../../Preloader/Preloader.slice";
import { store } from "../../../state/store";

const CollectionsMade = (props: ContractDashboardProps) => {
    const { t } = useTranslation();
    const [collectionMadeResult, setCollectionMadeResult] = useState<CollectionMadeResponse>({ TotalAmount: 0 })
    const onFilterChange = async () => {
        store.dispatch(startPreloader())
        try {
            const result = await getContractDashboardCollectionMade(props)
            setCollectionMadeResult(result)
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }
    useEffect(() => {
        onFilterChange()
    }, [props.TenantRegionId, props.TenantOfficeId, props.DateFrom, props.DateTo])

    return (
        <div className="p-0 mt-1 m-0 ">
            <div className="rounded me-2 p-3 bg-light">
                <div className="fw-bold fs-3">{collectionMadeResult?.TotalAmount} </div>
                <div className="text-size-13 text-muted">{t('contract_dashboard_collections_made')}</div>
            </div>
        </div>
    )
}
export default CollectionsMade
