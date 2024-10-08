import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { EditServiceRequestState, initializeServiceRequestEdit, toggleInformationModalStatus, updateErrors, updateField, loadMasterData, loadAssetDetails, loadServiceRequestDetails } from "./ServiceRequestEdit.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { getServiceUpdateRequestDetails, serviceRequestUpdate } from "../../../../../services/serviceRequest";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import { getProductModelName } from "../../../../../services/product";
import { getPartMake } from "../../../../../services/part";
import { useHistory, useParams } from "react-router-dom";
import { getValuesInMasterDataByTable } from "../../../../../services/masterData";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import ServiceRequestDetails from "../ServiceRequestCreate/ServiceRequestDetails";
import { getAssetProductCategoryNames } from "../../../../../services/assetProductCategory";
import { searchStatusStartSubmitting } from "../ServiceRequestCreate/ServiceRequestCreate.slice";

export const ServiceRequestEdit = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const {
        servicerequestedit: { serviceRequest, asset, masterDataList, displayInformationModal, errors },
    } = useStore(({ servicerequestedit }) => ({ servicerequestedit }));

    const { ServiceRequestId } = useParams<{ ServiceRequestId: string }>();

    useEffect(() => {
        store.dispatch(initializeServiceRequestEdit())
        GetMasterDataItems()
    }, [])

    useEffect(() => {
        getServiceRequestDetails()
    }, [ServiceRequestId])

    const getServiceRequestDetails = async () => {
        const { ServiceRequestDetails } = await getServiceUpdateRequestDetails(ServiceRequestId)
        store.dispatch(loadAssetDetails({
            Id: ServiceRequestDetails.AssetId,
            ProductModelNumber: ServiceRequestDetails.ProductModelId,
            CustomerInfoId: 0, CustomerSiteId: null,
            CallStopDate: "", IsCallStopped: "",
            ...ServiceRequestDetails
        }))
        store.dispatch(loadServiceRequestDetails({ Id: ServiceRequestDetails.ServiceRequestId, CallStatusId: ServiceRequestDetails.CaseStatusId, ...ServiceRequestDetails }))
        store.dispatch(searchStatusStartSubmitting(true))
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        if (['OptedForRemoteSupport', 'RemotelyClose'].includes(name)) {
            value = ev.target.checked ? true : false
        }
        store.dispatch(updateField({ name: name as keyof EditServiceRequestState['serviceRequest'], value }));
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
        const result = await serviceRequestUpdate(serviceRequest)

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
                {t('service_request_update_success_message')}
            </SweetAlert>
        );
    }

    const updateServiceRequest = async () => {
        store.dispatch(toggleInformationModalStatus());
        history.push('/calls/callcentre')
    }

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
        store.dispatch(updateField({ name: name as keyof EditServiceRequestState['serviceRequest'], value }));
    }

    const validationServiceRequestSchema = yup.object().shape({
        CallTypeId: yup.string().required('validation_error_service_request_call_type_required'),
        CallStatusId: yup.string().required('validation_error_service_request_call_status_required'),
        CallSourceId: yup.string().required('validation_error_service_request_call_source_required'),
        CaseReportedOn: yup.string().required('validation_error_service_request_casereportedon_required'),
        CaseReportedCustomerEmployeeName: yup.string().required('validation_error_service_request_casereportedempname_required'),
        CustomerContactTypeId: yup.string().required('validation_error_service_request_customer_contact_type_required'),
        OptedForRemoteSupport: yup.boolean(),
        RemoteSupportNotOptedReason: yup.string().when('OptedForRemoteSupport', (OptedForRemoteSupport, schema) =>
            serviceRequest.OptedForRemoteSupport === false
                ? schema.required(('validation_error_service_request_remote_support_not_opted_reason'))
                : schema.nullable()
        ),
        CustomerReportedIssue: yup.string().when('Others', (CustomerReportedIssue, schema) =>
            customerReportedIssue === true
                ? schema.required('validation_error_service_request_customerreportedissueforothers_required')
                : schema.required('validation_error_service_request_customerreportedissue_required')
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
    });

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_calls', Link: '/calls' },
        { Text: 'breadcrumbs_edit_service_request' }
    ];
    return (
        <ContainerPage>
            <div className="">
                <div className="ms-1 my-2">
                    <BreadCrumb items={breadcrumbItems} />
                </div>
                <ValidationErrorComp errors={errors} />

                <div className="row border">
                    {/* Service Request Details */}
                    <ServiceRequestDetails asset={asset} assetDetails={masterDataList} />
                    {/* Service Request Details Ends */}

                    <div className="col-md-6">
                        <div className="mt-2 px-3">
                            {/* Incident Id */}
                            <>
                                <label className="mt-2">{t('service_request_update_label_incident_id')}</label>
                                <input
                                    value={serviceRequest.IncidentId ? serviceRequest.IncidentId : ""}
                                    className="form-control"
                                    name="IncidentId"
                                    maxLength={128}
                                    onChange={onUpdateField}
                                ></input>
                            </>
                            <>
                                <label className="mt-2">{t('service_request_update_label_ticketnumber')}</label>
                                <input
                                    className="form-control"
                                    name="TicketNumber"
                                    type="text"
                                    value={serviceRequest.TicketNumber ?? ""}
                                    onChange={onUpdateField}
                                ></input>
                            </>
                            {/* Incident Id  Ends*/}

                            {/* CallType */}
                            <div className="mb-2">
                                <label className="mt-2 red-asterisk">{t('create_assets_label_call_type')}</label>
                                <Select
                                    value={masterDataList.CallType && masterDataList.CallType.find(option => option.value == serviceRequest.CallTypeId) || null}
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
                                    value={masterDataList.CustomerReportedIssue && masterDataList.CustomerReportedIssue.find(option => option.label == serviceRequest.CustomerReportedIssue) || null}
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
                                        value={serviceRequest.CustomerReportedIssue ? serviceRequest.CustomerReportedIssue : ""}
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

                            {/* Case Reported Customer EmployeeName */}
                            <>
                                <label className="mt-2 red-asterisk">{t('service_request_update_label_casereportedempname')}</label>
                                <input
                                    value={serviceRequest.CaseReportedCustomerEmployeeName ? serviceRequest.CaseReportedCustomerEmployeeName : ""}
                                    className={`form-control  ${errors["CaseReportedCustomerEmployeeName"] ? "is-invalid" : ""}`}
                                    name="CaseReportedCustomerEmployeeName"
                                    type="text"
                                    onChange={onUpdateField}
                                ></input>
                                <div className="invalid-feedback">{t(errors['CaseReportedCustomerEmployeeName'])}</div>
                            </>
                            {/* Case Reported Customer Employee Name Ends*/}

                            {/* Case Reported On */}
                            <>
                                <label className="mt-2 red-asterisk">{t('service_request_update_label_casereportedon')}</label>
                                <input
                                    className={`form-control  ${errors["CaseReportedOn"] ? "is-invalid" : ""}`}
                                    name="CaseReportedOn"
                                    type="datetime-local"
                                    value={serviceRequest.CaseReportedOn}
                                    disabled={true}
                                ></input>
                                <div className="invalid-feedback">{t(errors['CaseReportedOn'])}</div>
                            </>
                            {/* Case Reported On */}

                            {/* Opted For Remote Support*/}
                            <div className="mb-2 form-check form-switch">
                                <label className="mt-2 form-check-label" htmlFor="flexSwitchCheckDefault">
                                    {t('service_request_update_label_opted_for_remote_support')}
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
                                        value={masterDataList.RemoteSupportNotOptedReason && masterDataList.RemoteSupportNotOptedReason.find(option => option.value == serviceRequest.RemoteSupportNotOptedReason) || null}
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
                                    value={masterDataList.CustomerContactType && masterDataList.CustomerContactType.find(option => option.value == serviceRequest.CustomerContactTypeId) || null}
                                    options={masterDataList.CustomerContactType}
                                    onChange={(selectedOption) => onSelectChange(selectedOption, "CustomerContactTypeId")}
                                    isSearchable
                                    name="CustomerContactTypeId"
                                    placeholder="Select option"
                                />
                                <div className="small text-danger"> {t(errors['CustomerContactTypeId'])}</div>
                            </div>
                            {/*  Customer Contact Type */}

                            {/* End User Name */}
                            <>
                                <label className="mt-2">{t('service_request_update_label_enduser_name')}</label>
                                <input
                                    className={`form-control  ${errors["EndUserName"] ? "is-invalid" : ""}`}
                                    name="EndUserName"
                                    type="text"
                                    value={serviceRequest.EndUserName ? serviceRequest.EndUserName : ""}
                                    onChange={onUpdateField}
                                ></input>
                            </>
                            {/* End User Name Ends */}

                            {/* End User Phone */}
                            <>
                                <label className="mt-2">{t('service_request_update_label_enduser_phone')}</label>
                                <input
                                    className={`form-control  ${errors["EndUserPhone"] ? "is-invalid" : ""}`}
                                    name="EndUserPhone"
                                    type="text"
                                    value={serviceRequest.EndUserPhone ? serviceRequest.EndUserPhone : ""}
                                    onChange={onUpdateField}
                                ></input>
                            </>
                            {/* End User Phone Ends*/}

                            {/* End User Email */}
                            <>
                                <label className="mt-2">{t('service_request_update_label_enduser_email')}</label>
                                <input
                                    className={`form-control  ${errors["EndUserEmail"] ? "is-invalid" : ""}`}
                                    name="EndUserEmail"
                                    type="text"
                                    value={serviceRequest.EndUserEmail ? serviceRequest.EndUserEmail : ""}
                                    onChange={onUpdateField}
                                ></input>
                            </>
                            {/* End User Email */}

                            {/* Call Source */}
                            <div className="mb-2">
                                <label className="mt-2 red-asterisk">{t('create_assets_label_customer_call_source')}</label>
                                <Select
                                    value={masterDataList.CallSource && masterDataList.CallSource.find(option => option.value == serviceRequest.CallSourceId) || null}
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
                                <div className="small text-danger"> {t(errors['CallSeverityLevelId'])}</div>
                            </div>
                            {/* CallSeverityLevel Ends*/}

                            {/*  Customer Service Address*/}
                            <>
                                <label className="mt-2">{t('service_request_update_label_customer_service_address')}</label>
                                <textarea
                                    value={serviceRequest.CustomerServiceAddress ? serviceRequest.CustomerServiceAddress : ""}
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
                                <label className="mt-2">{t('service_request_update_label_callcenterremarks')}</label>
                                <textarea
                                    value={serviceRequest.CallCenterRemarks ? serviceRequest.CallCenterRemarks : ""}
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
                                <label className="mt-2">{t('service_request_update_label_repair_reason')}</label>
                                <textarea
                                    value={serviceRequest.RepairReason ? serviceRequest.RepairReason : ""}
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
                                {serviceRequest.IsInterimCaseId == false && (
                                    <div className="col-md-12 mt-2">
                                        <input
                                            className="form-check-input switch-input-lg"
                                            type="checkbox"
                                            name="RemotelyClose"
                                            id="flexSwitchCheckDefault"
                                            checked={serviceRequest?.RemotelyClose?.valueOf()}
                                            value={serviceRequest?.RemotelyClose?.toString()}
                                            onChange={onUpdateField}
                                        />
                                        <label className="form-check-label ms-2" htmlFor="flexSwitchCheckDefault">{t('service_request_create_label_remotelyclose')}</label>
                                    </div>
                                )}
                            </>
                            {/* Remotely Close Ends*/}

                            {/* closure details*/}
                            {serviceRequest.RemotelyClose == true && (
                                <>
                                    <div className="mb-2">
                                        <label className='mt-2 red-asterisk'>{t('callclosure_label_hoursspend')}</label>
                                        <input
                                            value={serviceRequest?.HoursSpent ?? ""}
                                            className={`form-control  ${errors["HoursSpent"] ? "is-invalid" : ""}`}
                                            name="HoursSpent"
                                            type="number"
                                            onChange={onUpdateField}
                                        ></input>
                                        <div className="invalid-feedback">{t(errors['HoursSpent'])}</div>
                                    </div>
                                    <div className="mb-2">
                                        <label className="red-asterisk">{t('callclosure_label_closureremarks')}</label>
                                        <textarea onChange={onUpdateField} name="ClosureRemarks" value={serviceRequest?.ClosureRemarks ?? ""}
                                            className={`form-control  ${errors["ClosureRemarks"] ? "is-invalid" : ""}`}
                                        />
                                        <div className="invalid-feedback">{t(errors['ClosureRemarks'])}</div>
                                    </div>
                                </>
                            )}
                            {/* closure details ends */}
                            <div className="col-md-12 mt-2 mb-2">
                                <button type='button' className="btn app-primary-bg-color w-100 text-white" onClick={onServiceRequestSubmit}>{t('service_request_update_button_submit')}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Information Modal */}
                {displayInformationModal ? <InformationModal /> : ''}
                {/* Information Modal Ends*/}

            </div>
        </ContainerPage >
    );
}