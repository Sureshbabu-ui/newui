import { store } from '../../../../state/store';
import { useState, useEffect } from 'react'
import { useStore, useStoreWithInitializer } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import {
  startSubmitting,
  stopSubmitting,
  toggleInformationDraftModalStatus,
  toggleInformationApprovalModalStatus,
  updateErrors,
  updateField,
  isMsme,
  loadTenantOffices,
  loadCountries,
  loadBilledToStates,
  loadShippedToStates,
  loadBilledToCities,
  loadShippedToCities,
  UpdateCustomerState,
  loadCustomerDetails,
  loadCustomerIndustries,
  loadMasterData
} from './CustomerEdit.slice';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { ClickedCustomerDetails } from '../../../../types/customer';
import { editApprovedCustomer, getCustomerDetails } from '../../../../services/customer';
import Select from 'react-select';
import { getTenantOfficeInfo } from '../../../../services/tenantOfficeInfo';
import { formatSelectInput, formatSelectInputWithCode } from '../../../../helpers/formats';
import { getCustomerGroupNames } from '../../../../services/customerGroup';
import { getCountries } from '../../../../services/country';
import { getFilteredStatesByCountry } from '../../../../services/state';
import { getFilteredCitiesByState } from '../../../../services/city';
import * as yup from 'yup';
import { useParams, useHistory } from 'react-router';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { editPendingApproval, getClickedPendingDetails } from '../../../../services/approval';
import { setActiveTab } from '../CustomerManagement.slice';
import { TenantInfoDetails } from '../../../../types/user';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { getValuesInMasterDataByTable } from '../../../../services/masterData';
import { createGstNumberValidation } from '../../../../helpers/validationformats';
import { initializeCustomer } from '../../CreateCustomer/CreateCustomer.slice';
import RequestApproval from './../../ContractSubMenu/General/ContractApprovalRequest/RequestApproval/RequestApproval';

export function CustomerEdit() {
  const { masterDataList, customer, errors, approvaldisplayInformationModal, draftdisplayInformationModal, countries, billedToStates, shippedToStates, shippedToCities, billedToCities, industries }
    = useStore(
      ({ customerupdate }) => (customerupdate));

  useEffect(() => {
    onLoad();
  }, []);

  const { t } = useTranslation();
  const history = useHistory()
  const [formattedOfficeList, setFormattedOfficeList] = useState<any>(null)
  const [customergroupList, setCustomergroupList] = useState<any>(null)
  const { CustomerId } = useParams<{ CustomerId: string }>();
  const { PendingCustomerId } = useParams<{ PendingCustomerId: string }>();

  const [showDropdown, setShowDropdown] = useState(false);
  const [TenantOfficeList, setTenantOfficeList] = useState<TenantInfoDetails[]>([]);
  const [autoFill, setAutoFill] = useState(false);
  const [hasBillingDetails, sethasBillingDetails] = useState(false);
  const [customerReviewStatus, setCustomerReviewStatus] = useState('');

  useEffect(() => {
    setAutoFill(isAddressMatchCheck(customer))
    if (
      customer.BilledToAddress !== "" &&
      customer.BilledToCityId !== null &&
      customer.BilledToStateId !== null &&
      customer.BilledToCountryId !== null &&
      customer.BilledToPincode !== "" &&
      customer.BilledToGstNumber !== ""
    ) {
      sethasBillingDetails(true);
    } else {
      sethasBillingDetails(false);
    }
  }, [customer?.BilledToAddress, customer?.BilledToPincode, customer.BilledToGstNumber, customer.BilledToStateId, customer.BilledToCityId, customer.BilledToCountryId])

  const isAddressMatchCheck = (customer: any) => {
    if (
      customer.BilledToAddress !== null &&
      customer.BilledToCityId !== null &&
      customer.BilledToStateId !== null &&
      customer.BilledToCountryId !== null &&
      customer.BilledToPincode !== null &&
      customer.BilledToGstNumber !== null &&
      customer.BilledToAddress === customer.ShippedToAddress &&
      customer.BilledToCityId === customer.ShippedToCityId &&
      customer.BilledToStateId === customer.ShippedToStateId &&
      customer.BilledToCountryId === customer.ShippedToCountryId &&
      customer.BilledToPincode === customer.ShippedToPincode &&
      customer.BilledToGstNumber === customer.ShippedToGstNumber
    ) {
      return true;
    } else {
      return false;
    }
  };

  async function GetMasterDataItems() {
    store.dispatch(initializeCustomer());
    try {
      var { MasterData } = await getValuesInMasterDataByTable("GstType")
      const gsttype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
      store.dispatch(loadMasterData({ name: "GstType", value: { MasterData: gsttype } }));
      const GstTypeData = MasterData.filter(item => item.Code == "GCT_RGST")[0];
      store.dispatch(updateField({ name: 'GstTypeCode', value: GstTypeData.Code }));
      store.dispatch(updateField({ name: 'GstTypeId', value: GstTypeData.Id }));
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    GetMasterDataItems()
  }, [])

  const onLoad = async () => {
    try {
      const CustomerGroups = await getCustomerGroupNames();
      setCustomergroupList(formatSelectInput(CustomerGroups.CustomerGroupNames, "GroupName", "Id"))

      const TenantOffices = await getTenantOfficeInfo();
      setTenantOfficeList(TenantOffices.TenantOfficeInfo)
      setFormattedOfficeList(formatSelectInput(TenantOffices.TenantOfficeInfo, "OfficeName", "Id"))
      store.dispatch(loadTenantOffices(TenantOffices));

      var { MasterData } = await getValuesInMasterDataByTable("CustomerIndustry")
      const CustomerIndustry = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadCustomerIndustries({ Industries: CustomerIndustry }));

      const Countries = await getCountries();
      const SelectCountries = await formatSelectInput(Countries.Countries, "Name", "Id")
      store.dispatch(loadCountries({ MasterData: SelectCountries }))

      if (CustomerId) {
        var result = await getCustomerDetails(CustomerId);
        store.dispatch(loadCustomerDetails(result));
      } else {
        const tableName = "Customer"
        //  var { ApprovalRequestDetails } = await getClickedPendingDetails(PendingCustomerId, tableName);
        //  var ApprovalReviewStatus = ApprovalRequestDetails.ReviewStatus;
        //  setCustomerReviewStatus(ApprovalReviewStatus);
        //  var parsedCustomerDetails: ClickedCustomerDetails = JSON.parse(ApprovalRequestDetails.Content)
        //parsedCustomerDetails && store.dispatch(loadCustomerDetails({ CustomerDetails: parsedCustomerDetails }))
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (customer.BilledToCountryId !== 0) {
      getFilteredStates("BilledTo")
    }
  }, [customer.BilledToCountryId])

  useEffect(() => {
    if (customer.BilledToCountryId !== 0) {
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
    if (customer.CustomerGroupId !== null) {
      setShowDropdown(true)
    }
  }, [customer.CustomerGroupId])

  useEffect(() => {
    if (customer.BilledToStateId !== 0) {
      getFilteredCities("BilledTo")
    }
  }, [customer.BilledToStateId])

  useEffect(() => {
    if (customer.ShippedToStateId !== 0) {
      getFilteredCities("ShippedTo")
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
  const onSelectChange = (selectedOption: any, actionMeta: any) => {
    var value = selectedOption.value?selectedOption.value:null
    var name = actionMeta.name
    store.dispatch(updateField({ name: 'GstTypeCode', value: selectedOption.code }));
    store.dispatch(updateField({ name: name as keyof UpdateCustomerState['customer'], value }));
  }

  const validationSchema = yup.object().shape({
    Name: yup.string().trim().required('validation_error_updatecustomer_name_required'),
    NameOnPrint: yup.string().required('validation_error_updatecustomer_nameonprint_required'),
    PrimaryContactName: yup.string().trim().required('validation_error_updatecustomer_contactname_required'),
    PrimaryContactEmail: yup.string().required('validation_error_updatecustomer_contactemail_required'),
    PrimaryContactPhone: yup.string().required('validation_error_updatecustomer_contactphone_required'),
    BilledToAddress: yup.string().required('validation_error_updatecustomer_billedtoaddress_required'),
    GstTypeId: yup.number().required('validation_error_createcustomer_gsttype_required'),
    BilledToPincode: yup.string().required('validation_error_updatecustomer_billedtopincode_required'),
    BilledToGstNumber: createGstNumberValidation(t('validation_error_updatecustomer_billedtogstnumber_required'), t('validation_error_updatecustomer_billtogstnumber_checking_rule') ?? ''),
    ShippedToGstNumber: createGstNumberValidation(t('validation_error_updatecustomer_shippedtgstnumber_required'), t('validation_error_updatecustomer_shiptogstnumber_checking_rule') ?? ''),
    ShippedToAddress: yup.string().required('validation_error_updatecustomer_shippedtoaddress_required'),
    ShippedToPincode: yup.string().required('validation_error_updatecustomer_shippedtopincode_required'),
    IsContractCustomer: yup.boolean().required(t('validation_error_updatecustomer_iscontractcustomer_required') ?? ''),
    TenantOfficeId: yup.string().required('validation_error_updatecustomer_tenantofficeid_required').min(1, ('validation_error_updatecustomer_tenantofficeid_required')),
    CustomerIndustryId: yup.string().required(('validation_error_updatecustomer_industryid_required') ?? '').min(1, t('validation_error_updatecustomer_industryid_required') ?? ''),
    BilledToCountryId: yup.string().required('validation_error_updatecustomer_billedtocountryid_required').min(1, ('validation_error_updatecustomer_billedtocountryid_required')),
    BilledToStateId: yup.string().required('validation_error_updatecustomer_billedtostateid_required').min(1, ('validation_error_updatecustomer_billedtostateid_required')),
    BilledToCityId: yup.string().required('validation_error_updatecustomer_billedtocityid_required').min(1, ('validation_error_updatecustomer_billedtocityid_required')),
    ShippedToCountryId: yup.string().required('validation_error_updatecustomer_shippedtocountryid_required').min(1, ('validation_error_updatecustomer_shippedtocountryid_required')),
    ShippedToStateId: yup.string().required('validation_error_updatecustomer_shippedtostateid_required').min(1, ('validation_error_updatecustomer_shippedtostateid_required')),
    ShippedToCityId: yup.string().required('validation_error_updatecustomer_shippedtocityid_required').min(1, ('validation_error_updatecustomer_shippedtocityid_required')),
    MsmeRegistrationNumber: yup
      .string()
      .when('IsMsme', (IsMsme, schema) =>
        customer.IsMsme === true
          ? schema.required(t('validation_error_updatecustomer_msmeregistrationnumber_required') ?? '')
          : schema.nullable()
      ),
    PanNumber: yup.string().required(t('validation_error_updatecustomer_pannumber_required') ?? '').matches(/^[A-Z]{3}[PHAFCT]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/, t('validation_error_updatecustomer_pannumber_checking_rule') ?? '')
  });

  async function onSubmitForReview(customer: ClickedCustomerDetails) {
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
    var result
    var customerApprovalRequestDetails = {
      ...store.getState().customerupdate.customer,
      CaseId: '',
      IsDeleted: 0,
      CreatedBy: 0,
      CreatedOn: '',
      UpdatedBy: '',
      UpdatedOn: '',
      ReviewStatus: 'ARS_SMTD',
      ApprovedBy: '',
      ApprovedOn: '',
    };
    if (window.location.pathname == `/config/customers/pendingupdate/${PendingCustomerId}`) {
      result = await editPendingApproval(customerApprovalRequestDetails, PendingCustomerId);
    } else {
      result = await editApprovedCustomer(customerApprovalRequestDetails);
    }
    store.dispatch(stopSubmitting());
    result.match({
      ok: () => {
        store.dispatch(toggleInformationApprovalModalStatus());
      },
      err: (e) => {
        store.dispatch(updateErrors(e));
      },
    });
    store.dispatch(stopPreloader());
  }

  async function onSubmitDraft(customer: ClickedCustomerDetails) {
    store.dispatch(startPreloader());
    store.dispatch(startSubmitting());
    var result
    var customerApprovalRequestDetails = {
      ...store.getState().customerupdate.customer,
      CaseId: '',
      IsDeleted: 0,
      CreatedBy: 0,
      CreatedOn: '',
      UpdatedBy: '',
      UpdatedOn: '',
      ReviewStatus: 'ARS_DRFT',
      ApprovedBy: '',
      ApprovedOn: '',
    };
    if (window.location.pathname == `/customer/pendingupdate/${PendingCustomerId}`) {
      result = await editPendingApproval(customerApprovalRequestDetails, PendingCustomerId);
    } else {
      result = await editApprovedCustomer(customerApprovalRequestDetails);
    }
    store.dispatch(stopSubmitting());
    result.match({
      ok: () => {
        store.dispatch(toggleInformationDraftModalStatus());
      },
      err: (e) => {
        store.dispatch(updateErrors(e));
      },
    });
    store.dispatch(stopPreloader());
  }

  function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
    const name = actionMeta.name;
    const value = selectedOption.value?selectedOption.value:null;
    if (['BilledToCountryId', 'BilledToStateId', 'BilledToCityId'].includes(name) && autoFill == true) {
      setAutoFill(false)
    }
    if (name == 'BilledToStateId') {
      store.dispatch(updateField({ name: "BilledToCityId", value: null }));
    }
    store.dispatch(updateField({ name: name as keyof UpdateCustomerState['customer'], value }));
  }

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_manage_customer', Link: '/config/customers' },
    { Text: 'breadcrumbs_edit_customer' }
  ];

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
      store.dispatch(updateField({ name: 'NameOnPrint', value }));
    }
    if (['BilledToPincode', 'BilledToGstNumber', 'BilledToAddress'].includes(name) && autoFill == true) {
      setAutoFill(false)
    }
    store.dispatch(updateField({ name: name as keyof UpdateCustomerState['customer'], value }));
  }

  function ApprovalInformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRouteApprovalRequets}>
        {t('update_customer_success_submit_for_review')}
      </SweetAlert>
    );
  }

  function reDirectRouteApprovalRequets() {
    store.dispatch(toggleInformationApprovalModalStatus());
    store.dispatch(setActiveTab('nav-pending'))
    history.push("/config/customers")
  }

  function DraftInformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRouteDraftRequets}>
        {t('update_customer_draft_success')}
      </SweetAlert>
    );
  }

  function reDirectRouteDraftRequets() {
    store.dispatch(toggleInformationApprovalModalStatus());
    store.dispatch(setActiveTab('nav-draft'))
    history.push("/config/customers")
  }

  useEffect(() => {
    if (autoFill == true) {
      store.dispatch(updateField({ name: "ShippedToCountryId", value: store.getState().customerupdate.customer.BilledToCountryId }));
      store.dispatch(updateField({ name: "ShippedToStateId", value: store.getState().customerupdate.customer.BilledToStateId }));
      store.dispatch(updateField({ name: "ShippedToCityId", value: store.getState().customerupdate.customer.BilledToCityId }));
      store.dispatch(updateField({ name: "ShippedToPincode", value: store.getState().customerupdate.customer.BilledToPincode }));
      store.dispatch(updateField({ name: "ShippedToGstNumber", value: store.getState().customerupdate.customer.BilledToGstNumber }));
      store.dispatch(updateField({ name: "ShippedToAddress", value: store.getState().customerupdate.customer.BilledToAddress }));
    } else {
      store.dispatch(updateField({ name: "ShippedToCountryId", value: null }));
      store.dispatch(updateField({ name: "ShippedToStateId", value: null }));
      store.dispatch(updateField({ name: "ShippedToCityId", value: null }));
      store.dispatch(updateField({ name: "ShippedToPincode", value: "" }));
      store.dispatch(updateField({ name: "ShippedToGstNumber", value: "" }));
      store.dispatch(updateField({ name: "ShippedToAddress", value: "" }));
    }
  }, [autoFill])

  return (
    <ContainerPage>
      <div className='my-2'>
        <div className="mx-4 mt-2">
          <BreadCrumb items={breadcrumbItems} />
          <ValidationErrorComp errors={errors} />
        </div>
        <div className="row ms-2 mt-1 me-0">
          {/* TODO: For the time being, we are commenting out 'IsContractCustomer' and setting the default value to true. */}
          {/* <div className='row'>
            <div className="form-check form-switch">
              <input
                className="form-check-input switch-input-lg me-2"
                type="checkbox"
                name="IsContractCustomer"
                id="flexSwitchCheckDefault"
                checked={customer?.IsContractCustomer?.valueOf()}
                value={customer?.IsContractCustomer?.toString()}
                onChange={onUpdateField}
              ></input>
              <label className="form-label mb-0 red-asterisk">{t('update_customer_label_is_contractcustomer')}</label>
              <div><small>{t('update_customer_label_is_contractcustomer_help_text')}</small></div>
            </div>
          </div> */}
          <div className="form-check form-switch">
            <input
              className="form-check-input switch-input-lg me-2"
              type="checkbox"
              id="flexSwitchCheckDefault"
              checked={showDropdown}
              onChange={() => setShowDropdown(!showDropdown)}
            /><label>{t('update_customer_label_customergroup_help_text')}</label>
          </div>
          {showDropdown && (
            <div className='mt-1 ps-0'>
              <label className="form-label">{t('update_customer_label_customergroupid')}</label>
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
            <label className="form-label mb-0 red-asterisk">{t('update_customer_label_tenantoffice_id')}</label>
            <Select
              options={formattedOfficeList}
              value={formattedOfficeList && formattedOfficeList.find(option => option.value == customer.TenantOfficeId) || null}
              name="TenantOfficeId"
              onChange={onFieldChangeSelect}
              isSearchable
              isClearable
              isDisabled={true}
              placeholder={t('update_customer_select_tenantoffice')}
            />
            <div className="small text-danger"> {t(errors['TenantOfficeId'])}</div>
            {customer.TenantOfficeId !== null && (
              <>
                {(formattedOfficeList.length > 0 &&
                  <div className="text-muted mt-1">
                    {(TenantOfficeList.filter((value) => (value.Id == customer.TenantOfficeId)
                    )).length > 0 ? `Address : ${(TenantOfficeList.filter((value) => (value.Id == customer.TenantOfficeId)
                    ))[0].Address}` : ''}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mt-1 ps-0">
            <label className="form-label mb-0 red-asterisk">{t('update_customer_label_customer_name')}</label>
            <input
              name='Name'
              onChange={onUpdateField}
              value={customer?.Name ?? ""}
              disabled={true}
              className={`form-control ${errors["Name"] ? "is-invalid" : ""}`}
            />
            <div className="small text-danger"> {t(errors['Name'])}</div>
          </div>
          <div className="mt-1 ps-0">
            <label className="form-label mb-0 red-asterisk">{t('update_customer_label_nameonprint')}</label>
            <input name='NameOnPrint' type='string' value={customer?.NameOnPrint ?? ""} onChange={onUpdateField} className={`form-control  ${errors["NameOnPrint"] ? "is-invalid" : ""}`}></input>
            <div className="small text-danger"> {t(errors['NameOnPrint'])}</div>
          </div>
          <div className="mt-1 ps-0">
            <label className="form-label mb-0 red-asterisk">{t('update_customer_label_industry')}</label>
            <Select
              options={industries}
              value={industries && industries.find(option => option.value == customer.CustomerIndustryId) || null}
              name="CustomerIndustryId"
              onChange={onFieldChangeSelect}
              isSearchable
              isClearable
              placeholder={t('update_customer_select_industry')}
            />
            <div className="small text-danger"> {t(errors['CustomerIndustryId'])}</div>
          </div>
          <>
            <div className='row m-0 mt-3 p-0'>
              {/* section 1 */}
              <div className="col-md-9 p-0">
                <div className="app-primary-color fw-bold">{t('update_customer_heading_contact_details')}</div>
                <div className="row align-items-start mt-2">
                  <div className="col">
                    <label className="form-label mb-0 red-asterisk">{t('update_customer_label_primary_contact_name')}</label>
                    <input name='PrimaryContactName' value={customer?.PrimaryContactName ?? ""} onChange={onUpdateField} className={`form-control  ${errors["PrimaryContactName"] ? "is-invalid" : ""}`}></input>
                    <div className="small text-danger"> {t(errors['PrimaryContactName'])}</div>
                  </div>
                  <div className="col">
                    <label className="form-label mb-0 red-asterisk">{t('update_customer_label_primary_contact_phone')}</label>
                    <input name='PrimaryContactPhone' value={customer?.PrimaryContactPhone ?? ""} onChange={onUpdateField} className={`form-control  ${errors["PrimaryContactPhone"] ? "is-invalid" : ""}`}></input>
                    <div className="small text-danger"> {t(errors['PrimaryContactPhone'])}</div>
                  </div>
                  <div className="col">
                    <label className="form-label mb-0 red-asterisk">{t('update_customer_label_primary_contact_email')}</label>
                    <input name='PrimaryContactEmail' value={customer?.PrimaryContactEmail ?? ""} onChange={onUpdateField} className={`form-control  ${errors["PrimaryContactEmail"] ? "is-invalid" : ""}`}></input>
                    <div className="small text-danger"> {t(errors['PrimaryContactEmail'])}</div>
                  </div>
                </div>
                <div className="row align-items-start mt-2">
                  <div className="col">
                    <label className="form-label mb-0">{t('update_customer_label_secondary_contact_name')}</label>
                    <input name='SecondaryContactName' value={customer?.SecondaryContactName ?? ""} onChange={onUpdateField} className="form-control"></input>
                  </div>
                  <div className="col">
                    <label className="form-label mb-0">{t('update_customer_label_secondary_contact_phone')}</label>
                    <input name='SecondaryContactPhone' value={customer?.SecondaryContactPhone ?? ""} onChange={onUpdateField} className="form-control"></input>
                  </div>
                  <div className="col">
                    <label className="form-label mb-0">{t('update_customer_label_secondary_contact_email')}</label>
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
                  <div className="app-primary-color fw-bold mt-2">{t('update_customer_heading_billing_address')}</div>
                  <div className=" mt-1">
                    <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_billedto_country_id')}</label>
                    <Select
                      options={countries}
                      name="BilledToCountryId"
                      value={countries && countries.find(option => option.value == customer.BilledToCountryId) || null}
                      onChange={onFieldChangeSelect}
                      isSearchable
                      isClearable
                      placeholder={t('update_customer_select_billedto_country_id')}
                    />
                    <div className="small text-danger"> {t(errors['BilledToCountryId'])}</div>
                  </div>
                  <div className=" mt-2">
                    <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_billedto_state_id')}</label>
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
                    <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_billedto_city_id')}</label>
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
                    <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_billedto_pincode')}</label>
                    <input type='number' value={customer?.BilledToPincode ?? ""} name='BilledToPincode' onChange={onUpdateField} className={`form-control  ${errors["BilledToPincode"] ? "is-invalid" : ""}`}></input>
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
                    <label className="form-label mb-0 red-asterisk">{t('update_customer_label_billedto_address')}</label>
                    <textarea name='BilledToAddress' value={customer?.BilledToAddress ?? ""} onChange={onUpdateField} className={`form-control  ${errors["BilledToAddress"] ? "is-invalid" : ""}`} rows={4}></textarea>
                    <div className="small text-danger"> {t(errors['BilledToAddress'])}</div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="mt-2">
                    <span className='app-primary-color fw-bold'>{t('update_customer_heading_shipping_address')}</span>
                    <span className='ms-2'>
                      {hasBillingDetails == true && (
                        <>
                          <input type="checkbox" checked={autoFill}
                            onChange={() => setAutoFill(!autoFill)} className={`form-check-input`} />
                          <label className="form-check-label ms-1">{t('update_customer_heading_shipping_address_auto_fill')}</label>
                          {autoFill == true &&
                            <div><small className='text-muted'>{t('update_customer_shipping_address_auto_fill_warning')}</small></div>
                          }
                        </>
                      )}
                    </span>
                  </div>
                  <div className=" mt-2">
                    <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_shippedto_country_id')}</label>
                    <Select
                      options={countries}
                      name="ShippedToCountryId"
                      isDisabled={autoFill}
                      value={countries && countries.find(option => option.value == customer.ShippedToCountryId) || null}
                      onChange={onFieldChangeSelect}
                      isSearchable
                      isClearable
                      placeholder={t('update_customer_select_shippedto_country_id')}
                    />
                    <div className="small text-danger"> {t(errors['ShippedToCountryId'])}</div>
                  </div>
                  <div className=" mt-2">
                    <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_shippedto_state_id')}</label>
                    <Select
                      options={shippedToStates}
                      name="ShippedToStateId"
                      isDisabled={autoFill}
                      value={shippedToStates && shippedToStates.find(option => option.value == customer.ShippedToStateId) || null}
                      onChange={onFieldChangeSelect}
                      isSearchable
                      isClearable
                      placeholder={t('validation_error_createcustomer_shippedtostateid_required')}
                    />
                    <div className="small text-danger"> {t(errors['ShippedToStateId'])}</div>
                  </div>
                  <div className=" mt-2">
                    <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_shippedto_city_id')}</label>
                    <Select
                      options={shippedToCities}
                      name="ShippedToCityId"
                      isDisabled={autoFill}
                      value={shippedToCities && shippedToCities.find(option => option.value == customer.ShippedToCityId) || null}
                      onChange={onFieldChangeSelect}
                      isSearchable
                      isClearable
                      placeholder={t('validation_error_createcustomer_shippedtostateid_required')}
                    />
                    <div className="small text-danger"> {t(errors['ShippedToCityId'])}</div>
                  </div>
                  <div className=" mt-2">
                    <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_shippedto_pincode')}</label>
                    <input type='string' disabled={autoFill} value={customer.ShippedToPincode ?? ""} name='ShippedToPincode' onChange={onUpdateField} className={`form-control  ${errors["ShippedToPincode"] ? "is-invalid" : ""}`}></input>
                    <div className="small text-danger"> {t(errors['ShippedToPincode'])}</div>
                  </div>

                  {customer.GstTypeCode == "GCT_RGST" &&
                    <div className=" mt-2">
                      <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_shippedto_gst_number')}</label>
                      <input name='ShippedToGstNumber' disabled={autoFill} value={customer.ShippedToGstNumber ?? ""} onChange={onUpdateField} className={`form-control  ${errors["ShippedToGstNumber"] ? "is-invalid" : ""}`}></input>
                      <div className="small text-danger"> {t(errors['ShippedToGstNumber'])}</div>
                    </div>
                  }
                  <div className=" mt-2">
                    <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_shippedto_address')}</label>
                    <textarea name='ShippedToAddress' disabled={autoFill} value={customer.ShippedToAddress ?? ""} onChange={onUpdateField} className={`form-control  ${errors["ShippedToAddress"] ? "is-invalid" : ""}`} rows={4}></textarea>
                    <div className="small text-danger"> {t(errors['ShippedToAddress'])}</div>
                  </div>
                </div>
              </div>
              {/* section 1 ends */}
              {/* section 2 */}
              <div className="col-md-3">
                <div className="app-primary-color fw-bold">{t('update_customer_heading_document_numbers')}</div>
                <div>
                  <small className='text-muted'>{t('update_customer_document_numbers_help_text')}</small>
                </div>
                <div className=" mt-0">
                  <label className="form-label mb-0  pt-2">{t('update_customer_label_tan_number')}</label>
                  <input name='TanNumber' value={customer?.TanNumber ?? ""} onChange={onUpdateField} className={`form-control `}></input>
                </div>
                <div className=" mt-2">
                  <label className="form-label mb-0 ">{t('update_customer_label_cin_number')}</label>
                  <input name='CinNumber' value={customer?.CinNumber ?? ""} onChange={onUpdateField} className={`form-control `}></input>
                </div>
                <div className=" mt-1">
                  <label className="form-label mb-0 ">{t('update_customer_label_tin_number')}</label>
                  <input name='TinNumber' value={customer?.TinNumber ?? ""} onChange={onUpdateField} className={`form-control `}></input>
                  <div className="small text-danger"> {errors['TinNumber']}</div>
                </div>
                <div className="pt-2">
                  <label className="form-label mb-0  mt-0 red-asterisk">{t('update_customer_label_pan_number')}</label>
                  <input name='PanNumber' value={customer?.PanNumber ?? ""} onChange={onUpdateField} className={`form-control  `}></input>
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
                        checked={customer.IsMsme.valueOf()}
                        value={customer?.IsMsme.toString()}
                        onChange={onUpdateField}
                      ></input>
                      <span className=''>{t('update_customer_label_is_msme')}</span>
                    </div>
                    <div className="text-muted"><small>{t('update_customer_ismsme_help_text')}</small></div>
                  </div>
                  <div className='mt-1'>
                    {customer.IsMsme == true && (
                      <>
                        <label className="form-label  mb-0 red-asterisk">{t('update_customer_label_msme_registration_number')}</label>
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
                <button type='button' onClick={() => onSubmitForReview(customer)} className="btn app-primary-bg-color text-white">
                  {t('update_customer_submit_for_approval_button')}
                </button>
                {customer.CustomerId !== null || customerReviewStatus !== 'ARS_CAND' && (
                  <button type='button' onClick={() => onSubmitDraft(customer)} className="btn app-primary-bg-color text-white ms-2">
                    {t('update_customer_draft_button')}
                  </button>
                )}
              </div>
            </div>
          </>
        </div>
        {approvaldisplayInformationModal ? <ApprovalInformationModal /> : ""}
        {draftdisplayInformationModal ? <DraftInformationModal /> : ""}
      </div>
    </ContainerPage>
  );
}