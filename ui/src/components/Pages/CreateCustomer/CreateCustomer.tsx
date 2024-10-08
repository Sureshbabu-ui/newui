import { store } from '../../../state/store';
import { useState, useEffect } from 'react'
import { useStoreWithInitializer } from '../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useHistory } from 'react-router';
import {
  CreateCustomerState,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
  initializeCustomer,
  customerNamesExist,
  isMsme,
  loadTenantOffices,
  loadCountries,
  loadBilledToStates,
  loadShippedToStates,
  loadBilledToCities,
  loadShippedToCities,
  toggleConformationModalStatus,
  loadCustomerIndustries,
  loadMasterData,
  toggleInformationModalDraftStatus
} from './CreateCustomer.slice';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../Preloader/Preloader.slice';
import { checkExistingCustomerNames, createCustomerApproval, createCustomerDraft } from '../../../services/customer';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatDateTime, formatSelectInput, formatSelectInputWithCode } from '../../../helpers/formats';
import { getCustomerGroupNames } from '../../../services/customerGroup';
import { getCountries } from '../../../services/country';
import { getFilteredStatesByCountry } from '../../../services/state';
import { getFilteredCitiesByState } from '../../../services/city';
import * as yup from 'yup';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import BreadCrumb from '../../BreadCrumbs/BreadCrumb';
import { TenantInfoDetails } from '../../../types/user';
import { setActiveTab } from '../CustomerManagement/CustomerManagement.slice';
import { getValuesInMasterDataByTable } from '../../../services/masterData';
import { getUserTenantOfficeName } from '../../../services/users';
import { createGstNumberValidation } from '../../../helpers/validationformats';
import { Link } from 'react-router-dom';

export function CreateCustomer() {
  const { t } = useTranslation();
  const history = useHistory();
  const [isApproved, setIsApproved] = useState(false)

  const { masterDataList, customer, errors, displayInformationDraftModal, displayConformationModal, displayInformationModal, existingCustomers, countries, billedToStates, shippedToStates, shippedToCities, billedToCities, industries } = useStoreWithInitializer(
    ({ customercreate }) => customercreate,
    initializeCustomer
  );
  useEffect(() => {
    GetMasterDataItems()
    onLoad();
  }, []);

  const [TenantOfficeList, setTenantOfficeList] = useState<TenantInfoDetails[]>([]);
  const [formattedOfficeList, setFormattedOfficeList] = useState<any>([])
  const [customergroupList, setCustomergroupList] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false);
  const [existScore, setExistScore] = useState<any>(null);
  const [autoFill, setAutoFill] = useState(false);
  const [hasBillingDetails, sethasBillingDetails] = useState(false);
  const [proceedStatus, setProceedStatus] = useState(false);

  const onLoad = async () => {
    try {
      const CustomerGroups = await getCustomerGroupNames();
      setCustomergroupList(formatSelectInput(CustomerGroups.CustomerGroupNames, "GroupName", "Id"))

      var { MasterData } = await getValuesInMasterDataByTable("CustomerIndustry")
      const CustomerIndustry = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadCustomerIndustries({ Industries: CustomerIndustry }));

      const TenantLocations = await getUserTenantOfficeName();
      setTenantOfficeList(TenantLocations.TenantOfficeName)
      setFormattedOfficeList(formatSelectInput(TenantLocations.TenantOfficeName, "OfficeName", "Id"))
      const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
      store.dispatch(loadTenantOffices({ MasterData: TenantLocation }));
      const Countries = await getCountries();
      const SelectCountries = await formatSelectInput(Countries.Countries, "Name", "Id")
      store.dispatch(loadCountries({ MasterData: SelectCountries }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (customer.BilledToCountryId != null) {
      getFilteredStates("BilledTo")
    }
  }, [customer.BilledToCountryId])

  useEffect(() => {
    if (customer.ShippedToCountryId != null) {
      getFilteredStates("ShippedTo")
    }
  }, [customer.ShippedToCountryId])

  const getFilteredStates = async (StateType) => {
    if (StateType == "BilledTo" && customer?.BilledToCountryId !== null && customer?.BilledToCountryId !== undefined) {
      const States = await getFilteredStatesByCountry(customer.BilledToCountryId.toString());
      const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
      store.dispatch(loadBilledToStates({ MasterData: FilteredStates }))
    }
    else if (StateType == "ShippedTo" && customer?.ShippedToCountryId !== null && customer?.ShippedToCountryId !== undefined) {
      const States = await getFilteredStatesByCountry(customer.ShippedToCountryId.toString());
      const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
      store.dispatch(loadShippedToStates({ MasterData: FilteredStates }))
    }
  }
  useEffect(() => {
    if (
      customer.BilledToAddress !== "" &&
      customer.BilledToCityId !== null &&
      customer.BilledToStateId !== null &&
      customer.BilledToCountryId !== null &&
      customer.BilledToPincode !== "" &&
      (customer.GstTypeCode !== "GCT_RGST" || customer.BilledToGstNumber !== "")
    ) {
      sethasBillingDetails(true);
    } else {
      sethasBillingDetails(false);
    }
  }, [customer.BilledToAddress, customer.BilledToPincode, customer.BilledToGstNumber, customer.BilledToStateId, customer.BilledToCityId, customer.BilledToCountryId])

  useEffect(() => {
    if (customer.BilledToStateId != null) {
      getFilteredCities("BilledTo")
    }
    store.dispatch(updateField({ name: 'BilledToCityId', value: null }));
  }, [customer.BilledToStateId])

  useEffect(() => {
    if (customer.ShippedToStateId != null) {
      getFilteredCities("ShippedTo")
    }
    if (autoFill == false) {
      store.dispatch(updateField({ name: 'ShippedToCityId', value: null }));
    }
  }, [customer.ShippedToStateId])

  const getFilteredCities = async (CityType) => {
    if (CityType === "BilledTo" && customer?.BilledToStateId !== null && customer?.BilledToStateId !== undefined) {
      const Cities = await getFilteredCitiesByState(customer.BilledToStateId.toString());
      const FilteredCities = await formatSelectInput(Cities.Cities, "Name", "Id");
      store.dispatch(loadBilledToCities({ MasterData: FilteredCities }));
    }
    else if (CityType === "ShippedTo" && customer?.ShippedToStateId !== null && customer?.ShippedToStateId !== undefined) {
      const Cities = await getFilteredCitiesByState(customer.ShippedToStateId.toString());
      const FilteredCities = await formatSelectInput(Cities.Cities, "Name", "Id");
      store.dispatch(loadShippedToCities({ MasterData: FilteredCities }));
    }
  }
  const proceedvalidationSchema = yup.object().shape({
    Name: yup.string().trim().required(('validation_error_createcustomer_name_required') ?? ''),
    NameOnPrint: yup.string().trim().required(('validation_error_createcustomer_nameonprint_required') ?? ''),
    TenantOfficeId: yup.string().required(('validation_error_createcustomer_tenantofficeid_required') ?? '').min(1, t('validation_error_createcustomer_tenantofficeid_required') ?? ''),
    CustomerIndustryId: yup.string().required(('validation_error_createcustomer_industry_required') ?? '').min(1, t('validation_error_createcustomer_industry_required') ?? ''),
  });

  const validationSchema = yup.object().shape({
    Name: yup.string().trim().required('validation_error_createcustomer_name_required'),
    PrimaryContactName: yup.string().trim().required('validation_error_updatecustomer_contactname_required'),
    PrimaryContactEmail: yup.string().trim().required('validation_error_createcustomer_contactemail_required'),
    PrimaryContactPhone: yup.string().trim().required('validation_error_createcustomer_contactphone_required'),
    MsmeRegistrationNumber: yup.string().when('IsMsme', (IsMsme, schema) => { return customer.IsMsme == true ? schema.required('Enter MSME Registration Number') : schema }),
    BilledToAddress: yup.string().trim().required('validation_error_createcustomer_billedtoaddress_required'),
    BilledToPincode: yup.string().trim().required('validation_error_createcustomer_billedtopincode_required'),
    BilledToGstNumber: yup.string().when('GstTypeCode', (GstTypeCode, schema) =>
      customer.GstTypeCode === "GCT_RGST"
        ? createGstNumberValidation(
          'validation_error_createcustomer_billedtogstnumber_required',
          'validation_error_createcustomer_billtogstnumber_checking_rule'
        )
        : schema.nullable()
    ),
    ShippedToAddress: yup.string().trim().required('validation_error_createcustomer_shippedtoaddress_required'),
    ShippedToPincode: yup.string().trim().required('validation_error_createcustomer_shippedtopincode_required'),
    GstTypeId: yup.number().required('validation_error_createcustomer_gsttype_required'),
    ShippedToGstNumber: yup.string().when('GstTypeCode', (GstTypeCode, schema) =>
      customer.GstTypeCode === "GCT_RGST"
        ? createGstNumberValidation(
          'validation_error_createcustomer_shippedtgstnumber_required',
          'validation_error_createcustomer_shiptogstnumber_checking_rule'
        )
        : schema.nullable()
    ),
    IsContractCustomer: yup.boolean().required(t('validation_error_createcustomer_iscontractcustomer_required') ?? ''),
    TenantOfficeId: yup.string().required('validation_error_createcustomer_tenantofficeid_required').min(1, ('validation_error_createcustomer_tenantofficeid_required')),
    CustomerIndustryId: yup.string().required(('validation_error_createcustomer_industry_required') ?? '').min(1, t('validation_error_createcustomer_industry_required') ?? ''),
    BilledToCountryId: yup.string().required('validation_error_createcustomer_billedtocountryid_required').min(1, ('validation_error_createcustomer_billedtocountryid_required')),
    BilledToStateId: yup.string().required('validation_error_createcustomer_billedtostateid_required').min(1, ('validation_error_createcustomer_billedtostateid_required')),
    BilledToCityId: yup.string().required('validation_error_createcustomer_billedtocityid_required').min(1, ('validation_error_createcustomer_billedtocityid_required')),
    ShippedToCountryId: yup.number().required('validation_error_createcustomer_shippedtocountryid_required').min(1, ('validation_error_createcustomer_shippedtocountryid_required')),
    ShippedToStateId: yup.string().required('validation_error_createcustomer_shippedtostateid_required').min(1, ('validation_error_createcustomer_shippedtostateid_required')),
    ShippedToCityId: yup.string().required(('validation_error_createcustomer_shippedtostateid_required') ?? '').min(1, t('validation_error_createcustomer_shippedtocityid_required') ?? ''),
    PanNumber: yup.string().required(t('validation_error_customercreate_pannumber_required') ?? '').matches(/^[A-Z]{3}[PHAFCT]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/, t('validation_error_customercreate_pannumber_checking_rule') ?? '')
  });

  async function onSubmit(reviewStatus: string) {
    if (reviewStatus == "ARS_DRFT") {
      store.dispatch(startPreloader());
      var customerApprovalRequestDetails = {
        ...store.getState().customercreate.customer,
        CaseId: '',
        IsDeleted: 0,
        CreatedBy: 0,
        CreatedOn: '',
        UpdatedBy: '',
        UpdatedOn: '',
        ReviewStatus: reviewStatus,
        ApprovedBy: '',
        ApprovedOn: '',
      };
      const result = await createCustomerDraft(customerApprovalRequestDetails);
      result.match({
        ok: (response) => {
          store.dispatch(toggleInformationModalDraftStatus());
        },
        err: async (e) => {
          const formattedErrors = convertBackEndErrorsToValidationErrors(e)
          store.dispatch(updateErrors(formattedErrors))
        },
      });
      store.dispatch(stopPreloader());
    } else {
      try {
        await validationSchema.validate(customer, { abortEarly: false });
      } catch (error: any) {
        const errors = error.inner.reduce((allErrors: any, currentError: any) => {
          return { ...allErrors, [currentError.path as string]: currentError.message };
        }, {});
        store.dispatch(updateErrors(errors))
        if (errors)
          return;
      }
      store.dispatch(startPreloader());
      store.dispatch(startSubmitting());
      var customerApprovalRequestDetails = {
        ...store.getState().customercreate.customer,
        CaseId: '',
        IsDeleted: 0,
        CreatedBy: 0,
        CreatedOn: '',
        UpdatedBy: '',
        UpdatedOn: '',
        ReviewStatus: reviewStatus,
        ApprovedBy: '',
        ApprovedOn: '',
      };
      const result = await createCustomerApproval(customerApprovalRequestDetails);
      store.dispatch(stopSubmitting());
      result.match({
        ok: (response) => {
          setIsApproved(response.IsApproved)
          store.dispatch(toggleInformationModalStatus());
        },
        err: async (e) => {
          const formattedErrors = convertBackEndErrorsToValidationErrors(e)
          store.dispatch(updateErrors(formattedErrors))
        },
      });
      store.dispatch(stopPreloader());
    }
  }

  function DraftInformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectToDraft}>
        {t('create_customer_draft_success')}
      </SweetAlert>
    );
  }

  function reDirectToDraft() {
    store.dispatch(toggleInformationModalStatus());
    history.push("/config/customers")
    if (isApproved == false)
      store.dispatch(setActiveTab('nav-draft'))
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectToPending}>
        {t('create_customer_success_submit_for_review')}
      </SweetAlert>
    );
  }

  function reDirectToPending() {
    store.dispatch(toggleInformationModalStatus());
    history.push("/config/customers")
    if (isApproved == false)
      store.dispatch(setActiveTab('nav-pending'))
  }

  async function filterCustomerName() {
    store.dispatch(updateErrors({}))
    try {
      await proceedvalidationSchema.validate(customer, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    const result = await checkExistingCustomerNames(customer.Name);
    store.dispatch(customerNamesExist(result));
    if (result && result.ExistingCustomerDetails.length > 0) {
      setExistScore(result.ExistingCustomerDetails[0].SCORE)
      setProceedStatus(true)
    }
    else {
      setExistScore(0)
      setProceedStatus(true)
    }
  }

  function onUpdateField(event: any) {
    var name = event.target.name;
    var value = event.target.value;
    var checked = event.target.checked;
    if (name == 'IsMsme' || name == "IsContractCustomer") {
      value = checked ? store.dispatch(isMsme(true)) : store.dispatch(isMsme(false))
      value = checked ? true : false;
    }
    if (name == 'Name') {
      store.dispatch(updateField({ name: 'Name', value }));
      store.dispatch(updateField({ name: 'NameOnPrint', value: value }));
    }
    if (name == 'Name' && customer.Name == "") {
      setProceedStatus(false)
    }
    if (['BilledToPincode', 'BilledToGstNumber', 'BilledToAddress'].includes(name) && autoFill == true) {
      setAutoFill(false)
    }
    store.dispatch(updateField({ name: name as keyof CreateCustomerState['customer'], value }));
  }

  const onSelectChange = (selectedOption: any, actionMeta: any) => {
    var value = selectedOption?selectedOption.value:null;
    var name = actionMeta.name
    store.dispatch(updateField({ name: 'GstTypeCode', value: selectedOption.code }));
    store.dispatch(updateField({ name: name as keyof CreateCustomerState['customer'],value}));
  }

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_manage_customer', Link: '/config/customers' },
    { Text: 'breadcrumbs_create_customer' }
  ];

  useEffect(() => {
    if (autoFill == true) {
      store.dispatch(updateField({ name: "ShippedToCountryId", value: store.getState().customercreate.customer.BilledToCountryId }));
      store.dispatch(updateField({ name: "ShippedToStateId", value: store.getState().customercreate.customer.BilledToStateId }));
      store.dispatch(updateField({ name: "ShippedToCityId", value: store.getState().customercreate.customer.BilledToCityId }));
      store.dispatch(updateField({ name: "ShippedToPincode", value: store.getState().customercreate.customer.BilledToPincode }));
      store.dispatch(updateField({ name: "ShippedToGstNumber", value: store.getState().customercreate.customer.BilledToGstNumber }));
      store.dispatch(updateField({ name: "ShippedToAddress", value: store.getState().customercreate.customer.BilledToAddress }));
    } else {
      store.dispatch(updateField({ name: "ShippedToCountryId", value: 1 }));
      store.dispatch(updateField({ name: "ShippedToStateId", value: 0 }));
      store.dispatch(updateField({ name: "ShippedToCityId", value: 0 }));
      store.dispatch(updateField({ name: "ShippedToPincode", value: "" }));
      store.dispatch(updateField({ name: "ShippedToGstNumber", value: "" }));
      store.dispatch(updateField({ name: "ShippedToAddress", value: "" }));
    }
  }, [autoFill])

  const ToggleConfirmationModal = async () => {
    store.dispatch(toggleConformationModalStatus());
  }

  async function GetMasterDataItems() {
    store.dispatch(initializeCustomer());
    try {
      var { MasterData } = await getValuesInMasterDataByTable("GSTType")
      const gsttype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
      store.dispatch(loadMasterData({ name: "GstType", value: { MasterData: gsttype } }));
      const GstTypeData = MasterData.filter(item => item.Code == "GCT_RGST")[0];
      store.dispatch(updateField({ name: 'GstTypeCode', value: GstTypeData.Code }));
      store.dispatch(updateField({ name: 'GstTypeId', value: GstTypeData.Id }));
    } catch (error) {
      console.error(error);
    }
  }

  const ConfirmationModal = () => {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert
        custom
        showCloseButton
        showCancel
        confirmBtnText="Yes"
        cancelBtnText="No"
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="light"
        title="Are you sure?"
        closeBtnStyle={{ border: "none" }}
        onConfirm={() => {
          initializeCustomer();
          window.location.reload();
        }}
        onCancel={ToggleConfirmationModal}
      >
        {t('update_customer_clear_confirmation_message')}
      </SweetAlert>
    );
  }

  return (
    <ContainerPage>
      <div className='my-2'><div className="mx-4 mt-2">
        <BreadCrumb items={breadcrumbItems} />
      </div>
        <div className="row ms-2 mt-1 me-0">
          {/* Create user form */}
          {/* TODO: For the time being, we are commenting out 'IsContractCustomer' and setting the default value to true. */}
          {/* <div className='row'>
            <div className="form-check form-switch">
              <input
                className="form-check-input switch-input-lg me-2"
                type="checkbox"
                name="IsContractCustomer"
                id="flexSwitchCheckDefault"
                value={customer.IsContractCustomer.toString()}
                onChange={onUpdateField}
              ></input>
              <label className="form-label mb-0 red-asterisk">{t('create_customer_label_is_contractcustomer')}</label>
              <div><small>{t('create_customer_label_is_contractcustomer_help_text')}</small></div>
            </div>
          </div> */}
          <div className="form-check form-switch">
            <input
              className="form-check-input switch-input-lg me-2"
              type="checkbox"
              id="flexSwitchCheckDefault"
              checked={showDropdown}
              onChange={() => setShowDropdown(!showDropdown)}
            /><label>{t('create_customer_label_customergroup_help_text')}</label>
          </div>
          {showDropdown && (
            <div className='mt-1 ps-0'>
              <label className="form-label">{t('create_customer_label_customergroupid')}</label>
              <Select
                options={customergroupList}
                name="CustomerGroupId"
                value={customergroupList && customergroupList.find(option => option.value === customer.CustomerGroupId) || null}
                onChange={onFieldChangeSelect}
                isSearchable
                isClearable
                placeholder={t('create_customer_placeholder_select_customer_group')}
              />
            </div>
          )}
          <div className="mt-2 ps-0">
            <label className="form-label mb-0 red-asterisk">{t('create_customer_label_tenantoffice_id')}</label>
            <Select
              options={formattedOfficeList}
              value={formattedOfficeList && formattedOfficeList.find(option => option.value == customer.TenantOfficeId) || null}
              name="TenantOfficeId"
              isClearable
              onChange={onFieldChangeSelect}
              isSearchable
              placeholder={t('create_customer_select_tenantoffice')}
            />
            <div className="small text-danger"> {t(errors['TenantOfficeId'])}</div>
            {(formattedOfficeList.length > 0 &&
              <div className="text-muted mt-1">
                {(TenantOfficeList.filter((value) => (value.Id == customer.TenantOfficeId)
                )).length > 0 ? `Address : ${(TenantOfficeList.filter((value) => (value.Id == customer.TenantOfficeId)
                ))[0].Address}` : ''}
              </div>
            )}
          </div>
          <div className="mt-1 ps-0">
            <label className="form-label mb-0 red-asterisk">{t('create_customer_label_customer_name')}{proceedStatus}</label>
            <input
              name='Name'
              onChange={onUpdateField}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customer.Name !== "") {
                  filterCustomerName();
                }
              }}
              value={customer.Name}
              autoComplete="off"
              className={`form-control ${errors["Name"] ? "is-invalid" : ""} ${customer.Name !== null && proceedStatus === true ? "-secondary" : ""}`}
              disabled={proceedStatus} // Disable the input when proceedStatus is true
            />
            <div className="small text-danger"> {t(errors['Name'])}</div>
          </div>
          <div className="mt-1 ps-0">
            <label className="form-label mb-0 red-asterisk">{t('create_customer_label_nameonprint')}</label>
            <input name='NameOnPrint' type='string' value={customer.NameOnPrint} onChange={onUpdateField} className={`form-control me-1 ${errors["NameOnPrint"] ? "is-invalid" : ""}`}></input>
            <div className="small text-danger"> {t(errors['NameOnPrint'])}</div>
          </div>
          <div className="mt-1 ps-0">
            <label className="form-label mb-0 red-asterisk">{t('create_customer_label_industry_id')}</label>
            <Select
              options={industries}
              value={industries && industries.find(option => option.value == customer.CustomerIndustryId) || null}
              name="CustomerIndustryId"
              onChange={onFieldChangeSelect}
              isSearchable
              isClearable
              placeholder={t('create_customer_select_industry')}
            />
            <div className="small text-danger"> {t(errors['CustomerIndustryId'])}</div>
          </div>
          <div className='mt-2 ps-0'>
            {proceedStatus == true ? (
              <button type='button' disabled={customer.Name !== "" ? false : true} className='btn  app-primary-bg-color text-white' onClick={ToggleConfirmationModal}>
                Clear
              </button>
            ) : (
              <button onClick={filterCustomerName} disabled={customer.Name !== "" ? false : true} className="btn app-primary-bg-color text-white">Proceed</button>
            )}
          </div>
          {customer.Name !== "" && existingCustomers.length > 0 && existScore === 1 && proceedStatus == true ? (
            <div className="ps-0 pe-2 mt-3">
              <div className="alert alert-danger p-2 rounded-0" role="alert">
                <div>
                  <span className="material-symbols-outlined align-bottom">warning</span>&nbsp;
                  <span className="fw-bold">Warning</span>
                </div>
                {customer.Name !== "" && existingCustomers.length > 0 && proceedStatus == true && (
                  <>
                    <div className="my-1"><small>{t('create_customer_exist_customer_danger_help_text_one')} "{customer.Name}"{t('create_customer_exist_customer_danger_help_text_two')}</small></div>
                    {existingCustomers.map((field) => (
                      <>
                        <div className="ms-2 mt-3">
                          <div className="fw-bold">
                            <span className="material-symbols-outlined fs-5 align-top">corporate_fare</span>&nbsp;
                            <span className=""><small>{field.existingCustomer.Name} ({field.existingCustomer.CustomerCode})</small></span>
                            <span className="material-symbols-outlined fs-5 ms-2 align-top">new_releases</span>&nbsp;
                          </div>
                          <div className="ms-4">
                            <small>{field.existingCustomer.BilledToAddress}</small>
                          </div>
                          <div className="ms-4">
                            <small>{t('create_customer_exist_customer_warning_help_text_created_on')} {formatDateTime(field.existingCustomer.CreatedOn)}</small>
                          </div>
                        </div>
                      </>
                    ))}
                  </>
                )}
              </div>
            </div>
          ) : customer.Name !== "" && existingCustomers.length > 0 && existScore === 0 && proceedStatus == true && (
            <div className="ps-0 pe-2 mt-3">
              <div className="alert alert-warning p-2 rounded-0" role="alert">
                <div>
                  <span className="material-symbols-outlined align-bottom">warning</span>&nbsp;
                  <span className="fw-bold">Warning</span>
                </div>
                {existingCustomers.length > 0 && customer.Name !== "" && proceedStatus == true && (
                  <>
                    <div className="my-1"><small>{t('create_customer_exist_customer_warning_help_text_one')} "{customer.Name}"{t('create_customer_exist_customer_warning_help_text_two')}</small></div>
                    {existingCustomers.map((field) => (
                      <>
                        <div className="ms-2 mt-3">
                          <div className="fw-bold">
                            <span className="material-symbols-outlined fs-5 align-top">corporate_fare</span>&nbsp;
                            <span className=""><small>{field.existingCustomer.Name} ({field.existingCustomer.CustomerCode})</small></span>
                            <span className="material-symbols-outlined fs-5 ms-2 align-top">new_releases</span>&nbsp;
                          </div>
                          <div className="ms-4">
                            <small>{field.existingCustomer.BilledToAddress}</small>
                          </div>
                          <div className="ms-4">
                            <small>{t('create_customer_exist_customer_warning_help_text_created_on')} {formatDateTime(field.existingCustomer.CreatedOn)}</small>
                          </div>
                        </div>
                      </>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {proceedStatus == true && existScore == 0 && (
            <>
              <div className='row m-0 mt-3 p-0'>
                {/* section 1 */}
                <div className="col-md-9 p-0">
                  <div className="app-primary-color fw-bold">{t('create_customer_heading_contact_details')}</div>
                  <div className="row align-items-start mt-2">
                    <div className="col">
                      <label className="form-label mb-0 red-asterisk">{t('create_customer_label_primary_contact_name')}</label>
                      <input name='PrimaryContactName' value={customer.PrimaryContactName} onChange={onUpdateField} className={`form-control  ${errors["PrimaryContactName"] ? "is-invalid" : ""}`}></input>
                      <div className="small text-danger"> {t(errors['PrimaryContactName'])}</div>
                    </div>
                    <div className="col">
                      <label className="form-label mb-0 red-asterisk">{t('create_customer_label_primary_contact_phone')}</label>
                      <input name='PrimaryContactPhone' value={customer.PrimaryContactPhone} onChange={onUpdateField} className={`form-control  ${errors["PrimaryContactPhone"] ? "is-invalid" : ""}`}></input>
                      <div className="small text-danger"> {t(errors['PrimaryContactPhone'])}</div>
                    </div>
                    <div className="col">
                      <label className="form-label mb-0 red-asterisk">{t('create_customer_label_primary_contact_email')}</label>
                      <input name='PrimaryContactEmail' value={customer.PrimaryContactEmail} onChange={onUpdateField} className={`form-control  ${errors["PrimaryContactEmail"] ? "is-invalid" : ""}`}></input>
                      <div className="small text-danger"> {t(errors['PrimaryContactEmail'])}</div>
                    </div>
                  </div>
                  <div className="row align-items-start mt-2">
                    <div className="col">
                      <label className="form-label mb-0">{t('create_customer_label_secondary_contact_name')}</label>
                      <input name='SecondaryContactName' value={customer?.SecondaryContactName ?? ''} onChange={onUpdateField} className="form-control"></input>
                    </div>
                    <div className="col">
                      <label className="form-label mb-0">{t('create_customer_label_secondary_contact_phone')}</label>
                      <input name='SecondaryContactPhone' value={customer?.SecondaryContactPhone ?? ""} onChange={onUpdateField} className="form-control"></input>
                    </div>
                    <div className="col">
                      <label className="form-label mb-0">{t('create_customer_label_secondary_contact_email')}</label>
                      <input name='SecondaryContactEmail' value={customer?.SecondaryContactEmail ?? ""} onChange={onUpdateField} className="form-control"></input>
                    </div>
                  </div>
                  <div className="row align-items-start mt-2">
                    <div className="col">
                      <div className="mb-1 mt-1">
                        <label className="red-asterisk">{t('create_customer_label_gst_type')}</label>
                        <Select
                          options={masterDataList.GstType}
                          value={masterDataList && masterDataList.GstType.find(option => option.value == customer.GstTypeId) || null}
                          onChange={onSelectChange}
                          isSearchable
                          isClearable
                          name="GstTypeId"
                          placeholder={t('validation_error_createcustomer_gsttype_required')}
                        />
                        <div className="small text-danger"> {t(errors['GstTypeId'])}</div>
                      </div>
                    </div>
                  </div>
                  <div className='row mt-3'>
                    <div className="app-primary-color fw-bold mt-2">{t('create_customer_heading_billing_address')}</div>
                    <div className=" mt-1">
                      <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_billedto_country_id')}</label>
                      <Select
                        options={countries}
                        name="BilledToCountryId"
                        value={countries && countries.find(option => option.value == customer.BilledToCountryId) || null}
                        onChange={onFieldChangeSelect}
                        isSearchable
                        isClearable
                        placeholder={t('create_customer_select_billedto_country_id')}
                      />
                      <div className="small text-danger"> {t(errors['BilledToCountryId'])}</div>
                    </div>
                    <div className=" mt-2">
                      <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_billedto_state_id')}</label>
                      <Select
                        options={billedToStates}
                        name="BilledToStateId"
                        value={billedToStates && billedToStates.find(option => option.value == customer.BilledToStateId) || null}
                        onChange={onFieldChangeSelect}
                        isSearchable
                        isClearable
                        placeholder={t('validation_error_createcustomer_billedtostateid_required')}
                      />
                      <div className="small text-danger"> {t(errors['BilledToStateId'])}</div>
                    </div>
                    <div className=" mt-2">
                      <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_billedto_city_id')}</label>
                      <Select
                        options={billedToCities}
                        name="BilledToCityId"
                        value={billedToCities && billedToCities.find(option => option.value == customer.BilledToCityId) || null}
                        onChange={onFieldChangeSelect}
                        isSearchable
                        isClearable
                        placeholder={t('validation_error_createcustomer_billedtocityid_required')}
                      />
                      <div className="small text-danger"> {t(errors['BilledToCityId'])}</div>
                    </div>
                    <div className=" mt-2">
                      <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_billedto_pincode')}</label>
                      <input type='number' value={customer.BilledToPincode} name='BilledToPincode' onChange={onUpdateField} className={`form-control  ${errors["BilledToPincode"] ? "is-invalid" : ""}`}></input>
                      <div className="small text-danger"> {t(errors['BilledToPincode'])}</div>
                    </div>

                    {customer.GstTypeCode == "GCT_RGST" &&
                      <div className=" mt-2">
                        <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_billedto_gst_number')}</label>
                        <input name='BilledToGstNumber' value={customer.BilledToGstNumber || ""} onChange={onUpdateField} className={`form-control  ${errors["BilledToGstNumber"] ? "is-invalid" : ""}`}></input>
                        <div className="small text-danger"> {t(errors['BilledToGstNumber'])}</div>
                      </div>
                    }
                    <div className=" mt-2">
                      <label className="form-label mb-0 red-asterisk">{t('create_customer_label_billedto_address')}</label>
                      <textarea name='BilledToAddress' value={customer.BilledToAddress} onChange={onUpdateField} className={`form-control  ${errors["BilledToAddress"] ? "is-invalid" : ""}`} rows={4}></textarea>
                      <div className="small text-danger"> {t(errors['BilledToAddress'])}</div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="mt-2">
                      <span className='app-primary-color fw-bold'>{t('create_customer_heading_shipping_address')}</span>
                      <span className='ms-2'>
                        {hasBillingDetails == true && (
                          <>
                            <input type="checkbox" checked={autoFill}
                              onChange={() => setAutoFill(!autoFill)} className={`form-check-input`} />
                            <label className="form-check-label ms-1">{t('create_customer_heading_shipping_address_auto_fill')}</label>
                            {autoFill == true &&
                              <div><small className='text-muted'>{t('create_customer_shipping_address_auto_fill_warning')}</small></div>
                            }
                          </>
                        )}
                      </span>
                    </div>
                    <div className=" mt-2">
                      <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_shippedto_country_id')}</label>
                      <Select
                        options={countries}
                        name="ShippedToCountryId"
                        isDisabled={autoFill}
                        value={countries && countries.find(option => option.value == customer.ShippedToCountryId) || null}
                        onChange={onFieldChangeSelect}
                        isClearable
                        isSearchable
                        placeholder={t('create_customer_select_shippedto_country_id')}
                      />
                      <div className="small text-danger"> {t(errors['ShippedToCountryId'])}</div>
                    </div>
                    <div className=" mt-2">
                      <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_shippedto_state_id')}</label>
                      <Select
                        options={shippedToStates}
                        name="ShippedToStateId"
                        isDisabled={autoFill}
                        value={shippedToStates && shippedToStates.find(option => option.value == customer.ShippedToStateId) || null}
                        onChange={onFieldChangeSelect}
                        isClearable
                        isSearchable
                        placeholder={t('validation_error_createcustomer_shippedtostateid_required')}
                      />
                      <div className="small text-danger"> {t(errors['ShippedToStateId'])}</div>
                    </div>
                    <div className=" mt-2">
                      <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_shippedto_city_id')}</label>
                      <Select
                        options={shippedToCities}
                        name="ShippedToCityId"
                        isDisabled={autoFill}
                        value={shippedToCities && shippedToCities.find(option => option.value == customer.ShippedToCityId) || null}
                        onChange={onFieldChangeSelect}
                        isClearable
                        isSearchable
                        placeholder={t('validation_error_createcustomer_shippedtostateid_required')}
                      />
                      <div className="small text-danger"> {t(errors['ShippedToCityId'])}</div>
                    </div>
                    <div className=" mt-2">
                      <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_shippedto_pincode')}</label>
                      <input type='string' disabled={autoFill} value={customer.ShippedToPincode} name='ShippedToPincode' onChange={onUpdateField} className={`form-control  ${errors["ShippedToPincode"] ? "is-invalid" : ""}`}></input>
                      <div className="small text-danger"> {t(errors['ShippedToPincode'])}</div>
                    </div>

                    {customer.GstTypeCode == "GCT_RGST" &&
                      <div className=" mt-2">
                        <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_shippedto_gst_number')}</label>
                        <input name='ShippedToGstNumber' disabled={autoFill} value={customer.ShippedToGstNumber || ""} onChange={onUpdateField} className={`form-control  ${errors["ShippedToGstNumber"] ? "is-invalid" : ""}`}></input>
                        <div className="small text-danger"> {t(errors['ShippedToGstNumber'])}</div>
                      </div>
                    }

                    <div className=" mt-2">
                      <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_shippedto_address')}</label>
                      <textarea name='ShippedToAddress' disabled={autoFill} value={customer.ShippedToAddress} onChange={onUpdateField} className={`form-control  ${errors["ShippedToAddress"] ? "is-invalid" : ""}`} rows={4}></textarea>
                      <div className="small text-danger"> {t(errors['ShippedToAddress'])}</div>
                    </div>
                  </div>
                </div>
                {/* section 1 ends */}
                {/* section 2 */}
                <div className="col-md-3">
                  <div className="app-primary-color fw-bold">{t('create_customer_heading_document_numbers')}</div>
                  <div>
                    <small className='text-muted'>{t('create_customer_document_numbers_help_text')}</small>
                  </div>
                  <div className=" mt-0">
                    <label className="form-label mb-0  pt-2">{t('create_customer_label_tan_number')}</label>
                    <input name='TanNumber' value={customer.TanNumber} onChange={onUpdateField} className={`form-control `}></input>
                  </div>
                  <div className=" mt-2">
                    <label className="form-label mb-0 ">{t('create_customer_label_cin_number')}</label>
                    <input name='CinNumber' value={customer.CinNumber} onChange={onUpdateField} className={`form-control `}></input>
                  </div>
                  <div className=" mt-1">
                    <label className="form-label mb-0 ">{t('create_customer_label_tin_number')}</label>
                    <input name='TinNumber' value={customer.TinNumber} onChange={onUpdateField} className={`form-control `}></input>
                    <div className="small text-danger"> {errors['TinNumber']}</div>
                  </div>
                  <div className="pt-2">
                    <label className="form-label mb-0  mt-0 red-asterisk">{t('create_customer_label_pan_number')}</label>
                    <input name='PanNumber' value={customer.PanNumber} onChange={onUpdateField} className={`form-control  `}></input>
                    <div className="small text-danger"> {errors['PanNumber']}</div>
                  </div>
                  <div className="row mt-3">
                    <div className="pt-2">
                      <div className="form-check form-switch ps-4 ms-3">
                        <input
                          className="form-check-input switch-input-lg ps-1"
                          type="checkbox"
                          name="IsMsme"
                          id="flexSwitchCheckDefault"
                          checked={customer.IsMsme}
                          value={customer.IsMsme.toString()}
                          onChange={onUpdateField}
                        ></input>
                        <span className=''>{t('create_customer_label_is_msme')}</span>
                      </div>
                      <div className="text-muted"><small>{t('create_customer_ismsme_help_text')}</small></div>
                    </div>
                    <div className='mt-1'>
                      {customer.IsMsme == true && (
                        <>
                          <label className="form-label  mb-0 red-asterisk">{t('create_customer_label_msme_registration_number')}</label>
                          <input name='MsmeRegistrationNumber' value={customer.MsmeRegistrationNumber == null ? "" : customer.MsmeRegistrationNumber} onChange={onUpdateField} className={`form-control  ${errors["MsmeRegistrationNumber"] ? "is-invalid" : ""}`}></input>
                          <div className="small text-danger">{t(errors['MsmeRegistrationNumber'])}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* section 2 ends */}
              </div>
              <div className='row p-0 mt-2 mb-2'>
                <div className='d-flex justify-content-start'>
                  <button type='button' onClick={() => onSubmit('ARS_SMTD')} className="btn app-primary-bg-color text-white">
                    {t('create_customer_submit_for_approval_button')}
                  </button>
                  <button type='button' onClick={() => onSubmit('ARS_DRFT')} className="btn app-primary-bg-color text-white ms-2">
                    {t('create_customer_draft_button')}
                  </button>
                  <Link to={'/config/customers'}>
                    <button type='button' className="btn app-primary-bg-color text-white ms-2">
                      {t('create_customer_cancel_button')}
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        {displayInformationDraftModal ? <DraftInformationModal /> : ""}
        {displayConformationModal ? <ConfirmationModal /> : ""}
        {displayInformationModal ? <InformationModal /> : ""}
      </div>
    </ContainerPage>
  );

  function onFieldChangeSelect(selectedOption: any, actionMeta: any) {

    const name = actionMeta.name;
    const value = selectedOption ?selectedOption.value : null;
    store.dispatch(updateField({ name: name as keyof CreateCustomerState['customer'], value }));
    if (['BilledToCountryId', 'BilledToStateId', 'BilledToCityId'].includes(name) && autoFill == true) {
      setAutoFill(false)
    }
    store.dispatch(updateField({ name: name as keyof CreateCustomerState['customer'], value}));
  }
}