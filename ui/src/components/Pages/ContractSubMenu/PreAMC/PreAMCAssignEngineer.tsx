import { store } from '../../../../state/store';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import {
    AssignEngineerState,
    AssignEngineer,
    initializeAssignEngineer,
    loadEngineers,
    startSubmitting,
    stopSubmitting,
    toggleInformationModalStatus,
    updateErrors,
    updateField,
    ShedulesExist,
} from './PreAMCAssignEngineer.Slice';
import { GetContractPreAmcSchedule, GetContractPreAmcScheduledEngineers, contractPreAmcAssignEngineer, getAssignedEngineerSchedule, getServiceEngineers } from '../../../../services/contractPreAmc';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { updateValidationErrors } from '../../../App/App.slice';
import * as yup from 'yup';
import { useParams } from 'react-router';
import { getContractCustomerSiteList } from '../../../../services/customer';
import { loadPreAmcCustomerSite, loadPreAmcScheduled, loadPreAmcScheduledEngineers } from './PreAMCManagement.slice';
import { convertBackEndErrorsToValidationErrors, formatDate } from '../../../../helpers/formats';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../../../state/storeHooks';

export const PreAmcAssignEngineer = () => {
    const modalRef = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation();
    const { assignEngineer, engineersList, displayInformationModal, selectedSiteDetails, errors } = useStoreWithInitializer(
        ({ assignengineer }) => assignengineer,
        onLoad
    );
    const {
        contractpreamcmanagement: { preAmcScheduled, customerSites, preAmcScheduledEngineers, preAmcSchedule, },
    } = useStore(({ contractpreamcmanagement, app }) => ({ contractpreamcmanagement, app }));

    useEffect(() => {
        if (customerSites.length != 0) {
            getSitePreAmcSchedules(ContractId, customerSites);
        }
    }, [customerSites]);

    useEffect(() => {
        if (assignEngineer.EngineerId) {
            (async () => {
                const result = await getAssignedEngineerSchedule(
                    store.getState().assignengineer.assignEngineer.EngineerId,
                );
                store.dispatch(ShedulesExist(result));
            })();
        }
    }, [assignEngineer.EngineerId]);

    const { ContractId } = useParams<{ ContractId: string }>();

    const validationSchema = yup.object().shape({
        EngineerId: yup.string().required('validation_error_pre_amc_assign_engineer_engineer_id_required'),
        PlannedFrom: yup.string()
            .required('validation_error_pre_amc_assign_engineer_planned_from_required')
            .test('is-after-start-date', 'validation_error_contract_create_end_date_later_startson', function (value) {
                if (selectedSiteDetails.StartsOn.split('T')[0] && value) {
                    return value >= selectedSiteDetails.StartsOn.split('T')[0];
                }
                return true;
            })
            .test('is-before-endson', `${'validation_error_contract_create_planned_from_before_endson'}`, function (value) {
                if (selectedSiteDetails.EndsOn.split('T')[0] && value) {
                    return selectedSiteDetails.EndsOn.split('T')[0] >= value;
                }
                return true;
            }),
        PlannedTo: yup.string().required(t('validation_error_pre_amc_assign_engineer_planned_to_required') ?? '')
            .test('is-after-planned_from', `${'validation_error_contract_create_plannedto_after_planned_from'}`, function (plannedto) {
                if (assignEngineer.PlannedFrom && plannedto) {
                    return new Date(plannedto) >= new Date(assignEngineer.PlannedFrom);
                }
                return true;
            })
            .test('is-before_endson', `${'validation_error_contract_create_plannedto_before_endson'}`, function (plannedto) {
                if (selectedSiteDetails.EndsOn.split('T')[0] && plannedto) {
                    return selectedSiteDetails.EndsOn.split('T')[0] >= plannedto;
                }
                return true;
            }),
    });
    

    const cancel = () => {
        document.getElementById("closeAssignNewEngineerModal")?.click();
        store.dispatch(updateValidationErrors({}))
    }

    async function onSubmit(assignEngineer: AssignEngineer) {
        store.dispatch(updateErrors({}));

        try {
            await validationSchema.validate(store.getState().assignengineer.assignEngineer, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors) {
                return;
            }
        }

        const isAvailable = checkEngineerAvailability(
            store.getState().assignengineer.assignEngineer.PlannedFrom,
            store.getState().assignengineer.assignEngineer.PlannedTo,
            store.getState().assignengineer.existingShedules,
        );

        function checkEngineerAvailability(plannedFrom, plannedTo, existingPlans) {
            const plannedFromDate = new Date(plannedFrom);
            const plannedToDate = new Date(plannedTo);

            return !existingPlans.some(existingPlan => {
                const existingFromDate = new Date(existingPlan.existingShedules.PlannedFrom);
                const existingToDate = new Date(existingPlan.existingShedules.PlannedTo);

                // Check for overlapping schedules or if the schedules are exactly equal
                return (
                    (plannedFromDate >= existingFromDate && plannedFromDate <= existingToDate) ||
                    (plannedToDate >= existingFromDate && plannedToDate <= existingToDate) ||
                    (plannedFromDate <= existingFromDate && plannedToDate >= existingFromDate) ||
                    (plannedFromDate <= existingToDate && plannedToDate >= existingToDate) ||
                    (plannedFromDate.getTime() === existingFromDate.getTime() && plannedToDate.getTime() === existingToDate.getTime())
                );
            });
        }

        if (isAvailable) {
            store.dispatch(startPreloader());
            store.dispatch(startSubmitting());
            const result = await contractPreAmcAssignEngineer(assignEngineer)
            store.dispatch(stopSubmitting());
            result.match({
                ok: () => {
                    store.dispatch(toggleInformationModalStatus());
                },
                err: (e) => {
                    const errorMessages = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(errorMessages));
                },
            });
            store.dispatch(stopPreloader());
        } else {
            setWarning(true);
        }
    }

    const onModalClose = async () => {
        store.dispatch(initializeAssignEngineer())
        const Engineers = await getServiceEngineers();
        store.dispatch(loadEngineers(Engineers));
        setWarning(false)
    }

    const [warning, setWarning] = useState(false)

    return (
        <div>
            <ContainerPage>
                <ValidationErrorComp errors={errors} />
                <div
                    className="modal fade"
                    id='AssignNewEngineer'
                    data-bs-backdrop='static'
                    data-bs-keyboard='false'
                    aria-hidden='true'
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header mx-3">
                                <h5 className="modal-title app-primary-color">{t('pre_amc_management_modal_title_assign_engineer')}</h5>
                                <button
                                    type='button'
                                    className="btn-close"
                                    data-bs-dismiss='modal'
                                    id='closeAssignNewEngineerModal'
                                    aria-label='Close'
                                    onClick={onModalClose}
                                    ref={modalRef}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div>
                                            <label className="form-label"> {t('pre_amc_assign_engineer_label_customer_site')}</label>
                                        </div>
                                        <div>
                                            <strong className=''>{selectedSiteDetails.SiteName}</strong>,&nbsp;&nbsp;{selectedSiteDetails.Address}<br />
                                            <small>{formatDate(selectedSiteDetails.StartsOn)} to {formatDate(selectedSiteDetails.EndsOn)}</small>
                                        </div>
                                    </div>
                                    <div className="mb-1 mt-2">
                                        <label className='form-label mt-2 mb-0 red-asterisk'>{t('pre_amc_assign_engineer_label_engineer_name')}</label>
                                        <select name='EngineerId' onChange={onUpdateField} className='form-select'>
                                            <option value={assignEngineer.EngineerId ?? ""} selected>
                                                {t('pre_amc_assign_engineer_select_enginee_name')}
                                            </option>
                                            {engineersList.map((eachEngineer) => (
                                                <option value={eachEngineer.Id}>{eachEngineer.FullName}</option>
                                            ))}
                                        </select>
                                        <div className="small text-danger"> {t(errors['EngineerId'])}</div>
                                    </div>
                                    <div className="mt-2">
                                        <label className='form-label mb-0 red-asterisk'>{t('pre_amc_assign_engineer_label_planned_from')}</label>
                                        <input name='PlannedFrom' value={assignEngineer.PlannedFrom ? assignEngineer.PlannedFrom : selectedSiteDetails.StartsOn.split('T')[0]} onChange={onUpdateField} type='date' min={selectedSiteDetails.StartsOn?.split('T')[0]} max={selectedSiteDetails.EndsOn?.split('T')[0]} className='form-control'></input>
                                    </div>
                                    <div className="small text-danger"> {t(errors['PlannedFrom'])}</div>
                                    <div className="mt-2">
                                        <label className='form-label mb-0 red-asterisk'>{t('pre_amc_assign_engineer_label_planned_to')}</label>
                                        <input name='PlannedTo' value={assignEngineer.PlannedTo ? assignEngineer.PlannedTo : selectedSiteDetails.EndsOn.split('T')[0]} onChange={onUpdateField} type='date' min={assignEngineer.PlannedFrom} max={selectedSiteDetails.EndsOn?.split('T')[0]} className='form-control'></input>
                                    </div>
                                    <div className="small text-danger"> {t(errors['PlannedTo'])}</div>
                                    <div className="d-flex justify-content-end">
                                        {warning && (
                                            <div className="alert alert-warning mt-3 me-3 p-2" role="alert">
                                                {t('pre_amc_assign_engineer_warning_message_to_user')}
                                            </div>
                                        )}
                                        <div>
                                            <button type='button' onClick={cancel} className='btn app-primary-bg-color text-white mt-3 me-2'>
                                                {t('pre_amc_assign_engineer_button_cancel')}
                                            </button>
                                            <button type='button' onClick={() => onSubmit(assignEngineer)} className='btn app-primary-bg-color text-white mt-3'>
                                                {t('pre_amc_assign_engineer_button_assign_engineer')}
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ContainerPage>
            {displayInformationModal ? <InformationModal /> : ''}
        </div>
    );

    async function onLoad() {
        store.dispatch(initializeAssignEngineer);
        try {
            const Engineers = await getServiceEngineers();
            store.dispatch(loadEngineers(Engineers)); 
        } catch (error) {
            console.error(error);
        }
    }

    function onUpdateField(ev: any) {
        var { name, value } = ev.target     
        store.dispatch(updateField({ name: name as keyof AssignEngineerState['assignEngineer'], value }));
    }

    function InformationModal() {
        const { t, i18n } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={preAmcReload}>
                {t('pre_amc_assign_engineer_alert_assigned_engineer_successfully')}
            </SweetAlert>
        );
    }

    async function preAmcReload() {
        try {
            const currentPage = store.getState().customersitemanagement.currentPage;
            const searchKey = store.getState().customersitemanagement.search;
            const contractCustomerSites = await getContractCustomerSiteList(searchKey, currentPage, ContractId);
            store.dispatch(loadPreAmcCustomerSite(contractCustomerSites));
            store.dispatch(toggleInformationModalStatus());
            document.getElementById("closeAssignNewEngineerModal")?.click();
        } catch (error) {
            console.error(error);
        }
    }

    async function getSitePreAmcSchedules(ContractId: string, CustomerSiteList: any) {
        const sitePreAmcSchedules = await GetContractPreAmcSchedule(ContractId, CustomerSiteList.map((i: any) => (i.customerSite.Id)))
        store.dispatch(loadPreAmcScheduled(sitePreAmcSchedules));
        if (sitePreAmcSchedules.length != 0) {
            getSiteInspectionEngineersList(CustomerSiteList);
        }
    }

    async function getSiteInspectionEngineersList(CustomerSiteList: any) {
        const siteInspectionEngineers = await GetContractPreAmcScheduledEngineers(ContractId, CustomerSiteList.map((i: any) => (i.customerSite.Id)))
        store.dispatch(loadPreAmcScheduledEngineers(siteInspectionEngineers))
    }

}