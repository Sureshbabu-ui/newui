import React, { useEffect, useRef, useState } from 'react'
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { store } from '../../../../state/store';
import * as yup from 'yup';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { convertBackEndErrorsToValidationErrors, formatBytes, formatSelectInput, formatSelectInputWithCode } from '../../../../helpers/formats';
import { CreateUserState, initializeUser, loadAppkeyValues, loadCities, loadContractNumbers, loadCountries, loadCustomerSites, loadCustomers, loadDivisions, loadMasterData, loadReportingManagers, loadStates, loadTenantOffices, loadUserDesignation, loadUsersRoles, startSubmitting, stopSubmitting, toggleInformationModalStatus, updateErrors, updateField, userCategorySelect, userRoleSelected, userRoleUnSelected } from './CreateUser.slice';
import { UserForCreation } from '../../../../types/user';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { getUserCategoryFilteredTenantOfficeName, getUserTenantOfficeName, getUsersRolesList, userCreate } from '../../../../services/users';
import { getDesignations } from '../../../../services/designation';
import { getValuesInMasterDataByTable } from '../../../../services/masterData';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getManagersList } from '../../../../services/tenantOfficeInfo';
import { getDivisionNames } from '../../../../services/division';
import { getAppKeyValues } from '../../../../services/appsettings';
import { useStore } from '../../../../state/storeHooks';
import { checkForPermission } from '../../../../helpers/permissions';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { useHistory } from 'react-router-dom';
import { getFilteredStatesByCountry } from '../../../../services/state';
import { getFilteredCitiesByState } from '../../../../services/city';
import { getCountries } from '../../../../services/country';
import { setActiveTab } from '../UsersList/UserManagement.slice';
import { getContractCustomerSites, getCustomersList } from '../../../../services/customer';
import { CustomerList, CustomerSites } from '../../../../types/customer';
import { getFilteredContractsByCustomer } from '../../../../services/serviceRequest';

const CreateUser = () => {
    const { t, i18n } = useTranslation();
    const [selectDivisionNames, setDivisionNames] = useState<any>(null)
    const [selectReportingManagersList, setReportingManagersList] = useState<any>(null)
    const [userCategory, setUserCategory] = useState<any>(null)
    const [engCategory, setEngCategory] = useState('')
    const history = useHistory();
    const [CustomerList, setCustomerList] = useState<CustomerList[]>([]);
    const [SiteList, setSiteList] = useState<CustomerSites[]>([]);
    const [isApproved, setIsApproved] = useState(false)

    useEffect(() => {
        onLoad();
    }, []);

    const { errors, roles, user, entitiesList, Customer, CustomerSiteNames, ContractNumbers, masterDataList, Cities, Countries, States, displayInformationModal, TenantOffices } = useStore(
        ({ usercreate }) => usercreate)

    useEffect(() => {
        setDivisionNames(formatSelectInput(entitiesList.Divison, "Name", "Id"))
        setReportingManagersList(formatSelectInput(entitiesList.Managers, "FullName", "Id"));
    }, [entitiesList.Divison]);


    const appValues = (store.getState().usercreate?.appvalues?.AppKey === "SEDesignationCodes") ? (store.getState().usercreate.appvalues.AppValue.split(",")) : [];
    const isServiceEngineer = entitiesList.Designation.find(designation => designation.value === user.DesignationId)?.code &&
        appValues.includes(entitiesList.Designation.find(designation => designation.value === user.DesignationId)?.code || '')

    const validationSchema = yup.object().shape({
        FullName: yup.string().required('validation_error_create_user_fullname_required'),
        Email: yup.string().required('validation_error_create_user_email_required'),
        Phone: yup.string().required('validation_error_create_user_phone_required'),
        UserRoles: yup.string().required('validation_error_create_user_role_required'),
        GenderId: yup.number().required('validation_error_create_user_gender_required').min(1, ('validation_error_create_user_gender_required')),
        UserCategoryId: yup.string().required('validation_error_create_user_category_required'),
        DepartmentId: yup.string().required('validation_error_create_user_department_required'),
        UserGradeId:yup.string().required('validation_error_create_user_usergrade_required'),
        DivisionId: yup.number().required('validation_error_create_user_division_required').min(1, ('validation_error_create_user_division_required')),
        ReportingManagerId: yup.number().required('validation_error_create_user_reporting_manager_required').min(1, ('validation_error_create_user_reporting_manager_required')),
        DesignationId: yup.number().required('validation_error_create_user_designation_required').min(1, ('validation_error_create_user_designation_required')),
        EngagementTypeId: yup.string().required('validation_error_create_user_engagement_type_required'),
        EmployeeCode: yup.string().required('validation_error_create_user_userid_required').max(8, ('validation_error_create_user_employee_code_max_required')),
        TenantOfficeId: yup.number().required('validation_error_create_user_tenant_office_required').min(1, ('validation_error_create_user_tenant_office_required')),
        EngineerCategory: yup.string().when('DesignationId', (DesignationId, schema) =>
            isServiceEngineer == true
                ? schema.required('validation_error_edit_user_engineercategory_required')
                : schema.nullable()
        ),
        EngineerLevel: yup.string().when('DesignationId', (DesignationId, schema) =>
            isServiceEngineer == true
                ? schema.required('validation_error_edit_user_engineercategory_required')
                : schema.nullable()
        ),
        EngineerType: yup.string().when('DesignationId', (DesignationId, schema) =>
            isServiceEngineer == true
                ? schema.required('validation_error_edit_user_engineertype_required')
                : schema.nullable()
        ),
        DocumentFile: yup.mixed<FileList>().required(t('validation_error_create_user_create_file_required') ?? '')
            .test('fileFormat', t('validation_error_create_user_create_file_type_mismatch') ?? '', (value: any) => {
                return value && process.env.REACT_APP_USER_DOCUMENT_TYPES?.split(",").includes(value.type);

            })
            .test('fileSize', t('validation_error_create_user_create_file_maxsize') ?? '', (value: any) => {
                return value.size <= process.env.REACT_APP_USER_DOCUMENT_MAX_FILESIZE!
            })
        ,
        BusinessUnits: yup.string().required('validation_error_create_user_business_units'),
        EngineerCountryId: yup.string().when('DesignationId', (DesignationId, schema) =>
            isServiceEngineer == true
                ? schema.required('validation_error_create_users_serviceengineer_country_required')
                : schema.nullable()
        ),
        EngineerStateId: yup.string().when('DesignationId', (DesignationId, schema) =>
            isServiceEngineer == true
                ? schema.required('validation_error_create_users_serviceengineer_state_required')
                : schema.nullable()
        ),
        EngineerCityId: yup.string().when('DesignationId', (DesignationId, schema) =>
            isServiceEngineer == true
                ? schema.required('validation_error_create_users_serviceengineer_city_required')
                : schema.nullable()
        ),
        EngineerPincode: yup.string().when('DesignationId', (DesignationId, schema) =>
            isServiceEngineer == true
                ? schema.required('validation_error_create_users_serviceengineer_engpincode_required')
                : schema.nullable()
        )
    });

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : null;
        store.dispatch(updateField({ name: name as keyof CreateUserState['user'], value }));
    }

    async function onSubmit(user: UserForCreation) {
        store.dispatch(updateErrors({}));
        try {
            await validationSchema.validate(user, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader())
        store.dispatch(startSubmitting());
        const result = await userCreate(user);
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
        store.dispatch(stopPreloader())
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

    async function GetMasterDataItems() {
        store.dispatch(initializeUser());
        try {
            // Masters tables
            const { Designations } = await getDesignations();
            const designation = await formatSelectInputWithCode(Designations, "Name", "Id", "Code")
            store.dispatch(loadUserDesignation({ Select: designation }));

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
            var { MasterData } = await getValuesInMasterDataByTable("UserCategory")
            const usercategory = await formatSelectInput(MasterData, "Name", "Id")
            setUserCategory(formatSelectInputWithCode(MasterData, "Name", "Id", "Code"))
            const filteredUsercategory = usercategory.sort((item1, item2) => item1.value - item2.value)
            store.dispatch(loadMasterData({ name: "UserCategory", value: { Select: filteredUsercategory } }));

            var { MasterData } = await getValuesInMasterDataByTable("Gender")
            const gender = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "Gender", value: { Select: gender } }));

            const Countries = await getCountries();
            const SelectCountries = await formatSelectInput(Countries.Countries, "Name", "Id")
            store.dispatch(loadCountries({ Countries: SelectCountries }));

            var { MasterData } = await getValuesInMasterDataByTable("EngagementType")
            const engagementType = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "EngagementType", value: { Select: engagementType } }));

            var { MasterData } = await getValuesInMasterDataByTable("Department")
            const department = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "Department", value: { Select: department } }));

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

    async function onLoad() {
        store.dispatch(initializeUser());
        store.dispatch(updateField({ name: 'TenantOfficeId', value: 0 }))
        GetMasterDataItems()
        try {
            const TenantLocations = await getUserCategoryFilteredTenantOfficeName('UCT_CPTV');
            const TenantLocation = await formatSelectInputWithCode(TenantLocations.TenantOfficeName, "OfficeName", "Id", "code")
            store.dispatch(loadTenantOffices({ Select: TenantLocation }));
            const roles = await getUsersRolesList();
            store.dispatch(loadUsersRoles(roles));
            const Customers = await getCustomersList();
            const customers = await formatSelectInput(Customers.CustomersList, "Name", "Id")
            store.dispatch(loadCustomers({ Select: customers }));
        } catch (error) {
            console.error(error);
        }
    }

    function handleCheckboxClick(ev: any) {
        if (ev.target.checked) {
            store.dispatch(userRoleSelected(ev.target.value));
        } else {
            store.dispatch(userRoleUnSelected(ev.target.value));
        }
    }

    async function handleCheckbox(ev: any) {
        store.dispatch(updateField({ name: 'TenantOfficeId', value: 0 }))
        var name = ev.target.name;
        var value = ev.target.value;
        if (name == "UserCategoryId") {
            const data = userCategory.filter(item => item.value == value)
            const TenantLocations = await getUserCategoryFilteredTenantOfficeName(data[0].code);
            const TenantLocation = await formatSelectInputWithCode(TenantLocations.TenantOfficeName, "OfficeName", "Id", "code")
            store.dispatch(loadTenantOffices({ Select: TenantLocation }));
            store.dispatch(userCategorySelect({ name: name as keyof CreateUserState['user']['UserCategoryId'], value }));
        }
    }

    useEffect(() => {
        if (user.CustomerInfoId != 0) {
            getFilteredContracts()
        }
    }, [user.CustomerInfoId])

    const getFilteredContracts = async () => {
        const { Contracts } = await getFilteredContractsByCustomer(user.CustomerInfoId);
        const FormatedContracts = await formatSelectInput(Contracts, "ContractNumber", "Id")
        store.dispatch(loadContractNumbers({ SelectDetails: FormatedContracts }));
    }

    useEffect(() => {
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
        fetchData();
        store.dispatch(updateField({ name: 'CustomerSiteId', value: null }));
    }, [user.ContractId]);

    function onSelectChange(selectedOption: any, Name: any) {
        var value = selectedOption ? selectedOption.value : null
        var name = Name
        if (name == "EngineerCategory") {
            setEngCategory(selectedOption.code)
        }
        store.dispatch(updateField({ name: name as keyof CreateUserState['user'], value: selectedOption ? selectedOption.value : null }));
    }

    const [selectBusinessUnits, setSelectBusinessUnits] = useState<any>([])

    const onSelectBusinessUnit = (selectedOption: any) => {
        setSelectBusinessUnits(selectedOption)
        const BusinessUnitId = [...selectedOption.map((selectBusinessUnits) => (selectBusinessUnits.value))].join(",")
        store.dispatch(updateField({ name: 'BusinessUnits', value: BusinessUnitId }))
    }

    function onUpdateField(ev: any) {
        var name = ev.target.name;
        var value = ev.target.value;
        if (name == 'IsConcurrentLoginAllowed') {
            value = ev.target.checked ? true : false;
        }
        if (name == 'IsTemporaryUser') {
            value = ev.target.checked ? true : false;
        }
        store.dispatch(updateField({ name: name as keyof CreateUserState['user'], value }));
    }

    function InformationModal() {
        const { t, i18n } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={reDirectRoute}>
                {t('create_user_alert_success')}
            </SweetAlert>
        );
    }

    function reDirectRoute() {
        store.dispatch(toggleInformationModalStatus());
        history.push('/config/users');
        if (isApproved == false)
            store.dispatch(setActiveTab('nav-pending'))
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_user', Link: '/config/users' },
        { Text: 'breadcrumbs_newusers', Link: '' },
    ];

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
                <div className='col-7 px-2'>
                    <div className=' m-0 me-0'>
                        {/* Create user Form */}
                        {checkForPermission("USER_MANAGE") && <>
                            <form>
                                <ValidationErrorComp errors={errors} />
                                <div className="mb-3 mt-1">
                                    <label className='red-asterisk'>{t('create_user_label_name_as_in_aadhaar')}</label>
                                    <input
                                        onChange={onUpdateField}
                                        className={`form-control ${errors["FullName"] ? "is-invalid" : ""}`}
                                        name='FullName'
                                        aria-describedby="emailHelp"
                                    />
                                    <div className="invalid-feedback">
                                        {t(errors['FullName'])}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className='red-asterisk'>{t('create_user_label_gender')}</label>
                                    <Select
                                        options={masterDataList.Gender}
                                        value={masterDataList.Gender && masterDataList.Gender.find(option => option.value == user.GenderId) || null}
                                        onChange={onFieldChangeSelect}
                                        isSearchable
                                        isClearable
                                        classNamePrefix="react-select"
                                        name="GenderId"
                                        placeholder={t('validation_error_create_user_gender_required')}
                                    />
                                    <div className="small text-danger"> {t(errors['GenderId'])}</div>
                                </div>
                                <div className="row">
                                    <div className="mb-1">
                                        <label className='red-asterisk'>{t('create_user_label_employee_code')}</label>
                                        <input onChange={onUpdateField} type="text" className={`form-control  ${errors["EmployeeCode"] ? "is-invalid" : ""}`} name='EmployeeCode' />
                                        <div className="invalid-feedback"> {t(errors['EmployeeCode'])}</div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className='red-asterisk'>{t('create_user_label_email')}</label>
                                    <input onChange={onUpdateField} type="email" className={`form-control  ${errors["Email"] ? "is-invalid" : ""}`} name='Email' aria-describedby="emailHelp" />
                                    <div className="invalid-feedback">
                                        {t(errors['Email'])}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className='red-asterisk'>{t('create_user_label_mobile_number')}</label>
                                    <input onChange={onUpdateField} className={`form-control  ${errors["Phone"] ? "is-invalid" : ""}`} maxLength={10} name='Phone' aria-describedby="emailHelp" />
                                    <div id="emailHelp" className="form-text">{t('create_user_rule_mobile_number')}</div>
                                    <div className="invalid-feedback">
                                        {t(errors['Phone'])}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="red-asterisk">{t('create_user_label_engagement_type')}</label>
                                    <Select
                                        options={masterDataList.EngagementType}
                                        value={masterDataList.EngagementType && masterDataList.EngagementType.find(option => option.value == user.EngagementTypeId) || null}
                                        onChange={onFieldChangeSelect}
                                        isSearchable
                                        isClearable
                                        name="EngagementTypeId"
                                        placeholder={t('validation_error_create_user_engagement_type_required')}
                                    />
                                    <div className="small text-danger"> {t(errors['EngagementTypeId'])}</div>
                                </div>
                                <div className="row mt-2">
                                    <div className='mb-1'>
                                        <div className=' mb-2 form-check form-switch'>
                                            <input
                                                className='form-check-input switch-input-lg'
                                                type='checkbox'
                                                name='IsTemporaryUser'
                                                id='flexSwitchCheckDefault'
                                                checked={user.IsTemporaryUser.valueOf()}
                                                value={user.IsTemporaryUser.toString()}
                                                onChange={onUpdateField}
                                            />
                                            <label className='form-check-label'>{t('create_user_label_istemporaryuser_switch')}</label>
                                            <div className='form-text'>{t('create_user_label_istemporaryuser_switch_hlp_text')}</div>
                                        </div>
                                    </div>
                                </div>
                                {(user.IsTemporaryUser &&
                                    <div className="container pb-2">
                                        <div className="row">
                                            <label className='text-muted p-0 m-0'>{t('create_user_label_istemporaryuser_expirydate')}</label>
                                            <input id="startDate" name='UserExpiryDate' className="form-control" type="date" onChange={onUpdateField} />
                                        </div>
                                    </div>
                                )}
                                {/* Department */}
                                <div className="mb-3">
                                    <label className="red-asterisk">{t('create_user_label_dept')}</label>
                                    <Select
                                        options={masterDataList.Department}
                                        value={masterDataList.Department && masterDataList.Department.find(option => option.value == user.DepartmentId) || null}
                                        onChange={onFieldChangeSelect}
                                        isSearchable
                                        isClearable
                                        name="DepartmentId"
                                        placeholder={t('validation_error_create_user_department_required')}
                                    />
                                    <div className="small text-danger"> {t(errors['DepartmentId'])}</div>
                                </div>
                                <div className='mb-3'>
                                    <label className='red-asterisk'>{t('create_user_label_division')}</label>
                                    <Select
                                        options={selectDivisionNames}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "DivisionId")}
                                        isSearchable
                                        isClearable
                                        name="DivisionId"
                                        placeholder={t('validation_error_create_user_division_required')}
                                    />
                                    <div className="small text-danger"> {t(errors['DivisionId'])}</div>
                                </div>
                                <div className="mt-3">
                                    <label className="red-asterisk">{t('create_user_title_category_of_this_user')}</label><br />
                                    <div className="text-danger small"> {t(errors['UserCategoryId'])}</div>
                                    {masterDataList.UserCategory.map((category) => {
                                        const helperTextExist = `create_user_helper_text_${category.label}`;
                                        return (
                                            <div key={category.value} className="mt-1">
                                                <input
                                                    className={`form-check-input ${errors["UserCategoryId"] ? "is-invalid" : ""}`}
                                                    type="radio"
                                                    onChange={handleCheckbox}
                                                    value={category.value}
                                                    name="UserCategoryId"
                                                    data-testid={`create_user_input_checkbox_${category.label}`}
                                                    checked={user.UserCategoryId == category.value}
                                                />
                                                <label className="form-check-label ms-2">
                                                    {category.label}<br></br>
                                                    {/* Helper Text */}
                                                    <div className="form-text mt-0">{i18n.exists(helperTextExist) ? <span>{t(`create_user_helper_text_${category.label}`)}</span> : ""}</div>
                                                </label>&nbsp;
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="row mt-2">
                                    <div className='mb-1'>
                                        <label className='red-asterisk'>{t('create_user_label_location')}</label>
                                        <Select
                                            options={TenantOffices}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "TenantOfficeId")}
                                            value={TenantOffices && TenantOffices.find(option => option.value == user.TenantOfficeId) || null}
                                            isSearchable
                                            isClearable
                                            name="TenantOfficeId"
                                            placeholder={t("user_create_select_accel_location_placeholder")}
                                        />
                                        <div className="small text-danger"> {t(errors['TenantOfficeId'])}</div>
                                    </div>
                                </div>
                                {/* TODOS: Need separate sp for listing Reporting manager */}
                                <div className="mb-3">
                                    <label className='red-asterisk'>{t('create_user_label_reporting_manager')}</label>
                                    <Select
                                        options={selectReportingManagersList}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "ReportingManagerId")}
                                        isSearchable
                                        isClearable
                                        classNamePrefix="react-select"
                                        name="ReportingManagerId"
                                        placeholder={t('validation_error_create_user_reporting_manager_required')}
                                    />
                                    <div className="small text-danger"> {t(errors['ReportingManagerId'])}</div>
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
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "DesignationId")}
                                        isSearchable
                                        isClearable
                                        name="DesignationId"
                                        placeholder={t('validation_error_create_user_designation_required')}
                                    />
                                    <div className="small text-danger"> {t(errors['DesignationId'])}</div>
                                </div>
                                <div className='mb-1 mt-1'>
                                    <label className="red-asterisk">{t('create_user_label_upload_image')}</label>
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
                                    {previewUrl && (
                                        <div className='mt-2'>
                                            <img src={previewUrl} alt="Profile Preview" style={{ maxWidth: '100px' }} />
                                        </div>
                                    )}
                                </div>
                                {isServiceEngineer && (
                                    <>
                                        <div className='mb-3'>
                                            <label className='red-asterisk'>{t('create_user_label_engineerlevel')}</label>
                                            <Select
                                                options={masterDataList.EngineerLevel}
                                                value={masterDataList.EngineerLevel && masterDataList.EngineerLevel.find(option => option.value == user.EngineerLevel) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "EngineerLevel")}
                                                isSearchable
                                                isClearable
                                                name="EngineerLevel"
                                                placeholder="Select Engineer Level"
                                            />
                                            <div className="small text-danger"> {t(errors['EngineerLevel'])}</div>
                                        </div>
                                        <div className='mb-3'>
                                            <label className='red-asterisk'>{t('create_user_label_engineertype')}</label>
                                            <Select
                                                options={masterDataList.EngineerType}
                                                value={masterDataList.EngineerType && masterDataList.EngineerType.find(option => option.value == user.EngineerType) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "EngineerType")}
                                                isSearchable
                                                isClearable
                                                name="EngineerType"
                                                placeholder={t('validation_error_edit_user_engineercategory_required')}
                                            />
                                            <div className="small text-danger"> {t(errors['EngineerType'])}</div>
                                        </div>
                                        <div className='mb-3'>
                                            <label className='red-asterisk'>{t('create_user_label_engineercategory')}</label>
                                            <Select
                                                options={masterDataList.EngineerCategory}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "EngineerCategory")}
                                                isSearchable
                                                isClearable
                                                value={masterDataList.EngineerCategory && masterDataList.EngineerCategory.find(option => option.value == user.EngineerCategory) || null}
                                                name="EngineerCategory"
                                                placeholder={t('validation_error_edit_user_engineercategory_required')}
                                            />
                                            <div className="small text-danger"> {t(errors['EngineerCategory'])}</div>
                                        </div>
                                        {engCategory == "ETP_RENG" && (
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
                                                        placeholder='Select option'
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
                                                            placeholder={t('validation_error_edit_user_contract_number_placeholder')}
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
                                                            placeholder={t('validation_error_edit_user_customer_site_name_placeholder')}
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
                                                        <input type="date" name="StartDate" onChange={onUpdateField} value={user.StartDate ?? ""} className="form-control"></input>
                                                    </div>
                                                    <div className="mb-1">
                                                        <label>{t('manpowerallocation_create_label_enddate')}</label>
                                                        <input type="date" name="EndDate" onChange={onUpdateField} value={user.EndDate ?? ""} className="form-control"></input>
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
                                            <label className="form-label red-asterisk mb-0">{t('create_user_label_engineercountryid')}</label>
                                            <Select
                                                options={Countries}
                                                name="EngineerCountryId"
                                                value={Countries && Countries.find(option => option.value == user.EngineerCountryId) || null}
                                                onChange={onFieldChangeSelect}
                                                isSearchable
                                                isClearable
                                                placeholder={t('create_user_select_country')}
                                            />
                                            <div className="small text-danger"> {t(errors['EngineerCountryId'])}</div>

                                        </div>
                                        <div className=" mt-2">
                                            <label className="form-label red-asterisk mb-0">{t('create_user_label_engineerstateid')}</label>
                                            <Select
                                                options={States}
                                                name="EngineerStateId"
                                                onChange={onFieldChangeSelect}
                                                isSearchable
                                                isClearable
                                                placeholder={t('create_user_select_state')}
                                            />
                                            <div className="small text-danger"> {t(errors['EngineerStateId'])}</div>
                                        </div>
                                        <div className=" mt-2">
                                            <label className="form-label red-asterisk mb-0">{t('create_user_label_engineercityid')}</label>
                                            <Select
                                                options={Cities}
                                                name="EngineerCityId"
                                                value={Cities && Cities.find(option => option.value == user.EngineerCityId) || null}
                                                onChange={onFieldChangeSelect}
                                                isSearchable
                                                isClearable
                                                placeholder={t('create_user_select_city')}
                                            />
                                            <div className="small text-danger"> {t(errors['EngineerCityId'])}</div>
                                        </div>
                                        <div className='mb-3 pt-2 '>
                                            <label className='red-asterisk'>{t('create_user_label_engineerpincode')}</label>
                                            <input onChange={onUpdateField} value={user.EngineerPincode} type="text" className='form-control' name='EngineerPincode' />
                                            <div className="small text-danger"> {t(errors['EngineerPincode'])}</div>
                                        </div>
                                        <div className='mb-3'>
                                            <label>{t('create_user_label_engineergeolocation')}</label>
                                            <input onChange={onUpdateField} value={user.EngineerGeolocation} type="text" className="form-control" name='EngineerGeolocation' />
                                        </div>
                                        <div className='mb-3'>
                                            <label >{t('create_user_label_engineerhomelocation')}</label>
                                            <textarea onChange={onUpdateField} value={user.EngineerAddress} rows={3} className="form-control" name='EngineerAddress' />
                                        </div>
                                    </>
                                )}
                                <div className="row mt-2">
                                    <div className='mb-1'>
                                        <div className=' mb-2 form-check form-switch'>
                                            <input
                                                className='form-check-input switch-input-lg'
                                                type='checkbox'
                                                name='IsConcurrentLoginAllowed'
                                                id='flexSwitchCheckDefault'
                                                checked={user.IsConcurrentLoginAllowed.valueOf()}
                                                value={user.IsConcurrentLoginAllowed.toString()}
                                                onChange={onUpdateField}
                                            />
                                            <label className='form-check-label'>{t('create_user_label_isconcurrentloginallowed')}</label>
                                            <div className='form-text'>{t('create_user_isconcurrentloginallowed_help_text')}</div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </>}
                        {/* Create user Form Ends Here*/}
                    </div>
                </div>
                <div className='col-5 px-2'>
                    <div>
                        <div className="mb-3 mt-1">
                            <label className='red-asterisk'>{t('create_user_grade_labal')}</label>
                            <Select
                                options={masterDataList.Grade}
                                value={masterDataList.Grade && masterDataList.Grade.find(option => option.value == user.UserGradeId) || null}
                                onChange={onFieldChangeSelect}
                                isSearchable
                                isClearable
                                classNamePrefix="react-select"
                                name="UserGradeId"
                                placeholder={t('create_user_grade_labal')}
                            />
                            <div className="small text-danger"> {t(errors['UserGradeId'])}</div>
                        </div>
                    </div>
                    <div className="mt-2 ms-2" >
                        <label className="red-asterisk mb-1">{t('create_user_title_role_of_this_user')}</label>
                        <br></br>
                        <div className="text-danger small">
                            {t(errors['UserRoles'])}
                        </div>
                        {roles.map((i, index) => (
                            <div className="mt-1" key={index}>
                                <input onChange={handleCheckboxClick} type="checkbox" value={i.role.Id} name="UserRoles" className={`form-check-input ${errors["UserRoles"] ? "is-invalid" : ""}`} data-testid='create_user_input_checkbox_${i.role.Id}' />&nbsp;
                                <label className="form-check-label">{i.role.RoleName}</label>&nbsp;
                            </div>
                        ))}
                    </div>
                </div>
                <button type="button" onClick={() => onSubmit(user)} className="btn app-primary-bg-color text-white mt-3 mb-2">{t('create_user_button_create_user')}</button>
                {displayInformationModal ? <InformationModal /> : ''}
            </div>
        </ContainerPage >
    )
}
export default CreateUser