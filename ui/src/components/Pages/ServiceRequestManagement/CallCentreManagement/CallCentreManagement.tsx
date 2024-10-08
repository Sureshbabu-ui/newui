import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { changePage, initializeCallCenterManagement, loadServiceRequests, setFilter, setSearch } from './CallCentreManagement.slice'
import Select from 'react-select';
import { checkForPermission } from "../../../../helpers/permissions";
import { store } from "../../../../state/store";
import { getCallCentreServiceRequestList, getCallCentreCallDetails } from "../../../../services/serviceRequest";
import { useStoreWithInitializer } from "../../../../state/storeHooks";
import { ContainerPage } from "../../../ContainerPage/ContainerPage";
import { startPreloader, stopPreloader } from "../../../Preloader/Preloader.slice";
import { Pagination } from "../../../Pagination/Pagination";
import FeatherIcon from 'feather-icons-react';
import { Link } from "react-router-dom";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";
import { ServiceRequestView } from "./ServiceRequestView/ServiceRequestView";
import { initializeServiceRequestInfo, loadSelectedServiceRequest } from "./ServiceRequestView/ServiceRequestView.slice";
import { getSLAExpiresOn } from "../../../../helpers/formats";

export const CallCentreManagement = () => {
    const { t } = useTranslation();
    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeCallCenterManagement());
        try {
            const { currentPage, search, searchWith } = store.getState().callcentremanagement;
            if (checkForPermission("SERVICE_REQUEST_LIST")) {
                const ServiceRequests = await getCallCentreServiceRequestList(search, searchWith, currentPage, filterWith);
                store.dispatch(loadServiceRequests(ServiceRequests));
                store.dispatch(setFilter({ Value: optionsTwo[0].value, Name: "searchWith" }));
            }
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const { serviceRequests, currentPage, search, searchWith, totalRows, perPage, filterWith } = useStoreWithInitializer(({ callcentremanagement }) => (callcentremanagement), onLoad);

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        if (checkForPermission("SERVICE_REQUEST_DETAILS")) {
            const result = await getCallCentreServiceRequestList(search, searchWith, index, filterWith);
            store.dispatch(loadServiceRequests(result));
        }
    }
    useEffect(() => {
        {
            filterCallList()
        }
    }, [store.getState().callcentremanagement.filterWith])

    const loadSelectedCallDetails = async (Id: number) => {
        store.dispatch(initializeServiceRequestInfo());
        try {
            if (checkForPermission("SERVICE_REQUEST_LIST")) {
                const serviceRequestDetails = await getCallCentreCallDetails(Id);
                store.dispatch(loadSelectedServiceRequest(serviceRequestDetails));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const filterCallList = async (event?: any) => {
        store.dispatch(changePage(1))
        const result = await getCallCentreServiceRequestList(search, searchWith, 1, filterWith);
        store.dispatch(loadServiceRequests(result));
    }
    const [selectedFilter, setSelectedFilter] = useState<any>(null);

    const callFilter = async (selectedOption: any) => {
        setSelectedFilter(selectedOption);
        store.dispatch(setFilter({ Value: selectedOption.value, Name: "filterWith" }));
    };

    const searchFilter = async (selectedOption: any) => {
        setSelectedFilter(selectedOption);
        store.dispatch(setFilter({ Value: selectedOption.value, Name: "searchWith" }));
    };

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value === "") {
            store.dispatch(setSearch(""))
            const result = await getCallCentreServiceRequestList("", searchWith, currentPage, filterWith);
            store.dispatch(loadServiceRequests(result));
        }
    };

    const callsFilter = [
        { value: '', label: 'All' },
        { value: 'RGLR', label: 'Regular' },
        { value: 'INTRM', label: 'Interim' },
        { value: 'CLSD', label: 'Closed' }
    ]
    
    const optionsTwo = [
        { value: 'CaseId', label: 'Case ID' },
        { value: 'WorkOrderNumber', label: 'Work Order Number' },
        { value: 'EndUserPhone', label: 'Customer Phone Number' },
        { value: 'SerialNumber', label: 'Serial Number' },
    ]

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_calls' }
    ]
    return (
        <ContainerPage>
            <BreadCrumb items={breadcrumbItems} />
            {serviceRequests.match({
                none: () => <>{t('service_request_list_loading')}</>,
                some: (ServiceRequests) =>
                    <div className="px-3">
                        <div className="row m-0 me-1">
                            <div className="col-md-9 app-primary-color p-0">
                                <h5> {t('service_request_list_title')}</h5>
                            </div>
                            {checkForPermission("SERVICE_REQUEST_CREATE") && <>
                                <div className="col-md-3 pe-0">
                                    <Link to='/calls/create'>
                                        <button className="btn app-primary-bg-color text-white float-end">
                                            {t('service_request_list_button_create')}
                                        </button>
                                    </Link>
                                </div>
                            </>
                            }
                        </div>
                        <div className="row mt-2">
                            <label className="">{t('service_request_create_label_filterby')}</label>
                            <div className="input-group me-4">
                                <div className="me-2 fixed-width" >
                                    <Select
                                        options={callsFilter}
                                        onChange={callFilter}
                                        defaultValue={callsFilter ? callsFilter[0] : null}
                                        isSearchable
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <div className="me-2 fixed-width" >
                                    <Select
                                        options={optionsTwo}
                                        onChange={searchFilter}
                                        defaultValue={optionsTwo ? optionsTwo[0] : null}
                                        isSearchable
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <input
                                    type='search'
                                    className="form-control custom-input"
                                    value={search}
                                    placeholder={
                                        selectedFilter ? `${t('servicerequest_list_placeholder_searchwith')} ${t(selectedFilter.label)}` : `${t('servicerequest_list_placeholder_search')}`
                                    }
                                    onChange={addData}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterCallList(e);
                                        }
                                    }}
                                />
                                <button className="btn app-primary-bg-color text-white float-end px-4" type="button" onClick={filterCallList}>
                                    {t('callcentre_management_label_search')}
                                </button>
                            </div>
                        </div>

                        {/* new design */}
                        {ServiceRequests.length > 0 ?
                            (
                                ServiceRequests.map(({ serviceRequest }, index) => (
                                    <div className={`mt-2 p-2  bg-light ${(getSLAExpiresOn(serviceRequest.WorkOrderCreatedOn, serviceRequest.ResolutionTimeInHours).startsWith("-") && serviceRequest.StatusCode !== "SRS_CLSD") && "red-border-shadow"}`} key={index} data-bs-toggle='modal' data-bs-target='#ServiceRequestView' role="button" onClick={() => loadSelectedCallDetails(serviceRequest.Id)}>
                                        <div className="row m-0 border-bottom pb-1 mb-1">
                                            {/* case details */}
                                            <div className="col-1 p-0">
                                                <div className="text-muted text-size-11">{t('callcentre_management_label_caseid')}</div>
                                                <div className="text-size-12">{serviceRequest.CaseId}</div>
                                            </div>
                                            {/* case details */}
                                            {/* work order details */}
                                            <div className="col-2 p-0">
                                                <div className="text-muted text-size-11">{t('callcentre_management_label_wono')}</div>
                                                <div className="text-size-12">{serviceRequest.WorkOrderNumber ?? "---"}</div>
                                            </div>
                                            <div className="col-2 p-0">
                                                <div className="text-muted text-size-11">{t('callcentre_management_label_serial_no')}</div>
                                                <div className="text-size-12">{serviceRequest.ProductSerialNumber ?? "---"}</div>
                                            </div>
                                            {/* work order details */}
                                            {/* contract details */}
                                            <div className="col-2 p-0">
                                                <div className="text-muted text-size-11"> {t('callcentre_management_label_contractnumber')}</div>
                                                <div className="text-size-12">{serviceRequest.ContractNumber}</div>
                                            </div>
                                            {/* contract details */}
                                            {/* assignee details */}
                                            <div className="col-2 p-0">
                                                <div className="text-muted text-size-11"> {t('callcentre_management_label_calllodgedby')}</div>
                                                <div className="text-size-12">{serviceRequest.CreatedBy}</div>
                                            </div>
                                            {/* assignee details */}
                                            {/* status details */}
                                            <div className="col-2 p-0">
                                                <div className="text-muted text-size-11"> {t('callcentre_management_label_status')}</div>
                                                <div className="text-size-12">{serviceRequest.Status}</div>
                                            </div>
                                            {/* status details */}
                                            {/* asset details */}
                                            <div className="col-3 p-0">
                                                <div className="text-muted text-size-11"> {t('callcentre_management_label_assetdetails')}</div>
                                                <div className="text-size-12">{serviceRequest.CategoryName}<span className="text-size-8">&#x25CF;</span>{serviceRequest.ModelName}<span className="text-size-8">&#x25CF;</span>{serviceRequest.ProductSerialNumber} </div>
                                            </div>
                                            {/* asset details */}
                                        </div>
                                        <div className="row m-0">
                                            {/* case details */}
                                            <div className="col-7 p-0">
                                                <div className="text-black text-size-14"><strong>{serviceRequest.CustomerReportedIssue}</strong></div>
                                                <div><small>{serviceRequest.CallcenterRemarks && <q>{serviceRequest.CallcenterRemarks}</q>}</small></div>
                                            </div>
                                            {/* case details */}
                                            {/* contract details */}
                                            <div className="col-4 p-0">
                                                <div className="text-muted">
                                                    <small>
                                                        <span className="material-symbols-outlined text-size-12">
                                                            location_on
                                                        </span>
                                                        {t('callcentre_management_label_customerdetails')}
                                                    </small>
                                                </div>
                                                <div><small>{serviceRequest.CustomerName},{serviceRequest.CustomerServiceAddress}</small></div>
                                                <div><small>{serviceRequest.EndUserPhone}</small></div>
                                            </div>
                                            {(checkForPermission("SERVICE_REQUEST_CREATE") && serviceRequest.StatusCode == 'SRS_DRFT') &&
                                                (
                                                    <div className="col-1 p-0">
                                                        <a className="pseudo-href app-primary-color ms-1 float-end" href={`/calls/edit/${serviceRequest.Id}`}>
                                                            <FeatherIcon icon={"edit"} size="16" />
                                                        </a>
                                                    </div>
                                                )}
                                            {/* contract details */}
                                        </div>
                                    </div>
                                ))

                            ) : (
                                <div className="text-muted mt-2">{t('calllist_no_data')}</div>
                            )}

                        <div className="row mt-3">
                            <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                        </div>
                        {/* new design ends here */}
                    </div>
            })}
            <ServiceRequestView />
        </ContainerPage >)
}