import { t } from 'i18next'
import { useState } from 'react'
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { loadApproverDetails, loadReviewDetails, loadContractMandatoryDetails, setReviewComment, toggleApprovalModalStatus, updateErrors, updateReviewStatus } from './RequestApproval.slice';
import { store } from '../../../../../../state/store';
import { submitContractApprovalRequest, getContractApproverDetails, submitContractApprove, submitContractReject, submitContractRequestChange, getContractDetailsReview } from '../../../../../../services/contractApprovalRequest';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useParams, useHistory } from 'react-router-dom';
import { getClickedContractDetails } from '../../../../../../services/contracts';
import { loadContracts } from '../../General.slice';
import { setContractStatus } from '../../../../ContractView/ContractView.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../../../../ValidationErrors/ValidationError';
import FeatherIcon from 'feather-icons-react';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import ContractReviewDetails from './ReviewDetails';
import { convertBackEndErrorsToValidationErrors } from '../../../../../../helpers/formats';
import BreadCrumb from '../../../../../BreadCrumbs/BreadCrumb';

const RequestApproval = () => {
    const { ApproverDetails, ReviewDetails, ReviewStatus, ReviewedJsonDetails, ContractMandatoryDetails, ApprovalModalStatus, errors } = useStoreWithInitializer(({ contractapprovalrequest }) => (contractapprovalrequest), onLoad)
    const { ContractId } = useParams<{ ContractId: string }>();
    const history = useHistory()
    const [approveStatus, setApproveStatus] = useState("");
    const STATUS_APPROVED = "CTS_APRV"
    const STATUS_REJECT = "CTS_RJTD"
    const STATUS_BOOKING_PROGRESS = "CTS_PGRS"

    async function onLoad() {
        try {
            const result = await getClickedContractDetails(ContractId);
            store.dispatch(loadContracts(result));
            const { ApproversDetails } = await getContractApproverDetails(result.ContractDetails.TenantOfficeId, store.getState().generalcontractdetails.singlecontract.RenewContractId == null ? false : true);
            store.dispatch(loadApproverDetails(ApproversDetails))
            result.ContractDetails.ReviewComment ? await store.dispatch(loadReviewDetails(JSON.parse(result.ContractDetails.ReviewComment))) : ""
            const { ReviewedDetails } = await getContractDetailsReview(ContractId)
            store.dispatch(loadContractMandatoryDetails(ReviewedDetails))
        } catch (error) {
            console.error(error);
        }
    }

    function handleCheckbox(ev: any) {
        var value = ev.target.value
        store.dispatch(updateReviewStatus(value))
    }

    // Request for Approval
    const requestApproval = async () => {
        setApproveStatus("ApprovalRequest")
        store.dispatch(startPreloader());
        await manageContractApprovalWorkflow()
        store.dispatch(stopPreloader());
    }

    // Contract Approval Request Submit
    const submitContractForApproval = async (ApproverId: number, ColumnName: string, ApproverEmail: string, ApproverName: string) => {
        var reviewDetails = await ReviewedJsonDetails[0]?.CreatedOn == null ? [ReviewDetails] : [ReviewDetails, ...ReviewedJsonDetails]
        const result = await submitContractApprovalRequest(ContractId, ApproverId, ApproverEmail, ApproverName, ColumnName, ColumnName === "SecondApproverId" ? store.getState().contractapprovalrequest.ReviewedJsonDetails : reviewDetails)
        result.match({
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
            ok: () => {
                store.dispatch(toggleApprovalModalStatus());
            },
        });
    }

    // Contarct Approval Status Change
    const manageContractApprovalWorkflow = async () => {
        if ((store.getState().generalcontractdetails.singlecontract.FirstApprovedOn != null) && (store.getState().generalcontractdetails.singlecontract.SecondApprovedOn != null)) {
            store.dispatch(toggleApprovalModalStatus());
        }
        else {
            if (store.getState().generalcontractdetails.singlecontract.FirstApprovedOn == null) {
                await submitContractForApproval(ApproverDetails.FirstApproverId, "FirstApproverId", ApproverDetails.FirstApproverEmail, ApproverDetails.FirstApprover)
            } else if (store.getState().generalcontractdetails.singlecontract.SecondApprovedOn == null) {
                await submitContractForApproval(ApproverDetails.SecondApproverId, "SecondApproverId", ApproverDetails.SecondApproverEmail, ApproverDetails.SecondApprover)
            }
        }
    }

    const validationSchema = yup.object().shape({
        ReviewStatus: yup.string().required(t('validation_error_contract_approval_request_review_reviewstatus_required') ?? ''),
    });

    // Contarct Review (Approve/Reject/Request Change)
    const reviewSubmitedContract = async (ColumnName: string) => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate({ ReviewStatus }, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        if (ReviewStatus == STATUS_APPROVED) {
            var reviewDetails = ReviewedJsonDetails[0]?.CreatedOn == null ? [ReviewDetails] : [ReviewDetails, ...ReviewedJsonDetails]
            const result = await submitContractApprove(ContractId, ColumnName, reviewDetails)
            result.match({
                err: async (e) => {
                    const errorMessages = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(errorMessages));
                },
                ok: async ({ IsContractApproved }) => {
                    setApproveStatus("Approved")
                    const result = await getClickedContractDetails(ContractId);
                    await store.dispatch(setContractStatus(result.ContractDetails.ContractStatusCode))
                    store.dispatch(loadContracts(result));
                    result.ContractDetails.ReviewComment ? await store.dispatch(loadReviewDetails(JSON.parse(result.ContractDetails.ReviewComment))) : ""
                    if (IsContractApproved) {
                        await manageContractApprovalWorkflow()
                    }
                },
            });
        }
        else if (ReviewStatus == STATUS_REJECT) {
            var reviewDetails = ReviewedJsonDetails[0]?.CreatedOn == null ? [ReviewDetails] : [ReviewDetails, ...ReviewedJsonDetails]
            const result = await submitContractReject(ContractId, reviewDetails)
            result.match({
                err: async (e) => {
                    const errorMessages = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(errorMessages));
                },
                ok: async ({ IsContractRejected }) => {
                    setApproveStatus("Rejected")
                    const result = await getClickedContractDetails(ContractId);
                    await store.dispatch(setContractStatus(result.ContractDetails.ContractStatusCode))
                    store.dispatch(loadContracts(result));
                    result.ContractDetails.ReviewComment ? await store.dispatch(loadReviewDetails(JSON.parse(result.ContractDetails.ReviewComment))) : ""
                    store.dispatch(toggleApprovalModalStatus());
                },
            });
        }
        else if (ReviewStatus == STATUS_BOOKING_PROGRESS) {
            var reviewDetails = ReviewedJsonDetails[0]?.CreatedOn == null ? [ReviewDetails] : [ReviewDetails, ...ReviewedJsonDetails]
            const result = await submitContractRequestChange(ContractId, reviewDetails)
            result.match({
                err: async (e) => {
                    const errorMessages = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(errorMessages));
                },
                ok: async ({ IsContractChangeRequested }) => {
                    setApproveStatus("RequestChange")
                    const result = await getClickedContractDetails(ContractId);
                    await store.dispatch(setContractStatus(result.ContractDetails.ContractStatusCode))
                    store.dispatch(loadContracts(result));
                    result.ContractDetails.ReviewComment ? await store.dispatch(loadReviewDetails(JSON.parse(result.ContractDetails.ReviewComment))) : ""
                    store.dispatch(toggleApprovalModalStatus());
                },
            });
        }
    }

    //Contract Review Submit 
    const submitContractReview = async () => {
        store.dispatch(startPreloader());
        if (store.getState().generalcontractdetails.singlecontract.FirstApprovedOn == null && store.getState().generalcontractdetails.singlecontract.FirstApproverId == store.getState().app.user.unwrap().user[0].Id) {
            await reviewSubmitedContract("FirstApprovedOn")
        } else if (store.getState().generalcontractdetails.singlecontract.SecondApprovedOn == null && store.getState().generalcontractdetails.singlecontract.SecondApproverId == store.getState().app.user.unwrap().user[0].Id) {
            await reviewSubmitedContract("SecondApprovedOn")
        }
        store.dispatch(stopPreloader());
    }

    function ApproveInformationModal() {
        return (
            <SweetAlert success title='Success' onConfirm={modalRedirect}>
                {approveStatus == "ApprovalRequest" ? t('contract_approval_request_success') : approveStatus == "Approved" ? t('contract_approval_request_approved') : approveStatus == "Rejected" ? t('contract_approval_request_rejected') : approveStatus == "RequestChange" ? t('contract_approval_request_request_change') : ""}
            </SweetAlert>
        );
    }

    //Modal Confirm Redirect Information
    const modalRedirect = async () => {
        store.dispatch(setReviewComment(''))
        history.push(`/contracts/view/${ContractId}?Tab=DETAILS`)
        store.dispatch(toggleApprovalModalStatus());
        try {
            const result = await getClickedContractDetails(ContractId);
            await store.dispatch(setContractStatus(result.ContractDetails.ContractStatusCode))
            store.dispatch(loadContracts(result));
            result.ContractDetails.ReviewComment ? await store.dispatch(loadReviewDetails(JSON.parse(result.ContractDetails.ReviewComment))) : ""
        }
        catch (e) {
            console.log(e);
        }
    }

    const IsReviewable = ((store.getState().generalcontractdetails.singlecontract.FirstApprovedOn == null &&
        store.getState().generalcontractdetails.singlecontract.FirstApproverId == store.getState().app.user.unwrap().user[0].Id) ||
        (store.getState().generalcontractdetails.singlecontract.SecondApprovedOn == null &&
            store.getState().generalcontractdetails.singlecontract.SecondApproverId == store.getState().app.user.unwrap().user[0].Id))
    const contractMandatory = [
        { name: "IsMandatoryDetails", text: "Mandatory Contract Details", rightIcon: "check-circle", wrongIcon: "x-circle", details: "Customer,Accel Location,Start & End Dates,Contract Values,etc" },
        { name: "IsAssetSummary", text: "Asset Summary", rightIcon: "check-circle", wrongIcon: "x-circle", details: "Asset categories and its count" },
        { name: "IsManpower", text: "Manpower", rightIcon: "check-circle", wrongIcon: "x-circle", details: "Manpower distribution to customer locations" },
        { name: "IsContractDocuments", text: "Contract PO Document", rightIcon: "check-circle", wrongIcon: "x-circle", details: "Upload The necessary contract po details" },
        { name: "IsPaymentDetails", text: "Payment Details", rightIcon: "check-circle", wrongIcon: "x-circle", details: "Payment type, Allowed credit period " },

    ]
    const breadcrumbItems = [
        { Text: t('breadcrumbs_home'), Link: '/' },
        { Text: t('breadcrumbs_contracts'), Link: '/contracts' },
        { Text: t('breadcrumbs_contracts_booking_review') }
    ];
    return (
        <> <ContainerPage>
            <div className="mx-2 my-2">
                <BreadCrumb items={breadcrumbItems} />
            </div>
            {IsReviewable ? (
                <div className='ms-2 '>
                    <h5 className='modal-title fw-bold'>{t('contract_approval_request_review_title')}</h5>
                    <p>{t('contract_approval_request_review_description')}</p>
                </div>
            ) : (
                <div className='ms-2 '>
                    <h5 className='modal-title fw-bold'>{t('contract_approval_request_submit_for_review_title')}</h5>
                    <p>{t('contract_approval_request_submit_for_review_description')}</p>
                </div>
            )}
            {/* <div className='row'> */}
            <div className='col-md-8 ps-4'>
                <ValidationErrorComp errors={errors} />
                {IsReviewable ?
                    (
                        <div>
                            <ContractReviewDetails ApproverDetails={ApproverDetails} ReviewedJsonDetails={ReviewedJsonDetails} ReviewStatus={"SubmitReview"} />
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
                                        <label className="form-check-label fw-bold ms-1">{t('contract_approval_request_review_label_aprove')}</label>
                                        {/* checkbox & label ends */}
                                    </div>

                                    {/* helptext */}
                                    <div className="ms-3 text-muted">
                                        <small>{t('contract_approval_request_review_approve_helptext')}</small>
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
                                        <label className="form-check-label fw-bold ms-1">{t('contract_approval_request_review_label_reject')}</label>
                                        {/* checkbox & label ends */}
                                    </div>

                                    {/* helptext */}
                                    <div className="ms-3 text-muted">
                                        <small>{t('contract_approval_request_review_reject_helptext')}</small>
                                    </div>
                                    {/* helptext ends */}
                                </div>
                                {/* Reject option ends */}

                                {/* Request change option */}
                                <div>
                                    {/* checkbox & label */}
                                    <div>
                                        <input
                                            className={`form-check-input ${errors["ReviewStatus"] ? "is-invalid" : ""}`}
                                            type="radio"
                                            onChange={handleCheckbox}
                                            value={STATUS_BOOKING_PROGRESS}
                                            name="ReviewStatus"
                                        />
                                        <label className="form-check-label fw-bold ms-1">{t('contract_approval_request_review_label_request_change')}</label>
                                        {/* checkbox & label ends */}
                                    </div>

                                    {/* helptext */}
                                    <div className="ms-3 text-muted">
                                        <small>{t('contract_approval_request_review_request_change_helptext')}</small>
                                    </div>
                                    {/* helptext ends */}
                                </div>
                                {/* Request change option ends */}
                            </div>
                            {/* Update Status buttons */}
                            <button type='button' disabled={Object.values(ContractMandatoryDetails).includes(false) ? true : false} className="btn text-white app-primary-bg-color mt-2" onClick={() => submitContractReview()}>
                                {t('contract_approval_request_update_status_button')}
                            </button>
                            {/* Update Status buttons ends */}
                        </div>
                    ) : (
                        <>
                            {ApproverDetails.Location ? (
                                <>
                                    <ContractReviewDetails ApproverDetails={ApproverDetails} ReviewedJsonDetails={ReviewedJsonDetails} ReviewStatus={"RequestApproval"} />
                                    <button type='button' disabled={Object.values(ContractMandatoryDetails).includes(false) ? true : false} className="btn text-white app-primary-bg-color mt-2" onClick={() => requestApproval()}>
                                        {t('contract_approval_request_submit_for_review_button')}
                                    </button>
                                </>
                            ) : (
                                <div>
                                    {t('contract_approval_request_submit_for_review_noapprover_description')}
                                </div>
                            )}
                        </>
                    )}
                <>
                    {/* Information Modal */}
                    {ApprovalModalStatus ? <ApproveInformationModal /> : ""}
                    {/* Information Modal Ends*/}
                </>
            </div>
            <div className='col-md-4 ps-2 mt-2'>
                <p className='fw-bold mt-1'>{t('contract_approval_request_mandatory_details_title')}</p>
                <ul className="list-unstyled">
                    {contractMandatory.filter(item => !(
                        (['1', '2'].includes(store.getState().generalcontractdetails.singlecontract.AgreementTypeId.toString()) && item.name === "IsManpower") ||
                        (['3'].includes(store.getState().generalcontractdetails.singlecontract.AgreementTypeId.toString()) && item.name === "IsAssetSummary")
                    )).map((item, index) => (
                        <li key={index} className='mb-1'>
                            <div className="d-flex align-items-center">
                                <FeatherIcon
                                    className={`border border-light bg-light pseudo-link shadow-sm ${Object.entries(ContractMandatoryDetails).find(([key]) => key == item.name)?.[1] ? "text-success" : "text-danger"}`}
                                    icon={Object.entries(ContractMandatoryDetails).find(([key]) => key == item.name)?.[1] ? item.rightIcon : item.wrongIcon}
                                    size="20"
                                />
                                <span className="ms-2">{item.text}</span>
                            </div>
                            <div className='small ms-4'>{item.details}</div>
                        </li>
                    ))}
                </ul>
            </div>
            {/* </div> */}
        </ContainerPage ></>
    )
}

export default RequestApproval