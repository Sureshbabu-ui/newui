import { useTranslation } from "react-i18next";
import BreadCrumb from "../../../../../BreadCrumbs/BreadCrumb";
import { useStore } from "../../../../../../state/storeHooks";
import { checkForPermission } from "../../../../../../helpers/permissions";
import { setActiveTab } from "./DemandListManagement.slice";
import { store } from "../../../../../../state/store";
import PartIndentDemandsCompleted from "./PartIndentDemandsCompleted/PartIndentDemandCompleted";
import PartIndentDemandsPending from "./PartIndentDemandsPending/PartIndentDemandsPending";

const DemandsManagement = () => {
    const { demandsmanagement: { activeTab } } = useStore(({ demandsmanagement }) => ({ demandsmanagement }));
    const { t } = useTranslation();
    return (<>
        {checkForPermission("PARTINDENTDEMAND_LIST_FOR_LOGISTICS") && <>
            <nav className="mx-2 px-1 mt-5 pe-2">
                <div className="nav m-0 nav-tabs mx-2" id="nav-tab" role="tablist">
                    <button
                        className={`nav-link ${activeTab === 'nav-not-allocated' ? 'active' : ''}`}
                        onClick={() => store.dispatch(setActiveTab('nav-not-allocated'))}
                        id="nav-not-allocated-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-not-allocated"
                        type="button"
                        role="tab"
                        aria-controls="nav-not-allocated"
                        aria-selected="false"
                    >
                        {t('demands_management_nav_pending')}
                    </button>
                    <button
                        className={`nav-link ${activeTab === 'nav-allocated' ? 'active' : ''}`}
                        onClick={() => store.dispatch(setActiveTab('nav-allocated'))}
                        id="nav-allocated-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-allocated"
                        type="button"
                        role="tab"
                        aria-controls="nav-allocated"
                        aria-selected="false"
                    >
                        {t('demands_management_nav_completed')}
                    </button>
                </div>
            </nav>
            <div className="tab-content mt-2 m-0" id="nav-tabContent">
                <div className={`tab-pane ${activeTab === 'nav-allocated' ? 'active' : ''}`}
                    id="nav-allocated" role="tabpanel" aria-labelledby="nav-allocated-tab">
                    <div className="mt-2">
                        {activeTab === 'nav-allocated' && (
                            <PartIndentDemandsPending />
                        )}
                    </div>
                </div>
                <div className={`tab-pane ${activeTab === 'nav-not-allocated' ? 'active' : ''}`}
                    id="nav-not-allocated" role="tabpanel" aria-labelledby="nav-not-allocated-tab">
                    <div className="mt-2">
                        {activeTab === 'nav-not-allocated' && (
                            <PartIndentDemandsCompleted />
                        )}
                    </div>
                </div>
            </div>
        </>
        }
    </>
    );
}

export default DemandsManagement;