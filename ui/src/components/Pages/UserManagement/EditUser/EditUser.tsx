import { store } from '../../../../state/store';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import { editUser, getUserCategoryFilteredTenantOfficeName, getUserTenantOfficeName, getUserDetails, getUserRoles, getUsersRolesList, getUserBusinessUnits, editUserPendingApproval } from '../../../../services/users';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import {
  initializeUser,
  EditUserState,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
  loadUsersRoles,
  userCategorySelect,
  loadUserDesignation,
  loadReportingManagers,
  loadDivisions,
  loadTenantOffices,
  loadMasterData,
  userRoleAssigned,
  userRoleRevoked,
  loadAppkeyValues,
  setUser,
  setUserRole,
  loadCountries,
  loadStates,
  loadCities,
  loadCustomers,
  loadCustomerSites,
  loadContractNumbers,
} from './EditUser.slice';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { updateValidationErrors } from '../../../App/App.slice';
import * as yup from 'yup';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatBytes, formatDateTime, formatSelectInput, formatSelectInputWithCode } from '../../../../helpers/formats';
import { getDesignations } from '../../../../services/designation';
import { getManagersList, getTenantOfficeName } from '../../../../services/tenantOfficeInfo';
import { getDivisionNames } from '../../../../services/division';
import { getValuesInMasterDataByTable } from '../../../../services/masterData';
import { checkForPermission } from '../../../../helpers/permissions';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { getAppKeyValues } from '../../../../services/appsettings';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { useHistory, useParams } from 'react-router-dom';
import { getFilteredStatesByCountry } from '../../../../services/state';
import { getCountries } from '../../../../services/country';
import { getFilteredCitiesByState } from '../../../../services/city';
import { getPendingUserBusinessUnits } from '../../../../services/approval';
import { CustomerList, CustomerSites } from '../../../../types/customer';
import { getContractCustomerSites, getCustomersList } from '../../../../services/customer';
import { getFilteredContractsByCustomer } from '../../../../services/serviceRequest';


export function EditUser() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    onLoad();
  }, []);

  const { Id } = useParams<{ Id: string }>();
  const { PendingUserId } = useParams<{ PendingUserId: string }>();
  const history = useHistory();
  const { errors, roles, user, updatedRoles, ContractNumbers, Customer, CustomerSiteNames, Cities, Countries, States, entitiesList, displayInformationModal, TenantOffices, masterDataList } =
    useStoreWithInitializer(({ useredit }) => useredit, GetMasterDataItems);
  const [selectDivisionNames, setDivisionNames] = useState<any>(null);
  const [selectReportingManagersList, setReportingManagersList] = useState<any>(null);
  const [CustomerList, setCustomerList] = useState<CustomerList[]>([]);
  const [SiteList, setSiteList] = useState<CustomerSites[]>([]);
  const [engCategory, setEngCategory] = useState('')

  useEffect(() => {
    getEngineerMasterDataItems();
  }, [user.EngineerCountryId]);

  useEffect(() => {
    setDivisionNames(formatSelectInput(entitiesList.Divison, 'Name', 'Id'));
    setReportingManagersList(formatSelectInput(entitiesList.Managers, 'FullName', 'Id'));
  }, [entitiesList.Divison]);

  const appValues = (store.getState().useredit?.appvalues?.AppKey === "SEDesignationCodes") ? (store.getState().useredit.appvalues.AppValue.split(",")) : [];
  const isServiceEngineer = entitiesList.Designation.find(designation => designation.value === user.DesignationId)?.code &&
    appValues.includes(entitiesList.Designation.find(designation => designation.value === user.DesignationId)?.code || '')

  const [selectBusinessUnits, setSelectBusinessUnits] = useState<any>([]);
  const [prevBusinessUnits, setPrevBusinessUnits] = useState<any>([]);

  const onSelectBusinessUnit = (selectedOption: any) => {
    setSelectBusinessUnits(selectedOption);

    const BusinessUnitId = selectedOption.map((selectBusinessUnit) => selectBusinessUnit.value).join(",");
    store.dispatch(updateField({ name: 'BusinessUnits', value: BusinessUnitId }));

    const removedOptions = prevBusinessUnits.filter((unit) => !selectedOption.some((opt) => opt.value === unit.value));
    if (removedOptions.length > 0) {
      const BusinessUnitsRevokedId = removedOptions.map(unit => unit.value).join(",");
      store.dispatch(updateField({ name: 'BusinessUnitsRevoked', value: BusinessUnitsRevokedId }));
    } else {
      store.dispatch(updateField({ name: 'BusinessUnitsRevoked', value: '' }));
    }
  };

  const validationSchema = yup.object().shape({
    FullName: yup.string().required('validation_error_edit_user_fullname_required'),
    Email: yup.string().required('validation_error_edit_user_email_required'),
    Phone: yup.string().required('validation_error_edit_user_phone_required'),
    UserRoles: yup.string().required('validation_error_edit_user_role_required'),
    GenderId: yup.number().required('validation_error_edit_user_gender_required').min(1, ('validation_error_edit_user_gender_required')),
    UserCategoryId: yup.string().required('validation_error_edit_user_category_required'),
    DepartmentId: yup.string().required('validation_error_edit_user_department_required'),
    UserGradeId:yup.string().required('validation_error_edit_user_usergrade_required'),
    DivisionId: yup.number().required('validation_error_edit_user_division_required').min(1, ('validation_error_edit_user_division_required')),
    ReportingManagerId: yup.number().required('validation_error_edit_user_reporting_manager_required').min(1, ('validation_error_edit_user_reporting_manager_required')),
    DesignationId: yup.number().required('validation_error_edit_user_designation_required').min(1, ('validation_error_edit_user_designation_required')),
    EngagementTypeId: yup.string().required('validation_error_edit_user_engagement_type_required'),
    TenantOfficeId: yup.number().required('validation_error_edit_user_tenant_office_required').min(1, ('validation_error_edit_user_tenant_office_required')),
    EngineerCategory: yup.string().when('DesignationId', (DesignationId, schema) =>
      isServiceEngineer == true
        ? schema.required('validation_error_edit_user_engineercategory_required')
        : schema.nullable()
    ),
    EngineerLevel: yup.string().when('DesignationId', (DesignationId, schema) =>
      isServiceEngineer == true
        ? schema.required('validation_error_edit_user_engineerlevel_required')
        : schema.nullable()
    ),
    EngineerType: yup.string().when('DesignationId', (DesignationId, schema) =>
      isServiceEngineer == true
        ? schema.required('validation_error_edit_user_engineertype_required')
        : schema.nullable()
    ),
    BusinessUnits: yup.string().required('validation_error_edit_user_business_units'),
    DocumentFile: yup.mixed<FileList>()
      .nullable()
      .when('DocumentUrl', (DocumentUrl, schema) => {
        if (!user.DocumentUrl) {
          return schema
            .required(t('validation_error_edit_user_create_file_required') ?? '')
            .test('fileFormat', t('validation_error_edit_user_create_file_type_mismatch') ?? '', (value: any) => {
              return value && process.env.REACT_APP_USER_DOCUMENT_TYPES?.split(",").includes(value.type);
            })
            .test('fileSize', t('validation_error_edit_user_create_file_maxsize') ?? '', (value: any) => {
              return value && value.size <= parseInt(process.env.REACT_APP_USER_DOCUMENT_MAX_FILESIZE!, 10);
            });
        }
        return schema;
      }),
  });

  async function onLoad() {
    store.dispatch(initializeUser());
    store.dispatch(updateValidationErrors({}));
    try {
      if (Id) {
        const result = await getUserDetails(Number(Id))
        store.dispatch(setUser(result.UserDetails[0]));
        const data = await getUserRoles(Number(Id))
        store.dispatch(setUserRole(data.SelectedUserRoles[0].UserRoles));

        const businessunits = await getUserBusinessUnits(Number(Id));
        const transformedBusinessUnits = businessunits.SelectedBusinessUnits.map(unit => ({ value: unit.BusinessUnitId, label: unit.BusinessUnit }));
        setSelectBusinessUnits(transformedBusinessUnits)
        setPrevBusinessUnits(transformedBusinessUnits)
        const BusinessUnitId = [...transformedBusinessUnits.map((selectBusinessUnits) => (selectBusinessUnits.value))].join(",")
        store.dispatch(updateField({ name: 'BusinessUnits', value: BusinessUnitId }))

        const roles = await getUsersRolesList();
        store.dispatch(loadUsersRoles(roles));

        const Customers = await getCustomersList();
        const customers = await formatSelectInput(Customers.CustomersList, "Name", "Id")
        store.dispatch(loadCustomers({ Select: customers }));
      } else {
        const tableName = "User"
        // var { ApprovalRequestDetails } = await getClickedPendingDetails(PendingUserId, tableName);
        // var parsedUserDetails: UserEdit = JSON.parse(ApprovalRequestDetails.Content)
        // parsedUserDetails && store.dispatch(setUser(parsedUserDetails))

        const businessunits = await getPendingUserBusinessUnits(Number(PendingUserId));
        const transformedBusinessUnits = businessunits.SelectedBusinessUnits.map(unit => ({ value: unit.BusinessUnitId, label: unit.BusinessUnit }));
        setSelectBusinessUnits(transformedBusinessUnits)
        setPrevBusinessUnits(transformedBusinessUnits)
        const BusinessUnitId = [...transformedBusinessUnits.map((selectBusinessUnits) => (selectBusinessUnits.value))].join(",")
        store.dispatch(updateField({ name: 'BusinessUnits', value: BusinessUnitId }))
      }
    } catch (error) {
      return error;
    }
  }

  useEffect(() => {
    if (user.CustomerInfoId != null) {
      getFilteredContracts()
    }
  }, [user.CustomerInfoId])

  const getFilteredContracts = async () => {
    const { Contracts } = await getFilteredContractsByCustomer(user.CustomerInfoId);
    const FormatedContracts = await formatSelectInput(Contracts, "ContractNumber", "Id")
    store.dispatch(loadContractNumbers({ SelectDetails: FormatedContracts }));
  }

  useEffect(() => {
    if (user.ContractId != null) {
      fetchData()
    }
  }, [user.ContractId]);

  const fetchData = async () => {
    try {
      const { ContractCustomerSites } = await getContractCustomerSites(user.ContractId);
      setSiteList(ContractCustomerSites)
      const SiteNames = await formatSelectInputWithCode(ContractCustomerSites, "SiteName", "Id", "Address")
      store.dispatch(loadCustomerSites({ SelectDetails: SiteNames }));
    } catch (error) {
      console.error(error);
    }
  };



  async function onSubmit() {
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(store.getState().useredit.user, { abortEarly: false });
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
    if (window.location.pathname == `/config/users/pendingupdate/${PendingUserId}`) {
      result = await editUserPendingApproval(user, PendingUserId);
    } else {
      result = await editUser(user);
    }
    store.dispatch(stopSubmitting());
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: async (e) => {
        const formattedErrors = convertBackEndErrorsToValidationErrors(e);
        store.dispatch(updateErrors(formattedErrors));
      },
    });
    store.dispatch(stopPreloader());
  }

  function isRoleAlreadyAssigned(roleId: number) {
    const userRoles = store.getState().useredit.user.UserRoles;
    if (typeof userRoles === 'undefined') {
      return false;
    }
    return userRoles.split(',').includes(roleId.toString());
  }

  async function GetMasterDataItems() {
    store.dispatch(initializeUser());
    try {
      const roles = await getUsersRolesList();
      store.dispatch(loadUsersRoles(roles));

      const { Designations } = await getDesignations();
      const designations = await formatSelectInputWithCode(Designations, "Name", "Id", "Code")
      store.dispatch(loadUserDesignation({ Select: designations }));

      const TenantLocations = await getUserTenantOfficeName();
      const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
      store.dispatch(loadTenantOffices({ Select: TenantLocation }));

      const Managers = await getManagersList();
      store.dispatch(loadReportingManagers(Managers));

      const Divisions = await getDivisionNames();
      store.dispatch(loadDivisions(Divisions));

      const AppSettingsKeyValues = await getAppKeyValues('SEDesignationCodes');
      store.dispatch(loadAppkeyValues(AppSettingsKeyValues));

      // MasterData tables
      var { MasterData } = await getValuesInMasterDataByTable('UserCategory');
      const usercategory = await formatSelectInput(MasterData, 'Name', 'Id');
      setUserCategory(formatSelectInputWithCode(MasterData, "Name", "Id", "Code"))
      const filteredUsercategory = usercategory.sort((item1, item2) => item1.value - item2.value)
      store.dispatch(loadMasterData({ name: "UserCategory", value: { Select: filteredUsercategory } }));

      var { MasterData } = await getValuesInMasterDataByTable('Gender');
      const gender = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadMasterData({ name: 'Gender', value: { Select: gender } }));

      var { MasterData } = await getValuesInMasterDataByTable('EngagementType');
      const engagementType = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadMasterData({ name: 'EngagementType', value: { Select: engagementType } }));

      var { MasterData } = await getValuesInMasterDataByTable('Department');
      const department = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadMasterData({ name: 'Department', value: { Select: department } }));

      var { MasterData } = await getValuesInMasterDataByTable("EngineerLevel")
      const engineerLevel = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadMasterData({ name: "EngineerLevel", value: { Select: engineerLevel } }));

      var { MasterData } = await getValuesInMasterDataByTable("EngineerCategory")
      const engineerCategory = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
      store.dispatch(loadMasterData({ name: "EngineerCategory", value: { Select: engineerCategory } }));

      var { MasterData } = await getValuesInMasterDataByTable("EngineerType")
      const engineerType = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadMasterData({ name: "EngineerType", value: { Select: engineerType } }));

      var { MasterData } = await getValuesInMasterDataByTable("BusinessUnit")
      const businessunit = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadMasterData({ name: "BusinessUnit", value: { Select: businessunit } }));

      var { MasterData } = await getValuesInMasterDataByTable("UserGrade")
      const grade = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadMasterData({ name: "Grade", value: { Select: grade } }));
    } catch (error) {
      console.error(error);
    }
  }

  function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
    const name = actionMeta.name;
    const value = selectedOption.value?selectedOption.value:null;
    store.dispatch(updateField({ name: name as keyof EditUserState['user'], value }));
  }

  function handleCheckboxClick(ev: any) {
    const { value, checked } = ev.target;
    if (checked === true) {
      store.dispatch(userRoleAssigned(value));
    } else {
      store.dispatch(userRoleRevoked(value));
    }
  }

  function onSelectChange(selectedOption: any, actionMeta: any) {
    const name = actionMeta.name;
    const value = selectedOption.value?selectedOption.value:null;
    if (name == "EngineerCategory") {
      setEngCategory(selectedOption.code)
    }
    store.dispatch(updateField({ name: name as keyof EditUserState['user'], value }));
  }

  function onUpdateField(ev: any) {
    var name = ev.target.name;
    var value = ev.target.value;
    if (name == 'IsConcurrentLoginAllowed') {
      value = ev.target.checked ? true : false;
    }
    store.dispatch(updateField({ name: name as keyof EditUserState['user'], value }));
  }

  const [userCategory, setUserCategory] = useState<any>(null)

  async function handleCheckbox(ev: any) {
    store.dispatch(updateField({ name: 'TenantOfficeId', value: 0 }))
    var name = ev.target.name;
    var value = ev.target.value;
    if (name == "UserCategoryId") {
      const data = userCategory.filter(item => item.value == value)
      const TenantLocations = await getUserCategoryFilteredTenantOfficeName(data[0].code);
      const TenantLocation = await formatSelectInputWithCode(TenantLocations.TenantOfficeName, "OfficeName", "Id", "code")
      store.dispatch(loadTenantOffices({ Select: TenantLocation }));
      store.dispatch(userCategorySelect({ name: name as keyof EditUserState['user']['UserCategoryId'], value }));
    }
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('edit_user_alert_success')}
      </SweetAlert>
    );
  }

  function reDirectRoute() {
    store.dispatch(toggleInformationModalStatus());
    history.push('/config/users');
  }

  async function getEngineerMasterDataItems() {
    const Countries = await getCountries();
    const SelectCountries = await formatSelectInput(Countries.Countries, "Name", "Id")
    store.dispatch(loadCountries({ Countries: SelectCountries }));
  }

  useEffect(() => {
    async function getStates() {
      if (user.EngineerCountryId != null) {
        const States = await getFilteredStatesByCountry(user.EngineerCountryId.toString());
        const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
        store.dispatch(loadStates({ States: FilteredStates }))
      }
    }
    getStates()
  }, [user.EngineerCountryId])

  useEffect(() => {
    async function getCities() {
      if (user.EngineerStateId != null) {
        const Cities = await getFilteredCitiesByState(user.EngineerStateId.toString());
        const FilteredCities = await formatSelectInput(Cities.Cities, "Name", "Id");
        store.dispatch(loadCities({ Cities: FilteredCities }));
      }
    }
    getCities()
  }, [user.EngineerStateId])

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_user', Link: '/config/users' },
    { Text: 'breadcrumbs_editusers', Link: '' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (user && userCategory) {
        const data1 = userCategory.filter(item => item.value == user.UserCategoryId);
        const TenantLocations = await getUserCategoryFilteredTenantOfficeName(data1[0].code);
        const TenantLocation = await formatSelectInputWithCode(TenantLocations.TenantOfficeName, "OfficeName", "Id", "code");
        store.dispatch(loadTenantOffices({ Select: TenantLocation }));
      }
    };
    fetchData();
  }, [user, userCategory]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileUploadElement = useRef<HTMLInputElement>(null);

  const onUploadImage = (ev: any) => {
    const file = ev.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
    var value = ev.target.files[0];
    store.dispatch(updateField({ name: 'DocumentFile', value }));
  };

  return (
    <ContainerPage>
      <BreadCrumb items={breadcrumbItems} />
      <div className='row m-0'>
        <div className='col-7 px-2 m-0 me-0'>
          {/* Edit user Form */}
          {checkForPermission('USER_MANAGE') &&
            <>
              <form>
                <ValidationErrorComp errors={errors} />
                {/* <Errors errors={errors} /> */}
                <div className='mb-3 mt-1'>
                  <label className='form-label red-asterisk m-0'>{t('edit_user_label_name_as_in_aadhaar')}</label>
                  <input
                    onChange={onUpdateField}
                    className={`form-control ${errors["FullName"] ? "is-invalid" : ""}`}
                    name='FullName'
                    value={user.FullName}
                    aria-describedby='emailHelp'
                  />
                  <div className="invalid-feedback">
                    {t(errors['FullName'])}
                  </div>
                </div>
                <div className='mb-3'>
                  <label className='form-label red-asterisk m-0'>{t('edit_user_label_email_address')}</label>
                  <input
                    onChange={onUpdateField}
                    type='email'
                    value={user.Email}
                    name='Email'
                    className={`form-control ${errors["Email"] ? "is-invalid" : ""}`}
                    aria-describedby='emailHelp'
                  />
                  <div className="invalid-feedback">
                    {t(errors['Email'])}
                  </div>
                </div>
                <div className='mb-3'>
                  <label className='form-label red-asterisk m-0'>{t('edit_user_label_mobile_number')}</label>
                  <input
                    onChange={onUpdateField}
                    className={`form-control ${errors["Phone"] ? "is-invalid" : ""}`}
                    value={user.Phone}
                    name='Phone'
                    aria-describedby='emailHelp'
                  />
                  <div id='emailHelp' className='form-text'>
                    {t('edit_user_mobile_number_rule')}
                  </div>
                  <div className="invalid-feedback">
                    {t(errors['Phone'])}
                  </div>
                </div>
                <div className='mb-3'>
                  <label className='red-asterisk'>{t('create_user_label_gender')}</label>
                  <Select
                    options={masterDataList.Gender}
                    onChange={onSelectChange}
                    value={
                      masterDataList.Gender && masterDataList.Gender.find((option) => option.value === user.GenderId)
                    }
                    isSearchable
                    isClearable
                    classNamePrefix='react-select'
                    name='GenderId'
                    placeholder='Select Gender'
                  />
                  <div className='small text-danger'> {errors['GenderId']}</div>
                </div>
                <div className='mb-3'>
                  <label className='red-asterisk'>{t('create_user_label_engagement_type')}</label>
                  <Select
                    options={masterDataList.EngagementType}
                    value={
                      (masterDataList.EngagementType &&
                        masterDataList.EngagementType.find((option) => option.value == user.EngagementTypeId)) ||
                      null
                    }
                    onChange={onSelectChange}
                    isSearchable
                    isClearable
                    name='EngagementTypeId'
                    placeholder='Select option'
                  />
                  <div className="small text-danger"> {t(errors['EngagementTypeId'])}</div>
                </div>
                <div className='mb-3'>
                  <label className='red-asterisk'>{t('create_user_label_dept')}</label>
                  <Select
                    options={masterDataList.Department}
                    value={
                      (masterDataList.Department &&
                        masterDataList.Department.find((option) => option.value == user.DepartmentId)) ||
                      null
                    }
                    onChange={onSelectChange}
                    isSearchable
                    isClearable
                    name='DepartmentId'
                    placeholder='Select option'
                  />
                  <div className='small text-danger'> {errors['DepartmentId']}</div>
                </div>
                <div className='mb-3'>
                  <label className='red-asterisk'>{t('create_user_label_division')}</label>
                  <Select
                    options={selectDivisionNames}
                    value={
                      (selectDivisionNames &&
                        selectDivisionNames.find((option) => option.value === user.DivisionId)) ||
                      null
                    }
                    onChange={onSelectChange}
                    isSearchable
                    isClearable
                    name='DivisionId'
                    placeholder='Select option'
                  />
                  <div className='small text-danger'> {errors['DivisionId']}</div>
                </div>
                {/* TODOS: Need separate sp for listing Reporting manager */}
                <div className='mb-3'>
                  <label className='red-asterisk'>{t('create_user_label_reporting_manager')}</label>
                  <Select
                    options={selectReportingManagersList}
                    onChange={onSelectChange}
                    value={
                      (selectReportingManagersList &&
                        selectReportingManagersList.find((option) => option.value === user.ReportingManagerId)) ||
                      null
                    }
                    isSearchable
                    isClearable
                    classNamePrefix='react-select'
                    name='ReportingManagerId'
                    placeholder='Select Reporting Manager'
                  />
                  <div className='small text-danger'> {errors['ReportingManagerId']}</div>
                </div>
                <div className='mb-3'>
                  <label className='red-asterisk'>{t('create_user_label_business_unit')}</label>
                  <Select
                    options={masterDataList.BusinessUnit}
                    onChange={onSelectBusinessUnit}
                    isSearchable
                    isClearable
                    isMulti={true}
                    value={selectBusinessUnits}
                    name="BusinessUnits"
                    placeholder={t('create_user_label_business_unit_placeholder')}
                  />
                  <div className="small text-danger"> {t(errors['BusinessUnits'])}</div>
                </div>
                <div className='mb-3'>
                  <label className='red-asterisk'>{t('create_user_label_designation')}</label>
                  <Select
                    options={entitiesList.Designation}
                    onChange={onSelectChange}
                    value={
                      entitiesList.Designation &&
                      entitiesList.Designation.find((option) => option.value === user.DesignationId || null)
                    }
                    isSearchable
                    isClearable
                    name='DesignationId'
                    placeholder='Select option'
                  />
                  <div className='small text-danger'> {errors['DesignationId']}</div>
                </div>
                <div className='mb-1 mt-1'>
                  <label className="red-asterisk">Upload Image</label>
                  <input
                    name='DocumentFile'
                    onChange={onUploadImage}
                    ref={fileUploadElement}
                    type='file'
                    className='form-control'
                  />
                  <div>
                    <small className="text-muted">
                      <div><small className="text-muted">{`${t('create_user_message_warning_size_type')}  ${formatBytes(parseInt(process.env.REACT_APP_USER_DOCUMENT_MAX_FILESIZE!))}`}</small></div>
                    </small>
                  </div>
                  <div className="small text-danger">{errors['DocumentFile']}</div>
                  {previewUrl ? (
                    <div className='mt-2'>
                      <img src={previewUrl} alt="Profile Preview" style={{ maxWidth: '100px' }} />
                    </div>
                  ) : (
                    user.DocumentUrl && (
                      <div className='mt-2'>
                        <img src={user.DocumentUrl} alt="Profile Preview" style={{ maxWidth: '100px' }} />
                      </div>
                    )
                  )}
                </div>
                {isServiceEngineer && (
                  <>
                    <div className='mb-3'>
                      <label className='red-asterisk'>{t('create_user_label_engineerlevel')}</label>
                      <Select
                        options={masterDataList.EngineerLevel}
                        value={masterDataList.EngineerLevel && masterDataList.EngineerLevel.find(option => option.value == user.EngineerLevel) || null}
                        onChange={onSelectChange}
                        isSearchable
                        isClearable
                        name="EngineerLevel"
                        placeholder={t("edit_user_placeholder_selectengineerlevel")}
                      />
                      <div className="small text-danger"> {t(errors['EngineerLevel'])}</div>
                    </div>
                    <div className='mb-3'>
                      <label className='red-asterisk'>{t('create_user_label_engineertype')}</label>
                      <Select
                        options={masterDataList.EngineerType}
                        value={masterDataList.EngineerType && masterDataList.EngineerType.find(option => option.value == user.EngineerType) || null}
                        onChange={onSelectChange}
                        isSearchable
                        isClearable
                        name="EngineerType"
                        placeholder={t("edit_user_placeholder_selectengineertype")}
                      />
                      <div className="small text-danger"> {t(errors['EngineerType'])}</div>
                    </div>
                    <div className='mb-3'>
                      <label className='red-asterisk'>{t('create_user_label_engineercategory')}</label>
                      <Select
                        options={masterDataList.EngineerCategory}
                        value={masterDataList.EngineerCategory && masterDataList.EngineerCategory.find(option => option.value == user.EngineerCategory) || null}
                        onChange={onSelectChange}
                        isSearchable
                        isClearable
                        name="EngineerCategory"
                        placeholder={t("edit_user_placeholder_selectengineercategory")}
                      />
                      <div className="small text-danger"> {t(errors['EngineerCategory'])}</div>
                    </div>
                    {user.EngineerCategory && engCategory == "ETP_RENG" && (
                      <div>
                        {/* customer name */}
                        <div className='mb-2'>
                          <label className='red-asterisk'>{t('create_contract_label_customer_name')}</label>
                          <Select
                            value={(Customer && Customer.find((option) => option.value == user.CustomerInfoId)) || null}
                            options={Customer}
                            onChange={onFieldChangeSelect}
                            isSearchable
                            isClearable
                            name='CustomerInfoId'
                            placeholder={t("edit_user_placeholder_customers")}
                          />
                          <div className='small text-danger'> {t(errors['CustomerInfoId'])}</div>
                          {CustomerList.length > 0 && (
                            <div className='text-muted mt-1'>
                              {CustomerList.filter((value) => value.Id == user.CustomerInfoId).length > 0
                                ? `Address : ${CustomerList.filter((value) => value.Id == user.CustomerInfoId)[0].BilledToAddress
                                }`
                                : ''}
                            </div>
                          )}
                        </div>
                        {/* customer name ends */}
                        <div>
                          <div className="pb-2">
                            <label className="mt-2 red-asterisk">{t('impreststock_create_label_contract_number')}</label>
                            <Select
                              options={ContractNumbers}
                              value={ContractNumbers && ContractNumbers.find(option => option.value == user.ContractId) || null}
                              onChange={onFieldChangeSelect}
                              isSearchable
                              isClearable
                              placeholder={t("edit_user_placeholder_contractnumbers")}
                              className={`${errors["ContractId"] ? " border border-danger rounded-2" : ""}`}
                              name="ContractId"
                            />
                            <div className="small text-danger"> {t(errors['ContractId'])}</div>
                          </div>
                          <div className="col-md-12">
                            <label className="mt-2 red-asterisk">{t('impreststock_create_label_contract_customer_site_name')}</label>
                            <Select
                              options={CustomerSiteNames}
                              value={CustomerSiteNames && CustomerSiteNames.find(option => option.value == user.CustomerSiteId) || null}
                              onChange={onFieldChangeSelect}
                              isSearchable
                              isClearable
                              placeholder={t("edit_user_placeholder_customersite")}
                              name="CustomerSiteId"
                              className={`${errors["CustomerSiteId"] ? " border border-danger rounded-2" : ""}`}
                            />
                            <div className="small text-danger"> {t(errors['CustomerSiteId'])}</div>

                          </div>
                          <div className="row">
                            <div className="col-md-12 mt-2">
                              <label className='red-asterisk'>{t('manpowerallocation_create_label_customer_agreed_amount')}</label>
                              <input name="CustomerAgreedAmount" onChange={onUpdateField} type="text" className="form-control" value={user.CustomerAgreedAmount ?? ""}></input>
                              <div className="small text-danger"> {t(errors['CustomerAgreedAmount'])}</div>
                            </div>
                          </div>
                          <div className="mb-1">
                            <label>{t('manpowerallocation_create_label_startdate')}</label>
                            <input type="date" name="StartDate" onChange={onUpdateField} value={user.StartDate ? user.StartDate.split('T')[0] : ""} className="form-control"></input>
                          </div>
                          <div className="mb-1">
                            <label>{t('manpowerallocation_create_label_enddate')}</label>
                            <input type="date" name="EndDate" onChange={onUpdateField} value={user.EndDate ? user.EndDate.split('T')[0] : ""} className="form-control"></input>
                          </div>
                          <div className="col-md-12 mt-2">
                            <label className='red-asterisk'>{t('manpowerallocation_create_label_budgeted_amount')}</label>
                            <input name="BudgetedAmount" value={user.BudgetedAmount ?? ""} onChange={onUpdateField} type="text" className="form-control" ></input>
                            <div className="small text-danger"> {t(errors['BudgetedAmount'])}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className=" mt-1">
                      <label className="form-label red-asterisk  mb-0">{t('create_user_label_engineercountryid')}</label>
                      <Select
                        options={Countries}
                        name="EngineerCountryId"
                        value={Countries && Countries.find(option => option.value == user.EngineerCountryId) || null}
                        onChange={onFieldChangeSelect}
                        isSearchable
                        isClearable
                        placeholder={t('create_user_select_country')}
                      />
                    </div>
                    <div className=" mt-2">
                      <label className="form-label red-asterisk  mb-0">{t('create_user_label_engineerstateid')}</label>
                      <Select
                        options={States}
                        name="EngineerStateId"
                        value={States && States.find(option => option.value == user.EngineerStateId) || null}
                        onChange={onFieldChangeSelect}
                        isClearable
                        isSearchable
                        placeholder={t('create_user_select_state')}
                      />
                    </div>
                    <div className=" mt-2">
                      <label className="form-label red-asterisk  mb-0">{t('create_user_label_engineercityid')}</label>
                      <Select
                        options={Cities}
                        name="EngineerCityId"
                        value={Cities && Cities.find(option => option.value == user.EngineerCityId) || null}
                        onChange={onFieldChangeSelect}
                        isClearable
                        isSearchable
                        placeholder={t('create_user_select_city')}
                      />
                    </div>
                    <div className='mb-3 pt-2'>
                      <label className='red-asterisk'>{t('create_user_label_engineerpincode')}</label>
                      <input onChange={onUpdateField} value={user.EngineerPincode ?? ""} type="text" className='form-control' name='EngineerPincode' />
                    </div>
                    <div className='mb-3'>
                      <label>{t('create_user_label_engineergeolocation')}</label>
                      <input onChange={onUpdateField} value={user.EngineerGeolocation ?? ""} type="text" className={`form-control  ${errors["EngineerGeolocation"] ? "is-invalid" : ""}`} name='EngineerGeolocation' />
                      <div className="invalid-feedback"> {t(errors['EngineerGeolocation'])}</div>
                    </div>
                    <div className='mb-3'>
                      <label >{t('create_user_label_engineerhomelocation')}</label>
                      <textarea onChange={onUpdateField} value={user.EngineerAddress ?? ""} rows={3} className="form-control" name='EngineerAddress' />
                    </div>
                  </>
                )}
                <div className='mt-3'>
                  <label className='red-asterisk mb-1'>{t('create_user_title_category_of_this_user')}</label>
                  <br />
                  {masterDataList.UserCategory.map((category) => {
                    const helperTextExist = `create_user_helper_text_${category.label}`;
                    return (
                      <div key={category.value}>
                        <input
                          className='form-check-input'
                          type='radio'
                          onChange={handleCheckbox}
                          value={category.value}
                          checked={user.UserCategoryId == category.value}
                          name='UserCategoryId'
                          data-testid={`create_user_input_checkbox_${category.value}`}
                        />
                        <label className='form-check-label ms-2'>
                          {category.label}
                          <br />
                          {/* Helper Text */}
                          <div className='form-text mt-0'>
                            {i18n.exists(helperTextExist) ? (
                              <span>{t(`create_user_helper_text_${category.label}`)}</span>
                            ) : (
                              ''
                            )}
                          </div>
                        </label>
                        &nbsp;
                      </div>
                    );
                  })}
                </div>
                <div className='mt-2 mb-1'>
                  <label className='red-asterisk'>{t('create_user_label_location')}</label>
                  <Select
                    options={TenantOffices}
                    onChange={onSelectChange}
                    value={
                      (TenantOffices && TenantOffices.find((option) => option.value == user.TenantOfficeId)) || null
                    }
                    isSearchable
                    isClearable
                    name='TenantOfficeId'
                    placeholder='Select option'
                  />
                  <div className='small text-danger'> {t(errors['TenantOfficeId'])}</div>
                </div>
                <div className="row mt-2">
                  <div className='mb-1'>
                    <div className=' mb-2 form-check form-switch'>
                      <input
                        className='form-check-input switch-input-lg'
                        type='checkbox'
                        name='IsConcurrentLoginAllowed'
                        id='flexSwitchCheckDefault'
                        checked={user.IsConcurrentLoginAllowed?.valueOf() ?? false}
                        value={user.IsConcurrentLoginAllowed?.toString() ?? ''}
                        onChange={onUpdateField}
                      />
                      <label className='form-check-label'>{t('edit_user_label_isconcurrentloginallowed')}</label>
                      <div className='form-text'>{t('edit_user_isconcurrentloginallowed_help_text')}</div>
                    </div>
                  </div>
                </div>
              </form>
            </>
          }
        </div>
        <div className='col-5 px-2'>
          <div className='mb-3'>
            <label className='red-asterisk'>{t('edit_user_grade_labal')}</label>
            <Select
              options={masterDataList.Grade}
              onChange={onSelectChange}
              value={
                masterDataList.Grade && masterDataList.Grade.find((option) => option.value === user.UserGradeId)
              }
              isSearchable
              isClearable
              classNamePrefix='react-select'
              name='UserGradeId'
              placeholder={t('edit_user_grade_labal')}
            />
            <div className='small text-danger'> {t(errors['UserGradeId'])}</div>
          </div>
          <div className="mt-2 ms-2" >
            <label className='red-asterisk mb-1'>{t('create_user_title_role_of_this_user')}</label>
            <br></br>
            <div className="text-danger small">
              {t(errors['UserRoles'])}
            </div>
            {roles.map(({ role }) => (
              <div className='mt-1' key={role.Id}>
                <input
                  onChange={handleCheckboxClick}
                  type='checkbox'
                  value={role.Id}
                  checked={isRoleAlreadyAssigned(role.Id)}
                  name={role.RoleName}
                  className={`form-check-input ${errors["UserRoles"] ? "is-invalid" : ""}`}
                />
                <label className='form-check-label ms-2'>{role.RoleName}</label>
              </div>
            ))}
          </div>
        </div>
        <button type='button' onClick={() => onSubmit()} className='btn app-primary-bg-color text-white mt-3 mb-2 w-100'>
          {t('edit_user_button_update')}
        </button>
        {/* Edit user Form Ends Here */}
        {displayInformationModal ? <InformationModal /> : ''}
      </div >
    </ContainerPage >
  );
}