import { CustomerList } from './CustomerList/CustomerList';
import { checkForPermission } from '../../../helpers/permissions';
import { useTranslation } from "react-i18next";
import BreadCrumb from '../../BreadCrumbs/BreadCrumb';
import { CustomerPending } from './CustomerPendingList/CustomerPendingList';
import { useStore } from '../../../state/storeHooks';
import { store } from '../../../state/store';
import { setActiveTab } from './CustomerManagement.slice';
import { CustomerDraftList } from './CustomerDraftList/CustomerDraftList';

const CustomerManagement = () => {
    const { activeTab } = useStore(({ customermanagement }) => customermanagement);
    const { t } = useTranslation();
    const breadcrumbItems = [
        { Text: t('breadcrumbs_home'), Link: '/' },
        { Text: t('breadcrumbs_manage_customer') }
    ];

    return (
        <div className='ms-1'><div className="ms-3  my-2">
            <BreadCrumb items={breadcrumbItems} />
        </div>
            {checkForPermission("CUSTOMER_LIST") && <>
                <nav className="m-1 px-1 mt-4 pe-2">
                    <div className="row m-2 mt-4">
                        {/* New customer button */}
                        {checkForPermission("CUSTOMER_CREATE") && <>
                            <div className="col-md-12 float-end p-0 mt-1">
                                <a
                                    className='pseudo-href app-primary-color'
                                    href={"/config/customers/create"}
                                >
                                    <button className='btn app-primary-bg-color text-white float-end'>
                                        {t('customer_management_new_customer')}
                                    </button>
                                </a>
                            </div>
                        </>}
                        {/* New customer button ends */}
                    </div>
                    <div className="nav m-0 nav-tabs mx-2" id="nav-tab" role="tablist">
                        <button
                            className={`nav-link ${activeTab === 'nav-draft' ? 'active' : ''}`}
                            onClick={() => store.dispatch(setActiveTab('nav-draft'))}
                            id="nav-draft-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-draft"
                            type="button"
                            role="tab"
                            aria-controls="nav-draft"
                            aria-selected="false"
                        >
                              Drafts
                        </button>
                        <button
                            className={`nav-link ${activeTab === 'nav-approved' ? 'active' : ''}`}
                            onClick={() => store.dispatch(setActiveTab('nav-approved'))}
                            id="nav-approved-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-approved"
                            type="button"
                            role="tab"
                            aria-controls="nav-approved"
                            aria-selected="true"
                        >
                            {t('customer_management_title_approved_customers_list')}
                        </button>
                        <button
                            className={`nav-link ${activeTab === 'nav-pending' ? 'active' : ''}`}
                            onClick={() => store.dispatch(setActiveTab('nav-pending'))}
                            id="nav-pending-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-pending"
                            type="button"
                            role="tab"
                            aria-controls="nav-pending"
                            aria-selected="false"
                        >
                            {t('customer_management_title_pending_requests')}
                        </button>
                    </div>
                </nav>
                <div className="tab-content mt-3 m-0" id="nav-tabContent">
                    <div className={`tab-pane ${activeTab === 'nav-approved' ? 'active' : ''}`} id="nav-approved" role="tabpanel" aria-labelledby="nav-approved-tab">
                        <div className="mt-2">
                            {activeTab === 'nav-approved' && (
                                <CustomerList />
                            )}
                        </div>
                    </div>
                    <div className={`tab-pane ${activeTab === 'nav-pending' ? 'active' : ''}`}
                        id="nav-pending" role="tabpanel" aria-labelledby="nav-pending-tab">
                        <div className="mt-2">
                            {activeTab === 'nav-pending' && (
                                <CustomerPending />
                            )}
                        </div>
                    </div>
                    <div className={`tab-pane ${activeTab === 'nav-draft' ? 'active' : ''}`}
                        id="nav-draft" role="tabpanel" aria-labelledby="nav-draft-tab">
                        <div className="mt-2">
                            {activeTab === 'nav-draft' && (
                               <CustomerDraftList/>
                            )}
                        </div>
                    </div>
                </div>
            </>}
        </div >
    );
}

export default CustomerManagement;