import { t } from 'i18next'
import { useState } from 'react'
import { setReviewComment } from './RequestApproval.slice';
import { store } from '../../../../../../state/store';
import { formatDateTime } from '../../../../../../helpers/formats';

const ContractReviewDetails = ({ ApproverDetails, ReviewedJsonDetails, ReviewStatus }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const onUpdateField = (ev: any) => {
        var value = ev.target.value
        store.dispatch(setReviewComment(value))
    };

    return (
        <>
            {/* title */}
            <label className='mt-2 fw-bold'>
                {t('contract_approval_request_review_details_table_title')}
            </label>
            {/* title ends */}
            <div>
                <table className="table table-bordered mt-2 pe-0">
                    <thead>
                        <tr>
                            <th scope="col">{t('contract_approval_request_review_details_tablehead_name')}</th>
                            <th scope="col">{t('contract_approval_request_review_details_tablehead_designation')}</th>
                            <th scope="col">{t('contract_approval_request_review_details_tablehead_location')}</th>
                            <th scope="col">{t('contract_approval_request_review_details_tablehead_approvedon')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={`${ReviewStatus == "RequestApproval" ? "text-success" : ""}`}>
                            <td>{`${ApproverDetails.FirstApprover} (${ApproverDetails.FirstApproverEmployeeCode})`}</td>
                            <td>{ApproverDetails.FirstApproverDesignation}</td>
                            <td>{ApproverDetails.Location}</td>
                            <td>{store.getState().generalcontractdetails.singlecontract.FirstApprovedOn ? formatDateTime(store.getState().generalcontractdetails.singlecontract.FirstApprovedOn) : ""}</td>
                        </tr>
                        <tr className={`${ReviewStatus == "SubmitReview" ? "text-success" : ""}`}>
                            <td>{`${ApproverDetails.SecondApprover} (${ApproverDetails.SecondApproverEmployeeCode})`}</td>
                            <td>{ApproverDetails.SecondApproverDesignation}</td>
                            <td>{ApproverDetails.Location}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {
                ReviewedJsonDetails[0].CreatedOn != null && (
                    <>
                        {/* title */}
                        <label className='mt-2 fw-bold'>
                            {t('contract_approval_request_review_details_title_comments')}
                        </label>
                        {/* title ends */}

                        <div className="mt-2">
                            {/* last comment */}
                            {!isExpanded && (
                                <div className='mb-2'>
                                    {ReviewedJsonDetails[0].ReviewComment ? ReviewedJsonDetails[0].ReviewComment : "No comment"}
                                    <div>
                                        <span className='small'>
                                            {ReviewedJsonDetails[0].ReviewedBy}
                                        </span>
                                        <span className='small ms-1'>{formatDateTime(ReviewedJsonDetails[0].CreatedOn)}</span>
                                        {!isExpanded && (
                                            <a className='pseudo-link float-end' onClick={() => setIsExpanded(!isExpanded)}>{t('contract_approval_request_review_details_title_previous_comments')}</a>
                                        )}
                                    </div>
                                </div>
                            )}
                            {/* last comment */}
                            {isExpanded && (
                                <>
                                    {ReviewedJsonDetails.map((reviewDetails) => (
                                        <>
                                            {reviewDetails.ReviewComment && (
                                                <div className="mb-2">
                                                    {reviewDetails.ReviewComment}
                                                    <div>
                                                        <span className='small'>{reviewDetails.ReviewedBy}
                                                        </span>
                                                        <span className='small ms-1'>{formatDateTime(reviewDetails.CreatedOn)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ))}
                                </>
                            )}
                        </div>
                    </>
                )
            }
            <div className='ms-0 mt-2'>
                <label className="p-0">{t('contract_approval_request_review_label_review_comment')}</label>
                <textarea
                    value={store.getState().contractapprovalrequest.ReviewDetails.ReviewComment}
                    name='ReviewComment'
                    className='form-control'
                    rows={3}
                    maxLength={128}
                    onChange={onUpdateField}
                ></textarea>
            </div>
        </>
    )
}
export default ContractReviewDetails