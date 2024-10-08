import { store } from '../../../../../state/store';
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { ContractRenewDetail } from '../../../../../types/contract';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getClickedContractInfo, getContractsList, renewContract, updateContract } from '../../../../../services/contracts';
import { useEffect, useRef, useState } from 'react';
import { contractLeftMenuTabs } from '../../../../../tabs.json'
import * as yup from 'yup';
import {
  initializeContract,
  ContractRenewState,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
  loadMasterData,
  loadTenantlocations,
  loadCustomers,
  loadEmployees,
  loadContractInvoicePrerequisite,
  loadPaymentFrequency,
  loadContractDetails,
  loadInvoicePrerequisite,
  setSelectedInvoicePrerequisite,
  removeInvoicePrerequisite,
  loadAppkeyValues,
} from './ContractRenew.slice';
import { getCustomersList } from '../../../../../services/customer';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectedInputs, getFieldColumnClass } from '../../../../../helpers/formats';
import { getValuesInMasterDataByTable } from '../../../../../services/masterData';
import { ExpandableSection } from '../../../../ExpandableSection/ExpandableSection';
import { getPaymentFrequencyNames } from '../../../../../services/paymentFrequency';
import { loadContracts, setRedirectedStatusTab } from '../../../ContractManagement/ContractManagement.slice';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { Link, useHistory, useParams } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { getInvoicePrerequisiteDetails } from '../../../../../services/invoicePrerequisite';
import { getContractInvoicePrerequisite } from '../../../../../services/contractInvoicePrerequisite';
import { getUserTenantOfficeName, getUsersByRolesList } from '../../../../../services/users';
import { getAppKeyValues } from '../../../../../services/appsettings';

export const ContractRenew = () => {
  const { t } = useTranslation();

  const history = useHistory()
  const { ContractId } = useParams<{ ContractId: string }>();
  const [selectedTab, setSelectedTab] = useState(0);

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

  const optionFields = [
    "IsMultiSite",
    "IsPAVNeeded",
    "IsPerformanceGuaranteeRequired",
    "IsPmRequired",
    "IsStandByRequired",
    "IsStandByFullUnitRequired",
    "IsStandByImprestStockRequired",
    "IsBackToBackAllowed",
    "IsSez",
  ]

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    if (optionFields.includes(name)) {
      value = ev.target.checked ? true : false;
    }
    store.dispatch(updateField({ name: name as keyof ContractRenewState['contract'], value }));
  }
  const [paymentType, setPaymentType] = useState('');

  const GetMasterDataItems = async () => {
    store.dispatch(initializeContract());
    try {
      const contractInfo = await getClickedContractInfo(ContractId);
      store.dispatch(loadContractDetails(contractInfo))

      var { MasterData } = await getValuesInMasterDataByTable("AgreementType")
      const agreementType = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadMasterData({ name: "AgreementType", value: { Select: agreementType } }));

      var { MasterData } = await getValuesInMasterDataByTable("BookingType")
      const bookingType = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadMasterData({ name: "BookingType", value: { Select: bookingType } }));

      var { MasterData } = await getValuesInMasterDataByTable("ServiceMode")
      const ServiceMode = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadMasterData({ name: "ServiceMode", value: { Select: ServiceMode } }));

      const AppSettingsKeyValues = await getAppKeyValues('PaymentTypeExclusion');
      store.dispatch(loadAppkeyValues(AppSettingsKeyValues));

      const { MasterData: PaymentMode } = await getValuesInMasterDataByTable("PaymentMode");
      const { PaymentFrequencies } = await getPaymentFrequencyNames();
      const PaymentType = await formatSelectedInputs(PaymentMode, PaymentFrequencies, "Name", "Name", "Id", "Id");
      store.dispatch(loadMasterData({ name: "PaymentType", value: { Select: PaymentType } }));

      var { MasterData } = await getValuesInMasterDataByTable("PreventiveMaintenanceFrequency")
      const PreventiveMaintenanceFrequency = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadMasterData({ name: "PreventiveMaintenanceFrequency", value: { Select: PreventiveMaintenanceFrequency } }));

      var { MasterData } = await getValuesInMasterDataByTable("ServiceWindow")
      const ServiceWindow = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadMasterData({ name: "ServiceWindow", value: { Select: ServiceWindow } }));

      var { MasterData } = await getValuesInMasterDataByTable("BackToBackScope")
      const BackToBackScope = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadMasterData({ name: "BackToBackScope", value: { Select: BackToBackScope } }));

      const TenantLocations = await getUserTenantOfficeName();
      const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, "OfficeName", "Id")
      store.dispatch(loadTenantlocations({ Select: TenantLocation }));

      const Customers = await getCustomersList();
      const customers = await formatSelectInput(Customers.CustomersList, "Name", "Id")
      store.dispatch(loadCustomers({ Select: customers }));

      const InvoicePrerequisites = await getInvoicePrerequisiteDetails()
      store.dispatch(loadInvoicePrerequisite(InvoicePrerequisites));

      const ContractInvoicePrerequisites = await getContractInvoicePrerequisite(ContractId)
      store.dispatch(loadContractInvoicePrerequisite(ContractInvoicePrerequisites));
    } catch (error) {
      console.error(error);
    }
  }

  const { contractrenew: { contract, errors, displayInformationModal, masterDataList, InvoicePrerequisite, Customer, Employee, PaymentFrequency, TenantOfficeInfo, ContractInvoicePrerequisite } } = useStoreWithInitializer(
    ({ contractrenew }) => ({ contractrenew }),
    GetMasterDataItems
  );

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

  const handleClick = (index, divId,) => {
    divRefs[divId].current.scrollIntoView({
      behavior: "smooth",
    });
    setSelectedTab(index);
  };

  useEffect(() => {
    setPaymentType(`${contract.PaymentModeId}:${contract.PaymentFrequencyId}`)
  }, [contract.PaymentFrequencyId, contract.PaymentModeId])

  const onFieldChangeSelect = (selectedOption: any, actionMeta: any) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    if (name == "PaymentType") {
      setPaymentType(value)
      const [paymentmode, paymentfrequency] = value.split(':');
      store.dispatch(updateField({ name: 'PaymentModeId', value: paymentmode }));
      store.dispatch(updateField({ name: 'PaymentFrequencyId', value: paymentfrequency }));
    }
    store.dispatch(updateField({ name: name as keyof ContractRenewState['contract'], value }));
  }

  useEffect(() => {
    onLoad();
  }, [contract.CustomerInfoId]);

  const onLoad = async () => {
    try {
      var { MasterData } = await getValuesInMasterDataByTable("CreditPeriod");
      const CreditPeriod = await formatSelectInput(MasterData, "Name", "Id");
      if (contract.CreditPeriod && !CreditPeriod.some(item => item.value === contract.CreditPeriod)) {
        CreditPeriod.push({ value: contract.CreditPeriod, label: contract.CreditPeriodName });
      }
      store.dispatch(loadMasterData({ name: "CreditPeriod", value: { Select: CreditPeriod } }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onSubmit = async (contract: ContractRenewDetail) => {
    try {
      await validationSchema.validate(contract, { abortEarly: false });
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
    const result = await renewContract(contract, ContractInvoicePrerequisite);
    store.dispatch(stopSubmitting())
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
  }

  const validationSchema = yup.object().shape({
    AccelLocation: yup.string().required('validation_error_contract_create_accel_location_required'),
    CustomerInfoId: yup.string().required('validation_error_contract_create_customer_name_required'),
    AgreementTypeId: yup.string().required('validation_error_contract_create_agreement_type_required'),
    BookingTypeId: yup.string().required('validation_error_contract_create_booking_type_required'),
    StartDate: yup.string().required('validation_error_contract_create_start_date_required'),
    EndDate: yup.string().required('validation_error_contract_create_end_date_required'),
    ContractValue: yup.string().required('validation_error_contract_create_contract_value_required'),
    BookingValueDate: yup.string().required(t('validation_error_contract_create_booking_value_date_required') ?? ''),
    PerformanceGuaranteeAmount: yup
      .number()
      .when('IsPerformanceGuarentee', (IsPerformanceGuarentee, schema) =>
        contract.IsPerformanceGuaranteeRequired === true
          ? schema
            .required(
              t('validation_error_contract_create_isperformance_guarante_required') ?? ''
            )
            .typeError(t('validation_error_contract_renew_isperformance_guarante_amount_only_digits_are_allowed') ?? '')
          : schema.default(null).nullable()
      ),
  });

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('contractrenew_alert_success')}
      </SweetAlert>
    );
  }

  const reDirectRoute = async () => {
    store.dispatch(toggleInformationModalStatus());
    store.dispatch(setRedirectedStatusTab("CTS_PGRS"))
    history.push('/contracts')
  }

  const idSet = new Set(ContractInvoicePrerequisite.map(item => item.InvoicePrerequisiteId));

  const contractInvoicePrerequisiteUpdate = (ev) => {
    const { value, name } = ev.target
    const notExist = ContractInvoicePrerequisite.find(item => item.InvoicePrerequisiteId == value && item.Id !== null)?.InvoicePrerequisiteId == value
    const isExist = ContractInvoicePrerequisite.findIndex(item => item.InvoicePrerequisiteId == value && item.Id == null)
    if (ev.target.checked == true && notExist == false) {
      store.dispatch(setSelectedInvoicePrerequisite([...ContractInvoicePrerequisite, { Id: null, InvoicePrerequisiteId: parseInt(value), IsActive: true, DocumentName: name }]))
    }
    else if (ev.target.checked == true && notExist == true) {
      store.dispatch(setSelectedInvoicePrerequisite(ContractInvoicePrerequisite.map((InvoicePrerequisite) => {
        if (InvoicePrerequisite.InvoicePrerequisiteId == value) {
          return {
            ...InvoicePrerequisite, IsActive: true
          }
        }
        return InvoicePrerequisite
      })))
    }
    else if (ev.target.checked == false && isExist !== -1) {
      store.dispatch(removeInvoicePrerequisite(isExist))
    }
    else {
      store.dispatch(setSelectedInvoicePrerequisite(ContractInvoicePrerequisite.map((InvoicePrerequisite) => {
        if (InvoicePrerequisite.InvoicePrerequisiteId == value) {
          return {
            ...InvoicePrerequisite, IsActive: false
          }
        }
        return InvoicePrerequisite
      })))
    }
  }

  return (
    <ContainerPage>
      <div className='d-flex align-items-start ps-0 pe-3'>
        {/* left section */}
        <div className="contract-booking-left-menu mt-2 ">
          <div className="nav  nav-pills me-0 d-grid mx-auto" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <div className='ps-3'>
              <Link to={`/contracts/view/${ContractId}`} className='app-primary-color ps-1' >
                <FeatherIcon icon="arrow-left-circle" size="24" />
              </Link>
            </div>
            {contractLeftMenuTabs.map((leftTab, index) => (
              <>
                <div
                  onClick={() => handleClick(index, leftTab.divname)}
                  className={selectedTab == index ? "nav-link active button-sidebar app-primary-color " : "nav-link button-sidebar"}
                  id={`${leftTab.icon}-tab`} data-bs-toggle="pill" key={leftTab.id}
                  data-bs-target={`#${leftTab.icon}`} role="tab"
                  aria-controls={`${leftTab.icon}`}
                  aria-selected={leftTab.id == 1 ? true : false}
                >
                  <div className="d-flex justify-content-start">
                    {/* menu icon */}
                    <div className="m-0 ">
                      <FeatherIcon icon={leftTab.icon ?? ""} size="16" />
                    </div>
                    {/* menu icon ends */}
                    {/* menu name */}
                    <div className="ms-1 d-flex justify-content-center">
                      <span role="button">
                        {leftTab.name}
                      </span>
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
        <div className="tab-content col-md-10 ms-0 ps-3 pt-3">
          <ValidationErrorComp errors={errors} />
          {/* Section 1 */}
          <>
            {/* Contract Details Start*/}
            <div className="fw-bold" ref={divRefs.contractDetails}>
              Contract Details
            </div>
            {/* help text */}
            <div className="small mb-2">
              <ExpandableSection
                initialContent={t('renew_contract_expandable_section_initial_content')}
              />
            </div>
            {/* help text ends */}

            {/* accel location */}
            <div className="mb-2">
              <label className='red-asterisk'>{t('contractrenew_label_tenent_location')}</label>
              <Select
                options={TenantOfficeInfo}
                value={TenantOfficeInfo && TenantOfficeInfo.find(option => option.value == contract.AccelLocation) || null}
                onChange={onFieldChangeSelect}
                isSearchable
                name="AccelLocation"
                placeholder="Select option"
              />
              <div className="small text-danger"> {t(errors["AccelLocation"])}</div>
            </div>
            {/* accel location ends */}

            {/* customer name */}
            <div className="mb-2">
              <label >{t('contractrenew_label_customer_name')}</label>
              <Select
                value={Customer && Customer.find(option => option.value == contract.CustomerInfoId) || null}
                options={Customer}
                isDisabled={true}
                isSearchable={false}
                name="CustomerInfoId"
                placeholder="Select option"
              />
              <div className="small text-danger"> {t(errors["CustomerInfoId"])}</div>
            </div>
            {/* customer name ends */}

            {/* Marketing Executive name */}
            <div className="mb-2">
              <label >{t('contractrenew_label_marketing_executive')}</label>
              <Select
                options={Employee}
                value={Employee && Employee.find(option => option.value == contract.SalesContactPersonId) || null}
                onChange={onFieldChangeSelect}
                isSearchable
                name="SalesContactPersonId"
                placeholder="Select option"
              />
            </div>
            {/* MarketingExecutive ends */}

            {/* Agreement Type */}
            <div className="mb-2">
              <label className='red-asterisk'>{t('contractrenew_label_agreement_type')}</label>
              <Select
                value={masterDataList.AgreementType && masterDataList.AgreementType.find(option => option.value == contract.AgreementTypeId) || null}
                options={masterDataList.AgreementType}
                onChange={onFieldChangeSelect}
                isSearchable
                name="AgreementTypeId"
                placeholder="Select option"
              />
              <div className="small text-danger"> {t(errors["AgreementTypeId"])}</div>
            </div>
            {/* Agreement Type ends*/}

            {/* Add Purchase Order Line Item */}
            <div className='row'>
              <>
                {['1', '2', '4', '5'].includes(contract.AgreementTypeId.toString()) && (
                  <div className={getFieldColumnClass(contract.AgreementTypeId.toString())}>
                    <label className="mt-2 red-asterisk">{t('create_contract_label_amcvalue')}</label>
                    <input
                      name="AmcValue"
                      onChange={onUpdateField}
                      type="text"
                      value={contract.AmcValue ? contract.AmcValue : 0}
                      className={`form-control`}
                    />
                  </div>
                )}
              </>
              <>
                {['3', '4', '5'].includes(contract.AgreementTypeId.toString()) && (
                  <div className={getFieldColumnClass(contract.AgreementTypeId.toString())}>
                    <label className="mt-2 red-asterisk">{t('create_contract_label_fmsvalue')}</label>
                    <input name="FmsValue"
                      onChange={onUpdateField}
                      type="text"
                      value={contract.FmsValue ? contract.FmsValue : 0}
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
                    <input name='ContractValue' readOnly disabled={true} value={contract.ContractValue == null ? 0 : contract.ContractValue} type='number' className='form-control'></input>
                    <div className="small text-danger"> {t(errors["ContractValue"])}</div>
                  </div>
                </>
              )}
              {/* Contract Value ends*/}
            </div>
            {/* Add Purchase Order Line Item Ends*/}

            {/* Contract Start Date & End Date */}
            <div className="row mb-2">
              <div className='col-md-6'>
                <label className='red-asterisk'>{t('contractrenew_label_start_date')}</label>
                <input name='StartDate' value={contract.StartDate ? contract.StartDate.split('T')[0] : ""} onChange={onUpdateField} type='date' className='form-control'></input>
                <div className="small text-danger"> {t(errors["StartDate"])}</div>
              </div>

              <div className='col-md-6'>
                <label className='red-asterisk'>{t('contractrenew_label_end_date')}</label>
                <input name='EndDate' value={contract.EndDate ? contract.EndDate.split('T')[0] : ""} onChange={onUpdateField} type='date' className='form-control'></input>
                <div className="small text-danger"> {t(errors["EndDate"])}</div>
              </div>
            </div>
            {/* Contract Start Date & End Date Ends */}
          </>
          {/* Contract Details Ends*/}

          {/* Booking Details Start */}
          <>
            <div className="fw-bold mt-3" ref={divRefs.bookingDetails}>
              {t('contractrenew_sub_booking')}
            </div>
            {/* help text */}
            {/* help text ends */}

            {/* Booking Date & Booking Type */}
            <div className="row mb-2">
              <div className=" col-md-6">
                <label className='red-asterisk'>{t('contractrenew_label_booking_type')}</label>
                <Select
                  options={masterDataList.BookingType}
                  value={masterDataList.BookingType && masterDataList.BookingType.find(option => option.value == contract.BookingTypeId) || null}
                  onChange={onFieldChangeSelect}
                  isSearchable
                  name="BookingTypeId"
                  placeholder="Select option"
                />
                <div className="small text-danger"> {t(errors["BookingTypeId"])}</div>
              </div>
              <div className=" col-md-6">
                <label>{t('contractrenew_label_booking_date')}</label>
                <input name='BookingDate' value={contract.BookingDate?.split('T')[0]} onChange={onUpdateField} type='date' className='form-control'></input>
              </div>
            </div>
            {/* Booking Date & Booking Type Ends*/}

          </>
          {/* Booking Details Ends */}

          {/* Purchase Order Details */}
          <>
            <div className="fw-bold mt-2" ref={divRefs.poDetails}>
              {t('contractrenew_sub_podetail')}
            </div>
            {/* help text */}
            {/* help text ends */}

            {/*  Quotation Reference Number & Date Start*/}
            <div className='row mb-2 mt-1'>
              <div className='col-md-6'>
                <label>{t('contractrenew_label_quotation_reference_number')}</label>
                <input name='QuotationReferenceNumber' value={contract.QuotationReferenceNumber ? contract.QuotationReferenceNumber : ""} onChange={onUpdateField} type='text' className='form-control'></input>
              </div>
              <div className="col-md-6">
                <label >{t('contractrenew_label_quotation_reference_date')}</label>
                <input name='QuotationReferenceDate' value={contract.QuotationReferenceDate ? contract.QuotationReferenceDate.split('T')[0] : ""} onChange={onUpdateField} type='date' className='form-control'></input>
              </div>
            </div>
            {/*  Quotation Reference Number & Date Ends*/}

            {/* PO Number & Date Start */}
            <div className='row mb-2'>
              <div className='col-md-6'>
                <label >{t('contractrenew_label_purchase_order_number')}</label>
                <input name='PoNumber' value={contract.PoNumber ? contract.PoNumber : ""} onChange={onUpdateField} type='text' className='form-control'></input>
              </div>
              <div className='col-md-6 '>
                <label >{t('contractrenew_label_purchase_order_date')}</label>
                <input name='PoDate' value={contract.PoDate ? contract.PoDate.split('T')[0] : ""} onChange={onUpdateField} type='date' className='form-control'></input>
              </div>
            </div>
            {/* PO Number & Date End */}

            {/* Is MultiSite */}
            <div className=" mb-2 form-check form-switch">
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                {t('contractrenew_label_multi_site_contract')}
                <input
                  className="form-check-input switch-input-lg"
                  type="checkbox"
                  name="IsMultiSite"
                  id="flexSwitchCheckDefault"
                  checked={contract.IsMultiSite.valueOf()}
                  value={contract.IsMultiSite.toString()}
                  onChange={onUpdateField}
                />
              </label>
              <div className="form-text">
                {t('contractrenew_ismultisite_help_text')}
              </div>
            </div>
            {/* Is MultiSite End */}

            {/* Site Count */}
            {contract.IsMultiSite && (
              <div className='row mb-2'>
                <div className="col-md-6">
                  <label>{t('contractrenew_label_is_site_count')}</label>
                  <input name='SiteCount' value={contract.SiteCount ? contract.SiteCount : ""} onChange={onUpdateField} type='number' className='form-control'></input>
                </div>
              </div>
            )}
            {/* Site Count Ends*/}

            {/* Is PAV Needed(Is Pre Amc Needed) */}
            <div className=" mb-2 form-check form-switch">
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                {t('contractrenew_label_is_pav_needed_contract')}
                <input
                  className="form-check-input switch-input-lg"
                  type="checkbox"
                  name="IsPAVNeeded"
                  id="flexSwitchCheckDefault"
                  checked={contract.IsPAVNeeded.valueOf()}
                  value={contract.IsPAVNeeded.toString()}
                  onChange={onUpdateField}
                />
              </label>
              <div className="form-text">
                {t('contractrenew_is_pav_needed_help_text')}
              </div>
            </div>
            {/* Is PAV Needed(Is Pre Amc Needed) End */}

            {/* Is Preformance Guarentee*/}
            <div className=" mb-2 form-check form-switch">
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                {t('contractrenew_label_is_performance_guarentee')}
                <input
                  className="form-check-input switch-input-lg"
                  type="checkbox"
                  name="IsPerformanceGuaranteeRequired"
                  id="flexSwitchCheckDefault"
                  checked={contract.IsPerformanceGuaranteeRequired.valueOf()}
                  value={contract.IsPerformanceGuaranteeRequired.toString()}
                  onChange={onUpdateField}
                />
              </label>
              <div className="form-text">
                {t('contractrenew_is_performance_guarentee_help_text')}
              </div>
            </div>
            {/* Is Preformance Guarentee End */}

            {/* Performance Guarentee Amount */}
            {contract.IsPerformanceGuaranteeRequired && (
              <div className='row mb-2'>
                <div className="col-md-6">
                  <label>{t('contractrenew_label_performance_guarentee_amount')}</label>
                  <input name='PerformanceGuaranteeAmount' value={contract.PerformanceGuaranteeAmount ? contract.PerformanceGuaranteeAmount : ""} onChange={onUpdateField} type='text' maxLength={17} className='form-control'></input>
                  <div className='small text-danger'> {t(errors['PerformanceGuaranteeAmount'])}</div>
                </div>
              </div>
            )}
            {/* Performance Guarentee Amount Ends*/}
          </>
          {/* Purchase Order Details Ends*/}

          {/* Payment Details Starts*/}
          <>
            <div className="fw-bold mt-3" ref={divRefs.paymentDetails}>
              {t('contractrenew_sub_payment')}

            </div>
            {/* help text */}
            {/* help text ends */}

            {/* Is SEZ */}
            <div className=" mb-2 form-check form-switch mt-1">
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                {t('contractrenew_label_is_sez')}
                <input
                  className="form-check-input switch-input-lg"
                  type="checkbox"
                  name="IsSez"
                  id="flexSwitchCheckDefault"
                  checked={contract.IsSez.valueOf()}
                  value={contract.IsSez.toString()}
                  onChange={onUpdateField}
                />
              </label>
              <div className="form-text">
                {t('contractrenew_is_sez_help_text')}
              </div>
            </div>
            {/* Is SEZ Ends*/}

            <div className="row mb-2">
              {/* Payment Type */}
              <div className="col-md-6">
                <label >{t('contractrenew_label_payment_type')}</label>
                <Select
                  options={masterDataList.PaymentType}
                  value={masterDataList.PaymentType && masterDataList.PaymentType.find(option => option.value == paymentType) || null}
                  onChange={onFieldChangeSelect}
                  isSearchable
                  name="PaymentType"
                  placeholder="Select option"
                />
              </div>
              {/* Payment Type Ends*/}
              {/* Credit Period */}
              <div className="mb-2 col-md-6">
                <label>{t('contractrenew_label_creadit_period')}</label>
                <Select
                  value={masterDataList.CreditPeriod && masterDataList.CreditPeriod.find(option => option.value == contract.CreditPeriod) || null}
                  options={masterDataList.CreditPeriod}
                  onChange={onFieldChangeSelect}
                  isSearchable
                  name="CreditPeriod"
                  placeholder={t('contractrenew_placeholder')}
                />
              </div>
              {/* Credit Period Ends*/}
            </div>
          </>
          {/* Payment Details Ends */}

          {/* Service Details Star*/}
          <>
            <div className="fw-bold mt-3" ref={divRefs.serviceDetails}>
              {t('contractrenew_sub_service')}
            </div>
            {/* help text */}
            <div className="small mb-2">
              <ExpandableSection
                initialContent="Knowing the customer's working days and service mode is critical for tailoring maintenance services to their specific needs, optimizing scheduling, and ensuring that the"
                additionalContent="Knowing the customer's working days and service mode is critical for tailoring maintenance services to their specific needs, optimizing scheduling, and ensuring that the contract terms and costs are aligned with the customer's operational requirements"
              />
            </div>
            {/* help text ends */}

            <div className='row mb-2'>
              {/* Service Mode */}
              <div className="col-md-6">
                <label >{t('contractrenew_label_service_mode')}</label>
                <Select
                  value={masterDataList.ServiceMode && masterDataList.ServiceMode.find(option => option.value == contract.ServiceModeId) || null}
                  options={masterDataList.ServiceMode}
                  onChange={onFieldChangeSelect}
                  isSearchable
                  name="ServiceModeId"
                  placeholder="Select option"
                />
              </div>
              {/* Service Mode Ends*/}
              {/* Service Window */}
              <div className="col-md-6">
                <label >{t('contractrenew_label_service_window')}</label>
                <Select
                  options={masterDataList.ServiceWindow}
                  value={masterDataList.ServiceWindow && masterDataList.ServiceWindow.find(option => option.value == contract.ServiceWindowId) || null}
                  onChange={onFieldChangeSelect}
                  isSearchable
                  name="ServiceWindowId"
                  placeholder="Select option"
                />
              </div>
              {/* Service Window Ends*/}
            </div>


            {/* Is Preventive Maintenance Needed*/}
            < div className=" mb-2 form-check form-switch">
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                {t('contractrenew_label_is_preventive_maintenance_needed')}
                <input
                  className="form-check-input switch-input-lg"
                  type="checkbox"
                  name="IsPmRequired"
                  id="flexSwitchCheckDefault"
                  checked={contract.IsPmRequired.valueOf()}
                  value={contract.IsPmRequired.toString()}
                  onChange={onUpdateField}
                />
              </label>
              <div className="form-text">
                {t('contractrenew_is_preventive_maintenance_needed_help_text')}
              </div>
            </div>
            {/* Is Preventive Maintenance Needed End */}

            {/* PM Frequency */}
            {contract.IsPmRequired && (
              <div className="row mb-2">
                <div className='col-md-6'>
                  <label >{t('contractrenew_label_preventive_maintenance_frequency')}</label>
                  <Select
                    options={masterDataList.PreventiveMaintenanceFrequency}
                    value={masterDataList.PreventiveMaintenanceFrequency && masterDataList.PreventiveMaintenanceFrequency.find(option => option.value == contract.PmFrequencyId) || null}
                    onChange={onFieldChangeSelect}
                    isSearchable
                    name="PmFrequencyId"
                    placeholder="Select option"
                  />
                </div>
              </div>
            )}
            {/* PM Frequency Ends*/}

            {/* Is Back To Back Allowed*/}
            <div className=" mb-2 form-check form-switch">
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                {t('contractrenew_label_is_back_to_back_allowed')}
                <input
                  className="form-check-input switch-input-lg"
                  type="checkbox"
                  name="IsBackToBackAllowed"
                  id="flexSwitchCheckDefault"
                  checked={contract.IsBackToBackAllowed.valueOf()}
                  value={contract.IsBackToBackAllowed.toString()}
                  onChange={onUpdateField}
                />
              </label>
              <div className="form-text">
                {t('contractrenew_is_back_to_back_allowed_help_text')}
              </div>
            </div>
            {/* Is OutSourcing Allowed End */}

            {/* Back To Back Scope */}
            {contract.IsBackToBackAllowed && (
              <div className="row mb-2">
                <div className='col-md-6'>
                  <label >{t('contractrenew_label_is_back_to_back_scope')}</label>
                  <Select
                    value={masterDataList.BackToBackScope && masterDataList.BackToBackScope.find(option => option.value == contract.BackToBackScopeId) || null}
                    options={masterDataList.BackToBackScope}
                    onChange={onFieldChangeSelect}
                    isSearchable
                    name="BackToBackScopeId"
                    placeholder="Select option"
                  />
                </div>
              </div>
            )}

            {/* Back To Back Scope Ends*/}
          </>
          {/* Service Details Ends*/}

          {/* SLA Details */}
          <>
            <div className="fw-bold mt-3" ref={divRefs.slaDetails}>
              {t('contractrenew_sub_sla')}
            </div>
            {/* help text */}
            <div className="small mb-2">
              <ExpandableSection
                initialContent="Service Level Agreements, often referred to as SLAs, are formal agreements that outline the specific expectations and commitments between our organization and the customer."
              />
            </div>
            {/* help text ends */}

            {/* Is StandBy Required*/}
            <div className=" mb-2 form-check form-switch">
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                {t('contractrenew_label_is_standby_required')}
                <input
                  className="form-check-input switch-input-lg"
                  type="checkbox"
                  name="IsStandByRequired"
                  id="flexSwitchCheckDefault"
                  checked={(contract.IsStandByRequired?.valueOf() || contract.IsStandByFullUnitRequired.valueOf() || contract.IsStandByImprestStockRequired.valueOf())}
                  value={contract.IsStandByRequired?.toString()}
                  onChange={onUpdateField}
                />
              </label>
              <div className="form-text">
                {t('contractrenew_is_standby_required_help_text')}
              </div>
            </div>
            {/* Is Is StandBy Required Ends */}

            {(contract.IsStandByRequired || contract.IsStandByFullUnitRequired || contract.IsStandByImprestStockRequired) && (
              <>
                {/* Is StandBy Full-Unit Required*/}
                <div className=" mb-2 form-check form-switch">
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                    {t('contractrenew_label_is_standby_full_unit_required')}
                    <input
                      className="form-check-input switch-input-lg"
                      type="checkbox"
                      name="IsStandByFullUnitRequired"
                      id="flexSwitchCheckDefault"
                      checked={contract.IsStandByFullUnitRequired.valueOf()}
                      value={contract.IsStandByFullUnitRequired.toString()}
                      onChange={onUpdateField}
                    />
                  </label>
                  <div className="form-text">
                    {t('contractrenew_label_is_standby_full_unit_required_help_text')}
                  </div>
                </div>
                {/* Is Is StandBy Full-Unit Required Ends*/}

                {/* Is Standby Impress Stock Required*/}
                <div className=" mb-2 form-check form-switch">
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                    {t('contractrenew_label_is_standby_impress_stock_required')}
                    <input
                      className="form-check-input switch-input-lg"
                      type="checkbox"
                      name="IsStandByImprestStockRequired"
                      id="flexSwitchCheckDefault"
                      checked={contract.IsStandByImprestStockRequired.valueOf()}
                      value={contract.IsStandByImprestStockRequired.toString()}
                      onChange={onUpdateField}
                    />
                  </label>
                  <div className="form-text">
                    {t('contractrenew_label_is_standby_impress_stock_required_help_text')}
                  </div>
                </div>
                {/* Is Standby Impress Stock Required Ends */}
              </>
            )}
          </>
          {/* SLA Details Ends*/}

          {/* Documents Needed For Invoice Submission */}
          <>
            <div className="fw-bold mt-3" ref={divRefs.dnfInvoiceSubmission}>
              {t('contractrenew_sub_documents')}
            </div>
            {/* help text */}
            <div className="small mb-2">
              <ExpandableSection
                initialContent="Submitting your invoice is a crucial step in our payment process. To ensure a smooth and efficient transaction, please make sure to provide the following documents are,"
                additionalContent="Submitting your invoice is a crucial step in our payment process. To ensure a smooth and efficient transaction, please make sure to provide the following documents are submitted along with the contract invoice."
              />
            </div>
            {/* help text ends */}
            {InvoicePrerequisite.map((InvoicePrerequisite) => (
              <div key={InvoicePrerequisite.Id}>
                <div className="mt-2">
                  <input
                    onChange={contractInvoicePrerequisiteUpdate}
                    type="checkbox"
                    checked={
                      (idSet.has(InvoicePrerequisite.Id) == true &&
                        ContractInvoicePrerequisite.find(item => item.InvoicePrerequisiteId == InvoicePrerequisite.Id)?.IsActive == true) ? true : false
                    }
                    name={InvoicePrerequisite.DocumentName}
                    value={InvoicePrerequisite.Id}
                    className={`form-check-input mt-1`}
                  />
                  <label className="form-check-label ms-2">{InvoicePrerequisite.DocumentName}</label>
                </div>
              </div>
            ))}
            <button type="button"
              onClick={() => onSubmit(contract)}
              className="sticky-bottom btn app-primary-bg-color text-white mt-3 mb-1 w-100">
              {t('contractrenew_button_renew_contract')}
            </button>
          </>
          {/* Documents Needed For Invoice Submission Ends*/}
        </div>
        {/* right section end */}
        {/* Edit contract form ends here */}

        {/* Information Modal */}
        {displayInformationModal ? <InformationModal /> : ''}
        {/* Information Modal Ends*/}
      </div >
    </ContainerPage>
  );
}
