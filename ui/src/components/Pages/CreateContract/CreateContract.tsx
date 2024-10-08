import { store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { ContractDetails } from '../../../types/contract';
import SweetAlert from 'react-bootstrap-sweetalert';
import { createContract, getContractsList, getGstRates } from '../../../services/contracts';
import { useEffect, useRef, useState } from 'react';
import { contractLeftMenuTabs } from '../../../tabs.json';
import * as yup from 'yup';
import {
  initializeContract,
  CreateContractState,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
  loadMasterData,
  loadTenantlocations,
  loadCustomers,
  loadEmployees,
  loadInvoicePrerequisite,
  setSelectedInvoicePrerequisite,
  loadAppkeyValues,
} from './CreateContract.slice';
import { getlocationWiseContractCustomers } from '../../../services/customer';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../Preloader/Preloader.slice';
import Select from 'react-select';
import {
  convertBackEndErrorsToValidationErrors,
  formatSelectInput,
  formatSelectInputWithThreeArgWithParenthesis,
  formatSelectedInputsWithCode,
  getFieldColumnClass,
} from '../../../helpers/formats';
import { getValuesInMasterDataByTable } from '../../../services/masterData';
import { getPaymentFrequencyNames } from '../../../services/paymentFrequency';
import { loadContracts, setRedirectedStatusTab } from '../ContractManagement/ContractManagement.slice';
import { ValidationErrorComp } from '../../ValidationErrors/ValidationError';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { useHistory } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { getInvoicePrerequisiteDetails } from '../../../services/invoicePrerequisite';
import { getUserTenantOfficeName, getUsersByRolesList } from '../../../services/users';
import BreadCrumb from '../../BreadCrumbs/BreadCrumb';
import { CustomerList } from '../../../types/customer';
import { getAppKeyValues } from '../../../services/appsettings';
import { Expand } from '../../ExpandableSection/Expand';

export function CreateContract() {
  const { t } = useTranslation();
  const {
    contractcreate: {
      contract,
      errors,
      displayInformationModal,
      masterDataList,
      InvoicePrerequisite,
      Customer,
      Employee,
      PaymentFrequency,
      TenantOfficeInfo,
      appvalues,
      searchWith,
      SelectedContractInvoicePrerequisite,
    },
  } = useStoreWithInitializer(({ contractcreate }) => ({ contractcreate }), GetMasterDataItems);

  const [selectedTab, setSelectedTab] = useState(0);
  const history = useHistory();
  
  const divRefs = {
    locationDetails: useRef<HTMLDivElement | null>(null),
    contractDetails: useRef<HTMLDivElement | null>(null),
    bookingDetails: useRef<HTMLDivElement | null>(null),
    poDetails: useRef<HTMLDivElement | null>(null),
    paymentDetails: useRef<HTMLDivElement | null>(null),
    serviceDetails: useRef<HTMLDivElement | null>(null),
    slaDetails: useRef<HTMLDivElement | null>(null),
    dnfInvoiceSubmission: useRef<HTMLDivElement | null>(null),
  };

  useEffect(() => {
    store.dispatch(updateField({ name: 'AmcValue', value: 0 }));
    store.dispatch(updateField({ name: 'FmsValue', value: 0 }));
  }, [contract.AgreementTypeId]);

  const [showAlert, setShowAlert] = useState(false);
  const [CustomerList, setCustomerList] = useState<CustomerList[]>([]);

  useEffect(() => {
    GetMasterDataItems();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Customers = await getlocationWiseContractCustomers(contract.AccelLocation?.toString() ?? '');
        setCustomerList(Customers.CustomersList);

        const customers = await formatSelectInputWithThreeArgWithParenthesis(
          Customers.CustomersList,
          'Name',
          'CustomerCode',
          'Id'
        );
        store.dispatch(loadCustomers({ Select: customers }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    store.dispatch(updateField({ name: 'CustomerInfoId', value: null }));
  }, [contract.AccelLocation]);


  useEffect(() => {
    if (
      (contract?.QuotationReferenceDate && contract.QuotationReferenceDate > contract.StartDate) ||
      (contract?.PoDate && contract.PoDate > contract.StartDate)
    ) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [contract?.QuotationReferenceDate, contract?.PoDate, contract.StartDate]);

  const optionFields = [
    'IsMultiSite',
    'IsPAVNeeded',
    'IsPerformanceGuarentee',
    'IsPreventiveMaintenanceNeeded',
    'IsStandByRequired',
    'IsStandByFullUnitRequired',
    'IsStandByImpressStockRequired',
    'IsBackToBackAllowed',
    'IsSez'
  ];

  function onUpdateField(ev: any) {
    var { name, value } = ev.target;
    if (optionFields.includes(name)) {
      value = ev.target.checked ? true : false;
    }
    store.dispatch(updateField({ name: name as keyof CreateContractState['contract'], value }));
  }

  const [paymentType, setPaymentType] = useState('');

  async function GetMasterDataItems() {
    store.dispatch(initializeContract());
    try {
      var { MasterData } = await getValuesInMasterDataByTable('AgreementType');
      const agreementType = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadMasterData({ name: 'AgreementType', value: { Select: agreementType } }));

      var { MasterData } = await getValuesInMasterDataByTable('BookingType');
      const bookingType = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadMasterData({ name: 'BookingType', value: { Select: bookingType } }));

      const AppSettingsKeyValues = await getAppKeyValues('PaymentTypeExclusion');
      store.dispatch(loadAppkeyValues(AppSettingsKeyValues));

      const { MasterData: PaymentMode } = await getValuesInMasterDataByTable('PaymentMode');
      const { PaymentFrequencies } = await getPaymentFrequencyNames();
      const PaymentType = await formatSelectedInputsWithCode(PaymentMode, PaymentFrequencies, 'Name', 'Name', 'Id', 'Id', 'Code', 'Code');
      store.dispatch(loadMasterData({ name: 'PaymentType', value: { Select: PaymentType } }));

      var { MasterData } = await getValuesInMasterDataByTable('ServiceMode');
      const ServiceMode = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadMasterData({ name: 'ServiceMode', value: { Select: ServiceMode } }));

      var { MasterData } = await getValuesInMasterDataByTable('PreventiveMaintenanceFrequency');
      const PreventiveMaintenanceFrequency = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(
        loadMasterData({ name: 'PreventiveMaintenanceFrequency', value: { Select: PreventiveMaintenanceFrequency } })
      );

      var { MasterData } = await getValuesInMasterDataByTable('ServiceWindow');
      const ServiceWindow = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadMasterData({ name: 'ServiceWindow', value: { Select: ServiceWindow } }));

      var { MasterData } = await getValuesInMasterDataByTable('BackToBackScope');
      const BackToBackScope = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadMasterData({ name: 'BackToBackScope', value: { Select: BackToBackScope } }));

      const TenantLocations = await getUserTenantOfficeName();
      const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
      store.dispatch(loadTenantlocations({ Select: TenantLocation }));

      const ContractInvoicePrerequisites = await getInvoicePrerequisiteDetails();
      store.dispatch(loadInvoicePrerequisite(ContractInvoicePrerequisites));

      var { MasterData } = await getValuesInMasterDataByTable('CreditPeriod');
      const CreditPeriod = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadMasterData({ name: 'CreditPeriod', value: { Select: CreditPeriod } }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (contract.AccelLocation != null) {
      getMarketingExecutiveList();
    }
  }, [contract.AccelLocation]);

  const getMarketingExecutiveList = async () => {
    const RoleUsers = await getUsersByRolesList(contract.AccelLocation, ['ALM', 'RCSM', 'SM', 'BDM']);
    const roleUsers = await formatSelectInput(RoleUsers.Roleusers, 'FullName', 'Id');
    store.dispatch(loadEmployees({ Select: roleUsers }));
  };

  const handleClick = (index, divId) => {
    divRefs[divId].current.scrollIntoView({
      behavior: 'smooth',
    });
    setSelectedTab(index);
  };

  function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
    const name = actionMeta.name;
    const value = selectedOption.value;
    if (name == 'PaymentType') {
      setPaymentType(value);
      const [paymentmode, paymentfrequency] = value.split(':');
      store.dispatch(updateField({ name: 'PaymentMode', value: paymentmode }));
      store.dispatch(updateField({ name: 'PaymentFrequency', value: paymentfrequency }));
    }
    store.dispatch(updateField({ name: name as keyof CreateContractState['contract'], value }));
  }

  async function onSubmit(contract: ContractDetails) {
    try {
      await validationSchema.validate(contract, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors));
      if (errors) return;
    }
    store.dispatch(startSubmitting());
    store.dispatch(startPreloader());
    const result = await createContract(store.getState().contractcreate.contract, SelectedContractInvoicePrerequisite);
    store.dispatch(stopSubmitting());
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e);
        store.dispatch(updateErrors(errorMessages));
      },
    });
    store.dispatch(stopPreloader());
  }

  const validationSchema = yup.object().shape({
    AccelLocation: yup.string().required(t('validation_error_contract_create_accel_location_required') ?? ''),
    CustomerInfoId: yup.string().required(t('validation_error_contract_create_customer_name_required') ?? ''),
    AgreementTypeId: yup
      .number()
      .required(t('validation_error_contract_create_agreement_type_required') ?? '')
      .min(1, t('validation_error_contract_create_agreement_type_required') ?? ''),
    BookingType: yup.string().required(t('validation_error_contract_create_booking_type_required') ?? ''),
    StartDate: yup.string().required(t('validation_error_contract_create_start_date_required') ?? ''),
    EndDate: yup
      .string()
      .required(t('validation_error_contract_create_end_date_required') ?? '')
      .test(
        'is-after-start-date',
        `${t('validation_error_contract_create_end_date_later_start_date')}`,
        function (endDate) {
          const { StartDate } = this.parent;
          if (StartDate && endDate) {
            return new Date(endDate) >= new Date(StartDate);
          }
          return true;
        }
      ),
    ContractValue: yup
      .string()
      .required(t('validation_error_contract_create_contract_value_required') ?? '')
      .test('is-positive', 'Invalid Contract Value', (value) => {
        const numericValue = parseFloat(value);
        return numericValue > 0;
      }),
    BookingValueDate: yup.string().required(t('validation_error_contract_create_booking_value_date_required') ?? ''),
    SiteCount: yup.string().when('IsMultiSite', (IsMultiSite, schema) =>
      contract.IsMultiSite === true
        ? schema
          .required(t('validation_error_contract_create_booking_value_site_count_required') ?? '')
          .test(
            'siteCount',
            t('validation_error_site_count_greater_than_one') ?? '',
            value => parseInt(value, 10) > 1
          )
        : schema.nullable()
    ),
    PerformanceGuaranteeAmount: yup
      .number()
      .when('IsPerformanceGuarentee', (IsPerformanceGuarentee, schema) =>
        contract.IsPerformanceGuarentee === true
          ? schema
            .required(
              t('validation_error_contract_create_isperformance_guarante_required') ?? ''
            )
            .typeError(t('validation_error_contract_create_isperformance_guarante_amount_only_digits_are_allowed') ?? '')
          : schema.default(null).nullable()
      ),
  });

  function InformationModal() {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('create_contract_alert_success')}
      </SweetAlert>
    );
  }

  const reDirectRoute = async () => {
    store.dispatch(toggleInformationModalStatus());
    store.dispatch(setRedirectedStatusTab("CTS_PGRS"))
    history.push('/contracts');
  };

  const prerequisiteUpdateField = (ev: any, Description: string | null, DocumentCode: string) => {
    const { value, name } = ev.target;
    if (ev.target.checked == true) {
      store.dispatch(
        setSelectedInvoicePrerequisite([
          ...SelectedContractInvoicePrerequisite,
          { Id: value, DocumentName: name, Description: Description, DocumentCode: DocumentCode },
        ])
      );
    } else {
      store.dispatch(
        setSelectedInvoicePrerequisite(
          SelectedContractInvoicePrerequisite.filter((InvoicePrerequisite) => InvoicePrerequisite.DocumentName !== name)
        )
      );
    }
  };
  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_contracts', Link: '/contracts' },
    { Text: 'breadcrumbs_contracts_booking' },
  ];

  return (
    <>
      <div className=''>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <ContainerPage>
        <div className='d-flex align-items-start ps-0 pe-3'>
          {/* left section */}
          <div className='contract-booking-left-menu  '>
            <div
              className='nav  nav-pills me-0 d-grid mx-auto position-fixed'
              id='v-pills-tab'
              role='tablist'
              aria-orientation='vertical'
            >
              {contractLeftMenuTabs.map((leftTab, index) => (
                <>
                  <div
                    onClick={() => handleClick(index, leftTab.divname)}
                    className={
                      selectedTab == index
                        ? 'nav-link active button-sidebar app-primary-color '
                        : 'nav-link button-sidebar'
                    }
                    id={`${leftTab.icon}-tab`}
                    data-bs-toggle='pill'
                    key={leftTab.id}
                    data-bs-target={`#${leftTab.icon}`}
                    role='tab'
                    aria-controls={`${leftTab.icon}`}
                    aria-selected={leftTab.id == 1 ? true : false}
                  >
                    <div className='d-flex justify-content-start'>
                      {/* menu icon */}
                      <div className='m-0 '>
                        <FeatherIcon icon={leftTab.icon ?? ''} size='16' />
                      </div>
                      {/* menu icon ends */}
                      {/* menu name */}
                      <div className='ms-1 d-flex justify-content-center'>
                        <span className='pseudo-link'>{leftTab.name}</span>
                      </div>
                      {/* menu name ends */}
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
          {/* left section ends */}

          {/* right section */}
          <div className='tab-content col-md-10 ms-0 ps-3 pt-1'>
            <ValidationErrorComp errors={errors} />
            {/* Section 1 */}
            <>
              {/* Contract Details Start*/}
              <div
                className='fw-bold border-bottom py-1 mb-2 border-light app-primary-color fs-6'
                ref={divRefs.contractDetails}
              >
                {t('create_contract_sub_contract')}
              </div>
              {/* help text */}
              <div className='small mb-2'>
                <Expand
                  maxLength={150}
                  helpText={t('create_contract_expandable_section_initial_content')}
                />
              </div>
              {/* help text ends */}

              {/* accel location */}
              <div className='mb-2'>
                <label className='red-asterisk'>{t('create_contract_label_tenent_location')}</label>
                <Select
                  options={TenantOfficeInfo}
                  value={
                    (TenantOfficeInfo && TenantOfficeInfo.find((option) => option.value == contract.AccelLocation)) ||
                    null
                  }
                  onChange={onFieldChangeSelect}
                  isSearchable
                  name='AccelLocation'
                  placeholder='Select option'
                />
                <div className='small text-danger'> {t(errors['AccelLocation'])}</div>
              </div>
              {/* accel location ends */}

              {/* customer name */}
              <div className='mb-2'>
                <label className='red-asterisk'>{t('create_contract_label_customer_name')}</label>
                <Select
                  value={(Customer && Customer.find((option) => option.value == contract.CustomerInfoId)) || null}
                  options={Customer}
                  onChange={onFieldChangeSelect}
                  isSearchable
                  name='CustomerInfoId'
                  placeholder='Select option'
                />
                <div className='small text-danger'> {t(errors['CustomerInfoId'])}</div>
                {CustomerList.length > 0 && (
                  <div className='text-muted mt-1'>
                    {CustomerList.filter((value) => value.Id == contract.CustomerInfoId).length > 0
                      ? `Address : ${CustomerList.filter((value) => value.Id == contract.CustomerInfoId)[0].BilledToAddress
                      }`
                      : ''}
                  </div>
                )}
              </div>
              {/* customer name ends */}

              {/* Marketing Executive name */}
              <div className='mb-2'>
                <label>{t('create_contract_label_marketing_executive')}</label>
                <Select
                  options={Employee}
                  value={(Employee && Employee.find((option) => option.value == contract.MarketingExecutive)) || null}
                  onChange={onFieldChangeSelect}
                  isSearchable
                  name='MarketingExecutive'
                  placeholder='Select option'
                />
              </div>
              {/* MarketingExecutive ends */}

              {/* Agreement Type */}
              <div className='mb-2'>
                <label className='red-asterisk'>{t('create_contract_label_agreement_type')}</label>
                <Select
                  value={
                    (masterDataList.AgreementType &&
                      masterDataList.AgreementType.find((option) => option.value == contract.AgreementTypeId)) ||
                    null
                  }
                  options={masterDataList.AgreementType}
                  onChange={onFieldChangeSelect}
                  isSearchable
                  name='AgreementTypeId'
                  placeholder='Select option'
                />
                <div className='small text-danger'> {t(errors['AgreementTypeId'])}</div>
              </div>
              {/* Agreement Type ends*/}

              {/* Add Purchase Order Line Item */}
              <div className='row'>
                <>
                  {['1', '2', '4', '5'].includes(contract.AgreementTypeId.toString()) && (
                    <div className={getFieldColumnClass(contract.AgreementTypeId.toString())}>
                      <label className='mt-2 red-asterisk'>{t('create_contract_label_amcvalue')}</label>
                      <input
                        name='AmcValue'
                        onChange={onUpdateField}
                        type='text'
                        value={contract.AmcValue ?? 0}
                        className={`form-control`}
                      />
                    </div>
                  )}
                </>
                <>
                  {['3', '4', '5'].includes(contract.AgreementTypeId.toString()) && (
                    <div className={getFieldColumnClass(contract.AgreementTypeId.toString())}>
                      <label className='mt-2 red-asterisk'>{t('create_contract_label_fmsvalue')}</label>
                      <input
                        name='FmsValue'
                        onChange={onUpdateField}
                        type='text'
                        value={contract.FmsValue ?? 0}
                        className={`form-control`}
                      ></input>
                    </div>
                  )}
                </>
                {/* Contract Value*/}
                {parseInt(contract.AgreementTypeId.toString()) > 0 && (
                  <>
                    <div className={getFieldColumnClass(contract.AgreementTypeId.toString())}>
                      <label className='red-asterisk mt-2'>{t('create_contract_label_contract_value')}</label>
                      <input
                        name='ContractValue'
                        readOnly
                        disabled={true}
                        value={contract.ContractValue == null ? 0 : contract.ContractValue}
                        type='number'
                        className='form-control'
                      ></input>
                      <div className='small text-danger'> {t(errors['ContractValue'])}</div>
                    </div>
                  </>
                )}
                {/* Contract Value ends*/}
              </div>
              {/* Add Purchase Order Line Item Ends*/}

              {/* Contract Start Date & End Date */}
              <div className='row mb-2'>
                <div className='col-md-6'>
                  <label className='red-asterisk'>{t('create_contract_label_start_date')}</label>
                  <input
                    name='StartDate'
                    value={contract.StartDate ? contract.StartDate : ''}
                    onChange={onUpdateField}
                    type='date'
                    className='form-control'
                  ></input>
                  <div className='small text-danger'> {t(errors['StartDate'])}</div>
                </div>

                <div className='col-md-6'>
                  <label className='red-asterisk'>{t('create_contract_label_end_date')}</label>
                  <input
                    name='EndDate'
                    value={contract.EndDate ? contract.EndDate : ''}
                    min={contract.StartDate}
                    onChange={onUpdateField}
                    type='date'
                    className='form-control'
                  ></input>
                  <div className='small text-danger'> {t(errors['EndDate'])}</div>
                </div>
              </div>
              {/* Contract Start Date & End Date Ends */}
            </>
            {/* Contract Details Ends*/}

            {/* Booking Details Start */}
            <>
              <div
                className='fw-bold fs-6 mt-3 border-bottom py-1 mb-2 border-light app-primary-color'
                ref={divRefs.bookingDetails}
              >
                {t('create_contract_sub_booking')}
              </div>
              {/* help text */}
              {/* help text ends */}

              {/* Booking Date & Booking Type */}
              <div className='row mb-2'>
                <div className='col-md-6'>
                  <div className='mb-2 mt-0'>
                    <label className='red-asterisk'>{t('create_contract_label_booking_type')}</label>
                    <Select
                      options={masterDataList.BookingType}
                      value={
                        (masterDataList.BookingType &&
                          masterDataList.BookingType.find((option) => option.value == contract.BookingType)) ||
                        null
                      }
                      onChange={onFieldChangeSelect}
                      isSearchable
                      name='BookingType'
                      placeholder='Select option'
                    />
                    <div className='small text-danger'> {t(errors['BookingType'])}</div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <label>{t('create_contract_label_booking_date')}</label>
                  <input
                    name='BookingDate'
                    value={contract.BookingDate ? contract.BookingDate : '--'}
                    onChange={onUpdateField}
                    type='date'
                    className='form-control'
                  />
                </div>
              </div>
              {/* Booking Date & Booking Type Ends*/}
            </>
            {/* Booking Details Ends */}

            {/* Purchase Order Details */}
            <>
              <div
                className='fw-bold mt-2 border-bottom py-1 mb-2 border-light app-primary-color fs-6'
                ref={divRefs.poDetails}
              >
                {t('create_contract_sub_podetail')}
              </div>
              {/* help text */}
              {/* help text ends */}

              {/*  Quotation Reference Number & Date Start*/}
              <div className='row mb-2 mt-1'>
                <div className='col-md-6'>
                  <label>{t('create_contract_label_quotation_reference_number')}</label>
                  <input
                    name='QuotationReferenceNumber'
                    value={contract.QuotationReferenceNumber ? contract.QuotationReferenceNumber : ''}
                    onChange={onUpdateField}
                    type='text'
                    className='form-control'
                  ></input>
                </div>
                <div className='col-md-6'>
                  <label>{t('create_contract_label_quotation_reference_date')}</label>
                  <input
                    name='QuotationReferenceDate'
                    max={contract.StartDate}
                    value={contract.QuotationReferenceDate ? contract.QuotationReferenceDate : ''}
                    onChange={onUpdateField}
                    type='date'
                    className='form-control'
                  ></input>
                </div>
              </div>
              {/*  Quotation Reference Number & Date Ends*/}

              {/* PO Number & Date Start */}
              <div className='row mb-2'>
                <div className='col-md-6'>
                  <label>{t('create_contract_label_purchase_order_number')}</label>
                  <input
                    name='PoNumber'
                    value={contract.PoNumber}
                    onChange={onUpdateField}
                    type='text'
                    className='form-control'
                  ></input>
                </div>
                <div className='col-md-6 '>
                  <label>{t('create_contract_label_purchase_order_date')}</label>
                  <input
                    name='PoDate'
                    max={contract.StartDate}
                    value={contract.PoDate ? contract.PoDate : ''}
                    onChange={onUpdateField}
                    type='date'
                    className='form-control'
                  ></input>
                </div>
              </div>
              {/* PO Number & Date End */}

              {/* Is MultiSite */}
              <div className=' mb-2 form-check form-switch'>
                <input
                  className='form-check-input switch-input-lg'
                  type='checkbox'
                  name='IsMultiSite'
                  id='flexSwitchCheckDefault'
                  checked={contract.IsMultiSite.valueOf()}
                  value={contract.IsMultiSite.toString()}
                  onChange={onUpdateField}
                />
                <label className='form-check-label'>{t('create_contract_label_multi_site_contract')}</label>
                <div className='form-text'>{t('create_contract_ismultisite_help_text')}</div>
              </div>
              {/* Is MultiSite End */}

              {/* Site Count */}
              {contract.IsMultiSite && (
                <div className='row mb-2'>
                  <div className='col-md-6'>
                    <label className='red-asterisk'>{t('create_contract_label_is_site_count')}</label>
                    <input
                      name='SiteCount'
                      value={contract.SiteCount ? contract.SiteCount : ''}
                      onChange={onUpdateField}
                      type='number'
                      className='form-control'
                    ></input>
                    <div className='small text-danger'> {t(errors['SiteCount'])}</div>
                  </div>
                </div>
              )}
              {/* Site Count Ends*/}

              {/* Is PAV Needed(Is Pre Amc Needed) */}
              <div className=' mb-2 form-check form-switch'>
                <input
                  className='form-check-input switch-input-lg'
                  type='checkbox'
                  name='IsPAVNeeded'
                  id='flexSwitchCheckDefault'
                  checked={contract.IsPAVNeeded.valueOf()}
                  value={contract.IsPAVNeeded.toString()}
                  onChange={onUpdateField}
                />
                <label className='form-check-label'>{t('create_contract_label_is_pav_needed_contract')}</label>
                <div className='form-text'>{t('create_contract_is_pav_needed_help_text')}</div>
              </div>
              {/* Is PAV Needed(Is Pre Amc Needed) End */}

              {/* Is Preformance Guarentee*/}
              <div className=' mb-2 form-check form-switch'>
                <input
                  className='form-check-input switch-input-lg'
                  type='checkbox'
                  name='IsPerformanceGuarentee'
                  id='flexSwitchCheckDefault'
                  checked={contract.IsPerformanceGuarentee.valueOf()}
                  value={contract.IsPerformanceGuarentee.toString()}
                  onChange={onUpdateField}
                />
                <label className='form-check-label'>{t('create_contract_label_is_performance_guarentee')}</label>
                <div className='form-text'>{t('create_contract_is_performance_guarentee_help_text')}</div>
              </div>
              {/* Is Preformance Guarentee End */}

              {/* Performance Guarentee Amount */}
              {contract.IsPerformanceGuarentee && (
                <div className='row mb-2'>
                  <div className='col-md-6'>
                    <label>{t('create_contract_label_performance_guarentee_amount')}</label>
                    <input
                      name='PerformanceGuaranteeAmount'
                      value={contract.PerformanceGuaranteeAmount ? contract.PerformanceGuaranteeAmount : ''}
                      onChange={onUpdateField}
                      maxLength={17}
                      type='text'
                      className='form-control'
                    ></input>
                    <div className='small text-danger'> {t(errors['PerformanceGuaranteeAmount'])}</div>
                  </div>
                </div>
              )}
              {/* Performance Guarentee Amount Ends*/}
            </>
            {/* Purchase Order Details Ends*/}

            {/* Payment Details Starts*/}
            <>
              <div
                className='fw-bold mt-3 border-bottom py-1 mb-2 border-light app-primary-color fs-6'
                ref={divRefs.paymentDetails}
              >
                {t('create_contract_sub_payment')}
              </div>
              {/* help text */}
              {/* help text ends */}

              {/* Is SEZ */}
              <div className=' mb-2 form-check form-switch mt-1'>
                <input
                  className='form-check-input switch-input-lg'
                  type='checkbox'
                  name='IsSez'
                  id='flexSwitchCheckDefault'
                  checked={contract.IsSez.valueOf()}
                  value={contract.IsSez.toString()}
                  onChange={onUpdateField}
                />
                <label className='form-check-label'>{t('create_contract_label_is_sez')}</label>
                <div className='form-text'>{t('create_contract_is_sez_help_text')}</div>
              </div>
              {/* Is SEZ Ends*/}

              <div className='row mb-2'>
                <div className='col-md-6'>
                  <label>{t('create_contract_label_payment_type')}</label>
                  <Select
                    options={masterDataList.PaymentType}
                    value={
                      (masterDataList.PaymentType &&
                        masterDataList.PaymentType.find((option) => option.value == paymentType)) ||
                      null
                    }
                    onChange={onFieldChangeSelect}
                    isSearchable
                    name='PaymentType'
                    placeholder='Select option'
                  />
                </div>
                {/* Credit Period */}
                <div className='mb-2 col-md-6'>
                  <label>{t('create_contract_label_creadit_period')}</label>
                  <Select
                    value={
                      (masterDataList.CreditPeriod &&
                        masterDataList.CreditPeriod.find((option) => option.value == contract.CreditPeriod)) ||
                      null
                    }
                    options={masterDataList.CreditPeriod}
                    onChange={onFieldChangeSelect}
                    isSearchable
                    name='CreditPeriod'
                    placeholder={t('create_contract_placeholder')}
                  />
                </div>
                {/* Credit Period Ends*/}
              </div>
            </>
            {/* Payment Details Ends */}

            {/* Service Details Star*/}
            <>
              <div
                className='fw-bold mt-3 border-bottom py-1 mb-2 border-light app-primary-color fs-6'
                ref={divRefs.serviceDetails}
              >
                {t('create_contract_sub_service')}
              </div>
              {/* help text */}
              <div className='small mb-2'>
                <Expand
                  maxLength={150}
                  helpText="Knowing the customer's working days and service mode is critical for tailoring maintenance services to their specific needs, optimizing scheduling, and ensuring that the contract terms and costs are aligned with the customer's operational requirements"
                />
              </div>
              {/* help text ends */}

              {/* Service Window */}
              <div className='row mb-2'>
                {/* Service Mode */}
                <div className='col-md-6'>
                  <label>{t('create_contract_label_service_mode')}</label>
                  <Select
                    value={
                      (masterDataList.ServiceMode &&
                        masterDataList.ServiceMode.find((option) => option.value == contract.ServiceMode)) ||
                      null
                    }
                    options={masterDataList.ServiceMode}
                    onChange={onFieldChangeSelect}
                    isSearchable
                    name='ServiceMode'
                    placeholder='Select option'
                  />
                </div>
                {/* Service Mode Ends*/}

                <div className='col-md-6'>
                  <label>{t('create_contract_label_service_window')}</label>
                  <Select
                    options={masterDataList.ServiceWindow}
                    value={
                      (masterDataList.ServiceWindow &&
                        masterDataList.ServiceWindow.find((option) => option.value == contract.ServiceWindow)) ||
                      null
                    }
                    onChange={onFieldChangeSelect}
                    isSearchable
                    name='ServiceWindow'
                    placeholder='Select option'
                  />
                </div>
              </div>
              {/* Service Window Ends*/}

              {/* Is Preventive Maintenance Needed*/}
              <div className=' mb-2 form-check form-switch'>
                <input
                  className='form-check-input switch-input-lg'
                  type='checkbox'
                  name='IsPreventiveMaintenanceNeeded'
                  id='flexSwitchCheckDefault'
                  checked={contract.IsPreventiveMaintenanceNeeded.valueOf()}
                  value={contract.IsPreventiveMaintenanceNeeded.toString()}
                  onChange={onUpdateField}
                />
                <label className='form-check-label'>
                  {t('create_contract_label_is_preventive_maintenance_needed')}
                </label>
                <div className='form-text'>{t('create_contract_is_preventive_maintenance_needed_help_text')}</div>
              </div>
              {/* Is Preventive Maintenance Needed End */}

              {/* PM Frequency */}
              {contract.IsPreventiveMaintenanceNeeded && (
                <div className='row mb-2'>
                  <div className='col-md-6'>
                    <label>{t('create_contract_label_preventive_maintenance_frequency')}</label>
                    <Select
                      options={masterDataList.PreventiveMaintenanceFrequency}
                      value={
                        (masterDataList.PreventiveMaintenanceFrequency &&
                          masterDataList.PreventiveMaintenanceFrequency.find(
                            (option) => option.value == contract.PmFrequency
                          )) ||
                        null
                      }
                      onChange={onFieldChangeSelect}
                      isSearchable
                      name='PmFrequency'
                      placeholder='Select option'
                    />
                  </div>
                </div>
              )}
              {/* PM Frequency Ends*/}

              {/* Is Back To Back Allowed*/}
              <div className=' mb-2 form-check form-switch'>
                <input
                  className='form-check-input switch-input-lg'
                  type='checkbox'
                  name='IsBackToBackAllowed'
                  id='flexSwitchCheckDefault'
                  checked={contract.IsBackToBackAllowed.valueOf()}
                  value={contract.IsBackToBackAllowed.toString()}
                  onChange={onUpdateField}
                />
                <label className='form-check-label'>{t('create_contract_label_is_back_to_back_allowed')}</label>
                <div className='form-text'>{t('create_contract_is_back_to_back_allowed_help_text')}</div>
              </div>
              {/* Is OutSourcing Allowed End */}

              {/* Back To Back Scope */}
              {contract.IsBackToBackAllowed && (
                <div className='row mb-2'>
                  <div className='col-md-6'>
                    <label>{t('create_contract_label_is_back_to_back_scope')}</label>
                    <Select
                      value={
                        (masterDataList.BackToBackScope &&
                          masterDataList.BackToBackScope.find(
                            (option) => option.value == contract.BackToBackScopeId
                          )) ||
                        null
                      }
                      options={masterDataList.BackToBackScope}
                      onChange={onFieldChangeSelect}
                      isSearchable
                      name='BackToBackScopeId'
                      placeholder='Select option'
                    />
                  </div>
                </div>
              )}

              {/* Back To Back Scope Ends*/}
            </>
            {/* Service Details Ends*/}

            {/* SLA Details */}
            <>
              <div
                className='fw-bold mt-3 border-bottom py-1 mb-2 border-light app-primary-color fs-6'
                ref={divRefs.slaDetails}
              >
                {t('create_contract_sub_sla')}
              </div>
              {/* help text */}
              <div className='small mb-2'>
                <Expand
                  maxLength={150}
                  helpText='Service Level Agreements, often referred to as SLAs, are formal agreements that outline the specific expectations and commitments between our organization and the customer.'
                />
              </div>
              {/* help text ends */}

              {/* Is StandBy Required*/}
              <div className=' mb-2 form-check form-switch'>
                <input
                  className='form-check-input switch-input-lg'
                  type='checkbox'
                  name='IsStandByRequired'
                  id='flexSwitchCheckDefault'
                  checked={contract.IsStandByRequired.valueOf()}
                  value={contract.IsStandByRequired.toString()}
                  onChange={onUpdateField}
                />
                <label className='form-check-label'>{t('create_contract_label_is_standby_required')}</label>
                <div className='form-text'>{t('create_contract_is_standby_required_help_text')}</div>
              </div>
              {/* Is Is StandBy Required Ends */}

              {contract.IsStandByRequired && (
                <>
                  {/* Is StandBy Full-Unit Required*/}
                  <div className=' mb-2 form-check form-switch'>
                    <input
                      className='form-check-input switch-input-lg'
                      type='checkbox'
                      name='IsStandByFullUnitRequired'
                      id='flexSwitchCheckDefault'
                      checked={contract.IsStandByFullUnitRequired.valueOf()}
                      value={contract.IsStandByFullUnitRequired.toString()}
                      onChange={onUpdateField}
                    />
                    <label className='form-check-label'>
                      {t('create_contract_label_is_standby_full_unit_required')}
                    </label>
                    <div className='form-text'>
                      {t('create_contract_label_is_standby_full_unit_required_help_text')}
                    </div>
                  </div>
                  {/* Is Is StandBy Full-Unit Required Ends*/}

                  {/* Is Standby Impress Stock Required*/}
                  <div className=' mb-2 form-check form-switch'>
                    <input
                      className='form-check-input switch-input-lg'
                      type='checkbox'
                      name='IsStandByImpressStockRequired'
                      id='flexSwitchCheckDefault'
                      checked={contract.IsStandByImpressStockRequired.valueOf()}
                      value={contract.IsStandByImpressStockRequired.toString()}
                      onChange={onUpdateField}
                    />
                    <label className='form-check-label'>
                      {t('create_contract_label_is_standby_impress_stock_required')}
                    </label>
                    <div className='form-text'>
                      {t('create_contract_label_is_standby_impress_stock_required_help_text')}
                    </div>
                  </div>
                  {/* Is Standby Impress Stock Required Ends */}
                </>
              )}
            </>
            {/* SLA Details Ends*/}

            {/* Documents Needed For Invoice Submission */}
            <>
              <div
                className='fw-bold fs-6 mt-3 border-bottom py-1 mb-2 border-light app-primary-color'
                ref={divRefs.dnfInvoiceSubmission}
              >
                {t('create_contract_sub_documents')}
              </div>
              {/* help text */}
              <div className='small mb-2'>
                <Expand helpText='Submitting your invoice is a crucial step in our payment process. To ensure a smooth and efficient transaction, please make sure to provide the following documents are submitted along with the contract invoice.' />
              </div>
              {/* help text ends */}
              {InvoicePrerequisite.length > 0 ? (
                <>
                  {InvoicePrerequisite.map((contractInvoicePrerequisite) => (
                    <div>
                      <div className='mt-2'>
                        <input
                          onChange={(e) =>
                            prerequisiteUpdateField(
                              e,
                              contractInvoicePrerequisite.Description,
                              contractInvoicePrerequisite.DocumentCode
                            )
                          }
                          type='checkbox'
                          value={contractInvoicePrerequisite.Id}
                          name={contractInvoicePrerequisite.DocumentName}
                          className={`form-check-input mt-1`}
                        />
                        <label className='form-check-label ms-2'>{contractInvoicePrerequisite.DocumentName}</label>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className='text-muted'>{t('create_contract_documents_not_added')}</div>
              )}
              <button
                type='button'
                onClick={() => onSubmit(contract)}
                className='sticky-bottom btn app-primary-bg-color text-white mt-3 mb-1 w-100'
              >
                {t('create_contract_button_create_contract')}
              </button>
            </>
            {/* Documents Needed For Invoice Submission Ends*/}
          </div>
          {/* right section ends */}
          {/* Create contract form ends here */}
          {/* Information Modal */}
          {showAlert && (
            <SweetAlert warning title='Warning!' confirmBtnBsStyle='warning' onConfirm={() => setShowAlert(false)}>
              {t('create_contract_warning_message')}
            </SweetAlert>
          )}
          {displayInformationModal ? <InformationModal /> : ''}
          {/* Information Modal Ends*/}
        </div>
      </ContainerPage>
    </>
  );
}
