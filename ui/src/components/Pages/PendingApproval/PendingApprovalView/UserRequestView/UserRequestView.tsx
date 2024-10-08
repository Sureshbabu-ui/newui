import { store } from '../../../../../state/store';
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { convertBackEndErrorsToValidationErrors, formatDate, formatDateTime, formatSelectInput } from '../../../../../helpers/formats';
import { initializeUserRequestDetails, setReviewDetails, toggleRequestChangeModalStatus, updateErrors, updateReviewStatus } from './UserRequestView.slice';
import { useEffect, useState } from 'react';
import { getAllApprovalRequests, getClickedUserApprovalDetails, } from '../../../../../services/approval';
import { loadSelectedApproval, toggleApproveModalStatus, toggleRejectModalStatus } from './UserRequestView.slice';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';
import * as yup from 'yup';
import { UserApprovalDetail } from '../../../../../types/pendingApproval';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { approvalRequestChange, rejectApprovalRequest } from '../../../../../services/bank';
import SweetAlert from 'react-bootstrap-sweetalert';
import { loadApprovals, loadApprovalEventNames} from '../../PendingApprovalList/PendingApprovals.slice';
import { approveUser } from '../../../../../services/users';
import { ApprovalRequestReviewList } from '../../../../ApprovalRequestReviewList/ApprovalRequestReviewList';
import { getApprovalEventNames } from '../../../../../services/ApprovalWorkflow/approvalEvent';

export const UserRequestView = () => {
    const { t } = useTranslation();
    const STATUS_APPROVED = "ARS_APRV"
    const STATUS_REJECT = "ARS_RJTD"
    const STATUS_REVIEW = "ARS_CAND"
    const [isExpanded, setIsExpanded] = useState(true);

    const onLoad = async () => {
        if (Number(store.getState().approvalsmanagement.approvalRequestDetailId) > 0) {
            try {
                const result = await getClickedUserApprovalDetails(store.getState().approvalsmanagement.approvalRequestDetailId ?? 0)
                store.dispatch(loadSelectedApproval(result));
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        onLoad()
    }, [store.getState().approvalsmanagement.approvalRequestDetailId])

    const { userrequestview: { selectedApprovals, errors, ReviewStatus, ReviewDetails, ReviewList, approveModalStatus, rejectModalStatus, requestChangeModalStatus, isApprovalNeeded } } = useStoreWithInitializer(({ userrequestview }) => ({ userrequestview }), onLoad);

    const onModalClose = () => {
        store.dispatch(initializeUserRequestDetails())
    }

    function handleCheckbox(ev: any) {
        var value = ev.target.value;
        store.dispatch(updateReviewStatus(value))
    }

    const onUpdateField = (ev: any) => {
        store.dispatch(setReviewDetails({ name: ev.target.name, value: ev.target.value }));
    };

    const validationSchema = yup.object().shape({
        ReviewStatus: yup.string().required('validation_error_userrequestview_reviewstatus_required'),
    });

    const submitReview = async (reviewDetails: UserApprovalDetail) => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(ReviewDetails, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        if (ReviewStatus == STATUS_APPROVED) {
            const FetchTime = reviewDetails.FetchTime ?? '';
            var result = await approveUser(reviewDetails.Id, FetchTime, ReviewDetails.ReviewComment);
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
            const result = await rejectApprovalRequest(reviewDetails.Id, ReviewDetails.ReviewComment);
            result.match({
                err: (e) => {
                    const errorMessages = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(errorMessages));
                },
                ok: () => {
                    store.dispatch(toggleRejectModalStatus());
                },
            });
        }
        else {
            const result = await approvalRequestChange(reviewDetails.Id, ReviewDetails.ReviewComment, ReviewStatus);
            result.match({
                err: (e) => {
                    const errorMessages = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(errorMessages));
                },
                ok: () => {
                    store.dispatch(toggleRequestChangeModalStatus());
                },
            });
        }
        store.dispatch(stopPreloader());
    }

    function ApproveInformationModal() {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={redirectAfterApproval}>
                {t('userrequestview_title_approved')}
            </SweetAlert>
        );
    }

    function RejectInformationModal() {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={redirectAfterRejection}>
                {t('userrequestview_title_rejected')}
            </SweetAlert>
        );
    }

    function RequestChangeInformationModal() {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={redirectAfterRequestChange}>
                {t('userrequestview_title_requestchanged')}
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
            const tableName = store.getState().approvalsmanagement.selectedApprovalEventCode;
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
            const tableName = store.getState().approvalsmanagement.selectedApprovalEventCode;
            const pendingApprovalDeatails = await getAllApprovalRequests(currentPage, tableName);
            store.dispatch(loadApprovals(pendingApprovalDeatails));
        } catch (error) {
            console.error(error);
        }
        onModalClose()
        document.getElementById('closeViewPendingRequest')?.click();
    }

    const redirectAfterRequestChange = async () => {
        store.dispatch(toggleRequestChangeModalStatus());
        try {
            const events = await getApprovalEventNames();
            const FilteredEvents = await formatSelectInput(events.ApprovalEvents, "EventName", "EventCode")
            store.dispatch(loadApprovalEventNames({ MasterData: FilteredEvents }));
            const currentPage = store.getState().approvalsmanagement.currentPage;
            const tableName = store.getState().approvalsmanagement.selectedApprovalEventCode;
            const pendingApprovalDeatails = await getAllApprovalRequests(currentPage, tableName);
            store.dispatch(loadApprovals(pendingApprovalDeatails));
        } catch (error) {
            console.error(error);
        }
        document.getElementById('closeViewPendingRequest')?.click();
    }

    return (
        <ContainerPage>
            <>
                {selectedApprovals.Id !== 0 && (
                    <>
                        {isApprovalNeeded && (
                            <div className=" row">
                                <strong>{t('userrequestview_helper_text_bold')}</strong>
                                <p>{t('userrequestview_helper_text')}
                                </p>
                            </div>
                        )}
                        <div className={`row ${isExpanded ? 'expanded-row' : 'collapsed-row'}`}>
                            <div className="preview-container">
                                <img src={selectedApprovals?.DocumentUrl} alt="Image Description" className="preview-img" />
                            </div>
                            <div className='border-bottom p-2'>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_name')}</label>
                                    <div >{selectedApprovals?.FullName}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_email')}</label>
                                    <div >{selectedApprovals?.Email}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_mobile')}</label>
                                    <div >{selectedApprovals?.Phone}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_gender')}</label>
                                    <div >{selectedApprovals?.Gender}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_engagementtype')}</label>
                                    <div >{selectedApprovals.EngagementType} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_department')}</label>
                                    <div >{selectedApprovals.Department} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_division')}</label>
                                    <div >{selectedApprovals.Division} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_reportingmanager')}</label>
                                    <div >{selectedApprovals.ReportingManager} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_designation')}</label>
                                    <div >{selectedApprovals.Designation} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_usergrade')}</label>
                                    <div >{selectedApprovals.UserGrade} </div>
                                </div>
                                {selectedApprovals?.ServiceEngineerLevel && (
                                    <>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_serviceengineerlevel')}</label>
                                            <div >{selectedApprovals?.ServiceEngineerLevel ?? ""} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_serviceengineertype')}</label>
                                            <div >{selectedApprovals?.ServiceEngineerType ?? ""} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_serviceengineercategory')}</label>
                                            <div >{selectedApprovals?.ServiceEngineerCategory ?? ""} </div>
                                        </div>
                                        {selectedApprovals?.ServiceEngineerCategory == "RE" &&
                                            <div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_customername')}</label>
                                                    <div >{selectedApprovals?.CustomerName ?? ""} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_contractnumber')}</label>
                                                    <div >{selectedApprovals?.ContractNumber ?? ""} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_customersite')}</label>
                                                    <div >{selectedApprovals?.CustomerSite ?? ""} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_budgetedamount')}</label>
                                                    <div >{selectedApprovals?.BudgetedAmount ?? ""}</div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_customeragreedamount')}</label>
                                                    <div >{selectedApprovals?.CustomerAgreedAmount ?? ""} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_startdate')}</label>
                                                    <div >{selectedApprovals?.StartDate ?formatDate(selectedApprovals.StartDate): ""} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_enddate')}</label>
                                                    <div >{selectedApprovals?.EndDate ? formatDate(selectedApprovals.EndDate):""} </div>
                                                </div>
                                            </div>}
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_country')}</label>
                                            <div >{selectedApprovals?.Country ?? ""} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_state')}</label>
                                            <div >{selectedApprovals?.State ?? ""} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_city')}</label>
                                            <div >{selectedApprovals?.City ?? ""} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_pincode')}</label>
                                            <div >{selectedApprovals?.EngineerPincode ?? ""} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_geolocation')}</label>
                                            <div >{selectedApprovals?.EngineerGeolocation ?? ""} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_enghomelocation')}</label>
                                            <div >{selectedApprovals?.EngineerAddress ?? ""} </div>
                                        </div>
                                    </>
                                )}
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_usercategory')}</label>
                                    <div >{selectedApprovals.UserCategory} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_location')}</label>
                                    <div >{selectedApprovals.Location} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_userrole')}</label>
                                    <div >{selectedApprovals.UserRole} </div>
                                </div>
                            </div>
                            <div className='border-bottom p-2'>
                                <div className='row pt-2'>
                                    <div className="col-md-6">
                                        <label className="form-text">{t('userrequestview_label_createdby')}</label>
                                        <div >{selectedApprovals.CreatedUserName}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-text">{t('userrequestview_label_createdon')}</label>
                                        <div >{formatDateTime(selectedApprovals.CreatedOn)}</div>
                                    </div>
                                </div>
                            </div>
                            <ApprovalRequestReviewList ReviewList={ReviewList} />
                        </div>
                        <div>
                            <a className='float-end pseudo-link'
                                onClick={() => setIsExpanded(!isExpanded)}
                            >{isExpanded ? t('approvalrequest_view_collapse') : t('approvalrequest_view_expand')}</a>
                        </div>
                        {(selectedApprovals.ReviewStatus !== "" && !['ARS_CAND', 'ARS_RJTD', 'ARS_APRV'].includes(selectedApprovals.ReviewStatus)) && isApprovalNeeded && (
                            <>
                                {selectedApprovals.ReviewStatus !== 'ARS_RJTD' && (
                                    <div className='row mt-1 pe-0'>
                                        <ValidationErrorComp errors={errors} />
                                        <div className='row ms-0 pe-0'>
                                            <label className='ps-0 mt-2'>{t('userrequestview_label_reviewcomment')}</label>
                                            <textarea
                                                value={ReviewDetails.ReviewComment}
                                                className="form-control"
                                                rows={3}
                                                name="ReviewComment"
                                                maxLength={128}
                                                onChange={onUpdateField}
                                            ></textarea>
                                            <div className="text-danger small mb-2 ps-0 ">{t(errors["ReviewComment"])}</div>
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
                                                    <label className="form-check-label fw-bold ms-1">{t('userrequestview_label_approve')}</label>
                                                </div>
                                                <div className="ms-3 text-muted">
                                                    <small>{t('userrequestview_approve_helptext')}</small>
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
                                                <label className="form-check-label fw-bold ms-1">{t('userrequestview_label_reject')}</label>
                                            </div>
                                            <div className="ms-3 text-muted">
                                                <small>{t('userrequestview_reject_helptext')}</small>
                                            </div>
                                            <div className='mb-1 m-0'>
                                                <div>
                                                    <input
                                                        className={`form-check-input ${errors["ReviewStatus"] ? "is-invalid" : ""}`}
                                                        type="radio"
                                                        onChange={handleCheckbox}
                                                        value={STATUS_REVIEW}
                                                        name="ReviewStatus"
                                                    />
                                                    <label className="form-check-label fw-bold ms-1">{t('userrequestview_label_requestchange')}</label>
                                                </div>
                                                <div className="ms-3 text-muted">
                                                    <small>{t('userrequestview_requestchange_helptext')}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row ms-0 pe-0 mb-2'>
                                            <button type='button' disabled={selectedApprovals.ReviewStatus == 'ARS_RJTD' && true} className="btn text-white app-primary-bg-color pe-0"
                                                onClick={() => submitReview(selectedApprovals)}
                                            >
                                                {t('userrequestview_button_submit')}
                                            </button>
                                        </div>
                                        {approveModalStatus ? <ApproveInformationModal /> : ''}
                                        {rejectModalStatus ? <RejectInformationModal /> : ''}
                                        {requestChangeModalStatus ? <RequestChangeInformationModal /> : ''}
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