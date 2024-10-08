import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { changePage, initializeCallCordinatorManagement, loadSelectedServiceRequest, loadServiceRequestCounts, loadServiceRequests, setActiveTab, setFilter, setSearch, setSelectedStatus, setServiceRequestId } from './CallCordinatorManagement.slice'
import Select from 'react-select';
import { checkForPermission } from "../../../../helpers/permissions";
import { store } from "../../../../state/store";
import { getCallCordinatorCallDetails, getCallCordinatorServiceRequestCounts, getCallCordinatorServiceRequestList } from "../../../../services/serviceRequest";
import { useStore } from "../../../../state/storeHooks";
import { ContainerPage } from "../../../ContainerPage/ContainerPage";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";
import { formatDateTime } from "../../../../helpers/formats";
import CallCordinatorHome from "./CallCordinatorView/CallCordinatorHome";
import AssignEngineer from "./CallCordinatorView/Submenu/AssignEngineer/AssignEngineer";
import PartIndentManagement from "./CallCordinatorView/Submenu/PartIndent/PartIndentManagement/PartIndentManagement";
import PreviousTickets from "./CallCordinatorView/Submenu/PreviousTickets/PreviousTickets";
import { setServiceRequestDetail } from "./CallCordinatorView/Submenu/CallClosure/CallClosure.slice";
import { CallClosure } from "./CallCordinatorView/Submenu/CallClosure/CallClosure";
import AssetDetails from "./CallCordinatorView/Submenu/AssetDetails/AssetDetails";
import CallStatus from "./CallCordinatorView/Submenu/Others/CallStatus";
import { CallCordinatorTableView } from "./CallCordinatorTableView/CallCordinatorTableView";
import { Link, NavLink } from "react-router-dom";
import { getAllPreAmcPendingAssetCount } from "../../../../services/assets";

export const CallCordinatorManagement = () => {
    const { t } = useTranslation();
    const { serviceRequests, search, searchWith, selectedServiceRequest, activeTab, selectedStatus } = useStore(({ callcordinatormanagement }) => (callcordinatormanagement));
    const [selectedFilter, setSelectedFilter] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [serviceRequestView, setServiceRequestView] = useState("SRV_GRID");
    const [preAmcPendingAsset, setPreAmcPendingAsset] = useState(0);
    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        store.dispatch(initializeCallCordinatorManagement());
        try {
            const CurrentPage = store.getState().callcordinatormanagement.currentPage;
            if (checkForPermission("SERVICEREQUEST_CALLCORDINATOR_VIEW")) {
                const ServiceRequests = await getCallCordinatorServiceRequestList(selectedStatus, CurrentPage);
                store.dispatch(loadServiceRequests(ServiceRequests));
                const serviceRequestCounts = await getCallCordinatorServiceRequestCounts(selectedStatus)
                store.dispatch(loadServiceRequestCounts(serviceRequestCounts));
                const { PreAmcPendingAssetsCount } = await getAllPreAmcPendingAssetCount()
                setPreAmcPendingAsset(PreAmcPendingAssetsCount)
            }
            store.dispatch(setSelectedStatus("UNASSIGNED"))
        } catch (error) {
            console.error(error);
        }
    }

    const searchFilter = async (selectedOption: any) => {
        setSelectedFilter(selectedOption);
        store.dispatch(setFilter({ Value: selectedOption.value, Name: "searchWith" }));
    };

    const filterCallList = async (event: any) => {
        store.dispatch(changePage(1))
        try {
            const CurrentPage = store.getState().callcordinatormanagement.currentPage;
            const ServiceRequests = await getCallCordinatorServiceRequestList(selectedStatus, CurrentPage, search, searchWith);
            store.dispatch(loadServiceRequests(ServiceRequests));
            const serviceRequestCounts = await getCallCordinatorServiceRequestCounts(selectedStatus)
            store.dispatch(loadServiceRequestCounts(serviceRequestCounts));
        } catch (error) {
            console.error(error);
        }
    }

    const handleCallStatusFilter = async (statusCodes: string) => {
        store.dispatch(initializeCallCordinatorManagement())
        store.dispatch(setActiveTab(0))
        store.dispatch(setSelectedStatus(statusCodes))
        try {
            const CurrentPage = store.getState().callcordinatormanagement.currentPage;
            if (checkForPermission("SERVICEREQUEST_CALLCORDINATOR_VIEW")) {
                const ServiceRequests = await getCallCordinatorServiceRequestList(statusCodes, CurrentPage, store.getState().callcordinatormanagement.search, searchWith);
                store.dispatch(loadServiceRequests(ServiceRequests));
                const serviceRequestCounts = await getCallCordinatorServiceRequestCounts(statusCodes)
                store.dispatch(loadServiceRequestCounts(serviceRequestCounts));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value === "") {
            const CurrentPage = store.getState().callcordinatormanagement.currentPage;
            const Search = store.getState().callcordinatormanagement.search;
            store.dispatch(setSearch(""))
            const ServiceRequests = await getCallCordinatorServiceRequestList(selectedStatus, CurrentPage, Search, searchWith);
            store.dispatch(loadServiceRequests(ServiceRequests));
            const serviceRequestCounts = await getCallCordinatorServiceRequestCounts(selectedStatus)
            store.dispatch(loadServiceRequestCounts(serviceRequestCounts));
        }
    };

    const optionsTwo = [
        { value: 'WorkOrderNumber', label: 'Work Order Number' },
        { value: 'SerialNumber', label: 'Serial Number' },
        { value: 'CustomerName', label: 'Customer Name' },
        { value: 'EndUserPhone', label: 'Contact Phone Number' }
    ]

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_calls' }
    ]

    const handleServiceRequest = async (Id: number) => {
        store.dispatch(setActiveTab(0))
        try {
            if (checkForPermission("SERVICEREQUEST_CALLCORDINATOR_VIEW")) {
                const serviceRequestDetails = await getCallCordinatorCallDetails(Id);
                store.dispatch(loadSelectedServiceRequest(serviceRequestDetails));
            }
        } catch (error) {
            console.error(error);
        }
        store.dispatch(setServiceRequestId(Id))
    }

    const tabComponents = [
        { component: <AssetDetails />, name: "Asset Details" },
        { component: <AssignEngineer />, name: "Assignment" },
        { component: <PartIndentManagement />, name: "Part" },
        { component: <PreviousTickets />, name: "Previous Requests" },
        { component: <CallStatus SRId={selectedServiceRequest.Id} />, name: "Others" }
    ];
    const handleTabClick = (index) => {
        store.dispatch(setActiveTab(index))
    };

    const passServiceRequestId = async (Id: number) => {
        store.dispatch(setServiceRequestDetail(Id));
    }

    return (
        <ContainerPage >
            <BreadCrumb items={breadcrumbItems} />
            <div className="row mt-1">
                <div className="col-md-5">
                    <div className="row ms-1 me-0">
                        <div className="input-group px-1 py-0">
                            <div className="me-2 text-size-13 " >
                                <Select
                                    options={optionsTwo}
                                    value={optionsTwo && optionsTwo.find(option => option.value == searchWith) || null}
                                    onChange={searchFilter}
                                    isSearchable
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <input
                                type='search'
                                className="form-control custom-input"
                                value={search}
                                placeholder={
                                    selectedFilter && `${t('servicerequest_list_placeholder_searchwith')} ${t(selectedFilter.label)}`
                                }
                                onChange={addData}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        filterCallList(e);
                                    }
                                }}
                            />
                            <button className="btn app-primary-bg-color text-white float-end  fs-6" type="button" onClick={filterCallList}>
                                {t('callcordinator_management_button_search')}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="row d-flex ">
                        <div className={`col-md-3 border ${selectedStatus == "UNASSIGNED" && "border-4"} text-size-13 text-center me-1 p-1`} onClick={() => handleCallStatusFilter('UNASSIGNED')} role="button">
                            <div className="text-center mt-1 text-size-13">{t('callcordinator_management_tab_unassigned')}</div>
                        </div>
                        <div className={`col-md-3 border ${selectedStatus == "ASSIGNED" && "border-4"} text-size-13 text-center me-1 p-1`} onClick={() => handleCallStatusFilter('ASSIGNED')} role="button">
                            <div className="text-center mt-1">{t('callcordinator_management_tab_assigned')}</div>
                        </div>
                        <div className={`col-md-3 border ${selectedStatus == "CLOSED" && "border-4"} text-size-13 text-center p-1`} onClick={() => handleCallStatusFilter('CLOSED')} role="button">
                            <div className="text-center mt-1">{t('callcordinator_management_tab_closed')}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 pe-0 d-flex flex-row justify-content-end">
                    <Link to='/calls/callcoordinator/preamcpending'>
                        <button type="button" className="nav-link position-relative me-3 mt-1">
                            <span className="material-symbols-outlined fs-2 text-dark" data-toggle="tooltip" data-placement="left" title={'PreAMC Pending'}>
                                engineering
                            </span>
                            <span className="position-absolute mt-2 start-100 translate-middle badge rounded-pill bg-danger">
                                <small>{preAmcPendingAsset}</small>
                            </span>
                        </button>
                    </Link>
                    <div className="d-flex flex-column align-items-center mb-2" onClick={() => setServiceRequestView("SRV_GRID")}>
                        <span className="material-symbols-outlined app-primary-color fs-3" role="button">
                            grid_view
                        </span>
                        <span className={`fw-3 app-primary-color text-size-10 ${serviceRequestView == "SRV_GRID" && "nav-link-border-bottom"}`} role="button">Grid</span>
                    </div>
                    <div className="d-flex flex-column align-items-center mb-2 ms-1" onClick={() => setServiceRequestView("SRV_TABLE")}>
                        <span className="material-symbols-outlined app-primary-color fs-3" role="button">
                            table_view
                        </span>
                        <span className={`fw-3 app-primary-color text-size-10 ${serviceRequestView == "SRV_TABLE" && "nav-link-border-bottom"}`} role="button">Table</span>
                    </div>
                </div>
            </div>
            {serviceRequestView === "SRV_GRID" ? (
                <div className="row mt-2">
                    <div className="col-md-5 ">
                        <div className="mb-2">
                            {serviceRequests.match({
                                none: () => <>{t('service_request_list_loading')}</>,
                                some: (ServiceRequests) =>
                                    <div>
                                        <div className="row m-0 px-2">
                                            {ServiceRequests.map(({ serviceRequest }, index) => (
                                                <div className="m-1 bg-light" onClick={() => handleServiceRequest(serviceRequest.Id)} role="button" key={index}>
                                                    <div className="row text-muted text-size-13 mt-2">
                                                        <div className="col-md-6 d-flex justify-content-start">{serviceRequest.WorkOrderNumber}</div>
                                                        <div className="col-md-6 d-flex justify-content-end">{formatDateTime(serviceRequest.WorkOrderCreatedOn)}</div>
                                                    </div>
                                                    <div className="text-size-13 fw-bold">{serviceRequest.CustomerReportedIssue}</div>
                                                    <div className="text-size-13">{serviceRequest.CustomerName}</div>
                                                    <div className="text-size-13 mb-2">{serviceRequest.Status}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                            })}
                        </div>
                    </div>
                    <div className="col-md-7">
                        {selectedServiceRequest.CustomerReportedIssue ? (
                            <>
                                <div>
                                    {/* call deatils */}
                                    {!isExpanded && (<>
                                        <div className="text-muted text-size-13 mt-2">{selectedServiceRequest.WorkOrderNumber}</div>
                                        <div className="fw-bold"><small> {selectedServiceRequest.CustomerReportedIssue}</small></div>
                                        <div>{selectedServiceRequest.CallCenterRemarks && selectedServiceRequest.CallCenterRemarks}</div>
                                        <div className="text-muted text-size-13">{selectedServiceRequest.WorkOrderCreatedOn && formatDateTime(selectedServiceRequest.WorkOrderCreatedOn)}</div>
                                        <a className="float-end mb-2" onClick={() => setIsExpanded(!isExpanded)} role="button">{isExpanded ? "Hide" : "More"}</a>
                                    </>)}
                                    {isExpanded && (
                                        // expanded call details
                                        <>
                                            <h6 className='mt-3 fw-bold app-primary-color'>{t('callcordinator_calldetails_title_call_details')}</h6>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_wono')}</label>
                                                        <div>{selectedServiceRequest.WorkOrderNumber}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_wonocreatedon')}</label>
                                                        <div>{selectedServiceRequest.WorkOrderCreatedOn && formatDateTime(selectedServiceRequest.WorkOrderCreatedOn)}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_caseid')}</label>
                                                        <div>{selectedServiceRequest.CaseId}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('callcordinator_calldetails_callstatus')}</label>
                                                        <div >{selectedServiceRequest.CallStatus}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('callcordinator_calldetails_calltype')}</label>
                                                        <div >{selectedServiceRequest.CallType}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_reportedempname')}</label>
                                                        <div>{selectedServiceRequest.CreatedBy}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('callcordinator_calldetails_customercontacttype')}</label>
                                                        <div >{selectedServiceRequest.CustomerContactType}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_enduserphone')}</label>
                                                        <div>{selectedServiceRequest.EndUserPhone}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('callcordinator_calldetails_incidentid')}</label>
                                                        <div >{selectedServiceRequest.IncidentId ? selectedServiceRequest.IncidentId : "---"}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('callcordinator_calldetails_ticket_number')}</label>
                                                        <div >{selectedServiceRequest.TicketNumber ? selectedServiceRequest.TicketNumber : "---"}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('callcordinator_calldetails_caserepempname')}</label>
                                                        <div >{selectedServiceRequest.CaseReportedCustomerEmployeeName}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('callcordinator_calldetails_casereportedon')}</label>
                                                        <div >{formatDateTime(selectedServiceRequest.CaseReportedOn)}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('callcordinator_calldetails_optedforremotesupport')}</label>
                                                        <div >{selectedServiceRequest.OptedForRemoteSupport ? "yes" : "No"}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('callcentrecalldetails_label_optedforremotesupportreason')}</label>
                                                        <div >{selectedServiceRequest.OptedForRemoteSupport ? "---" : selectedServiceRequest.RemoteSupportNotOptedReason}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_customerrepissue')}</label>
                                                        <div>{selectedServiceRequest.CustomerReportedIssue}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_callcentreremarks')}</label>
                                                        <div>{selectedServiceRequest.CallCenterRemarks ? selectedServiceRequest.CallCenterRemarks : "---"}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_customerserviceaddress')}</label>
                                                        <div>{selectedServiceRequest.CustomerServiceAddress ? selectedServiceRequest.CustomerServiceAddress : "---"}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_endusername')}</label>
                                                        <div>{selectedServiceRequest.EndUserName ? selectedServiceRequest.EndUserName : "---"}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_enduseremail')}</label>
                                                        <div>{selectedServiceRequest.EndUserEmail}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h6 className='mt-4 fw-bold app-primary-color'>{t('callcordinator_calldetails_title_customer_details')}</h6>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_contractnumber')}</label>
                                                        <div >{selectedServiceRequest.ContractNumber}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_customername')}</label>
                                                        <div >{selectedServiceRequest.CustomerName}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_customercode')}</label>
                                                        <div >{selectedServiceRequest.CustomerCode}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_customersiteaddress')}</label>
                                                        <div >{selectedServiceRequest.SiteAddress}</div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <label className="form-text">{t('callcordinator_calldetails_customersitename')}</label>
                                                        <div >{selectedServiceRequest.CustomerSiteName}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 mb-2">
                                                {(selectedServiceRequest.CallStatusCode && selectedServiceRequest.CallStatusCode !== 'SRS_CLSD' && selectedServiceRequest.CallStatusCode !== 'SRS_RCLD') && (
                                                    <button
                                                        className="btn btn app-primary-bg-color text-white"
                                                        data-bs-toggle='modal'
                                                        onClick={() => passServiceRequestId(selectedServiceRequest.Id)}
                                                        data-bs-target='#CallClosure'
                                                    >
                                                        {t('service_request_view_closure_button')}
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {/* Left Side Navigation */}
                                <div className="mt-3">
                                    <ul className="nav">
                                        {tabComponents.map((tab, index) => (
                                            <li key={index} className="nav-item">
                                                <button
                                                    className={activeTab == index ? "nav-link nav-link-border-bottom app-primary-color" : "nav-link tab-button-inactive"} role='button'
                                                    onClick={() => handleTabClick(index)}>
                                                    {tab.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Right Side Content */}
                                <div className="row">
                                    {tabComponents[activeTab].component}
                                </div>
                            </>
                        ) : (
                            <CallCordinatorHome />
                        )}
                    </div>
                    <CallClosure />
                </div >
            ) : (
                <CallCordinatorTableView />
            )}
        </ContainerPage >
    )
}