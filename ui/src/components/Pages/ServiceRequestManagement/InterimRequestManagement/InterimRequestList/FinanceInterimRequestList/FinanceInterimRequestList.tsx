import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../../state/store';
import { ServiceRequestListState, changePage, loadServiceRequests, setFilter, updateField } from './FinanceInterimRequestList.slice'
import { Pagination } from "../../../../../Pagination/Pagination";
import { formatDate } from "../../../../../../helpers/formats";
import Select from 'react-select';
import { Link } from "react-router-dom";
import FeatherIcon from 'feather-icons-react';
import { checkForPermission } from "../../../../../../helpers/permissions";
import BreadCrumb from "../../../../../BreadCrumbs/BreadCrumb";
import { getFinanceInterimServiceRequestList } from "../../../../../../services/serviceRequest";

export const FinanceInterimRequestList = () => {
    const { t } = useTranslation();

    const onLoad = async () => {
        try {
            if (checkForPermission("SERVICE_REQUEST_FINANCE_INTERIM_LIST")) {
                const result = await getFinanceInterimServiceRequestList(searchWith, 1, filters);
                store.dispatch(loadServiceRequests(result));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const { serviceRequests, totalRows, perPage, currentPage, filters, searchWith } = useStoreWithInitializer(({ financeinterimservicerequestlist }) => financeinterimservicerequestlist, onLoad);
    const [selectedFilter, setSelectedFilter] = useState<any>(null);

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        if (checkForPermission("SERVICE_REQUEST_FINANCE_INTERIM_LIST")) {
            const result = await getFinanceInterimServiceRequestList(searchWith, index);
            store.dispatch(loadServiceRequests(result));
        }
    }

    const onUpdateField = async (ev: any) => {
        if (ev.target.value == "") {
            if (checkForPermission("SERVICE_REQUEST_FINANCE_INTERIM_LIST")) {
                const result = await getFinanceInterimServiceRequestList(searchWith, currentPage);
                store.dispatch(loadServiceRequests(result));
            }
        }
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof ServiceRequestListState['filters'], value }));
    }

    const filterCallList = async (event: any) => {
        store.dispatch(changePage(1))
        if (checkForPermission("SERVICE_REQUEST_FINANCE_INTERIM_LIST")) {
            const result = await getFinanceInterimServiceRequestList(searchWith, 1, filters);
            store.dispatch(loadServiceRequests(result));
        }
    }

    const searchFilter = async (selectedOption: any) => {
        setSelectedFilter(selectedOption);
        store.dispatch(setFilter({ value: selectedOption.value }));
    };

    const options = [
        { value: 'CaseId', label: 'Case ID' },
        { value: 'CallType', label: 'Call Type' },
        { value: 'EndUserPhone', label: 'End User Phone Number' },
        { value: 'CallLodgedDateBetween', label: 'Call Lodged Date Between' }
    ]

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_interimcalls' }
    ];
    return (
        <ContainerPage>
            {serviceRequests.match({
                none: () => <>{t('service_request_list_loading')}</>,
                some: (ServiceRequests) =>
                    <div>
                        <BreadCrumb items={breadcrumbItems} />
                        <div className="row mt-2 pe-2">
                            <h5 className="app-primary-color ms-2"> {t('interimservice_request_list_title')}</h5>
                            <label className="ms-2">{t('service_request_create_label_filterby')}</label>
                            <div className="row m-2">
                                <div className="col-md-4 p-0" >
                                    <Select
                                        options={options}
                                        onChange={searchFilter}
                                        defaultValue={options ? options[0] : null}
                                        isSearchable
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <div className="col-md-7">
                                    {searchWith == "CallLodgedDateBetween" ? (
                                        <div className="row m-0">
                                            <div className='col-md-6'>
                                                <input
                                                    name='StartDate'
                                                    type='date'
                                                    className='form-control'
                                                    value={filters.StartDate}
                                                    onChange={onUpdateField}
                                                />
                                            </div>
                                            <div className='col-md-6'>
                                                <input
                                                    name='EndDate'
                                                    type='date'
                                                    className='form-control'
                                                    value={filters.EndDate}
                                                    onChange={onUpdateField}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <input
                                                type='search'
                                                name="SearchText"
                                                className="form-control custom-input"
                                                placeholder={
                                                    selectedFilter ? `${t('servicerequest_list_placeholder_searchwith')} ${t(selectedFilter.label)}` : `${t('servicerequest_list_placeholder_search')}`
                                                }
                                                onChange={onUpdateField}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        filterCallList(e);
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className='col-md-1 float-end px-2'>
                                    <button className="btn app-primary-bg-color text-white float-end px-4" type="button" onClick={filterCallList}>
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2 mx-0 pe-2 ms-2">
                            {ServiceRequests.length > 0 ? (
                                <div className='ps-0 table-responsive overflow-auto pe-0'>
                                    <table className="table table-bordered text-nowrap">
                                        <thead>
                                            <tr>
                                                {checkForPermission("SERVICE_REQUEST_FINANCE_INTERIM_LIST") &&
                                                    <th></th>
                                                }
                                                <th scope="col">{t('service_request_list_th_slno')}</th>
                                                <th scope="col">{t('service_request_list_th_caseid')}</th>
                                                <th scope="col">{t('service_request_list_th_customername')}</th>
                                                <th scope="col">{t('service_request_list_th_contractno')}</th>
                                                <th scope="col">{t('service_request_list_th_customerphonenumber')}</th>
                                                <th scope="col">{t('service_request_list_th_modelname')}</th>
                                                <th scope="col">{t('service_request_list_th_categoryname')}</th>
                                                <th scope="col">{t('service_request_list_th_serialno')}</th>
                                                <th scope="col">{t('service_request_list_th_customersite')}</th>
                                                <th scope="col">{t('service_request_list_th_customerserviceaddress')}</th>
                                                <th scope="col">{t('service_request_list_th_source')}</th>
                                                <th scope="col">{t('service_request_list_th_status')}</th>
                                                <th scope="col">{t('service_request_list_th_reportedon')}</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ServiceRequests.map(({ serviceRequest }, index) => (
                                                <tr className="mt-2">
                                                    {checkForPermission("SERVICE_REQUEST_FINANCE_INTERIM_LIST") &&
                                                        <td>
                                                            <Link to={`/finance/interimcalls/${serviceRequest.Id}/review`} className="app-primary-color">
                                                                <FeatherIcon icon={"eye"} size="16" />
                                                            </Link>
                                                        </td>
                                                    }
                                                    <td className="text-center">{(currentPage - 1) * 10 + (index + 1)}</td>
                                                    <td>{serviceRequest.CaseId} </td>
                                                    <td> {serviceRequest.CustomerName}</td>
                                                    <td>{serviceRequest.ContractNumber} </td>
                                                    <td> {serviceRequest.EndUserPhone}</td>
                                                    <td>{serviceRequest.ModelName} </td>
                                                    <td>{serviceRequest.CategoryName} </td>
                                                    <td>{serviceRequest.ProductSerialNumber} </td>
                                                    <td>{serviceRequest.SiteName} </td>
                                                    <td>{serviceRequest.CustomerServiceAddress} </td>
                                                    <td>{serviceRequest.CallSource} </td>
                                                    <td> {serviceRequest.StatusCode == "SRS_CLSD" ? (
                                                        <span className="badge text-bg-success">{serviceRequest.Status}</span>
                                                    ) : serviceRequest.StatusCode == "SRS_RCLD" ? (
                                                        <span className="badge text-bg-success">{serviceRequest.Status}</span>
                                                    ) : (
                                                        <span className="badge text-bg-danger">{serviceRequest.Status}</span>
                                                    )}
                                                    </td>
                                                    <td> {formatDate(serviceRequest.CaseReportedOn)} </td>                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('calllist_no_data')}</div>
                            )}
                        </div>
                    </div>
            })}
        </ContainerPage>)
}