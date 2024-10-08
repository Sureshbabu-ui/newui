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
import { InterimRequestReject, getFinanceInterimServiceRequestList, getInterimCallAssetDetails, getInterimServiceRequestDetails, interimCallFinanceApprove } from "../../../../../../services/serviceRequest";
import BreadCrumb from "../../../../../BreadCrumbs/BreadCrumb";
import { getValuesInMasterDataByTable } from "../../../../../../services/masterData";
import { loadServiceRequests } from "../../InterimRequestList/FinanceInterimRequestList/FinanceInterimRequestList.slice";

export const InterimFinanceReview = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const { ServiceRequestId } = useParams<{ ServiceRequestId: string }>();
    const {
        financeinterimservicerequestlist: { filters, searchWith },
        interimrequestreview: { displayInformationModal, InterimCallReject, InterimCallApproval, errors, assets, interimAssetDetails, interimServiceRequestDetails },
    } = useStoreWithInitializer(({ interimrequestreview, financeinterimservicerequestlist }) => ({ interimrequestreview, financeinterimservicerequestlist }), onLoad);
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

    const submitReview = async () => {
        store.dispatch(updateErrors({}))
        try {
            await RejectvalidationSchema.validate({ ReviewStatus: assets.ReviewStatus }, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
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
        store.dispatch(stopPreloader());
    }

    const PendingInterimCallApproval = async () => {
        store.dispatch(updateErrors({}))
        try {
            await RejectvalidationSchema.validate({ ReviewStatus: InterimCallApproval.ReviewStatus }, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            console.log(errors);

            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await interimCallFinanceApprove(InterimCallApproval)
        result.match({
            ok: () => {
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
                {assets.ReviewStatus == "1" ? "Interim Service Request Approved Successfully" : "Interim Service Request Rejected Successfully"}
            </SweetAlert>
        );
    }

    const updateServiceRequest = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getFinanceInterimServiceRequestList(searchWith, 1, filters);
        store.dispatch(loadServiceRequests(result));
        history.push('/finance/interimcalls')
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

        } catch (error) {
            console.error(error);
        }
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

                    {/* Update Status buttons */}
                    {InterimCallApproval.ReviewStatus == "1" ? (
                        <button type='button' className="btn text-white app-primary-bg-color mt-3 w-100" onClick={() => PendingInterimCallApproval()}>
                            {t('interim_request_update_status_button_approve')}
                        </button>
                    ) : InterimCallApproval.ReviewStatus == "0" && (
                        <button type='button' className="btn text-white app-primary-bg-color mt-3 w-100" onClick={() => submitReview()}>
                            {t('interim_request_update_status_button_reject')}
                        </button>
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