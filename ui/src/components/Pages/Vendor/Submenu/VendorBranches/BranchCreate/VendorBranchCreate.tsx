import SweetAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import {
  initializeVendorBranchCreate, updateField, updateErrors, toggleInformationModalStatus, CreateVendorBranchState, loadSelectDetails
} from './VendorBranchCreate.slice'
import * as yup from 'yup';
import Select from 'react-select';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { dispatchOnCall, store } from '../../../../../../state/store';
import { checkForPermission } from '../../../../../../helpers/permissions';
import { getTenantOfficeInfo } from '../../../../../../services/tenantOfficeInfo';
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithCode, formatSelectInputWithThreeArgParenthesis } from '../../../../../../helpers/formats';
import { getFilteredStatesByCountry } from '../../../../../../services/state';
import { getFilteredCitiesByState } from '../../../../../../services/city';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { createVendorBranch, getVendorBranchList } from '../../../../../../services/vendorBranch';
import { loadVendorBranches } from '../VendorBranches.slice';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { ValidationErrorComp } from '../../../../../ValidationErrors/ValidationError';
import { getValuesInMasterDataByTable } from '../../../../../../services/masterData';
import { getCountries } from '../../../../../../services/country';
import { useParams } from 'react-router-dom';
import { getUserTenantOfficeName } from '../../../../../../services/users';
import { createGstNumberValidation } from '../../../../../../helpers/validationformats';

export const VendorBranchCreate = () => {
  const modalRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const { VendorId } = useParams<{ VendorId: string }>();

  const { vendorBranch, displayInformationModal, errors, selectDetails } = useStoreWithInitializer(({ vendorbranchcreate }) => vendorbranchcreate,
    dispatchOnCall(initializeVendorBranchCreate()))

  useEffect(() => {
    if (checkForPermission("VENDORBRANCH_CREATE")) {
      onLoad();
    }
  }, []);

  const onLoad = async () => {
    try {
      store.dispatch(updateField({ name: "VendorId", value: VendorId }));

      const  TenantLocations  = await getUserTenantOfficeName();
      const filteredTenantOfiiceInfo = formatSelectInput(TenantLocations.TenantOfficeName, "OfficeName", "Id")
      store.dispatch(loadSelectDetails({ name: 'Location', value: { Select: filteredTenantOfiiceInfo } }));

      var { MasterData } = await getValuesInMasterDataByTable('GstVendorType');
      const filteredGstVendorTypeType = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadSelectDetails({ name: 'GstVendorType', value: { Select: filteredGstVendorTypeType } }));

      const Countries = await getCountries();
      const filteredCountries = await formatSelectInputWithCode(Countries.Countries, "Name","Id","CallingCode" )
      store.dispatch(loadSelectDetails({ name: 'Countrys', value: { Select: filteredCountries } }));

      const data = filteredCountries.filter(item => item.value == store.getState().vendorbranchcreate.vendorBranch.CountryId)
      store.dispatch(updateField({ name: 'ContactNumberOneCountryCode', value:data[0].code }));

      const filteredCountryCode = await formatSelectInputWithThreeArgParenthesis(Countries.Countries, "CallingCode", "Name", "CallingCode")
      store.dispatch(loadSelectDetails({ name: 'PrimaryCountryCode', value: { Select: filteredCountryCode } }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (vendorBranch.CountryId !== 0) {
      getFilteredStates()
    }
  }, [vendorBranch.CountryId])

  const getFilteredStates = async () => {
    const { States } = await getFilteredStatesByCountry(vendorBranch.CountryId.toString());
    const filteredStates = await formatSelectInput(States, "Name", "Id")
    store.dispatch(loadSelectDetails({ name: 'States', value: { Select: filteredStates } }));
  }

  useEffect(() => {
    if (vendorBranch.StateId != 0) {
      getFilteredCities()
    }
  }, [vendorBranch.StateId])

  const getFilteredCities = async () => {
    const { Cities } = await getFilteredCitiesByState(vendorBranch.StateId.toString());
    const filteredCities = await formatSelectInput(Cities, "Name", "Id")
    store.dispatch(loadSelectDetails({ name: 'Cities', value: { Select: filteredCities } }));
  }

  const validationSchema = yup.object().shape({
    Name: yup.string().required('validation_error_vendorbranch_create_name_required'),
    Code: yup.string().required('validation_error_vendorbranch_create_code_required'),
    Address: yup.string().required('validation_error_vendorbranch_create_address_required'),
    TenantOfficeId: yup.number().positive('validation_error_vendorbranch_create_tenantoffice_required'),
    CityId: yup.number().positive('validation_error_vendorbranch_create_city_required'),
    StateId: yup.number().positive('validation_error_vendorbranch_create_state_required'),
    CountryId: yup.number().positive('validation_error_vendorbranch_create_country_required'),
    Pincode: yup.string().required('validation_error_vendorbranch_create_pincode_required'),
    ContactName: yup.string().required('validation_error_vendorbranch_create_contactname_required'),
    Email: yup.string().email('validation_error_vendorbranch_create_invalid_email_required').required('validation_error_vendorbranch_create_email_required'),
    ContactNumberOneCountryCode: yup.string().required('validation_error_vendorbranch_create_primaryccode_required'),
    ContactNumberOne: yup.string().required('validation_error_vendorbranch_create_primarycname_required'),
    CreditPeriodInDays: yup.string().required('validation_error_vendorbranch_create_creditperiod_indays_required'),
    GstNumber: createGstNumberValidation(t('validation_error_vendorbranch_create_gstno_required'), t('validation_error_vendorbranch_create_gstnumber_checking_rule') ?? ''),
    GstArn: yup.string().required('validation_error_vendorbranch_create_gstarn_required'),
    GstVendorTypeId: yup.number().positive('validation_error_vendorbranch_create_gstvendortype_required'),
  });

  const onModalClose = () => {
    store.dispatch(initializeVendorBranchCreate())
    onLoad()
  }

  const onSubmit = async () => {
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(vendorBranch, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader());
    const result = await createVendorBranch(store.getState().vendorbranchcreate.vendorBranch);
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: async (e) => {
        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(formattedErrors))
      },
    });
    store.dispatch(stopPreloader())
  }

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof CreateVendorBranchState['vendorBranch'], value }));
  }

  const onSelectChange = (selectedOption: any, actionMeta: any) => {
    var value = selectedOption.value
    var name = actionMeta.name
    if(name=="CountryId"){
      store.dispatch(updateField({ name:'ContactNumberOneCountryCode', value : selectedOption.code})); 
    }
    store.dispatch(updateField({ name: name as keyof CreateVendorBranchState['vendorBranch'], value }));
  }

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('vendorbranch_create_success')}
      </SweetAlert>
    );
  }
  const reDirectRoute = async () => {
    store.dispatch(initializeVendorBranchCreate())
    document.getElementById('closeCreateVendorBranchModal')?.click();
    const result = await getVendorBranchList(store.getState().vendorbranchlist.currentPage, store.getState().vendorbranchlist.search, VendorId);
    store.dispatch(loadVendorBranches(result));
    onLoad()
  }

  return (
    <>
      {checkForPermission("VENDORBRANCH_CREATE") &&
        <div
          className="modal fade"
          id='CreateVendorBranch'
          data-bs-backdrop='static'
          data-bs-keyboard='false'
          aria-hidden='true'
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header mx-2">
                <h5 className="modal-title">{t('vendorbranch_create_modal')}</h5>
                <button
                  type='button'
                  className="btn-close"
                  data-bs-dismiss='modal'
                  id='closeCreateVendorBranchModal'
                  aria-label='Close'
                  onClick={onModalClose}
                  ref={modalRef}
                ></button>
              </div>
              <div className="modal-body">
                <ContainerPage>
                  <ValidationErrorComp errors={errors} />
                  <div className="col-md-12" >
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbranch_create_teantlocation')}</label>
                      <Select
                        options={selectDetails.Location}
                        value={selectDetails.Location && selectDetails.Location.find(option => option.value == vendorBranch.TenantOfficeId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="TenantOfficeId"
                        placeholder="Select Accel Location"
                      />
                      <div className="small text-danger"> {t(errors['TenantOfficeId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbranch_create_code')}</label>
                      <input onChange={onUpdateField} name="Code" value={vendorBranch.Code} type="text" className={`form-control  ${errors["Code"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['Code'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbranch_create_name')}</label>
                      <input onChange={onUpdateField} name="Name" value={vendorBranch.Name} type="text" className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['Name'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbranch_create_address')}</label>
                      <textarea onChange={onUpdateField} name="Address" value={vendorBranch.Address} className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`} style={{ height: "100px", resize: "vertical" }}></textarea>
                      <div className="invalid-feedback "> {t(errors['Address'])}</div>
                    </div>
                    <div className="mb-1 mt-1">
                      <label className="red-asterisk">{t('vendorbranch_create_country')}</label>
                      <Select
                        options={selectDetails.Countrys}
                        value={selectDetails.Countrys && selectDetails.Countrys.find(option => option.value == vendorBranch.CountryId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="CountryId"
                        placeholder={t('create_customer_site_select_state_id')}
                      />
                      <div className="small text-danger"> {t(errors['CountryId'])}</div>
                    </div>
                    <div className="mb-1 mt-1">
                      <label className="red-asterisk">{t('vendorbranch_create_state')}</label>
                      <Select
                        options={selectDetails.States}
                        value={selectDetails.States && selectDetails.States.find(option => option.value == vendorBranch.StateId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="StateId"
                        placeholder={t('create_customer_site_select_state_id')}
                      />
                      <div className="small text-danger"> {t(errors['StateId'])}</div>
                    </div>
                    <div className="mb-1 mt-1">
                      <label className="red-asterisk">{t('vendorbranch_create_city')}</label>
                      <Select
                        options={selectDetails.Cities}
                        value={selectDetails.Cities && selectDetails.Cities.find(option => option.value == vendorBranch.CityId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="CityId"
                        placeholder={t('create_customer_site_select_city_id')}
                      />
                      <div className="small text-danger"> {t(errors['CityId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbranch_create_pincode')}</label>
                      <input onChange={onUpdateField} name="Pincode" value={vendorBranch.Pincode} className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`}></input>
                      <div className="invalid-feedback"> {t(errors['Pincode'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbranch_create_contactname')}</label>
                      <input onChange={onUpdateField} name="ContactName" value={vendorBranch.ContactName} type="text" className={`form-control  ${errors["ContactName"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['ContactName'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbranch_create_email')}</label>
                      <input onChange={onUpdateField} name="Email" value={vendorBranch.Email} className={`form-control  ${errors["Email"] ? "is-invalid" : ""}`} ></input>
                      <div className="invalid-feedback"> {t(errors['Email'])}</div>
                    </div>
                    <div className="row">
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendorbranch_create_gstno')}</label>
                        <input onChange={onUpdateField} name="GstNumber" value={vendorBranch.GstNumber} className={`form-control  ${errors["GstNumber"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['GstNumber'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendorbranch_create_gstarnno')}</label>
                        <input onChange={onUpdateField} name="GstArn" value={vendorBranch.GstArn} className={`form-control  ${errors["GstArn"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['GstArn'])}</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendorbranch_create_gstvendortype')}</label>
                        <Select
                          options={selectDetails.GstVendorType}
                          value={selectDetails.GstVendorType && selectDetails.GstVendorType.find(option => option.value == vendorBranch.GstVendorTypeId) || null}
                          onChange={onSelectChange}
                          isSearchable
                          name="GstVendorTypeId"
                          placeholder={t('create_customer_site_select_city_id')}
                        />
                        <div className="small text-danger"> {t(errors['GstVendorTypeId'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendorbranch_create_creditperiodindays')}</label>
                        <input onChange={onUpdateField} name="CreditPeriodInDays" value={vendorBranch.CreditPeriodInDays} type="text" className={`form-control  ${errors["CreditPeriodInDays"] ? "is-invalid" : ""}`} />
                        <div className="invalid-feedback"> {t(errors['CreditPeriodInDays'])}</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendor_create_primaryno_code')}</label>
                        <Select
                          options={selectDetails.PrimaryCountryCode}
                          value={selectDetails.PrimaryCountryCode && selectDetails.PrimaryCountryCode.find(option => option.value == vendorBranch.ContactNumberOneCountryCode) || null}
                          onChange={onSelectChange}
                          isSearchable
                          name="ContactNumberOneCountryCode"
                          placeholder={t('create_customer_site_select_city_id')}
                        />
                        <div className="invalid-feedback"> {t(errors['ContactNumberOneCountryCode'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendorbranch_create_primaryno')}</label>
                        <input onChange={onUpdateField} name="ContactNumberOne" value={vendorBranch.ContactNumberOne} className={`form-control  ${errors["ContactNumberOne"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['ContactNumberOne'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label >{t('vendorbranch_create_secondaryno_code')}</label>
                        <input onChange={onUpdateField} name="ContactNumberTwoCountryCode" value={vendorBranch.ContactNumberTwoCountryCode} type="text" className={`form-control  ${errors["ContactNumberTwoCountryCode"] ? "is-invalid" : ""}`} />
                        <div className="invalid-feedback"> {errors['ContactNumberTwoCountryCode']}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label >{t('vendorbranch_create_secondno')}</label>
                        <input onChange={onUpdateField} name="ContactNumberTwo" value={vendorBranch.ContactNumberTwo} className={`form-control  ${errors["ContactNumberTwo"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {errors['ContactNumberTwo']}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label >{t('vendorbranch_create_tollfreeno')}</label>
                        <input onChange={onUpdateField} name="TollfreeNumber" value={vendorBranch.TollfreeNumber} className={`form-control  ${errors["TollfreeNumber"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {errors['TollfreeNumber']}</div>
                      </div>
                    </div>
                    <div className='mb-1'>
                      <label className="mt-2">{t('vendorbranch_create_remarks')}</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        name="Remarks"
                        maxLength={128}
                        onChange={onUpdateField}
                      ></textarea>
                    </div>
                    <button type="button" onClick={onSubmit} className="btn  app-primary-bg-color text-white mt-2 float-end">{t('vendorbranch_create_create_button')}</button>
                    {displayInformationModal ? <InformationModal /> : ''}
                  </div>
                </ContainerPage>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}