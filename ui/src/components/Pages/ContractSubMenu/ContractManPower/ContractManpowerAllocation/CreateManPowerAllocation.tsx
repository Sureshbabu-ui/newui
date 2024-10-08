import { store } from '../../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import {
  initializeManPowerAlloctaion,
  CreateManpowerAllocationState,
  startSubmitting,
  stopSubmitting,
  loadServiceEngineers,
  toggleInformationModalStatus,
  updateField,
  loadCustomerSite,
  updateErrors,
  initializeManpowerAllocation,
} from './CreateManpowerAllocation.slice';
import { getContractCustomerSites } from '../../../../../services/customer';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../../helpers/formats';
import { getEngineersNames } from '../../../../../services/assignEngineer';
import { ManpowerAllocationCreate } from '../../../../../types/contractmanpowerallocation';
import { getManPowerAllocationList, manpowerAllocationCreate } from '../../../../../services/contractmanowerallocation';
import { loadManPowerAllocations } from './ManPowerAllocationList.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';

export function ManPowerAllocationCreate() {
  const { t, i18n } = useTranslation();
  const modalRef = useRef<HTMLButtonElement>(null);

  const { ContractId } = useParams<{ ContractId: string }>();
  const MODAL_NAME = "createManpowerAllocation"

  const { createmanpowerallocation: { manpowerallocation, displayInformationModal, CustomerSites, EngineersList, errors }, manpowerallocation: { visibleModal } } = useStore(
    ({ createmanpowerallocation, manpowerallocation }) => ({ createmanpowerallocation, manpowerallocation }));

  const [selectEngineersList, setEngineersList] = useState<any>(null)

  useEffect(() => {
    GetMasterDataItems();
  }, [ContractId && visibleModal == MODAL_NAME]);

  useEffect(() => {
    setEngineersList(formatSelectInput(EngineersList, "FullName", "Id",));
  }, [EngineersList])

  const [selectCustomerSiteIdList, setSelectCustomerSiteIdList] = useState<any>(null)
  useEffect(() => {
    setSelectCustomerSiteIdList(formatSelectInput(CustomerSites, "SiteName", "Id"))
  }, [CustomerSites])

  const onModalClose = () => {
    store.dispatch(initializeManpowerAllocation())
  }

  const validationSchema = yup.object().shape({
    CustomerSiteId: yup.number().moreThan(0, 'validation_error_manpower_allocation_customersite_required'),
    EmployeeId: yup.number().positive('validation_error_manpower_allocation_engineer_name_required'),
    CustomerAgreedAmount: yup.number().moreThan(0, 'validation_error_manpower__allocation_customer_agreed_amount_required').required('validation_error_manpower__allocation_customer_agreed_amount_required').max(99999999999999.98, 'validation_error_manpower_allocation_customer_agreed_amount_exceed'),
    BudgetedAmount: yup.number().moreThan(0, 'validation_error_create_manpower_allocation_budgeted_amount_required').required('validation_error_create_manpower_allocation_budgeted_amount_required'),
  });

  return (
    <div
      className="modal fade px-0"
      id="createManpowerAllocation"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header mx-3">
            <h5 className="modal-title app-primary-color">{t('manpowerallocation_create_modal_title')}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="closecreateManpowerAllocation"
              onClick={onModalClose}
              ref={modalRef}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="manpower">
              <ValidationErrorComp errors={errors} />
              <ContainerPage>
                <div className="col-md-12" >
                  <div className="mb-1">
                    <label className='red-asterisk'>{t('manpowerallocation_create_label_customer_site')}</label>
                    <Select
                      options={selectCustomerSiteIdList}
                      onChange={(selectedOption) => onSelectChange(selectedOption, "CustomerSiteId")}
                      value={selectCustomerSiteIdList && selectCustomerSiteIdList.find(option => option.value === manpowerallocation.CustomerSiteId) || null}
                      isSearchable
                      name="CustomerSiteId"
                      placeholder="Select option"
                    />
                    <div className="small text-danger"> {t(errors['CustomerSiteId'])}</div>
                  </div>
                  <div className="mb-1 mt-2">
                    <label className='red-asterisk'>{t('manpowerallocation_create_label_employee_name')}</label>
                    <Select
                      options={selectEngineersList}
                      onChange={(selectedOption) => onSelectChange(selectedOption, "EmployeeId")}
                      value={selectEngineersList && selectEngineersList.find(option => option.value === manpowerallocation.EmployeeId) || null}
                      isSearchable
                      name="EmployeeId"
                      placeholder="Select option"
                    />
                    <div className="small text-danger"> {t(errors['EmployeeId'])}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-2">
                      <label className='red-asterisk'>{t('manpowerallocation_create_label_customer_agreed_amount')}</label>
                      <input name="CustomerAgreedAmount" onChange={onUpdateField} type="text" className="form-control" value={manpowerallocation.CustomerAgreedAmount ?? ""}></input>
                      <div className="small text-danger"> {t(errors['CustomerAgreedAmount'])}</div>
                    </div>
                  </div>
                  <div className="mb-1">
                    <label>{t('manpowerallocation_create_label_startdate')}</label>
                    <input type="date" name="StartDate" onChange={onUpdateField} value={manpowerallocation.StartDate ?? ""} className="form-control"></input>
                  </div>
                  <div className="mb-1">
                    <label>{t('manpowerallocation_create_label_enddate')}</label>
                    <input type="date" name="EndDate" onChange={onUpdateField} value={manpowerallocation.EndDate ?? ""} className="form-control"></input>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-2">
                      <label className='red-asterisk'>{t('manpowerallocation_create_label_budgeted_amount')}</label>
                      <input name="BudgetedAmount" value={manpowerallocation.BudgetedAmount ?? ""} onChange={onUpdateField} type="text" className="form-control" ></input>
                      <div className="small text-danger"> {t(errors['BudgetedAmount'])}</div>
                    </div>
                    <div className="col-md-12 mt-2">
                      <label>{t('manpowerallocation_create_label_remarks')}</label>
                      <textarea name="Remarks" value={manpowerallocation.Remarks ?? ""} onChange={onUpdateField} className="form-control" ></textarea>
                    </div>
                  </div>
                  <button type="button" onClick={() => onSubmit(manpowerallocation)} className="btn app-primary-bg-color text-white mt-2">{t('manpower_create_button_create_manpower')}</button><div>    <br></br></div>
                  {/* Create manpower form ends here */}
                  {displayInformationModal ? <InformationModal /> : ""}
                </div>
              </ContainerPage>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  async function GetMasterDataItems() {
    store.dispatch(initializeManPowerAlloctaion());
    store.dispatch(updateField({ name: "ContractId", value: ContractId }));
    if (visibleModal == MODAL_NAME) {
      try {
        const Customers = await getContractCustomerSites(ContractId);
        store.dispatch(loadCustomerSite(Customers));

        const ServiceEngineers = await getEngineersNames();
        store.dispatch(loadServiceEngineers(ServiceEngineers));
      } catch (error) {
        console.error(error);
      }
    }
  }

  function onUpdateField(ev: any) {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof CreateManpowerAllocationState["manpowerallocation"], value }));
  }

  async function onSubmit(allocation: ManpowerAllocationCreate) {
    try {
      await validationSchema.validate(store.getState().createmanpowerallocation.manpowerallocation, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader())
    const result = await manpowerAllocationCreate(store.getState().createmanpowerallocation.manpowerallocation);
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: (e) => {
        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(formattedErrors))
      },
    });
    store.dispatch(stopPreloader())
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title="Success" onConfirm={reDirectRoute}>
        {t('manpowerallocation_alert_success_message')}
      </SweetAlert>
    );
  }

  async function reDirectRoute() {
    store.dispatch(toggleInformationModalStatus());
    document.getElementById("closecreateManpowerAllocation")?.click();
    const result = await getManPowerAllocationList("", 1, ContractId);
    store.dispatch(loadManPowerAllocations(result));
    modalRef.current?.click()
  }
  function onSelectChange(selectedOption: any, Name: any) {
    var value = selectedOption.value
    var name = Name
    store.dispatch(updateField({ name: name as keyof CreateManpowerAllocationState['manpowerallocation'], value }));
  }
}