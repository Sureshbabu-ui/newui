import { store } from '../../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import {
  initializeManpowerSummary,
  CreateEmployeeState,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
  loadCustomerSite,
  loadMasterData,
  loadTenantlocations
} from './ManPowerSummaryCreate.slice';
import * as yup from 'yup';
import { createManpowerAllocation, getManPowerSummaryList } from '../../../../../services/manpowers';
import { ManpowerSummaryCreation } from '../../../../../types/manpower';
import { getContractCustomerSites } from '../../../../../services/customer';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../../helpers/formats';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';
import { getValuesInMasterDataByTable } from '../../../../../services/masterData';
import { loadManPower } from './ManPowerSummaryList.slice';
import { getUserTenantOfficeName } from '../../../../../services/users';

export function ManPowerSummaryCreate() {
  const { t, i18n } = useTranslation();
  const modalRef = useRef<HTMLButtonElement>(null);
  const { manpowersummarycreate: { manpowersummary, displayInformationModal, masterDataList, CustomerSites, TenantOffices, errors }, manpowermanagement: { visibleModal } } = useStore(
    ({ manpowersummarycreate, manpowermanagement }) => ({ manpowersummarycreate, manpowermanagement }));
  const MODAL_NAME = "createNewManpower"
  const { ContractId } = useParams<{ ContractId: string }>();

  useEffect(() => {
    GetMasterDataItems()
  }, [ContractId && visibleModal == MODAL_NAME]);

  const validationSchema = yup.object().shape({
    CustomerSiteId: yup.number().positive('validation_error_manpower_create_customersite_required'),
    TenantOfficeInfoId: yup.number().positive('Validation_error_manpower_create_msp_location_required'),
    EngineerCount: yup.string().required('validation_error_manpower_create_engineer_count_required'),
    EngineerTypeId: yup.number().positive('validation_error_manpower_create_engineer_required'),
    EngineerLevelId: yup.number().positive('validation_error_manpower_create_engineer_level_required'),
    CustomerAgreedAmount: yup.string().required('validation_error_manpower_customer_agreed_amount_required')
      .test({
        name: 'is-number',
        test: (value) => {
          return !isNaN(Number(value));
        },
        message: 'Customer Agreed Amount must be a valid number.',
      })
      .test({
        name: 'max-value',
        test: (value) => {
          const parsedValue = parseFloat(value);
          return isNaN(parsedValue) || parsedValue <= 99999999999999.99;
        },
        message: `${t('validation_error_manpower_customer_agreed_amount_exceed')}`,
      }),
    EngineerMonthlyCost: yup.string().required(t('validation_error_manpower_create_engineer_monthly_cost_required') ?? '')
      .test({
        name: 'is-number',
        test: (value) => {
          return !isNaN(Number(value));
        },
        message: 'Engineer Monthly Cost must be a valid number.',
      })
      .test({
        name: 'max-value',
        test: (value) => {
          const parsedValue = parseFloat(value);
          return isNaN(parsedValue) || parsedValue <= 99999999999999.99;
        },
        message: `${t('validation_error_manpower_engineer_monthly_cost_exceed')}`,
      }),
    DurationInMonth: yup.string().required(t('validation_error_manpower_create_duration_in_month_required') ?? ''),
  });

  const [selectCustomerSiteIdList, setSelectCustomerSiteIdList] = useState<any>(null)
  useEffect(() => {
    setSelectCustomerSiteIdList(formatSelectInput(CustomerSites, "SiteName", "Id"))
  }, [CustomerSites])

  async function GetMasterDataItems() {
    store.dispatch(initializeManpowerSummary());
    store.dispatch(updateField({ name: "ContractId", value: ContractId }));
    if (visibleModal == MODAL_NAME) {
      try {
        const TenantLocations = await getUserTenantOfficeName();
        const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
        store.dispatch(loadTenantlocations({ Select: TenantLocation }));

        const Customers = await getContractCustomerSites(ContractId);
        store.dispatch(loadCustomerSite(Customers));

        var { MasterData } = await getValuesInMasterDataByTable("EngineerType")
        const engineerType = await formatSelectInput(MasterData, "Name", "Id")
        store.dispatch(loadMasterData({ name: "EngineerType", value: { Select: engineerType } }));

        var { MasterData } = await getValuesInMasterDataByTable("EngineerLevel")
        const engineerLevel = await formatSelectInput(MasterData, "Name", "Id")
        store.dispatch(loadMasterData({ name: "EngineerLevel", value: { Select: engineerLevel } }));
      } catch (error) {
        console.error(error);
      }
    }
  }

  function onUpdateField(ev: any) {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof CreateEmployeeState["manpowersummary"], value }));
  }

  function onSubmit(employee: ManpowerSummaryCreation) {

    return async (ev: React.FormEvent) => {
      ev.preventDefault();
      store.dispatch(updateErrors({}));
      store.dispatch(updateErrors({}))
      try {
        await validationSchema.validate(store.getState().manpowersummarycreate.manpowersummary, { abortEarly: false });
      } catch (error: any) {
        const errors = error.inner.reduce((allErrors: any, currentError: any) => {
          return { ...allErrors, [currentError.path as string]: currentError.message };
        }, {});
        store.dispatch(updateErrors(errors));
        if (errors)
          return;
      }
      store.dispatch(startPreloader())
      store.dispatch(startSubmitting());
      const result = await createManpowerAllocation(store.getState().manpowersummarycreate.manpowersummary);
      // call API
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
      store.dispatch(stopPreloader())
    };
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title="Success" onConfirm={reDirectRoute}>
        {t('manpower_create_alert_manpower_created_successfully')}
      </SweetAlert>
    );
  }

  async function reDirectRoute() {
    store.dispatch(toggleInformationModalStatus());
    modalRef.current?.click()
    const result = await getManPowerSummaryList("", 1, ContractId);
    store.dispatch(loadManPower(result));
  }

  const onModalClose = () => {
    store.dispatch(initializeManpowerSummary())
  }

  function onSelectChange(selectedOption: any, Name: any) {
    var value = selectedOption.value
    var name = Name
    store.dispatch(updateField({ name: name as keyof CreateEmployeeState['manpowersummary'], value }));
  }

  return (
    <div
      className="modal fade px-0"
      id="createNewManpower"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header mx-3">
            <h5 className="modal-title app-primary-color">{t('manpowermanagement_modal_title_add_manpower')}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="closeCreateManpowerModal"
              onClick={onModalClose}
              aria-label="Close"
              ref={modalRef}
            ></button>
          </div>
          <div className="modal-body">
            <div className="manpower">
              <ContainerPage>
                <ValidationErrorComp errors={errors} />
                <div className="col-md-12" >
                  {/* Create manpower summary form */}
                  <div className="mb-1">
                    <label className='red-asterisk'>{t('manpower_create_label_customer_site')}</label>
                    <Select
                      options={selectCustomerSiteIdList}
                      onChange={(selectedOption) => onSelectChange(selectedOption, "CustomerSiteId")}
                      value={selectCustomerSiteIdList && selectCustomerSiteIdList.find(option => option.value === manpowersummary.CustomerSiteId) || null}
                      isSearchable
                      name="CustomerSiteId"
                      placeholder="Select option"
                    />
                    <div className="small text-danger"> {t(errors['CustomerSiteId'])}</div>
                  </div>
                  <div className="mb-1 mt-2">
                    <label className='red-asterisk'>{t('manpower_create_label_location')}</label>
                    <Select
                      options={TenantOffices}
                      onChange={(selectedOption) => onSelectChange(selectedOption, "TenantOfficeInfoId")}
                      value={TenantOffices && TenantOffices.find(option => option.value === manpowersummary.TenantOfficeInfoId) || null}
                      isSearchable
                      name="TenantOfficeInfoId"
                      placeholder="Select option"
                    />
                    <div className="small text-danger"> {t(errors['TenantOfficeInfoId'])}</div>
                  </div>
                  <div className="row mb-1">
                    <div className="col-md-12 mt-1">
                      <label className='red-asterisk'>{t('manpower_create_label_engineer_type')}</label>
                      <Select
                        options={masterDataList.EngineerType}
                        onChange={(selectedOption) => onSelectChange(selectedOption, "EngineerTypeId")}
                        value={masterDataList.EngineerType && masterDataList.EngineerType.find(option => option.value === manpowersummary.EngineerTypeId) || null}
                        isSearchable
                        name="EngineerTypeId"
                        placeholder="Select option"
                      />
                      <div className="small text-danger"> {t(errors['EngineerTypeId'])}</div>
                    </div>
                    <div className="col-md-12 mt-2">
                      <label className='red-asterisk'>{t('manpower_create_label_engineer_level')}</label>
                      <Select
                        options={masterDataList.EngineerLevel}
                        onChange={(selectedOption) => onSelectChange(selectedOption, "EngineerLevelId")}
                        value={masterDataList.EngineerLevel && masterDataList.EngineerLevel.find(option => option.value === manpowersummary.EngineerLevelId) || null}
                        isSearchable
                        name="EngineerLevelId"
                        placeholder="Select option"
                      />
                      <div className="small text-danger"> {t(errors['EngineerLevelId'])}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-2">
                      <label className='red-asterisk'>{t('manpower_create_label_customer_agreed_amount')}</label>
                      <input name="CustomerAgreedAmount" value={manpowersummary.CustomerAgreedAmount ?? null} onChange={onUpdateField} type="string" className="form-control" ></input>
                      <div className="small text-danger"> {t(errors['CustomerAgreedAmount'])}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-2">
                      <label className='red-asterisk'>{t('manpower_create_label_engineermonthly_cost')}</label>
                      <input name="EngineerMonthlyCost" onChange={onUpdateField} value={manpowersummary.EngineerMonthlyCost ?? null} type="text" className="form-control" ></input>
                      <div className="small text-danger"> {errors['EngineerMonthlyCost']}</div>
                    </div>
                    <div className="col-md-12 mt-2">
                      <label className='red-asterisk'>{t('manpower_create_label_engineercount')}</label>
                      <input name="EngineerCount" onChange={onUpdateField} type="text" value={manpowersummary.EngineerCount ?? null} className="form-control" ></input>
                      <div className="small text-danger"> {t(errors['EngineerCount'])}</div>
                    </div>
                    <div className="col-md-12 mt-2">
                      <label className='red-asterisk'>{t('manpower_create_label_duration_in_month')}</label>
                      <input name="DurationInMonth" value={manpowersummary.DurationInMonth ?? null} onChange={onUpdateField} type="text" className="form-control" ></input>
                      <div className="small text-danger"> {errors['DurationInMonth']}</div>
                    </div>
                    <div className="col-md-12 mt-2">
                      <label>{t('manpower_create_label_remarks')}</label>
                      <textarea name="Remarks" value={manpowersummary.Remarks ?? ""} onChange={onUpdateField} className="form-control" ></textarea>
                      <div className="small text-danger"> {errors['Remarks']}</div>
                    </div>
                  </div>

                  <button type="button" onClick={onSubmit(manpowersummary)} className="btn app-primary-bg-color text-white mt-2">{t('manpower_create_button_create_manpower')}</button><div>    <br></br></div>
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
}