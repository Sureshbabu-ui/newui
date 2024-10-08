import { useState } from 'react';
import Select from 'react-select';
import { store } from '../../../../../state/store';
import { changePage, loadServiceRequests, setFilter, updateErrors } from './SmeHomeCalls.slice';
import { downloadCallStatusReport, getCallCentreCallDetails, getCallDetailsForSme } from '../../../../../services/serviceRequest';
import { useStore } from '../../../../../state/storeHooks';
import { formatDocumentName, getSLAExpiresOn } from '../../../../../helpers/formats';
import { Pagination } from '../../../../Pagination/Pagination';
import { initializeServiceRequestInfo, loadSelectedServiceRequest } from '../../../ServiceRequestManagement/CallCentreManagement/ServiceRequestView/ServiceRequestView.slice';
import { checkForPermission } from '../../../../../helpers/permissions';
import { ServiceRequestView } from '../../../ServiceRequestManagement/CallCentreManagement/ServiceRequestView/ServiceRequestView';
import FileSaver from 'file-saver';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';


const SmeHomeCalls = () => {
  const { t, i18n } = useTranslation();
  const { calldetailsforsme: { serviceRequests, errors, searchWith, perPage, totalRows, currentPage } } = useStore(({ calldetailsforsme }) => ({ calldetailsforsme }));

  const SearchWith = [
    { value: 'WorkOrderNumber', label: 'Work Order Number' },
    { value: 'SerialNumber', label: 'Serial Number' }
  ];

  const validationSchema = yup.object().shape({
    searchValue: yup.string().required('sme_home_call_filter_required'),
  });

  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const onFieldChangeSelect = (selectedOption: any, actionMeta: any) => {
    const value = selectedOption.value;
    store.dispatch(setFilter({ Value: value, Name: "searchWith" }));
  };

  const onSubmit = async () => {
    try {
      await validationSchema.validate({ searchValue }, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    const result = await getCallDetailsForSme(searchWith, searchValue, 1);
    store.dispatch(loadServiceRequests(result));
  };

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    const result = await getCallDetailsForSme(searchWith, searchValue, index);
    store.dispatch(loadServiceRequests(result));
  };

  const loadSelectedCallDetails = async (Id: number) => {
    store.dispatch(initializeServiceRequestInfo());
    try {
      if (checkForPermission("SERVICE_REQUEST_LIST")) {
        const serviceRequestDetails = await getCallCentreCallDetails(Id);
        store.dispatch(loadSelectedServiceRequest(serviceRequestDetails));
      }
    } catch (error) {
      return
    }
  }

  const onDownloadClick = async (Id) => {
    const response = await downloadCallStatusReport(Number(Id))
    const url = window.URL.createObjectURL(response.data);
    FileSaver.saveAs(url, formatDocumentName())
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className='p-2'>
      <div className="row mt-2 ps-2 pe-2">
        <label className="">{t('sme_home_calls_label_filterby')}</label>
        <div className="input-group">
          <div className="me-2 fixed-width">
            <Select
              options={SearchWith}
              isSearchable
              onChange={onFieldChangeSelect}
              name="SearchWith"
              placeholder={t('sme_home_calls_searchwith_placeholder_select')}
              classNamePrefix="react-select"
            />
          </div>
          <input
            type='search'
            name='searchValue'
            className={`form-control custom-input ${errors["searchValue"] ? "is-invalid" : ""}`}
            placeholder={t('sme_home_calls_input_search_placeholder') as string}
            value={searchValue}
            onKeyPress={handleKeyPress}
            onChange={handleInputChange}
          />
          <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={onSubmit}>
            {t('sme_home_calls_button_search')}
          </button>
        </div>
        <div className="text-danger ">{t(errors['searchValue'])}</div>
      </div>

      {serviceRequests.match({
        none: () => <>{t('')}</>,
        some: (ServiceRequests) => (
          <>
            {ServiceRequests.length > 0 ? (

              <>
                {ServiceRequests.map((serviceRequest, index) => (
                  <div className={`mt-2 p-2 bg-light ${serviceRequest.serviceRequest.StatusCode !== "SRS_CLSD" ? "red-border-shadow" : ""}`} key={index}>
                    <div className="row m-0 border-bottom pb-1 mb-1">
                      <div className="col-1 p-0">
                        <div className="text-muted text-size-11">{t('sme_home_calls_label_caseid')}</div>
                        <div className="text-size-12">{serviceRequest.serviceRequest.CaseId}</div>
                      </div>
                      <div className="col-2 p-0">
                        <div className="text-muted ps-4 text-size-11">{t('sme_home_calls_label_wono')}</div>
                        <div className="text-size-12 ps-4">{serviceRequest.serviceRequest.WorkOrderNumber ?? "---"}</div>
                      </div>
                      <div className="col-1 p-0">
                        <div className="text-muted text-size-11">{t('sme_home_calls_label_serial_no')}</div>
                        <div className="text-size-12">{serviceRequest.serviceRequest.ProductSerialNumber ?? "---"}</div>
                      </div>
                      <div className="col-2 p-0">
                        <div className="text-muted text-size-11"> {t('sme_home_calls_label_contractnumber')}</div>
                        <div className="text-size-12">{serviceRequest.serviceRequest.ContractNumber}</div>
                      </div>
                      <div className="col-2 p-0">
                        <div className="text-muted text-size-11"> {t('sme_home_calls_label_calllodgedby')}</div>
                        <div className="text-size-12">{serviceRequest.serviceRequest.CreatedBy}</div>
                      </div>
                      <div className="col-1 p-0">
                        <div className="text-muted text-size-11"> {t('sme_home_calls_label_status')}</div>
                        <div className="text-size-12">{serviceRequest.serviceRequest.Status}</div>
                      </div>
                      <div className="col-2 p-0">
                        <div className="text-muted text-size-11"> {t('sme_home_calls_label_assetdetails')}</div>
                        <div className="text-size-12">{serviceRequest.serviceRequest.CategoryName}<span className="text-size-8">&#x25CF;</span>{serviceRequest.serviceRequest.ModelName}</div>
                      </div>
                    </div>
                    <div className="row m-0">
                      <div className="col-2 p-0">
                        <div className="text-black text-size-14"><strong>{serviceRequest.serviceRequest.CustomerReportedIssue}</strong></div>
                        <div><small>{serviceRequest.serviceRequest.CallcenterRemarks && <q>{serviceRequest.serviceRequest.CallcenterRemarks}</q>}</small></div>
                      </div>
                      <div className="col-3 p-0">
                        <div className="text-muted">
                          <small>
                            <span className="material-symbols-outlined text-size-12">
                              location_on
                            </span>
                            {t('sme_home_calls_label_customerdetails')}
                          </small>
                        </div>
                        <div><small>{serviceRequest.serviceRequest.CustomerName},{serviceRequest.serviceRequest.CustomerServiceAddress}</small></div>
                      </div>
                      <div className="col-3 pt-2">
                        <button
                          className="btn app-primary-bg-color text-white float-end fs-6"
                          onClick={() => window.open(`/callstatusreport/${serviceRequest.serviceRequest.Id}`, '_blank')}
                        >
                          {t('sme_home_calls_button_call_status_view')}
                        </button>
                      </div>
                      <div className="col-2 pt-2">
                        <button
                          className="btn app-primary-bg-color text-white float-end fs-6"
                          onClick={() => onDownloadClick(serviceRequest.serviceRequest.Id)}
                        >
                          {t('sme_home_calls_button_download')}
                        </button>
                      </div>
                      <div className="col-2 pt-2 ">
                        <button
                          className="btn btn-link dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#ServiceRequestView"
                          onClick={() => loadSelectedCallDetails(serviceRequest.serviceRequest.Id)}
                        >
                          {t('sme_home_calls_button_view_details')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className='mx-2 mt-2'>{t('sme_home_calls_no_records')}</div>
            )}
          </>
        )
      })}

      <div className="row mt-3">
        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
      </div>
      <ServiceRequestView />
    </div>
  );
}

export default SmeHomeCalls;
