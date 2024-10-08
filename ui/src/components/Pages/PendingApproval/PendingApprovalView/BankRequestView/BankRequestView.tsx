import { store } from '../../../../../state/store';
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { initializeRequestDetails } from '../PendingApprovalView.slice';
import { PendingApprovalReview } from '../../PendingApprovalReview/PendingApprovalReview';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../../../helpers/formats';
import {  setReviewComment, updateErrors, updateReviewStatus } from '../../PendingApprovalReview/PendingApprovalReview.slice';
import { useEffect, useState } from 'react';
import { getClickedBankPendingDetails } from '../../../../../services/approval';
import { loadSelectedApproval } from './BankRequestView.slice';

export const BankRequestView = () => {
  const { t } = useTranslation();

  const onLoad = async () => {
    if (Number(store.getState().approvalsmanagement.approvalRequestDetailId) > 0) {
      try {
        const result = await getClickedBankPendingDetails(store.getState().approvalsmanagement.approvalRequestDetailId ?? 0, store.getState().approvalsmanagement.selectedApprovalEventCode)
        store.dispatch(loadSelectedApproval(result));
      } catch (error) {
        return;
      }
    }
  }

  useEffect(() => {
    onLoad()
  }, [store.getState().approvalsmanagement.approvalRequestDetailId])

  const { selectedApprovals, ReviewList } = useStore(({ bankrequestview }) => bankrequestview);
  const [isExpanded, setIsExpanded] = useState(true);
  const approvalType = store.getState().approvalsmanagement.selectedApprovalEventCode

  if (selectedApprovals && selectedApprovals.Content != null) {
    var parsedSelectedApprovals = selectedApprovals.Content && JSON.parse(selectedApprovals?.Content);
  }
  
  return (
    <ContainerPage>
      {approvalType == "AE_BANK_CREATE" ? (
        <>
          {selectedApprovals.ApprovalRequestDetailId !== 0 && (
            <div className="row">
              {/* helptext */}
              <div className=" row">
                <strong>{t('view_bankrequest_details_helper_text_bold')}</strong>
                <p>{t('view_bankrequest_details_helper_text')}
                </p>
              </div>
              {/* helptext ends */}
              {/* submitted bank details */}
              <div className={`row ${isExpanded ? 'expanded-row' : 'collapsed-row'}`}>                  <div className="row">
                <label className="form-text">{t('view_bankrequest_details_label_bank_name')}</label>
                <div >{parsedSelectedApprovals?.BankName}</div>
              </div>
                <div className="row pt-2">
                  <label className="form-text">{t('view_bankrequest_details_label_bank_code')}</label>
                  <div >{parsedSelectedApprovals?.BankCode}</div>
                </div>
                <div className="row pt-2">
                  <label className="form-text">{t('view_bankrequest_details_label_createdby')}</label>
                  <div >{selectedApprovals.CreatedUserName}</div>
                </div>
                <div className="row pt-2">
                  <label className="form-text">{t('view_bankrequest_details_label_createdon')}</label>
                  <div >{formatDateTime(selectedApprovals.CreatedOn)}</div>
                </div>
                <div className="row pt-2">
                  <label className="form-text">{t('view_bankrequest_details_label_reviewstatus')}</label>
                  <div >
                    {selectedApprovals.ReviewStatusName}</div>
                </div>

                {ReviewList.length > 0 && (
                  <div className="row pt-2">
                    <label ><strong>{t('view_bankrequest_details_label_review_comment')}</strong></label>
                    {ReviewList.map((review, index) => {
                      return <div className="mb-2" key={index}>
                        {review.ReviewComment ? review.ReviewComment : "No Comment"}
                        <div>
                          <span className='small me-2'>{formatDateTime(review.ReviewedOn)}</span>
                          <span className='small'>{review.ReviewedBy}
                          </span>
                        </div>
                      </div>
                    })}
                  </div>
                )}
              </div>
              <div>
                <a className='float-end pseudo-link'
                  onClick={() => setIsExpanded(!isExpanded)}
                >{isExpanded ? t('approvalrequest_view_collapse') : t('approvalrequest_view_expand')}</a>
              </div>
              {(selectedApprovals.ReviewStatus !== "" && !['ARS_CAND', 'ARS_RJTD', 'ARS_APRV'].includes(selectedApprovals.ReviewStatus)) && (
                <PendingApprovalReview selectedItem={selectedApprovals} />
              )}
            </div>
          )}
        </>
      ) : (
        <div
          className="modal fade"
          id='ViewBankRequest'
          data-bs-backdrop='static'
          data-bs-keyboard='false'
          aria-hidden='true'
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header mx-2">
                <h5 className="modal-title">{t('view_bankrequest_details_modal_title')}</h5>
                <button
                  type='button'
                  className="btn-close"
                  data-bs-dismiss='modal'
                  id='closeViewBankRequest'
                  aria-label='Close'
                  onClick={onModalClose}
                ></button>
              </div>
              <div className="modal-body">
                {selectedApprovals.ApprovalRequestDetailId !== 0 && (
                  <ContainerPage>
                    <div className="row">
                      {/* helptext */}
                      <div className=" row">
                        <strong>{t('view_bankrequest_details_helper_text_bold')}</strong>
                        <p>{t('view_bankrequest_details_helper_text')}
                        </p>
                      </div>
                      {/* helptext ends */}
                      {/* submitted bank details */}
                      <div className={`row ${isExpanded ? 'expanded-row' : 'collapsed-row'}`}>                        <div className="row">
                        <label className="form-text">{t('view_bankrequest_details_label_bank_name')}</label>
                        <div >{parsedSelectedApprovals?.BankName}</div>
                      </div>
                        <div className="row pt-2">
                          <label className="form-text">{t('view_bankrequest_details_label_bank_code')}</label>
                          <div >{parsedSelectedApprovals?.BankCode}</div>
                        </div>
                        <div className="row pt-2">
                          <label className="form-text">{t('view_bankrequest_details_label_createdby')}</label>
                          <div >{selectedApprovals.CreatedUserName}</div>
                        </div>
                        <div className="row pt-2">
                          <label className="form-text">{t('view_bankrequest_details_label_createdon')}</label>
                          <div >{formatDateTime(selectedApprovals.CreatedOn)}</div>
                        </div>
                        <div className="row pt-2">
                          <label className="form-text">{t('view_bankrequest_details_label_reviewedby')}</label>
                          {/* <div >{selectedApprovals.ReviewedUserName == null
                            ? 'Pending'
                            : selectedApprovals.ReviewedUserName}</div> */}
                        </div>
                        <div className="row pt-2">
                          <label className="form-text">{t('view_bankrequest_details_label_reviewedon')}</label>
                          {/* <div >{selectedApprovals.ReviewedOn == null
                            ? 'Pending'
                            : formatDateTime(selectedApprovals.ReviewedOn)}</div> */}
                        </div>
                        {/* {selectedApprovals.ReviewComment !== null && (
                          <div className="row pt-2">
                            <label ><strong>{t('view_bankrequest_details_label_review_comment')}</strong></label>
                            {parsedReviewDetails[0].CreatedOn != null && (
                              <>
                                {parsedReviewDetails.map((reviewDetails) => (
                                  <div className="mb-2">
                                    {reviewDetails.ReviewComment ? reviewDetails.ReviewComment : "No Comment"}
                                    <div>
                                      <span className='small me-2'>{formatDateTime(reviewDetails.CreatedOn)}</span>
                                      <span className='small'>{reviewDetails.ReviewedBy}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        )} */}
                      </div>
                      <div>
                        <a className='float-end pseudo-link'
                          onClick={() => setIsExpanded(!isExpanded)}
                        >{isExpanded ? t('approvalrequest_view_collapse') : t('approvalrequest_view_expand')}</a>
                      </div>
                    </div>
                  </ContainerPage>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ContainerPage>
  )
}

const onModalClose = () => {
  store.dispatch(initializeRequestDetails())
  store.dispatch(setReviewComment( "" ))
  store.dispatch(updateReviewStatus(""))
  store.dispatch(updateErrors({}));
}