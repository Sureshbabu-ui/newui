import { useTranslation } from "react-i18next";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { useHistory, useParams } from "react-router-dom";
import { useStoreWithInitializer } from "../../../../../../state/storeHooks";
import { CreateServiceRequestState, interimCallApproval, loadInterimAsset, loadInterimServiceRequestDetails, loadMasterData, rejectCall, toggleInformationModalStatus, updateErrors, updateField } from "../InterimRequestReview.slice";
import { store } from "../../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { convertBackEndErrorsToValidationErrors, formatDate, formatSelectInput } from "../../../../../../helpers/formats";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { InterimRequestReject, getInterimCallAssetDetails, getInterimServiceRequestDetails, getPreAmcInterimServiceRequestList, interimCallAssetApprove, preAmcPendingAssetApprove } from "../../../../../../services/serviceRequest";
import BreadCrumb from "../../../../../BreadCrumbs/BreadCrumb";
import Select from 'react-select';
import { getValuesInMasterDataByTable } from "../../../../../../services/masterData";
import { loadServiceRequests } from "../../InterimRequestList/AssetInterimRequestList/AssetInterimRequestList.slice";
import { useEffect, useState } from "react";
import { getRegionWiseServiceEngineers } from "../../../../../../services/users";

export const InterimAssetReview = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const { ServiceRequestId } = useParams<{ ServiceRequestId: string }>();
    const {
        assetinterimservicerequestlist: { filters, searchWith },
        interimrequestreview: { displayInformationModal, masterData, InterimCallReject, InterimCallApproval, errors, assets, interimAssetDetails, interimServiceRequestDetails },
    } = useStoreWithInitializer(({ interimrequestreview, assetinterimservicerequestlist }) => ({ interimrequestreview, assetinterimservicerequestlist }), onLoad);
    const [selectedValue, setSelectedValue] = useState(1);
    const STATUS_APPROVED = 1
    const STATUS_REJECT = 0

    async function onUpdateField(ev: any) {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateServiceRequestState['assets'], value }));
        store.dispatch(interimCallApproval({ name: 'ReviewRemarks', value: value }))
        store.dispatch(rejectCall({ name: 'ReviewRemarks', value: value }))
    }

    const RejectvalidationSchema = yup.object().shape({
        ReviewStatus: yup.string().required(t('validation_error_interim_request_review_reviewstatus_required') ?? ''),
    });

    const validationSchema = yup.object().shape({
        ReviewStatus: yup.string().required(t('validation_error_interim_request_review_reviewstatus_required') ?? ''),
        IsEnterpriseAssetId: yup.number().moreThan(-1, ('validation_error_create_asset_enterprise_asset_required')),
        ResponseTimeInHours: yup.number().moreThan(0, ('Validation_error_create_asset_responsetime_required')),
        ResolutionTimeInHours: yup.number().moreThan(0, ('validation_error_create_asset_resolutiontime_required')),
        StandByTimeInHours: yup.number().moreThan(0, ('validation_error_create_asset_standbytime_required')
        ),
        IsVipAssetId: yup.number().moreThan(-1, ('validation_error_create_asset_vip_asset_required') ?? ''),
        AmcValue: yup.number().moreThan(0, 'validation_error_create_asset_amcvalue_required').typeError('validation_error_create_asset_amcvalue_required').max(99999999999999.99, ('validation_error_create_asset_amcvalue_exceeds')),
        IsOutsourcingNeededId: yup.number().moreThan(-1, t('validation_error_create_asset_outsourcing_required') ?? ''),
        IsPreAmcCompleted: yup.number().moreThan(-1, t('validation_error_create_asset_pre_amc_completed_required') ?? ''),
        PreAmcCompletedDate: yup.string().when('IsPreAmcCompleted', (IsPreAmcCompleted, schema) =>
            assets.IsPreAmcCompleted === "1" || assets.IsPreAmcCompleted === 1
                ? schema.required('validation_error_create_asset_preamc_completeddate_required')
                : schema.nullable()
        ),
        PreAmcCompletedBy: yup.string().when('IsPreAmcCompleted', (IsPreAmcCompleted, schema) =>
            assets.IsPreAmcCompleted === "1" || assets.IsPreAmcCompleted === 1
                ? schema.required('validation_error_update_asset_preamc_completedby_required')
                : schema.nullable()
        ),
        IsPreventiveMaintenanceNeededId: yup
            .number()
            .moreThan(-1, t('validation_error_create_asset_preventive_maintenance_needed_required') ?? ''),
        PreventiveMaintenanceFrequencyId: yup
            .number()
            .when('IsPreventiveMaintenanceNeededId', (IsPreventiveMaintenanceNeededId, schema) =>
                assets.IsPreventiveMaintenanceNeededId === "1" || assets.IsPreventiveMaintenanceNeededId === 1
                    ? schema.moreThan(0, () => t('Validation_error_create_asset_pm_frequency_required'))
                    : schema.nullable()
            ),
        AssetConditionId: yup.number().moreThan(0, t('validation_error_create_asset_assets_condition_required') ?? ''),
        AssetSupportTypeId: yup.number().moreThan(0, t('validation_error_create_asset_assets_support_type_required') ?? ''),
        AmcStartDate: yup.string().required(t('validation_error_create_asset_amc_startdate_required') ?? ''),
        AmcEndDate: yup.string().required(t('validation_error_create_asset_amc_enddate_required') ?? ''),
    });

    const preAmcValidationSchema = yup.object().shape({
        IsPreAmcCompleted: yup.number().moreThan(-1, t('validation_error_create_asset_pre_amc_completed_required') ?? ''),
        PreAmcCompletedDate: yup.string().when('IsPreAmcCompleted', (IsPreAmcCompleted, schema) =>
            assets.IsPreAmcCompleted === "1" || assets.IsPreAmcCompleted === 1
                ? schema.required('validation_error_create_asset_preamc_completeddate_required')
                : schema.nullable()
        ),
        PreAmcCompletedBy: yup.string().when('IsPreAmcCompleted', (IsPreAmcCompleted, schema) =>
            assets.IsPreAmcCompleted === "1" || assets.IsPreAmcCompleted === 1
                ? schema.required('validation_error_update_asset_preamc_completedby_required')
                : schema.nullable()
        ),
    })
    const submitReview = async () => {
        store.dispatch(updateErrors({}))
        try {
            if (assets.ReviewStatus == '1' && !interimServiceRequestDetails.IsPreAmcApprovalNeeded) {
                await validationSchema.validate(assets, { abortEarly: false });
            } else if (assets.ReviewStatus == '1' && interimServiceRequestDetails.IsPreAmcApprovalNeeded) {
                await preAmcValidationSchema.validate(assets, { abortEarly: false });
            } else {
                await RejectvalidationSchema.validate({ ReviewStatus: assets.ReviewStatus }, { abortEarly: false });
            }
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        if (assets.ReviewStatus == '1') {
            if (interimServiceRequestDetails.IsPreAmcApprovalNeeded) {
                const result = await preAmcPendingAssetApprove({
                    IsPreAmcCompleted: assets.IsPreAmcCompleted,
                    PreAmcCompletedDate: assets.PreAmcCompletedDate,
                    PreAmcCompletedBy: assets.PreAmcCompletedBy,
                    ReviewRemarks: assets.ReviewRemarks,
                    ServiceRequestId: interimServiceRequestDetails.Id
                });
                result.match({
                    ok: () => {
                        store.dispatch(toggleInformationModalStatus());
                    },
                    err: (e) => {
                        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                        store.dispatch(updateErrors(formattedErrors))
                    },
                });
            } else {
                const result = await interimCallAssetApprove(assets)
                result.match({
                    ok: () => {
                        store.dispatch(toggleInformationModalStatus());
                    },
                    err: (e) => {
                        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                        store.dispatch(updateErrors(formattedErrors))
                    },
                });
            }
        }
        else {
            const result = await InterimRequestReject(InterimCallReject)
            result.match({
                ok: () => {
                    store.dispatch(toggleInformationModalStatus());
                },
                err: (e) => {
                    const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(formattedErrors))
                },
            });
        }
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateServiceRequest}>
                {assets.ReviewStatus == "1" ? "Interim Service Request Approved Successfully" : "Interim Service Request Rejected Successfully"}
            </SweetAlert>
        );
    }

    const updateServiceRequest = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getPreAmcInterimServiceRequestList(searchWith, 1, filters);
        store.dispatch(loadServiceRequests(result));
        history.push('/calls/asset/interimlist')
    }

    async function onLoad() {
        try {
            const interimRequestDetails = await getInterimServiceRequestDetails(ServiceRequestId)
            store.dispatch(loadInterimServiceRequestDetails(interimRequestDetails))
            if (interimRequestDetails.InterimServiceRequestDetails.AssetSerialNumber == null) {
                const assetDetails = await getInterimCallAssetDetails(ServiceRequestId)
                store.dispatch(loadInterimAsset(assetDetails))
            }
            GetMasterDataItems()
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        if (interimServiceRequestDetails.IsPreAmcCompleted == true) {
            setSelectedValue(1);
            store.dispatch(updateField({ name: "IsPreAmcCompleted", value: 1 }));
            store.dispatch(updateField({ name: "PreAmcCompletedDate", value: interimServiceRequestDetails.PreAmcCompletedDate }));
            store.dispatch(updateField({ name: "PreAmcCompletedBy", value: interimServiceRequestDetails.PreAmcCompletedBy }));
        } else {
            setSelectedValue(0);
            store.dispatch(updateField({ name: "IsPreAmcCompleted", value: 0 }));
        }
    }, [interimServiceRequestDetails.IsPreAmcCompleted]);

    function handleCheckbox(ev: any) {
        var value = ev.target.value
        store.dispatch(updateField({ name: 'ReviewStatus', value: value }));
        store.dispatch(rejectCall({ name: 'ReviewStatus', value: value }))
        store.dispatch(interimCallApproval({ name: 'ReviewStatus', value: value }))
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_calls', Link: '/' },
        { Text: 'breadcrumbs_review_interimcall' }
    ];

    async function GetMasterDataItems() {
        try {
            var { MasterData } = await getValuesInMasterDataByTable("ProductSupportType")
            const ProductSupportType = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "ProductSupportType", value: { Select: ProductSupportType } }));

            var { MasterData } = await getValuesInMasterDataByTable("PreventiveMaintenanceFrequency")
            const PreventiveMaintenanceFrequency = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "PreventiveMaintenanceFrequency", value: { Select: PreventiveMaintenanceFrequency } }));

            var { MasterData } = await getValuesInMasterDataByTable("ProductPreAmcCondition")
            const ProductPreAmcCondition = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "ProductPreAmcCondition", value: { Select: ProductPreAmcCondition } }));

            const { ServiceEngineers } = await getRegionWiseServiceEngineers();
            const ServiceEngineer = await formatSelectInput(ServiceEngineers, "FullName", "Id")
            store.dispatch(loadMasterData({ name: "ServiceEngineers", value: { Select: ServiceEngineer } }));
        } catch (error) {
            console.error(error);
        }
    }

    function onSelectChange(selectedOption: any, Name: any) {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof CreateServiceRequestState['assets'], value }));
    }

    return (
        <ContainerPage>
            <BreadCrumb items={breadcrumbItems} />
            <ValidationErrorComp errors={errors} />
            <div className='px-3 row'>
                <div className="col-md-5">
                    <div className="col-md-12 p-1">
                        <div className="row">
                            <div className="fw-bold">{t('interim_request_review_title_service_requestdetails')}</div>
                            <div className="col md-6">
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_caseid')}</label>
                                    <div>{interimServiceRequestDetails.CaseId ? interimServiceRequestDetails.CaseId : "---"}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_customer_reportrd_issue')}</label>
                                    <div >{interimServiceRequestDetails.CustomerReportedIssue ? interimServiceRequestDetails.CustomerReportedIssue : "---"}</div>
                                </div>
                            </div>
                            <div className="col md-6">
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_case_reportrd_on')}</label>
                                    <div >{interimServiceRequestDetails.CaseReportedOn ? formatDate(interimServiceRequestDetails.CaseReportedOn) : "---"}</div>
                                </div>
                            </div>
                        </div>
                        {/* Interim Asset Details */}
                        {interimServiceRequestDetails.AssetSerialNumber != null ? (
                            <div className="row">
                                <div className="fw-bold mt-3">{t('interim_request_review_title_assetdetails')}</div>
                                <div className="col md-6">
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_lable_assetserialnumber')}</label>
                                        <div >{interimServiceRequestDetails.AssetSerialNumber ? interimServiceRequestDetails.AssetSerialNumber : "---"}</div>
                                    </div>
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_asset_category')}</label>
                                        <div >{interimServiceRequestDetails.CategoryName ? interimServiceRequestDetails.CategoryName : "---"}</div>
                                    </div>
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_site_name')}</label>
                                        <div >{interimServiceRequestDetails.CustomerSiteName ? interimServiceRequestDetails.CustomerSiteName : "---"}</div>
                                    </div>
                                </div>
                                <div className="col md-6">
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_asset_make')}</label>
                                        <div >{interimServiceRequestDetails.Make ? interimServiceRequestDetails.Make : "---"}</div>
                                    </div>
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_asset_model')}</label>
                                        <div >{interimServiceRequestDetails.ModelName ? interimServiceRequestDetails.ModelName : "---"}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="row">
                                <div className="fw-bold mt-3">{t('interim_request_review_title_assetdetails')}</div>
                                <div className="col md-6">
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_lable_assetserialnumber')}</label>
                                        <div >{interimAssetDetails.AssetSerialNumber ? interimAssetDetails.AssetSerialNumber : "---"}</div>
                                    </div>
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_asset_category')}</label>
                                        <div >{interimAssetDetails.CategoryName ? interimAssetDetails.CategoryName : "---"}</div>
                                    </div>
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_site_name')}</label>
                                        <div >{interimAssetDetails.CustomerSiteName ? interimAssetDetails.CustomerSiteName : "---"}</div>
                                    </div>
                                </div>
                                <div className="col md-6">
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_asset_make')}</label>
                                        <div >{interimAssetDetails.Make ? interimAssetDetails.Make : "---"}</div>
                                    </div>
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_asset_model')}</label>
                                        <div >{interimAssetDetails.ModelName ? interimAssetDetails.ModelName : "---"}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Interim Asset Details  Ends*/}

                        <div className="row">
                            <div className="fw-bold mt-3">{t('interim_request_review_title_contractdetails')}</div>
                            <div className="col md-6">
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_contract_number')}</label>
                                    <div>{interimServiceRequestDetails.ContractNumber ? interimServiceRequestDetails.ContractNumber : "---"}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_agreement_type')}</label>
                                    <div>{interimServiceRequestDetails.AgreementType ? interimServiceRequestDetails.AgreementType : "---"}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_service_mode')}</label>
                                    <div >{interimServiceRequestDetails.ServiceMode ? interimServiceRequestDetails.ServiceMode : "---"}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_tenent_office')}</label>
                                    <div>{interimServiceRequestDetails.Location ? interimServiceRequestDetails.Location : "---"}</div>
                                </div>
                            </div>
                            <div className="col md-6">
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_contract_end_date')}</label>
                                    <div>{interimServiceRequestDetails.EndDate ? formatDate(interimServiceRequestDetails.EndDate) : "---"}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_call_expiry')}</label>
                                    <div >{interimServiceRequestDetails.CallExpiryDate ? formatDate(interimServiceRequestDetails.CallExpiryDate) : "---"}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_call_stop_date')}</label>
                                    <div >{interimServiceRequestDetails.CallStopDate ? formatDate(interimServiceRequestDetails.CallStopDate) : "---"}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_call_stop_reason')}</label>
                                    <div>{interimServiceRequestDetails.CallStopReason ? interimServiceRequestDetails.CallStopReason : "---"}</div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="fw-bold mt-3">{t('interim_request_review_title_customerdetails')}</div>
                            <div className="col md-6">
                                <div className="row pt-2">
                                    <label className="form-text">{t('interim_request_review_label_customername')}</label>
                                    <div>{interimServiceRequestDetails.CustomerName ? interimServiceRequestDetails.CustomerName : "---"}</div>
                                </div>
                                {interimServiceRequestDetails.AssetSerialNumber != null ? (
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_sitename_and_adderss')}</label>
                                        <div >{interimServiceRequestDetails.CustomerSiteName ?? "---"}</div>
                                        <div >{interimServiceRequestDetails.CustomerSiteAddress ? interimServiceRequestDetails.CustomerSiteAddress : "---"}</div>
                                    </div>
                                ) : (
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_sitename_and_adderss')}</label>
                                        <div >{interimAssetDetails.CustomerSiteName ?? "---"}</div>
                                        <div >{interimAssetDetails.CustomerSiteAddress ? interimAssetDetails.CustomerSiteAddress : "---"}</div>
                                    </div>
                                )}
                            </div>
                            {interimServiceRequestDetails.AssetSerialNumber != null ? (
                                <div className="col md-6">
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_customercontactname')}</label>
                                        <div>{interimServiceRequestDetails.CustomerContactName ? interimServiceRequestDetails.CustomerContactName : "---"}</div>
                                    </div>
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_customeremail')}</label>
                                        <div >{interimServiceRequestDetails.CustomerContactEmail ? interimServiceRequestDetails.CustomerContactEmail : "---"}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="col md-6">
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_customercontactname')}</label>
                                        <div>{interimAssetDetails.CustomerContactName ? interimAssetDetails.CustomerContactName : "---"}</div>
                                    </div>
                                    <div className="row pt-2">
                                        <label className="form-text">{t('interim_request_review_label_customeremail')}</label>
                                        <div >{interimAssetDetails.CustomerContactEmail ? interimAssetDetails.CustomerContactEmail : "---"}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-7 mb-3 m-0 pe-0">
                    {/* Approve option */}
                    <div className='mb-1 row'>
                        <div className="text-danger small mb-2">
                            {errors['ReviewStatus']}
                        </div>
                        <div>
                            {/* checkbox & label */}
                            <div>
                                <input
                                    className={`form-check-input ${errors["ReviewStatus"] ? "is-invalid" : ""}`}
                                    type="radio"
                                    onChange={handleCheckbox}
                                    value={STATUS_APPROVED}
                                    name="ReviewStatus"
                                />
                                <label className="form-check-label fw-bold ms-1">{t('interim_request_review_label_aprove')}</label>
                                {/* checkbox & label ends */}
                            </div>
                            {/* helptext */}
                            <div className="ms-3 text-muted">
                                <small>{t('interim_request_review_approve_helptext')}</small>
                            </div>
                            {/* helptext ends */}
                        </div>
                        {/* Approve option ends */}

                        {/* Reject option */}
                        <div>
                            <div className='mb-1 m-0'>
                                {/* checkbox & label */}
                                <input
                                    className={`form-check-input ${errors["ReviewStatus"] ? "is-invalid" : ""}`}
                                    type="radio"
                                    onChange={handleCheckbox}
                                    value={STATUS_REJECT}
                                    name="ReviewStatus"
                                />
                                <label className="form-check-label fw-bold ms-1">{t('interim_request_review_label_reject')}</label>
                                {/* checkbox & label ends */}
                            </div>

                            {/* helptext */}
                            <div className="ms-3 text-muted">
                                <small>{t('interim_request_review_reject_helptext')}</small>
                            </div>
                            {/* helptext ends */}
                        </div>
                        {/* Reject option ends */}

                    </div>
                    <div className='ms-0 mt-2 mx-0'>
                        <label className="p-0">{t('interim_request_review_label_review_comment')}</label>
                        <textarea
                            value={assets.ReviewRemarks}
                            className='form-control me-0'
                            rows={2}
                            name="ReviewRemarks"
                            maxLength={128}
                            onChange={onUpdateField}
                        ></textarea>
                    </div>
                    {/* Asset Input Details */}
                    {InterimCallApproval.ReviewStatus == "1" && (
                        <>
                            {!interimServiceRequestDetails.IsPreAmcApprovalNeeded ? (
                                <div className="row">
                                    <div className="row m-0 p-0">
                                        {/* CustomerAssetId */}
                                        <div className="col-6 mb-1">
                                            <label>{t('create_assets_label_customer_asset_id')}</label>
                                            <input value={assets.CustomerAssetId} name="CustomerAssetId" onChange={onUpdateField} type="text" className={`form-control  ${errors["CustomerAssetId"] ? "is-invalid" : ""}`} ></input>
                                        </div>
                                        {/* Is Enterprise Product */}
                                        <div className="mb-1 col-6">
                                            <label className='red-asterisk'>{t('create_assets_label_is_enterprise_asset')}</label>
                                            <select name="IsEnterpriseAssetId" onChange={onUpdateField} className="form-select">
                                                <option value={-1} selected>
                                                    {t('create_assets_select_is_enterprise_asset')}
                                                </option>
                                                <option value="1">{t('create_assets_select_is_enterprise_asset_yes')}</option>
                                                <option value="0">{t('create_assets_select_is_enterprise_asset_no')}</option>
                                            </select>
                                            <div className="small text-danger"> {t(errors['IsEnterpriseAssetId'])}</div>
                                        </div>
                                        {/* ResponseTimeInHours */}
                                        <div className="mb-1 col-6">
                                            <label className='red-asterisk'>{t('create_assets_label_response_time_in_hours')}</label>
                                            <input name="ResponseTimeInHours" onChange={onUpdateField} type="number" min={0} className="form-control" value={assets.ResponseTimeInHours}></input>
                                            <div className="small text-danger"> {t(errors['ResponseTimeInHours'])}</div>
                                        </div>
                                        {/* ResolutionTimeInHours */}
                                        <div className="mb-1 col-6">
                                            <label className='red-asterisk'>{t('create_assets_label_resolution_time_in_hours')}</label>
                                            <input name="ResolutionTimeInHours" onChange={onUpdateField} type="number" min={0} className="form-control" value={assets.ResolutionTimeInHours}></input>
                                            <div className="small text-danger"> {t(errors['ResolutionTimeInHours'])}</div>
                                        </div>
                                    </div>
                                    {/* StandByTimeInHours */}
                                    <div className="mb-1 col-6">
                                        <label className='red-asterisk'>{t('create_assets_label_standby_time_in_hours')}</label>
                                        <input name="StandByTimeInHours" onChange={onUpdateField} type="number" min={0} className="form-control" value={assets.StandByTimeInHours}></input>
                                        <div className="small text-danger"> {t(errors['StandByTimeInHours'])}</div>
                                    </div>
                                    {/* IsVipAssetId */}
                                    <div className="mb-1 col-6">
                                        <label className='red-asterisk'>{t('create_assets_label_is_vip_asset')}</label>
                                        <select name="IsVipAssetId" onChange={onUpdateField} className="form-select">
                                            <option value={-1} selected>
                                                {t('create_assets_select_is_vip_asset')}
                                            </option>
                                            <option value="1">{t('create_assets_select_is_vip_asset_yes')}</option>
                                            <option value="0">{t('create_assets_select_is_vip_asset_no')}</option>
                                        </select>
                                        <div className="small text-danger"> {t(errors['IsVipAssetId'])}</div>
                                    </div>
                                    {/* AmcValue */}
                                    <div className="mb-1 col-6">
                                        <div className="col-md-12">
                                            <label className='red-asterisk'>{t('create_assets_label_amc_value')}</label>
                                            <input name="AmcValue" onChange={onUpdateField} type="text" className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['AmcValue'])}</div>
                                        </div>
                                    </div>
                                    {/* IsOutsourcingNeededId */}
                                    <div className="mb-1 col-6">
                                        <label className='red-asterisk'>{t('create_assets_label_is_outsourcing_needed')}</label>
                                        <select name="IsOutsourcingNeededId" onChange={onUpdateField} className="form-select">
                                            <option value={-1} selected>
                                                {t('create_assets_select_is_outsourcing_needed')}
                                            </option>
                                            <option value="1">{t('create_assets_select_is_outsourcing_needed_yes')}</option>
                                            <option value="0">{t('create_assets_select_is_outsourcing_needed_no')}</option>
                                        </select>
                                        <div className="small text-danger"> {t(errors['IsOutsourcingNeededId'])}</div>
                                    </div>
                                    {/* AssetCondition */}
                                    <div className="col-6">
                                        <label className='red-asterisk'>{t('create_assets_label_asset_condition')}</label>
                                        <Select
                                            value={masterData.ProductPreAmcCondition && masterData.ProductPreAmcCondition.find(option => option.value == assets.AssetConditionId) || null}
                                            options={masterData.ProductPreAmcCondition}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "AssetConditionId")}
                                            isSearchable
                                            name="AssetConditionId"
                                            placeholder="Select option"
                                        />
                                        <div className="small text-danger"> {t(errors['AssetConditionId'])}</div>
                                    </div>
                                    {/* IsPreventiveMaintenanceNeededId */}
                                    <div className="mb-1 col-6">
                                        <label className='red-asterisk'>{t('create_assets_label_is_preventive_maintenance_needed')}</label>
                                        <select name="IsPreventiveMaintenanceNeededId" onChange={onUpdateField} className="form-select">
                                            <option value={-1} selected>
                                                {t('create_assets_select_is_preventive_maintenance_needed')}
                                            </option>
                                            <option value={1}>{t('create_assets_select_is_preventive_maintenance_needed_yes')}</option>
                                            <option value={0}>{t('create_assets_select_is_preventive_maintenance_needed_no')}</option>
                                        </select>
                                        <div className="small text-danger"> {t(errors['IsPreventiveMaintenanceNeededId'])}</div>
                                    </div>
                                    {/* PreventiveMaintenanceFrequency */}
                                    {assets.IsPreventiveMaintenanceNeededId == 1 && (
                                        <div className="col-6">
                                            <label className='red-asterisk'>{t('create_assets_label_preventive_maintenance_frequency')}</label>
                                            <Select
                                                value={masterData.PreventiveMaintenanceFrequency && masterData.PreventiveMaintenanceFrequency.find(option => option.value == assets.PreventiveMaintenanceFrequencyId) || null}
                                                options={masterData.PreventiveMaintenanceFrequency}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "PreventiveMaintenanceFrequencyId")}
                                                isSearchable
                                                name="PreventiveMaintenanceFrequencyId"
                                                placeholder="Select option"
                                            />
                                            <div className="small text-danger"> {t(errors['PreventiveMaintenanceFrequencyId'])}</div>
                                        </div>
                                    )}

                                    {/* ProductSupportType */}
                                    <div className='mb-1 col-6'>
                                        <label className="red-asterisk">{t('create_assets_label_asset_support_type')}</label>
                                        <Select
                                            value={masterData.ProductSupportType && masterData.ProductSupportType.find(option => option.value == assets.AssetSupportTypeId) || null}
                                            options={masterData.ProductSupportType}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "AssetSupportTypeId")}
                                            isSearchable
                                            name="AssetSupportTypeId"
                                            placeholder="Select option"
                                        />
                                        <div className="small text-danger"> {t(errors['AssetSupportTypeId'])}</div>
                                    </div>
                                    {/* IsPreAmcCompleted */}
                                    <div className="mb-1 col-6">
                                        <label className='red-asterisk'>{t('create_assets_label_is_pre_amc_completed')}</label>
                                        <select name="IsPreAmcCompleted" onChange={onUpdateField} className="form-select">
                                            <option value={-1} selected>{t('create_assets_select_is_pre_amc_completed')}</option>
                                            <option value={0}>{t('create_assets_select_is_pre_amc_completed_no')}</option>
                                            <option value={1}>{t('create_assets_select_is_pre_amc_completed_yes')}</option>
                                        </select>
                                        <div className="small text-danger"> {t(errors['IsPreAmcCompleted'])}</div>
                                    </div>
                                    {/* PreAmcCompletedDate */}
                                    {assets.IsPreAmcCompleted == 1 && (
                                        <>
                                            <div className="mb-1 mt-1 col-6">
                                                <label className='red-asterisk'>{t('create_assets_label_pre_amc_completeddate')}</label>
                                                <input type="date" name="PreAmcCompletedDate" onChange={onUpdateField} className="form-control"></input>
                                                <div className="small text-danger"> {t(errors['PreAmcCompletedDate'])}</div>
                                            </div>
                                            {/* PreAmcCompletedBy */}
                                            <div className="mb-1 mt-1 col-6">
                                                <label className="red-asterisk">{t('update_assets_label_choose_engineer')}</label>
                                                <Select
                                                    options={masterData.ServiceEngineers}
                                                    value={masterData.ServiceEngineers && masterData.ServiceEngineers.find(option => option.value == assets.PreAmcCompletedBy) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PreAmcCompletedBy")}
                                                    isSearchable
                                                    classNamePrefix="react-select"
                                                    name="PreAmcCompletedBy"
                                                    placeholder="Select"
                                                />
                                                <div className="small text-danger"> {t(errors["PreAmcCompletedBy"])}</div>
                                            </div>
                                        </>
                                    )}
                                    {/* WarrantyEndDate */}
                                    <div className="col-6">
                                        <label>{t('create_assets_label_asset_warranty_end_date')}</label>
                                        <input
                                            value={assets.WarrantyEndDate ? assets.WarrantyEndDate : "---"}
                                            name="WarrantyEndDate" onChange={onUpdateField} type="date" className="form-control"></input>
                                    </div>
                                    {/* AmcStartDate */}
                                    <div className="col-md-6">
                                        <label className='red-asterisk'>{t('create_assets_label_asset_amc_start_date')}</label>
                                        <input
                                            //value={assets.AmcStartDate ? assets.AmcStartDate.split('T')[0] : ""} 
                                            name="AmcStartDate" onChange={onUpdateField} type="date" className="form-control"></input>
                                        <div className="small text-danger"> {t(errors['AmcStartDate'])}</div>
                                    </div>
                                    {/* AmcEndDate */}
                                    <div className="col-md-6">
                                        <label className='red-asterisk'>{t('create_assets_label_asset_amc_end_date')}</label>
                                        <input
                                            //value={assets.AmcEndDate ? assets.AmcEndDate.split('T')[0] : ""}
                                            name="AmcEndDate" onChange={onUpdateField} type="date" className="form-control"></input>
                                        <div className="small text-danger"> {t(errors['AmcEndDate'])}</div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {/* IsPreAmcCompleted */}
                                    <div className="mb-1">
                                        <label className='red-asterisk'>{t('create_assets_label_is_pre_amc_completed')}</label>
                                        <select name="IsPreAmcCompleted" onChange={onUpdateField} className="form-select" value={selectedValue}>
                                            <option value={0}>{t('create_assets_select_is_pre_amc_completed_no')}</option>
                                            <option value={1}>{t('create_assets_select_is_pre_amc_completed_yes')}</option>
                                        </select>
                                        <div className="small text-danger"> {t(errors['IsPreAmcCompleted'])}</div>
                                    </div>
                                    {/* PreAmcCompletedDate */}
                                    {assets.IsPreAmcCompleted == 1 && (
                                        <>
                                            <div className="mb-1 mt-1">
                                                <label className='red-asterisk'>{t('create_assets_label_pre_amc_completeddate')}</label>
                                                <input type="date" value={assets.PreAmcCompletedDate?.split("T")[0] ?? ""} name="PreAmcCompletedDate" onChange={onUpdateField} className="form-control"></input>
                                                <div className="small text-danger"> {t(errors['PreAmcCompletedDate'])}</div>
                                            </div>
                                            {/* PreAmcCompletedBy */}
                                            <div className="mb-1 mt-1 col">
                                                <label className="red-asterisk">{t('update_assets_label_choose_engineer')}</label>
                                                <Select
                                                    options={masterData.ServiceEngineers}
                                                    value={masterData.ServiceEngineers && masterData.ServiceEngineers.find(option => option.value == assets.PreAmcCompletedBy) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PreAmcCompletedBy")}
                                                    isSearchable
                                                    classNamePrefix="react-select"
                                                    name="PreAmcCompletedBy"
                                                    placeholder="Select"
                                                />
                                                <div className="small text-danger"> {t(errors["PreAmcCompletedBy"])}</div>
                                            </div>
                                        </>
                                    )}
                                </div>)}
                            {interimAssetDetails.IsProductCountExceeded && (
                                <div className="alert alert-warning p-2 mt-2 rounded-0" role="alert">
                                    <div>
                                        <span className="material-symbols-outlined align-bottom">warning</span>&nbsp;
                                        <span className="fw-bold">Warning</span>
                                    </div>
                                    <p>{t('interim_request_review_confirmation_warning')}</p>
                                </div>
                            )}
                        </>
                    )}
                    {/* Asset Input Details Ends*/}

                    {/* Update Status buttons */}
                    {!interimAssetDetails.IsProductCountExceeded && (
                        InterimCallApproval.ReviewStatus == "1" ? (
                            <button type='button' className="btn text-white app-primary-bg-color mt-3 w-100" disabled={interimAssetDetails.IsProductCountExceeded} onClick={() => submitReview()}>
                                {t('interim_request_update_status_button_approve')}
                            </button>
                        ) : InterimCallApproval.ReviewStatus == "0" && (
                            <button type='button' className="btn text-white app-primary-bg-color mt-3 w-100" onClick={() => submitReview()}>
                                {t('interim_request_update_status_button_reject')}
                            </button>
                        )
                    )}
                    {/* Update Status buttons ends */}

                    {/* Information Modal */}
                    {displayInformationModal ? <InformationModal /> : ''}
                    {/* Information Modal Ends*/}
                </div>
            </div>
        </ContainerPage>
    )
}