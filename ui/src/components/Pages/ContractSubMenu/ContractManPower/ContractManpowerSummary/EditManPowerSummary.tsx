import { store } from '../../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  initializeManPowerUpdate,
  EditManPowerSummaryState,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
} from './EditManPowerSummary.slice';
import { ManPowerEditTemplate } from '../../../../../types/manpower';
import { editEmployee } from '../../../../../services/manpowers';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithThreeArg } from '../../../../../helpers/formats';
import { loadCustomerSite, loadMasterData, loadTenantOffices } from './EditManPowerSummary.slice';
import { getContractCustomerSites } from '../../../../../services/customer';
import { getValuesInMasterDataByTable } from '../../../../../services/masterData';
import Select from 'react-select';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';
import { useParams } from 'react-router-dom';
import { getUserTenantOfficeName } from '../../../../../services/users';

export function EditManPowerSummary() {
  const { t, i18n } = useTranslation();
  const { manpoweredit: { manpowersummary, displayInformationModal, CustomerSites, TenantOffices, masterDataList, errors }, manpowermanagement: { visibleModal } } = useStore(
    ({ manpoweredit, manpowermanagement }) => ({ manpoweredit, manpowermanagement })
  );
  const MODAL_NAME = "manpoweredit"
  const [selectCustomerSiteIdList, setSelectCustomerSiteIdList] = useState<any>(null)

  useEffect(() => {
    setSelectCustomerSiteIdList(formatSelectInput(CustomerSites, "SiteName", "Id"))
  }, [CustomerSites])

  const { ContractId } = useParams<{ ContractId: string }>();
  useEffect(() => {
    GetMasterDataItems()
  }, [ContractId && visibleModal == MODAL_NAME]);

  function onSelectChange(selectedOption: any, actionMeta: any) {
    const name = actionMeta.name;
    const value = selectedOption.value;
    store.dispatch(updateField({ name: name as keyof EditManPowerSummaryState['manpowersummary'], value }));
  }

  const validationSchema = yup.object().shape({
    CustomerSiteId: yup.number().positive(('validation_error_manpower_edit_customersite_required') ?? ''),
    TenantOfficeInfoId: yup.number().positive(('Validation_error_manpower_edit_msp_location_required') ?? ''),
    EngineerMonthlyCost: yup.string().required(('validation_error_manpower_edit_engineer_monthly_cost_required') ?? ''),
    EngineerCount: yup.string().required(('validation_error_manpower_edit_engineer_count_required') ?? ''),
    EngineerTypeId: yup.number().positive(('validation_error_manpower_edit_engineer_required') ?? ''),
    EngineerLevelId: yup.number().positive(('validation_error_manpower_edit_engineer_level_required') ?? ''),
    CustomerAgreedAmount: yup.string().required(('validation_error_manpower_customer_agreed_amount_required') ?? ''),
    DurationInMonth: yup.string().required(('validation_error_manpower_edit_duration_in_month_required') ?? ''),
  });

  return (
    <div className="auth-page">
      <ContainerPage>
        <ValidationErrorComp errors={errors} />
        <div className="col-md-12" >
          {/* Create manpower summary form */}
          <div className="mb-1">
            <label className='red-asterisk'>{t('manpower_create_label_customer_site')}</label>
            <Select
              options={selectCustomerSiteIdList}
              onChange={onSelectChange}
              value={selectCustomerSiteIdList && selectCustomerSiteIdList.find(option => option.value === manpowersummary.CustomerSiteId)}
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
              onChange={onSelectChange}
              value={TenantOffices && TenantOffices.find(option => option.value === manpowersummary.TenantOfficeInfoId)}
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
                onChange={onSelectChange}
                value={masterDataList.EngineerType && masterDataList.EngineerType.find(option => option.value === manpowersummary.EngineerTypeId)}
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
                onChange={onSelectChange}
                value={masterDataList.EngineerLevel && masterDataList.EngineerLevel.find(option => option.value === manpowersummary.EngineerLevelId)}
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
              <input name="CustomerAgreedAmount" value={manpowersummary.CustomerAgreedAmount} onChange={onUpdateField} type="number" className="form-control" ></input>
              <div className="small text-danger"> {t(errors['CustomerAgreedAmount'])}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-2">
              <label className='red-asterisk'>{t('manpower_create_label_engineermonthly_cost')}</label>
              <input name="EngineerMonthlyCost" value={manpowersummary.EngineerMonthlyCost} onChange={onUpdateField} type="number" className="form-control" ></input>
              <div className="small text-danger"> {t(errors['EngineerMonthlyCost'])}</div>
            </div>
            <div className="col-md-12 mt-2">
              <label className='red-asterisk'>{t('manpower_create_label_engineercount')}</label>
              <input name="EngineerCount" value={manpowersummary.EngineerCount} onChange={onUpdateField} type="text" className="form-control" ></input>
              <div className="small text-danger"> {t(errors['EngineerCount'])}</div>
            </div>
            <div className="col-md-12 mt-2">
              <label className='red-asterisk'>{t('manpower_create_label_duration_in_month')}</label>
              <input name="DurationInMonth" value={manpowersummary.DurationInMonth} onChange={onUpdateField} type="text" className="form-control" ></input>
              <div className="small text-danger"> {t(errors['DurationInMonth'])}</div>
            </div>
            <div className="col-md-12 mt-2">
              <label>{t('manpower_create_label_remarks')}</label>
              <textarea name="Remarks" value={manpowersummary.Remarks == null ? "" : manpowersummary.Remarks} onChange={onUpdateField} className="form-control" ></textarea>
              <div className="small text-danger"> {errors['Remarks']}</div>
            </div>
          </div>

          <button type="button" onClick={onSubmit(manpowersummary)} className="btn app-primary-bg-color text-white mt-2">{t('manpower_create_button_create_manpower')}</button><div>    <br></br></div>
          {/* Create manpower form ends here */}
          {displayInformationModal ? <InformationModal /> : ""}
        </div>
      </ContainerPage>
    </div>
  );

  function onUpdateField(ev: any) {
    var name = ev.target.name
    var value = ev.target.value
    store.dispatch(updateField({ name: name as keyof EditManPowerSummaryState["manpowersummary"], value }));

  }
  async function GetMasterDataItems() {
    store.dispatch(initializeManPowerUpdate());
    store.dispatch(updateField({ name: "ContractId", value: ContractId }));
    if (visibleModal == MODAL_NAME) {
      try {
        const TenantLocations = await getUserTenantOfficeName();
        const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, "OfficeName", "Id")
        store.dispatch(loadTenantOffices({ Select: TenantLocation }));

        const Customers = await getContractCustomerSites(store.getState().manpoweredit.manpowersummary.ContractId.toString());
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

  function onSubmit(manpower: ManPowerEditTemplate) {

    return async (ev: React.FormEvent) => {
      ev.preventDefault();
      store.dispatch(updateErrors({}));
      store.dispatch(updateErrors({}))
      try {
        await validationSchema.validate(store.getState().manpoweredit.manpowersummary, { abortEarly: false });
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
      const result = await editEmployee(store.getState().manpoweredit.manpowersummary);
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
        {t('edit_manpower_alert_manpower_updated_successfully')}
      </SweetAlert>
    );
  }

  function reDirectRoute() {
    store.dispatch(toggleInformationModalStatus());
    document.getElementById("closeEditManPowerModal")?.click();
    window.location.reload();
  }

} 