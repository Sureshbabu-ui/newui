import { useTranslation } from 'react-i18next';
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { useState } from 'react';
import CallDetails from './Tabs/CallDetails/CallDetails';
import CustomerDetails from './Tabs/CustomerDetails/CustomerDetails';
import InterimCallInfo from './Tabs/InterimCallInfo/InterimCallInfo';
import ClosureDetails from './Tabs/ClosureDetails/ClosureDetails';
import { store } from '../../../../../state/store';
import { initializeServiceRequestInfo } from './ServiceRequestView.slice';
import AssetDetails from './Tabs/AssetDetails/AssetDetails';
import SLADetails from './Tabs/SLADetails/SLADetails';
import CallStatusReport from '../../CallCordinatorManagement/CallCordinatorView/Submenu/Others/CurrentCallStatus/CurrentCallStatusView/CallStatusView';
import CallStatus from '../../CallCordinatorManagement/CallCordinatorView/Submenu/Others/CallStatus';

export const ServiceRequestView = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);

    const { selectedServiceRequest } = useStore(
        ({ callcentreservicerequestdetails }) => callcentreservicerequestdetails);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    const tabComponents = [
        { component: <CallDetails />, name: "Call Details" },
        { component: <CustomerDetails />, name: "Customer Details" },
        { component: <AssetDetails />, name: "Asset Details" },
        { component: <CallStatus SRId={selectedServiceRequest.Id} />, name: "Call Status" },
        { component: <InterimCallInfo />, name: "Interim Details" },
        { component: <ClosureDetails />, name: "Closure Details" },
        { component: <SLADetails />, name: "SLA Details" },
    ];

    const onModalClose = () => {
        setActiveTab(0);
        store.dispatch(initializeServiceRequestInfo())
    }

    return (
        <ContainerPage>
            <div
                className="modal fade"
                id='ServiceRequestView'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title app-primary-color text-bold">{tabComponents[activeTab].name}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeServiceRequestView'
                                aria-label='Close'
                                onClick={onModalClose}
                            ></button>
                        </div>
                        <div className='mt-3'>
                            <div className="row">
                                {/* Left Side Navigation */}
                                <div className="col-md-2 mb-3 tab-view-height">
                                    <div className="ps-2">
                                        <ul className="nav flex-column">
                                            {tabComponents.map((tab, index) => (
                                                ((index == 4 && selectedServiceRequest.ReviewedBy == null) || (index == 5 && selectedServiceRequest.ClosedBy == null)) ? null :
                                                    <li key={index} className="nav-item">
                                                        <a
                                                            className={activeTab == index ? "nav-link app-primary-color " : "nav-link tab-button-inactive"} role='button'
                                                            onClick={() => handleTabClick(index)}>
                                                            {tab.name}
                                                        </a>
                                                    </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                {/* Right Side Content */}
                                <div className="col-md-10">
                                    {tabComponents[activeTab].component}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ContainerPage>
    )
}