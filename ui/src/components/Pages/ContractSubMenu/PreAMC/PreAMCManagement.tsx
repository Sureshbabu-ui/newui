import { useEffect, useState } from 'react';
import { changePage, initializePreAmcManagement, loadPreAmcCustomerSite, loadPreAmcScheduled, loadPreAmcScheduledEngineers, scheduleUpdateField, toggleInformationModalStatus, updateErrors } from './PreAMCManagement.slice';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { store } from '../../../../state/store';
import { useParams } from 'react-router-dom';
import { GetContractPreAmcSchedule, contractPreAmcSchedule } from '../../../../services/contractPreAmc';
import { getContractCustomerSiteList } from '../../../../services/customer';
import { stopPreloader } from '../../../Preloader/Preloader.slice';
import SweetAlert from 'react-bootstrap-sweetalert';
import { PreAmcAssignEngineer } from './PreAMCAssignEngineer';
import { loadPreAmcScheduleId, loadSelectedSite, updateField } from './PreAMCAssignEngineer.Slice';
import { GetContractPreAmcScheduledEngineers } from '../../../../services/contractPreAmc';
import { updateValidationErrors } from '../../../App/App.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { convertBackEndErrorsToValidationErrors, formatDate, formatDateTime } from '../../../../helpers/formats';
import { checkForPermission } from '../../../../helpers/permissions';
import { Pagination } from '../../../Pagination/Pagination';
import { PreAmcScheduleDetailsArray } from '../../../../types/contractPreAmc';

function PreAmcManagement() {
  const { t } = useTranslation();
  const {
    contractpreamcmanagement: { preAmcScheduled, customerSites, currentPage, totalRows, perPage, preAmcScheduledEngineers, preAmcSchedule, displayInformationModal, errors },
  } = useStore(({ contractpreamcmanagement }) => ({ contractpreamcmanagement }));

  const [isScheduleNeeded, setIsScheduleNeeded] = useState(0)
  const { ContractId } = useParams<{ ContractId: string }>();

  useEffect(() => {
    if (checkForPermission("CONTRACT_CUSTOMER_SITE_CREATE")) {
      onLoad();
    }
  }, []);

  useEffect(() => {
    if (customerSites.length != 0) {
      getSitePreAmcSchedules(ContractId, customerSites);
    }
  }, [customerSites]);

  const validationSchema = yup.object().shape({
    StartsOn: yup.string().required('validation_error_pre_amc_management_startson_required'),
    EndsOn: yup.string()
      .required('validation_error_pre_amc_management_endson_required')
      .test('is-greater', 'End date must be greater than Start date', function (value) {
        const { StartsOn } = this.parent; // Accessing StartsOn value
        return new Date(value) >= new Date(StartsOn);
      }),
  });

  async function InspectionSchedule(ev: any) {
    const scheduleDetails = preAmcSchedule.find(item => item.CustomerSiteId === ev.target.value);
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(scheduleDetails, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    const result = await contractPreAmcSchedule(scheduleDetails!)
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: (e) => {
        {
          const errorMessages = convertBackEndErrorsToValidationErrors(e)
          store.dispatch(updateErrors(errorMessages))
        }
      },
    })
    store.dispatch(stopPreloader());
  }
  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    const searchKey = store.getState().tenantlist.search;
    const result = await getContractCustomerSiteList(searchKey, index, ContractId);
    store.dispatch(loadPreAmcCustomerSite(result));
  }

  return (
    <ContainerPage>
      {store.getState().app.validationErrors && (
        <ValidationErrorComp errors={errors} />
      )}
      <div className="my-0 mt-2">
        <div className="row">
          <div className='ms-1'>
            <h5 className="app-primary-color">{t('pre_amc_management_title_manage_contract_pre_amc')}</h5>
            <small>{t('pre_amc_management_description')}</small>
          </div>
          <div className="row mt-2">
            {customerSites.length > 0 ? (
              <div>
                {customerSites.map((eachCustomerSite) => (
                  <div className="ms-3 mt-2 contract-pre-amc mb-2">
                    <div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          <strong className='mt-2'>{eachCustomerSite.customerSite.SiteName}</strong>,&nbsp;&nbsp;{eachCustomerSite.customerSite.Address}
                        </div>
                        {((isScheduleNeeded != eachCustomerSite.customerSite.Id) && (
                          <div>
                            <button className='btn app-primary-bg-color text-white' onClick={() => setIsScheduleNeeded(eachCustomerSite.customerSite.Id)} >Schedule</button>
                          </div>
                        ))}
                      </div>
                      {(isScheduleNeeded == eachCustomerSite.customerSite.Id) && (
                        <div className="row mt-2">
                          <div className="col-md-3">
                            <label className='red-asterisk'>{t('pre_amc_management_label_startson')}
                            </label>
                            <input
                              name='StartsOn'
                              onChange={onUpdateField}
                              type='date'
                              className={`form-control  ${errors["StartsOn"] ? "is-invalid" : ""}`}
                              data-id={eachCustomerSite.customerSite.Id}
                            ></input>
                            <div className="small text-danger"> {t(errors['StartsOn'])}</div>
                          </div>
                          <div className="col-md-3">
                            <label className='red-asterisk'>{t('pre_amc_management_label_endson')}</label>
                            <input
                              name='EndsOn'
                              onChange={onUpdateField}
                              type='date'
                              className={`form-control  ${errors["EndsOn"] ? "is-invalid" : ""}`}
                              data-id={eachCustomerSite.customerSite.Id}
                            ></input>
                            <div className="small text-danger"> {t(errors['EndsOn'])}</div>
                          </div>
                          {store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' && (
                            <div className="col-md-3 m-0 p-0 mb-2 mt-4">
                              <button disabled={store.getState().generalcontractdetails.singlecontract.ContractStatusCode === 'CTS_PNDG'} onClick={InspectionSchedule} type='button' className='btn app-primary-bg-color text-white' value={eachCustomerSite.customerSite.Id}>
                                {t('pre_amc_management_button_create_schedule')}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      {preAmcScheduled.some((eachSchedule) => eachSchedule.ContractCustomerSiteId === eachCustomerSite.customerSite.Id) && (
                        preAmcScheduled
                          .filter((eachSchedule) => eachSchedule.ContractCustomerSiteId === eachCustomerSite.customerSite.Id)
                          .map((eachSchedule) => (
                            <div className='row d-flex justify-content-between' key={eachSchedule.Id}>
                              <div className="ms-0">
                                <div className="mt-2">
                                  <strong>{eachSchedule.ScheduleNumber}</strong>
                                  <div className='ms-0'>
                                    <span className='ion-ios-calendar-outline me-1 fs-7'></span>
                                    <small>{eachSchedule.StartsOn ? formatDate(eachSchedule.StartsOn) : ""}</small>&nbsp;to&nbsp;
                                    <span className='ion-ios-calendar-outline me-1 fs-7'></span>
                                    <small>{eachSchedule.EndsOn ? formatDate(eachSchedule.EndsOn) : ""}</small>
                                  </div>
                                </div>
                                {/* {store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' && (
                                  <div className="col-md-4 ">
                                    <button disabled={store.getState().generalcontractdetails.singlecontract.ContractStatusCode === 'CTS_PNDG'} className="btn app-primary-bg-color text-white float-end" onClick={() => loadClickedDetails(eachCustomerSite.customerSite.Address, eachCustomerSite.customerSite.SiteName, eachSchedule)} data-bs-toggle="modal" data-bs-target="#AssignNewEngineer">
                                      {t('pre_amc_management_button_assign_engineer')}
                                    </button>
                                  </div>
                                )} */}
                              </div>
                              <div>
                                {preAmcScheduledEngineers.some((eachEngineer) => eachEngineer.Id === eachSchedule.Id) ? (
                                  <table className="table table-bordered mt-2">
                                    <thead>
                                      <tr>
                                        <th scope="col">{t('pre_amc_management_header_slno')}</th>
                                        <th scope="col">{t('pre_amc_management_header_name')}</th>
                                        <th scope="col">{t('pre_amc_management_header_planned_from')}</th>
                                        <th scope="col">{t('pre_amc_management_header_planned_to')}</th>
                                        <th scope="col">{t('pre_amc_management_header_executed_from')}</th>
                                        <th scope="col">{t('pre_amc_management_header_executed_to')}</th>
                                        <th scope="col">{t('pre_amc_management_header_assigned_by')}</th>
                                        <th scope="col">{t('pre_amc_management_header_assigned_on')}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {preAmcScheduledEngineers.filter((eachEngineer) => eachEngineer.ContractCustomerSiteId === eachCustomerSite.customerSite.Id)
                                        .map((eachEngineer, index) => (
                                          <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{eachEngineer.EngineerName}</td>
                                            <td>{eachEngineer.PlannedFrom ? formatDate(eachEngineer.PlannedFrom) : ""}</td>
                                            <td>{eachEngineer.PlannedTo ? formatDate(eachEngineer.PlannedTo) : ""}</td>
                                            <td>{eachEngineer.ExecutedFrom ? formatDate(eachEngineer.ExecutedFrom) : ""}</td>
                                            <td>{eachEngineer.ExecutedTo ? formatDate(eachEngineer.ExecutedTo) : ""}</td>
                                            <td>{eachEngineer.AssignedBy}</td>
                                            <td>{formatDateTime(eachEngineer.AssignedOn)}</td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <small>{t('pre_amc_management_title')}</small>
                                )}
                              </div>
                            </div>
                          ))
                      )
                      }
                    </div>
                  </div>
                ))}
                <div className="row m-0">
                  <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                </div>
              </div>
            ) : (
              <p className='ms-1'>
                <strong>{t('pre_amc_management_description_customer_site')}</strong>
              </p>
            )}
          </div>
        </div>
        {/* Modals */}
        {/* <PreAmcAssignEngineer /> */}
        {displayInformationModal ? <InformationModal /> : ''}
        {/* Modals ends */}
      </div>
    </ContainerPage >
  )

  async function onLoad() {
    store.dispatch(initializePreAmcManagement());
    try {
      const currentPage = store.getState().customersitemanagement.currentPage;
      const searchKey = store.getState().customersitemanagement.search;
      const contractCustomerSites = await getContractCustomerSiteList(searchKey, currentPage, ContractId);
      store.dispatch(loadPreAmcCustomerSite(contractCustomerSites));
    } catch (error) {
      console.error(error);
    }
  }

  async function getSitePreAmcSchedules(ContractId: string, CustomerSiteList: any) {
    const sitePreAmcSchedules = await GetContractPreAmcSchedule(ContractId, CustomerSiteList.map((i: any) => (i.customerSite.Id)))
    store.dispatch(loadPreAmcScheduled(sitePreAmcSchedules));
    if (sitePreAmcSchedules.length != 0) {
      getSiteInspectionEngineersList(sitePreAmcSchedules);
    }
  }

  async function getSiteInspectionEngineersList(PreAmcSchedules: PreAmcScheduleDetailsArray) {
    const siteInspectionEngineers = await GetContractPreAmcScheduledEngineers(ContractId, PreAmcSchedules.map((i) => (i.Id)).toString())
    store.dispatch(loadPreAmcScheduledEngineers(siteInspectionEngineers))
  }

  function onUpdateField(ev: any) {
    const Date = ev.target.value;
    const FieldName = ev.target.name;
    const CustomerSiteId = ev.target.dataset.id;
    store.dispatch(scheduleUpdateField({ Date, FieldName, CustomerSiteId, ContractId }));
  }

  function loadClickedDetails(Address: string, SiteName: string, Details: any) {
    var { EndsOn, StartsOn, Id } = Details
    store.dispatch(updateField({ name: 'PlannedFrom', value: StartsOn.split('T')[0] }));
    store.dispatch(updateField({ name: 'PlannedTo', value: EndsOn.split('T')[0] }));
    store.dispatch(loadSelectedSite({ Address, SiteName, EndsOn, StartsOn }))
    store.dispatch(loadPreAmcScheduleId(Id))
  }

  function InformationModal() {
    return (
      <SweetAlert success title='Success' onConfirm={preAmcReload}>
        {t('pre_amc_management_alert_schedule_created_sucessfully')}
      </SweetAlert>
    );
  }

  async function preAmcReload() {
    try {
      const currentPage = store.getState().customersitemanagement.currentPage;
      const searchKey = store.getState().customersitemanagement.search;
      setIsScheduleNeeded(0)
      const contractCustomerSites = await getContractCustomerSiteList(searchKey, currentPage, ContractId);
      store.dispatch(loadPreAmcCustomerSite(contractCustomerSites));
      store.dispatch(toggleInformationModalStatus());
    } catch (error) {
      console.error(error);
    }
  }
}

const setValodationErrorReset = () => {
  store.dispatch(updateValidationErrors({}))
}

export default PreAmcManagement