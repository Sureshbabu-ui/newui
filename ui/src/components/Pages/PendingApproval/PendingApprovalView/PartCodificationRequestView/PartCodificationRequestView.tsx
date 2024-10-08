import { store } from '../../../../../state/store';
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { convertBackEndErrorsToValidationErrors, formatDateTime, formatSelectInput } from '../../../../../helpers/formats';
import { initializePartRequestDetails, loadReviewDetails, setReviewDetails, updateErrors, updateReviewStatus } from './PartCodificationRequestView.slice';
import { useEffect, useState } from 'react';
import { getAllApprovalRequests, getClickedPartPendingDetails} from '../../../../../services/approval';
import { loadSelectedApproval, toggleApproveModalStatus, toggleRejectModalStatus } from './PartCodificationRequestView.slice';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';
import * as yup from 'yup';
import { PartApprovalDetail } from '../../../../../types/pendingApproval';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { rejectApprovalRequest } from '../../../../../services/bank';
import SweetAlert from 'react-bootstrap-sweetalert';
import { loadApprovalEventNames, loadApprovals } from '../../PendingApprovalList/PendingApprovals.slice';
import { approvePart } from '../../../../../services/part';
import { getApprovalEventNames } from '../../../../../services/ApprovalWorkflow/approvalEvent';

export const PartCodificationRequestView = () => {
    const { t } = useTranslation();
    const STATUS_APPROVED = "ARS_APRV"
    const STATUS_REJECT = "ARS_RJTD"

    const [isExpanded, setIsExpanded] = useState(true);
    const onLoad = async () => {
        if (Number(store.getState().approvalsmanagement.approvalRequestDetailId) > 0) {
            try {
                const result = await getClickedPartPendingDetails(store.getState().approvalsmanagement.approvalRequestDetailId ?? 0, store.getState().approvalsmanagement.selectedApprovalEvent)
                store.dispatch(loadSelectedApproval(result));
                result.ReviewComment &&
                    store.dispatch(loadReviewDetails(JSON.parse(result?.ReviewComment)));
            } catch (error) {
                console.error(error);
            }
        }
    }
    const { partcodificationrequestview: { selectedApprovals, errors, ReviewStatus, ReviewDetails, ReviewedJsonDetails, approveModalStatus, rejectModalStatus } } = useStoreWithInitializer(({ partcodificationrequestview }) => ({ partcodificationrequestview }), onLoad);

    if (selectedApprovals && selectedApprovals.Content) {
        var parsedReviewDetails = selectedApprovals.ReviewComment && JSON.parse(selectedApprovals?.ReviewComment);
    }
    const [parsedSelectedApprovals, setParsedSelectedApprovals] = useState<any>();

    useEffect(() => {
        setParsedSelectedApprovals(selectedApprovals.Content && JSON.parse(selectedApprovals?.Content))
    }, [selectedApprovals])

    useEffect(() => {
        store.dispatch(setReviewDetails({ name: "HsnCode", value: parsedSelectedApprovals?.HsnCode }));
        store.dispatch(setReviewDetails({ name: "OemPartNumber", value: parsedSelectedApprovals?.OemPartNumber }));
    }, [parsedSelectedApprovals])

    const onModalClose = () => {
        store.dispatch(initializePartRequestDetails())
    }

    function handleCheckbox(ev: any) {
        var value = ev.target.value;
        store.dispatch(updateReviewStatus(value))
    }

    const onUpdateField = (ev: any) => {
        store.dispatch(setReviewDetails({ name: ev.target.name, value: ev.target.value }));
    };

    const validationSchema = yup.object().shape({
        ReviewStatus: yup.string().required('validation_error_partcodificationrequestview_reviewstatus_required'),
        HsnCode: yup.string()
        .when('ReviewStatus', (ReviewStatus, schema) =>
        String(ReviewStatus) == STATUS_APPROVED
            ? schema
              .required(
                t('validation_error_partcodificationrequestview_hsncode_required') ?? '')
            : schema.nullable()
        ),
        OemPartNumber: yup.string()
        .when('ReviewStatus', (ReviewStatus, schema) =>
        String(ReviewStatus) == STATUS_APPROVED
            ? schema
              .required(
                t('validation_error_partcodificationrequestview_oempartnumber_required') ?? '')
            : schema.nullable()
        )
    });

    const submitReview = async (reviewDetails: PartApprovalDetail) => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(ReviewDetails, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            console.log(errors)
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        if (ReviewStatus == STATUS_APPROVED) {
            var contentParsed = JSON.parse(reviewDetails.Content);
            contentParsed.CaseId = '';
            contentParsed.CreatedOn = reviewDetails.CreatedOn;
            contentParsed.CreatedBy = reviewDetails.CreatedBy;
            contentParsed.ApprovalFlowId = reviewDetails.Id;
            const FetchTime = reviewDetails.FetchTime ?? '';
            var result = await approvePart(contentParsed, FetchTime, ReviewDetails, ReviewStatus);
            result.match({
                err: (e) => {
                    const errorMessages = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(errorMessages));
                },
                ok: ({ IsApproved }) => {
                    if (IsApproved)
                        store.dispatch(toggleApproveModalStatus());
                },
            });
        }
        else if (ReviewStatus == STATUS_REJECT) { 
           // var Comment = ReviewedJsonDetails[0]?.CreatedOn == null ? [ReviewDetails] : [ReviewDetails, ...ReviewedJsonDetails]
            const result = await rejectApprovalRequest(reviewDetails.Id, ''); 
            result.match({
                err: (e) => {
                    const errorMessages = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(errorMessages));
                },
                ok: () => {
                    store.dispatch(toggleRejectModalStatus());
                }
            });
        }
        store.dispatch(stopPreloader());
    }

    function ApproveInformationModal() {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={redirectAfterApproval}>
                {t('partcodificationrequestview_title_approved')}
            </SweetAlert>
        );
    }

    function RejectInformationModal() {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={redirectAfterRejection}>
                {t('partcodificationrequestview_title_rejected')}
            </SweetAlert>
        );
    }
    const redirectAfterApproval = async () => {
        try {
            store.dispatch(toggleApproveModalStatus())
            const events = await getApprovalEventNames();
            const FilteredEvents = await formatSelectInput(events.ApprovalEvents, "EventName", "EventCode")
            store.dispatch(loadApprovalEventNames({ MasterData: FilteredEvents }));
            const currentPage = store.getState().approvalsmanagement.currentPage;
            const tableName = store.getState().approvalsmanagement.selectedApprovalEvent;
            const pendingApprovalDeatails = await getAllApprovalRequests(currentPage, tableName);
            store.dispatch(loadApprovals(pendingApprovalDeatails));
        } catch (error) {
            console.error(error);
        }
        onModalClose()
        document.getElementById('closeViewPendingRequest')?.click();
    }

    const redirectAfterRejection = async () => {
        store.dispatch(toggleRejectModalStatus());
        try {
            const events = await getApprovalEventNames();
            const FilteredEvents = await formatSelectInput(events.ApprovalEvents, "EventName", "EventCode")
            store.dispatch(loadApprovalEventNames({ MasterData: FilteredEvents }));
            const currentPage = store.getState().approvalsmanagement.currentPage;
            const tableName = store.getState().approvalsmanagement.selectedApprovalEvent;
            const pendingApprovalDeatails = await getAllApprovalRequests(currentPage, tableName);
            store.dispatch(loadApprovals(pendingApprovalDeatails));
        } catch (error) {
            console.error(error);
        }
        onModalClose()
        document.getElementById('closeViewPendingRequest')?.click();
    }

    return (
        <ContainerPage>
            <>
                {selectedApprovals.Id !== 0 && (
                    <>
                        <div className=" row">
                            <strong>{t('partcodificationrequestview_helper_text_bold')}</strong>
                            <p>{t('partcodificationrequestview_helper_text')}
                            </p>
                        </div>
                        <div className={`row ${isExpanded ? 'expanded-row' : 'collapsed-row'}`}>
                            <div className='border-bottom p-2'>
                                <div className="row pt-2">
                                    <label className="form-text">{t('partcodificationrequestview_label_partname')}</label>
                                    <div >{parsedSelectedApprovals?.PartName}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('partcodificationrequestview_label_productcategoryname')}</label>
                                    <div >{selectedApprovals.ProductCategoryName} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('partcodificationrequestview_label_partcategoryname')}</label>
                                    <div >{selectedApprovals.PartCategoryName} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('partcodificationrequestview_label_partsubcategoryname')}</label>
                                    <div >{selectedApprovals.PartSubCategoryName} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('partcodificationrequestview_label_makename')}</label>
                                    <div >{selectedApprovals.MakeName} </div>
                                </div>
                            </div>
                            <div className='border-bottom p-2'>
                                <div className='row pt-2'>
                                    <div className="col-md-6">
                                        <label className="form-text">{t('partcodificationrequestview_label_createdby')}</label>
                                        <div >{selectedApprovals.CreatedUserName}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-text">{t('partcodificationrequestview_label_createdon')}</label>
                                        <div >{formatDateTime(selectedApprovals.CreatedOn)}</div>
                                    </div>
                                </div>
                                <div className='row pt-2'>
                                    {selectedApprovals.ReviewedUserName !== null && (
                                        <div className="col-md-6">
                                            <label className="form-text">{t('partcodificationrequestview_label_reviewedby')}</label>
                                            <div >{selectedApprovals.ReviewedUserName}</div>
                                        </div>
                                    )}
                                    {selectedApprovals.ReviewedOn !== null && (
                                        <div className="col-md-6">
                                            <label className="form-text">{t('partcodificationrequestview_label_reviewedon')}</label>
                                            <div >{formatDateTime(selectedApprovals.ReviewedOn)}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {selectedApprovals.ReviewComment !== null && (
                                <div className="row pt-2">
                                    <label className='app-primary-color'><strong>{t('partcodificationrequestview_label_review_comment')}</strong></label>
                                    <>
                                        {parsedReviewDetails.map((reviewDetails, index) => (
                                            <div className="mb-2" key={index}>
                                                {reviewDetails.ReviewComment ? reviewDetails.ReviewComment : "No Comment"}
                                                <div>
                                                    <span className='small me-2'>{formatDateTime(reviewDetails.CreatedOn)}</span>
                                                    <span className='small'>{reviewDetails.ReviewedBy}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                </div>
                            )}
                        </div>
                        <div>
                            <a className='float-end pseudo-link'
                                onClick={() => setIsExpanded(!isExpanded)}
                            >{isExpanded ? t('approvalrequest_view_collapse') : t('approvalrequest_view_expand')}</a>
                        </div>
                        {(selectedApprovals.ReviewStatus !== "" && !['ARS_CAND', 'ARS_RJTD', 'ARS_APRV'].includes(selectedApprovals.ReviewStatus)) && selectedApprovals.CreatedBy !== store.getState().app.user.unwrap().user[0].Id && (
                            <>
                                {selectedApprovals.ReviewStatus !== 'ARS_RJTD' && (
                                    <div className='row mt-1 pe-0'>
                                        <ValidationErrorComp errors={errors} />
                                        <div className='row ms-0 pe-0'>
                                            <label className='ps-0'>{t('partcodificationrequestview_label_hsncode')}</label>
                                            <input
                                                value={ReviewDetails.HsnCode??''}
                                                className={`form-control ${errors["HsnCode"] ? "is-invalid" : ""}`}
                                                name="HsnCode"
                                                onChange={onUpdateField}
                                            ></input>
                                            <div className="invalid-feedback mb-2 ps-0 ">{errors["HsnCode"]}</div>
                                        </div>
                                        <div className='row ms-0 pe-0 mt-2'>
                                            <label className='ps-0'>{t('partcodificationrequestview_label_oempartnumber')}</label>
                                            <input
                                                value={ReviewDetails.OemPartNumber??''}
                                                className={`form-control ${errors["OemPartNumber"] ? "is-invalid" : ""}`}
                                                name="OemPartNumber"
                                                maxLength={128}
                                                onChange={onUpdateField}
                                            ></input>
                                            <div className="invalid-feedback mb-2 ps-0 ">{errors["OemPartNumber"]}</div>
                                        </div>
                                        <div className='row ms-0 pe-0'>
                                            <label className='ps-0 mt-2'>{t('partcodificationrequestview_label_review_comment')}</label>
                                            <textarea
                                                value={ReviewDetails.ReviewComment}
                                                className="form-control"
                                                rows={3}
                                                name="ReviewComment"
                                                maxLength={128}
                                                onChange={onUpdateField}
                                            ></textarea>
                                            <div className="invalid-feedback mb-2 ps-0 ">{errors["ReviewComment"]}</div>
                                        </div>
                                        <div className='mb-1 row'>
                                            <div className="text-danger smal mb-2 mt-2">
                                                {t(errors['ReviewStatus'])}
                                            </div>
                                            <div>
                                                <div>
                                                    <input
                                                        className={`form-check-input ${errors["ReviewStatus"] ? "is-invalid" : ""}`}
                                                        type="radio"
                                                        onChange={handleCheckbox}
                                                        value={STATUS_APPROVED}
                                                        name="ReviewStatus"
                                                    />
                                                    <label className="form-check-label fw-bold ms-1">{t('partcodificationrequestview_label_approve')}</label>
                                                </div>
                                                <div className="ms-3 text-muted">
                                                    <small>{t('partcodificationrequestview_approve_helptext')}</small>
                                                </div>
                                            </div>
                                            <div className='mb-1 m-0'>
                                                <input
                                                    className={`form-check-input ${errors["ReviewStatus"] ? "is-invalid" : ""}`}
                                                    type="radio"
                                                    onChange={handleCheckbox}
                                                    value={STATUS_REJECT}
                                                    name="ReviewStatus"
                                                />
                                                <label className="form-check-label fw-bold ms-1">{t('partcodificationrequestview_label_reject')}</label>
                                            </div>
                                            <div className="ms-3 text-muted">
                                                <small>{t('partcodificationrequestview_reject_helptext')}</small>
                                            </div>
                                        </div>
                                        <div className='row ms-0 pe-0 mb-2'>
                                            <button type='button' disabled={selectedApprovals.ReviewStatus == 'ARS_RJTD' && true} className="btn text-white app-primary-bg-color pe-0"
                                                onClick={() => submitReview(selectedApprovals)}
                                            >
                                                {t('partcodificationrequestview_button_submit')}
                                            </button>
                                        </div>
                                        {approveModalStatus ? <ApproveInformationModal /> : ''}
                                        {rejectModalStatus ? <RejectInformationModal /> : ''}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </>
        </ContainerPage>
    )
}