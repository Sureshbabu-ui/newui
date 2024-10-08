import { useEffect, useState } from "react"
import PartIndent from "../PartIndent"
import { AvailablePartList } from "../AvailablePartList/AvailablePartList"
import { PartRequestCreate } from "../PartIndentCart/PartIndentCart"
import { store } from "../../../../../../../../state/store"
import { useStore, useStoreWithInitializer } from "../../../../../../../../state/storeHooks"
import { checkIsPartRequestable } from "../../../../../../../../services/partIndent"
import { initializePartIndentManagement, loadAssetDetails, loadIsPartRequestable, setTabStatus } from "./PartIndentManagement.slice"
import { useTranslation } from "react-i18next"
import { checkForPermission } from "../../../../../../../../helpers/permissions"
import { getAssetDetailsForPartRequest } from "../../../../../../../../services/assets"

const PartIndentManagement = () => {
    const ServiceRequestId = store.getState().callcordinatormanagement.serviceRequestId
    const { t } = useTranslation();

    const onLoad = async () => {
        store.dispatch(initializePartIndentManagement());
        if (ServiceRequestId) {
            try {
                const IsPartRequestable = await checkIsPartRequestable(ServiceRequestId);
                store.dispatch(loadIsPartRequestable(IsPartRequestable.IsPartRequestable))

                const assetinfo = await getAssetDetailsForPartRequest(ServiceRequestId.toString());
                store.dispatch(loadAssetDetails(assetinfo.AssetDetails))
            } catch (error) {
                console.error(error);
            }
        }
    }

    const { error, selectedStatus, AssetDetail } = useStoreWithInitializer(
        ({ partindentmanagement }) => partindentmanagement, onLoad
    );

    const { requestPart } = useStore(({ partindentcart }) => partindentcart);

    interface Tab {
        value: number;
        label: string;
        component: React.ReactNode;
    }

    const partTabs = () => {
        const tabs: Tab[] = [];
        if (checkForPermission('PARTINDENT_CREATE'))
            tabs.push({ value: 1, label: "Parts", component: <AvailablePartList /> })
        if (count > 0)
            tabs.push({ value: 2, label: "Cart", component: <PartRequestCreate /> })
        if (checkForPermission('SERVICE_REQUEST_DETAILS'))
            tabs.push({ value: 3, label: "Part Orders", component: <PartIndent /> })
        return tabs;
    }

    const handleStatusChange = (statusId) => {
        store.dispatch(setTabStatus(statusId))
    };

    const [count, setCount] = useState(0)

    useEffect(() => {
        setCount(requestPart.partInfoList.length)
    }, [requestPart.partInfoList])

    return (<>
        <div className="">

            {error ? (
                <>
                    <div className='text-danger mb-2 mt-4 pt-2'>{error ? t(error) : ""}</div>
                    <PartIndent />
                </>)
                :
                (
                    <div className="row ms-0">
                        <div className="col-md-12 mt-2 ">
                            <div className=" float-end text-center col-md-4 border border-warning">{t('partindent_request_warning_excluded_part_wont_list_here')}</div>
                        </div>
                        <div className="text-size-13 ps-0 pt-2"><strong>{t('partindentrequest_title_asset')}</strong></div>
                        <div className="d-flex flex-row bd-highlight mb-2 px-1 bg-light">
                            <div className="p-2 bd-highlight flex-fillp-2 bd-highlight flex-fill ">
                                <div className="text-muted text-size-13">{t('partindentrequest_asset_category')}</div>
                                <div>{AssetDetail.CategoryName}</div>
                            </div>
                            <div className="p-2 bd-highlight flex-fill ">
                                <div className="text-muted text-size-13">{t('partindentrequest_make')}</div>
                                <div>{AssetDetail.Make}</div>
                            </div>
                            <div className="p-2 bd-highlight flex-fill ">
                                <div className="text-muted text-size-13">{t('partindentrequest_model')}</div>
                                <div>{AssetDetail.ModelName}</div>
                            </div>
                            <div className=" p-2 bd-highlight flex-fill">
                                <div className="text-muted text-size-13">{t('partindentrequest_serialnum')}</div>
                                <div>{AssetDetail.ProductSerialNumber}</div>
                            </div>
                            <div className=" p-2 bd-highlight flex-fill">
                                <div className="text-muted text-size-13">{t('partindentrequest_isunderwarranty')}</div>
                                <div>{AssetDetail.IsWarranty ? t('partindentrequest_iswarranty_no') : t('partindentrequest_iswarranty_no')}</div>
                            </div>
                        </div>
                        <div className="nav nav-tabs mt-2 p-0" id="nav-tab" role="tablist">
                            {partTabs().map((option) => (
                                <button
                                    key={option.value}
                                    className={`nav-link ${selectedStatus === String(option.value) ? "active" : ''} `}
                                    onClick={() => handleStatusChange(String(option.value))}
                                    role="tab"
                                    aria-controls={`status-tab-${option.value}`}
                                    id={`nav-${option.label}-tab`}
                                    data-bs-toggle="tab"
                                    data-bs-target={`#${option.label}`}
                                    type="button"
                                    aria-selected="true"
                                >
                                    <div>{option.label == "Cart" ? `Cart(${count})` : option.label}</div>
                                </button>

                            ))}
                            {selectedStatus && partTabs().find((tab) => String(tab.value) === selectedStatus)?.component}
                        </div>
                    </div>
                )}
        </div>
    </>)
}

export default PartIndentManagement 