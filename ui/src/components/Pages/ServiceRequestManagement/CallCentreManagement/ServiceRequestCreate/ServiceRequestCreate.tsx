import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateServiceRequestState, searchStatusStartSubmitting, proceedStatusStartSubmitting, initializingData, initializeServiceRequestCreate, loadAssetDetails, toggleInformationModalStatus, updateErrors, updateField, updateSearchField, updateAssetField, loadMasterData, setIsInterim } from "./ServiceRequestCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { contractAssetExistCheck, getServiceRequestAssetDetails, serviceRequestCreate } from "../../../../../services/serviceRequest";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import FeatherIcon from 'feather-icons-react';
import * as yup from 'yup';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import { getProductModelName } from "../../../../../services/product";
import { getPartMake } from "../../../../../services/part";
import { useHistory } from "react-router-dom";
import { getValuesInMasterDataByTable } from "../../../../../services/masterData";
import { InterimCallCreate } from "./InterimCall/InterimCallCreate";
import { updateRemainingAssetDdetails } from "./InterimCall/InterimCallCreate.slice";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import ServiceRequestDetails from "./ServiceRequestDetails";
import { getAssetProductCategoryNames } from "../../../../../services/assetProductCategory";

export const ServiceRequestCreate = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const {
        servicerequestcreate: { serviceRequest, asset, masterDataList, displayInformationModal, SearchType, SearchValue, errors, searchStatus, proceedStatus, caseReportedOnLocalTime },
    } = useStore(({ servicerequestcreate, app }) => ({ servicerequestcreate, app }));

    useEffect(() => {
        store.dispatch(initializeServiceRequestCreate())
        GetMasterDataItems()
    }, [])

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        if (['OptedForRemoteSupport', 'RemotelyClose'].includes(name)) {
            value = ev.target.checked ? true : false
        }
        store.dispatch(updateField({ name: name as keyof CreateServiceRequestState['serviceRequest'], value }));
    }

    const onUpdateSearchField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        if (value == "") {
            store.dispatch(initializingData())
            store.dispatch(updateErrors({}))
        } else {
            store.dispatch(searchStatusStartSubmitting(false))
        }
        store.dispatch(updateSearchField({ name, value }));
    }

    const onAssetSubmit = async () => {
        store.dispatch(initializingData())
        store.dispatch(searchStatusStartSubmitting(true))
        store.dispatch(updateErrors({}))
        try {
            await validationAssetSearchSchema.validate({ SearchType, SearchValue }, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        try {
            const { AssetExistDetails } = await contractAssetExistCheck(SearchType, SearchValue)
            if (AssetExistDetails.IsInterimAssetExist || AssetExistDetails.IsCallOpen) {
                store.dispatch(searchStatusStartSubmitting(false))
                store.dispatch(updateErrors({ "CallWarnings": AssetExistDetails.IsInterimAssetExist ? t('service_request_create_interimexist_asset_warning') : AssetExistDetails.IsCallOpen ? `${t('service_request_create_iscallopen_warning_first')} (${AssetExistDetails.WorkOrderNumber}) ${t('service_request_create_iscallopen_warning_final')}` : "" }))
            } else if (AssetExistDetails.IsRegularAssetExist) {
                const { AssetDetails } = await getServiceRequestAssetDetails(AssetExistDetails.AssetId)
                if (AssetDetails.IsCallStopped == "true" && AssetDetails.IsPreAmcCompleted == false) {
                    store.dispatch(setIsInterim("BothApproval"))
                } else if (AssetDetails.IsPreAmcCompleted == false) {
                    store.dispatch(setIsInterim("PreAmcApproval"))
                } else if (AssetDetails.IsCallStopped == "true") {
                    store.dispatch(setIsInterim("FinanceApproval"))
                }
                store.dispatch(loadAssetDetails(AssetDetails))
            }
        } catch (error: any) {
            return;
        }
    }

    const onServiceRequestSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationServiceRequestSchema.validate(serviceRequest, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await serviceRequestCreate(serviceRequest)

        result.match({
            ok: (result) => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(formattedErrors))
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateServiceRequest}>
                {t('service_request_create_success_message')}
            </SweetAlert>
        );
    }

    const updateServiceRequest = async () => {
        store.dispatch(toggleInformationModalStatus());
        history.push('/calls/callcentre')
    }

    const onProceedUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(proceedStatusStartSubmitting({ name, value }));
        value == 1 && (SearchType == "ProductSerialNumber" ? store.dispatch(updateRemainingAssetDdetails({ name: 'ProductSerialNumber', value: SearchValue })) : store.dispatch(updateRemainingAssetDdetails({ name: 'MspAssetId', value: SearchValue })))
    }

    const condition1 = SearchValue !== null && asset?.Id == null && proceedStatus === '1';
    const condition3 = SearchValue !== null && asset?.Id !== null;
    const shouldRender = condition1 || condition3;
    const [customerReportedIssue, setCustomerReportedIssue] = useState<any>(false);

    async function GetMasterDataItems() {
        try {
            const { AssetProductCategoryNames } = await getAssetProductCategoryNames()
            const formatedCategoryNames = await (formatSelectInput(AssetProductCategoryNames, "CategoryName", "Id"))
            store.dispatch(loadMasterData({ name: "CategoryNames", value: { Select: formatedCategoryNames } }));

            const { MakeNames } = await getPartMake()
            const formatedMakeNames = await (formatSelectInput(MakeNames, "Name", "Id"))
            store.dispatch(loadMasterData({ name: "MakeNames", value: { Select: formatedMakeNames } }));

            const { ModelNames } = await getProductModelName()
            const formatedModelNames = await (formatSelectInput(ModelNames, "ModelName", "Id"))
            store.dispatch(loadMasterData({ name: "ModelNames", value: { Select: formatedModelNames } }));

            var { MasterData } = await getValuesInMasterDataByTable("CallStatus")
            var FilteredStatus = MasterData.filter((status) => status.Code == 'SRS_DRFT' || status.Code == 'SRS_PNDG');
            const CallStatus = await formatSelectInput(FilteredStatus, "Name", "Id")
            store.dispatch(loadMasterData({ name: "CallStatus", value: { Select: CallStatus } }));

            var { MasterData } = await getValuesInMasterDataByTable("CustomerReportedIssue")
            const CustomerReportedIssue = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "CustomerReportedIssue", value: { Select: CustomerReportedIssue } }));

            var { MasterData } = await getValuesInMasterDataByTable("CallType")
            const CallType = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "CallType", value: { Select: CallType } }));

            var { MasterData } = await getValuesInMasterDataByTable("RemoteSupportRejectReason")
            const RemoteSupportNotOptedReason = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "RemoteSupportNotOptedReason", value: { Select: RemoteSupportNotOptedReason } }));

            var { MasterData } = await getValuesInMasterDataByTable("CustomerContactType")
            const CustomerContactType = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "CustomerContactType", value: { Select: CustomerContactType } }));

            var { MasterData } = await getValuesInMasterDataByTable("CallSource")
            const CallSource = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "CallSource", value: { Select: CallSource } }));

            var { MasterData } = await getValuesInMasterDataByTable("CallSeverityLevel")
            const CallSeverityLevel = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "CallSeverityLevel", value: { Select: CallSeverityLevel } }));
        } catch (error) {
            console.error(error);
        }
    }

    function onSelectChange(selectedOption: any, Name: any) {
        var name = Name;
        var value = selectedOption.value;
        if (name == 'CustomerReportedIssue') {
            value = selectedOption.label
            value == "Others" ? setCustomerReportedIssue(true) : setCustomerReportedIssue(false)
            value == "Others" ? value = "" : null
        }
        store.dispatch(updateField({ name: name as keyof CreateServiceRequestState['serviceRequest'], value }));
    }

    const validationServiceRequestSchema = yup.object().shape({
        CallTypeId: yup.string().required('validation_error_service_request_call_type_required'),
        CallStatusId: yup.string().required('validation_error_service_request_call_status_required'),
        CallSourceId: yup.string().required('validation_error_service_request_call_source_required'),
        CaseReportedOn: yup.string()
            .required('validation_error_service_request_casereportedon_required')
            .test('is-not-future-date', 'validation_error_service_request_case_reported_on_shouldnotbe_future', function (value) {
                if (!value) return true; // Allow empty value
                const selectedDate = new Date(value);
                const today = new Date();
                return selectedDate <= today;
            }),
        CaseReportedCustomerEmployeeName: yup.string().required('validation_error_service_request_casereportedempname_required'),
        CustomerContactTypeId: yup.string().required('validation_error_service_request_customer_contact_type_required'),
        OptedForRemoteSupport: yup.boolean(),
        RemoteSupportNotOptedReason: yup.string().when('OptedForRemoteSupport', (OptedForRemoteSupport, schema) =>
            serviceRequest.OptedForRemoteSupport === false
                ? schema.required(('validation_error_service_request_remote_support_not_opted_reason'))
                : schema.nullable()
        ),
        ClosureRemarks: yup.string().when('RemotelyClose', (RemotelyClose, schema) =>
            serviceRequest.RemotelyClose === true
                ? schema.required(('validation_error_closureremarks_required'))
                : schema.nullable()
        ),
        HoursSpent: yup.number().when('RemotelyClose', (RemotelyClose, schema) =>
            serviceRequest.RemotelyClose === true
                ? schema.typeError(('validation_error_hoursspend_required')).moreThan(-1, ('validation_error_hoursspend_required'))
                : schema.nullable()
        ),
        CustomerReportedIssue: yup.string().when('Others', (CustomerReportedIssue, schema) =>
            customerReportedIssue === true
                ? schema.required('validation_error_service_request_customerreportedissueforothers_required')
                : schema.required('validation_error_service_request_customerreportedissue_required')
        )
    });

    const validationAssetSearchSchema = yup.object().shape({
        SearchValue: yup.string().required('validation_error_service_request_searchvalue_required'),
        SearchType: yup.string().required(t('validation_error_service_request_searchtype_required') ?? '')
    });
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_calls', Link: '/calls/callcentre' },
        { Text: 'breadcrumbs_new_service_request' }
    ];
    return (
        <ContainerPage>
            <div className="">
                <div className="ms-1   my-2">
                    <BreadCrumb items={breadcrumbItems} />
                </div>
                <div className="row border">
                    {/* Service Request Details */}
                    <ServiceRequestDetails asset={asset} assetDetails={masterDataList} />
                    {/* Service Request Details Ends */}
                    <div className="col-md-6  ">
                        <div className="row mb-2 py-2 px-3 ">
                            <div className="col-md-12 ">
                                <label className="mt-2 form-label p-0 m-0 pe-2">{t('service_request_create_label_search')}</label>
                                <input name="SearchType"
                                    checked={SearchType == "ProductSerialNumber"}
                                    className="form-radio-input ms-1" value="ProductSerialNumber" type="radio" id="flexCheckDefault" onChange={onUpdateSearchField} />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    {t('service_request_create_radio_assetserialnumber')}
                                </label>
                                <input name="SearchType"
                                    checked={SearchType == "MspAssetId"}
                                    className="form-radio-input ms-3" value="MspAssetId" type="radio" id="flexCheckDefault" onChange={onUpdateSearchField} />
                                <label className="form-check-label " htmlFor="flexCheckDefault" >
                                    {t('service_request_create_radio_assetid')}
                                </label>
                            </div>
                        </div>
                        < div className="row mb-1 px-3">
                            <div className="col-md-12">
                                <div className="input-group">
                                    <input type="text" name='SearchValue'
                                        onChange={onUpdateSearchField}
                                        value={SearchValue}
                                        className={`form-control rounded-0 rounded-start custom-border-2 custom-input${errors["SearchValue"] ? "is-invalid" : ""}`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                onAssetSubmit();
                                            }
                                        }} />
                                    <button className="btn app-primary-bg-color text-white rounded-end" type="button" onClick={onAssetSubmit}>
                                        <FeatherIcon icon="search" size="20" />
                                    </button>
                                </div>
                                <div className="small text-danger">{t(errors['SearchValue'])}</div>
                            </div>
                        </div>
                        {errors['CallWarnings'] && (
                            <div className="row mx-3 p-0 mt-2">
                                <div className="alert alert-warning rounded-0 py-0 mt-1" role="alert">
                                    <div className="p-2">
                                        <span className="material-symbols-outlined align-bottom">warning</span>&nbsp;
                                        <span>{t(errors['CallWarnings'])}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Check if SearchValue is not null and asset details are not found */}
                        <div className="mt-2 px-3">
                            {SearchValue !== "" && asset?.Id == null && searchStatus === true && (
                                <div>
                                    <div className="card">
                                        <div className="card-body">
                                            <p>The Serial Number OR AssetId is not found in database.</p>
                                            <p>Do you want to create this as a Interim Call ?</p>
                                            <button value='1' name="proceedStatus" onClick={onProceedUpdateField} className={`btn btn-outline-primary ${proceedStatus === '1' ? 'active' : ''}`} data-bs-toggle='modal' data-bs-target="#CreateInterimCall">Yes</button>
                                            <button value='0' name="proceedStatus" onClick={onProceedUpdateField} className={`btn btn-outline-primary ms-2 ${proceedStatus === '0' ? 'active' : ''}`}>No</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {shouldRender && asset.ContractStatus != "CLOSED" && searchStatus ? (
                            <div className="mt-2 px-3">

                                {/* CustomerReportedIssue( text styling by bismi) */}
                                <>
                                    {/* <label className="mt-2 red-asterisk">{t('service_request_create_label_customerreportedissue')}</label>
                                                    <EditorProvider>
                                                        <Editor value={serviceRequest.CustomerReportedIssue ?? ""} name="CustomerReportedIssue" onChange={onUpdateField}>
                                                            <Toolbar>
                                                                <BtnBold />
                                                                <BtnItalic />
                                                                <BtnUnderline />
                                                                <BtnNumberedList />
                                                                <BtnClearFormatting />
                                                            </Toolbar>
                                                        </Editor>
                                                    </EditorProvider> */}
                                </>
                                {/* CustomerReportedIssue( text styling by bismi) Ends*/}
                                <ValidationErrorComp errors={errors} />
                                {/* CallType */}
                                <div className="mb-2">
                                    <label className="mt-2 red-asterisk">{t('create_assets_label_call_type')}</label>
                                    <Select
                                        options={masterDataList.CallType}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "CallTypeId")}
                                        isSearchable
                                        name="CallTypeId"
                                        placeholder="Select option"
                                    />
                                    <div className="small text-danger"> {t(errors['CallTypeId'])}</div>
                                </div>
                                {/* CallType Ends*/}

                                {/* CallStatus */}
                                <div className="mb-2">
                                    <label className="mt-2 red-asterisk">{t('create_assets_label_call_status')}</label>
                                    <Select
                                        value={masterDataList.CallStatus && masterDataList.CallStatus.find(option => option.value == serviceRequest.CallStatusId) || null}
                                        options={masterDataList.CallStatus}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "CallStatusId")}
                                        isSearchable
                                        name="CallStatusId"
                                        placeholder="Select option"
                                    />
                                    <div className="small text-danger"> {t(errors['CallStatusId'])}</div>
                                </div>
                                {/* CallStatus Ends*/}

                                {/* Customer Reported Issue */}
                                <div className="mb-2">
                                    <label className="mt-2 red-asterisk">{t('create_assets_label_customer_reported_issue')}</label>
                                    <Select
                                        options={masterDataList.CustomerReportedIssue}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "CustomerReportedIssue")}
                                        isSearchable
                                        name="CustomerReportedIssue"
                                        placeholder="Select option"
                                    />
                                    {customerReportedIssue == false && <div className="small text-danger"> {t(errors['CustomerReportedIssue'])}</div>}
                                </div>
                                {/* Customer Reported Issue Ends */}

                                {/*  Customer Reported Issue Entering field*/}
                                {customerReportedIssue && (
                                    <>
                                        <label className="mt-2 red-asterisk">{t('create_assets_label_customer_reported_issue')}</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            name="CustomerReportedIssue"
                                            maxLength={128}
                                            onChange={onUpdateField}
                                        ></textarea>
                                        <div className="small text-danger"> {t(errors['CustomerReportedIssue'])}</div>
                                    </>
                                )}
                                {/*  Customer Reported Issue Entering field Ends*/}
                                <div className=" row col-md-12 p-0 m-0">
                                    {/* Case Reported Customer EmployeeName */}
                                    <div className="col-md-6 ps-0">
                                        <>
                                            <label className="mt-2 red-asterisk">{t('service_request_create_label_casereportedempname')}</label>
                                            <input
                                                className={`form-control  ${errors["CaseReportedCustomerEmployeeName"] ? "is-invalid" : ""}`}
                                                name="CaseReportedCustomerEmployeeName"
                                                type="text"
                                                onChange={onUpdateField}
                                            ></input>
                                            <div className="invalid-feedback">{t(errors['CaseReportedCustomerEmployeeName'])}</div>
                                        </>
                                    </div>
                                    {/* Case Reported Customer Employee Name Ends*/}

                                    {/* Case Reported On */}
                                    <div className="col-md-6 p-0">
                                        <>
                                            <label className="mt-2 m-0 red-asterisk">{t('service_request_create_label_casereportedon')}</label>
                                            <input
                                                className={`form-control  ${errors["CaseReportedOn"] ? "is-invalid" : ""}`}
                                                name="CaseReportedOn"
                                                type="datetime-local"
                                                value={caseReportedOnLocalTime}
                                                onChange={onUpdateField}
                                            ></input>
                                            <div className="invalid-feedback">{t(errors['CaseReportedOn'])}</div>
                                        </>
                                    </div>
                                    {/* Case Reported On */}
                                </div>

                                {/* Opted For Remote Support*/}
                                <div className="mb-2 form-check form-switch">
                                    <label className="mt-2 form-check-label" htmlFor="flexSwitchCheckDefault">
                                        {t('service_request_create_label_opted_for_remote_support')}
                                        <input
                                            className="form-check-input switch-input-lg"
                                            type="checkbox"
                                            name="OptedForRemoteSupport"
                                            id="flexSwitchCheckDefault"
                                            checked={serviceRequest.OptedForRemoteSupport.valueOf()}
                                            value={serviceRequest.OptedForRemoteSupport.toString()}
                                            onChange={onUpdateField}
                                        />
                                    </label>
                                    <div className="form-text">
                                        {t('opted_for_remote_support_help_text')}
                                    </div>
                                </div>
                                {/* Opted For Remote Support */}

                                {/* Remote Support Not Opted Reason */}
                                {serviceRequest.OptedForRemoteSupport == false && (
                                    <div className="mb-2">
                                        <label className="mt-2 red-asterisk">{t('create_assets_label_remote_support_not_opted_reason')}</label>
                                        <Select
                                            options={masterDataList.RemoteSupportNotOptedReason}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "RemoteSupportNotOptedReason")}
                                            isSearchable
                                            name="RemoteSupportNotOptedReason"
                                            placeholder="Select option"
                                        />
                                        <div className="small text-danger"> {t(errors['RemoteSupportNotOptedReason'])}</div>
                                    </div>
                                )}
                                {/*  Remote Support Not Opted Reason */}

                                {/* Customer Contact Type */}
                                <div className="mb-2">
                                    <label className="mt-2 red-asterisk">{t('create_assets_label_customer_contact_type')}</label>
                                    <Select
                                        options={masterDataList.CustomerContactType}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "CustomerContactTypeId")}
                                        isSearchable
                                        name="CustomerContactTypeId"
                                        placeholder="Select option"
                                    />
                                    <div className="small text-danger"> {t(errors['CustomerContactTypeId'])}</div>
                                </div>
                                {/*  Customer Contact Type */}

                                {/* Call Source */}
                                <div className="mb-2">
                                    <label className="mt-2 red-asterisk">{t('create_assets_label_customer_call_source')}</label>
                                    <Select
                                        options={masterDataList.CallSource}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "CallSourceId")}
                                        isSearchable
                                        name="CallSourceId"
                                        placeholder="Select option"
                                    />
                                    <div className="small text-danger"> {t(errors['CallSourceId'])}</div>
                                </div>
                                {/*  Call Source */}

                                {/* CallSeverityLevel */}
                                <div className="mb-2">
                                    <label className="mt-2">{t('create_assets_label_call_severity_level')}</label>
                                    <Select
                                        value={masterDataList.CallSeverityLevel && masterDataList.CallSeverityLevel.find(option => option.value == serviceRequest.CallSeverityLevelId) || null}
                                        options={masterDataList.CallSeverityLevel}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "CallSeverityLevelId")}
                                        isSearchable
                                        name="CallSeverityLevelId"
                                        placeholder={t('create_assets_label_call_severity_level_placeholder')}
                                    />
                                </div>
                                {/* CallSeverityLevel Ends*/}

                                {/* Incident Id */}
                                <>
                                    <label className="mt-2">{t('service_request_create_label_incident_id')}</label>
                                    <input
                                        value={serviceRequest.IncidentId ?? ""}
                                        className="form-control"
                                        name="IncidentId"
                                        maxLength={128}
                                        onChange={onUpdateField}
                                    ></input>
                                </>
                                {/* Incident Id  Ends*/}
                                <>
                                    <label className="mt-2">{t('service_request_create_label_ticketnumber')}</label>
                                    <input
                                        value={serviceRequest.TicketNumber ?? ""}
                                        className="form-control"
                                        name="TicketNumber"
                                        maxLength={16}
                                        onChange={onUpdateField}
                                    ></input>
                                    <div className="small text-danger"> {t(errors['TicketNumber'])}</div>
                                </>

                                {/* End User Name */}
                                <>
                                    <label className="mt-2">{t('service_request_create_label_enduser_name')}</label>
                                    <input
                                        className={`form-control  ${errors["EndUserName"] ? "is-invalid" : ""}`}
                                        name="EndUserName"
                                        type="text"
                                        value={serviceRequest.EndUserName ?? ""}
                                        onChange={onUpdateField}
                                    ></input>
                                </>
                                {/* End User Name Ends */}

                                {/* End User Phone */}
                                <>
                                    <label className="mt-2">{t('service_request_create_label_enduser_phone')}</label>
                                    <input
                                        className={`form-control  ${errors["EndUserPhone"] ? "is-invalid" : ""}`}
                                        name="EndUserPhone"
                                        type="text"
                                        value={serviceRequest.EndUserPhone ?? ""}
                                        onChange={onUpdateField}
                                    ></input>
                                </>
                                {/* End User Phone Ends*/}

                                {/* End User Email */}
                                <>
                                    <label className="mt-2">{t('service_request_create_label_enduser_email')}</label>
                                    <input
                                        className={`form-control  ${errors["EndUserEmail"] ? "is-invalid" : ""}`}
                                        name="EndUserEmail"
                                        type="text"
                                        value={serviceRequest.EndUserEmail ?? ""}
                                        onChange={onUpdateField}
                                    ></input>
                                </>
                                {/* End User Email */}

                                {/*  Customer Service Address*/}
                                <>
                                    <label className="mt-2">{t('service_request_create_label_customer_service_address')}</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        name="CustomerServiceAddress"
                                        maxLength={128}
                                        onChange={onUpdateField}
                                    ></textarea>
                                </>
                                {/*  Customer Service Address Ends*/}

                                {/*  Call Center Remarks*/}
                                <>
                                    <label className="mt-2">{t('service_request_create_label_callcenterremarks')}</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        name="CallCenterRemarks"
                                        maxLength={128}
                                        onChange={onUpdateField}
                                    ></textarea>
                                </>
                                {/*  Call Center Remarks Ends*/}

                                {/*  Repair Reason*/}
                                <>
                                    <label className="mt-2">{t('service_request_create_label_repair_reason')}</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        name="RepairReason"
                                        maxLength={128}
                                        onChange={onUpdateField}
                                    ></textarea>
                                </>
                                {/*  Repair Reason Ends*/}

                                {/* Remotely Close */}
                                <>
                                    {(serviceRequest.IsInterimCaseId == false && asset.IsCallStopped != "true") && (
                                        <div className="col-md-12 mt-2">
                                            <input
                                                className="form-check-input switch-input-lg"
                                                type="checkbox"
                                                name="RemotelyClose"
                                                id="flexSwitchCheckDefault"
                                                checked={serviceRequest.RemotelyClose.valueOf()}
                                                value={serviceRequest.RemotelyClose.toString()}
                                                onChange={onUpdateField}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="flexSwitchCheckDefault">{t('service_request_create_label_remotelyclose')}</label>
                                        </div>
                                    )}
                                </>
                                {/* Remotely Close Ends*/}

                                {/* Closure Details */}
                                <>
                                    {serviceRequest.RemotelyClose == true && (
                                        <>
                                            <div className="mb-2">
                                                <label className='mt-2 red-asterisk'>{t('callclosure_label_hoursspend')}</label>
                                                <input
                                                    value={serviceRequest.HoursSpent ?? ""}
                                                    className={`form-control  ${errors["HoursSpent"] ? "is-invalid" : ""}`}
                                                    name="HoursSpent"
                                                    type="number"
                                                    onChange={onUpdateField}
                                                ></input>
                                                <div className="invalid-feedback">{t(errors['HoursSpent'])}</div>
                                            </div>
                                            <div className="mb-2">
                                                <label className="red-asterisk">{t('callclosure_label_closureremarks')}</label>
                                                <textarea onChange={onUpdateField} name="ClosureRemarks" value={serviceRequest.ClosureRemarks ?? ""}
                                                    className={`form-control  ${errors["ClosureRemarks"] ? "is-invalid" : ""}`}
                                                />
                                                <div className="invalid-feedback">{t(errors['ClosureRemarks'])}</div>
                                            </div>
                                        </>
                                    )}
                                </>
                                {/* Closure Detail Ends*/}

                                {/* button submit */}
                                {shouldRender && asset.ContractStatus != "CLOSED" && (
                                    <div className={`px-0 mt-2 col-md-12 mb-2 ${(asset.IsCallStopped == "true" || asset.IsPreAmcCompleted == false) ? 'bg-warning' : 'bg-white'}`}>
                                        <div className="row">
                                            {/* warning message */}
                                            <div className="col-md-12">
                                                {(asset.IsCallStopped == "true" || asset.IsPreAmcCompleted == false) && (
                                                    <div>
                                                        <span className="material-symbols-outlined ms-2 mt-2 align-bottom">warning</span>&nbsp;
                                                        <span className="fw-bold">Warning</span>
                                                        <p className="my-2 px-2">{asset.IsCallStopped == "true" ? t('service_request_create_deatails_warning') : asset.IsPreAmcCompleted == false ? t('service_request_create_deatails_preamc_pending_warning') : ""}</p>
                                                    </div>
                                                )}
                                            </div>
                                            {/* warning message ends */}
                                            {/* submit button */}
                                            <div className="col-md-12">
                                                <button type='button' className="btn app-primary-bg-color w-100 text-white" onClick={onServiceRequestSubmit}>{t('service_request_create_button_submit')}</button>
                                            </div>
                                            {/* submit button ends  */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : asset.ContractStatus != null && asset.ContractStatus == "CLOSED" && (
                            <>
                                <div className="alert alert-danger mx-3 rounded-0" role="alert">
                                    <div>
                                        <span className="material-symbols-outlined align-bottom">warning</span>&nbsp;
                                        <span className="fw-bold">Warning</span>
                                    </div>
                                    <div>The Contract With This {SearchType == "ProductSerialNumber" ? 'Product Serial Number' : 'Msp Asset Id'} Is Already Closed; Unable To Proceed.</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {/* Information Modal */}
                {displayInformationModal ? <InformationModal /> : ''}
                {/* Information Modal Ends*/}

                {/* Interim Call Information Modal*/}
                <InterimCallCreate />
                {/* Interim Call Information Modal Ends*/}
            </div>
        </ContainerPage >
    );
}