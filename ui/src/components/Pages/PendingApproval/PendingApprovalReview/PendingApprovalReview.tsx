import { useEffect } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { approvalRequestChange, approveBank, rejectApprovalRequest } from '../../../../services/bank';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { SelectedPendingApprovalDetail } from '../../../../types/pendingApproval';
import { setContent, setReviewComment, toggleApproveModalStatus, toggleRejectModalStatus, toggleRequestChangeModalStatus, updateErrors, updateReviewStatus } from './PendingApprovalReview.slice';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { getAllApprovalRequests } from '../../../../services/approval';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../helpers/formats';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { approveCustomer } from '../../../../services/customer';
import { loadApprovals, loadApprovalEventNames } from '../PendingApprovalList/PendingApprovals.slice';
import { getApprovalEventNames } from '../../../../services/ApprovalWorkflow/approvalEvent';

export const PendingApprovalReview = ({ selectedItem }: { selectedItem: SelectedPendingApprovalDetail }) => {
  const { t } = useTranslation();
  const {
    approvalrequestreview: { approvalReviewDetails, approveModalStatus, rejectModalStatus, ReviewComment, errors, ReviewStatus, requestChangeModalStatus },
  } = useStore(({ approvalrequestreview }) => ({ approvalrequestreview }));

  const STATUS_APPROVED = "ARS_APRV"
  const STATUS_REJECT = "ARS_RJTD"
  const STATUS_REVIEW = "ARS_CAND"
  const BANK_APPROVAL_TYPE = "AE_BANK_CREATE"
  const CUSTOMER_APPROVAL_TYPE = "Customer"
  const approvalType = store.getState().approvalsmanagement.filteredEventCode

  useEffect(() => {
    store.dispatch(setContent(selectedItem));
  }, [selectedItem]);

  function handleCheckbox(ev: any) {
    var value = ev.target.value;
    store.dispatch(updateReviewStatus(value))
  }

  const onUpdateField = (ev: any) => {
    store.dispatch(setReviewComment(ev.target.value));
  };

  const validationSchema = yup.object().shape({
    ReviewStatus: yup.string().required('validation_error_bank_request_review_reviewstatus_required'),
  });

  const submitReview = (reviewDetails: SelectedPendingApprovalDetail) => {
    return async (ev: React.FormEvent) => {
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
      ev.preventDefault();
      store.dispatch(startPreloader());

      if (ReviewStatus == STATUS_APPROVED) {
        var contentParsed = JSON.parse(reviewDetails.Content);
        contentParsed.CreatedOn = reviewDetails.CreatedOn;
        contentParsed.CreatedBy = reviewDetails.CreatedBy;
        contentParsed.ApprovalFlowId = reviewDetails.ApprovalRequestDetailId;
        const FetchTime = reviewDetails.FetchTime;

        var result;
        switch (approvalType) {
          case BANK_APPROVAL_TYPE:
            result = await approveBank(store.getState().approvalsmanagement.approvalRequestDetailId, FetchTime ?? '', ReviewComment, store.getState().approvalrequestreview.ReviewStatus);
            break;
          case CUSTOMER_APPROVAL_TYPE:
            result = await approveCustomer(store.getState().approvalsmanagement.approvalRequestDetailId, FetchTime ?? '', ReviewComment);
            break;
          default:
            result = null
            break;
        }
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
        const result = await rejectApprovalRequest(reviewDetails.ApprovalRequestDetailId, ReviewComment);
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
        const result = await approvalRequestChange(reviewDetails.ApprovalRequestDetailId, ReviewComment, store.getState().approvalrequestreview.ReviewStatus);
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
    };
  }

  function ApproveInformationModal() {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={redirectAfterApproval}>
        {t('bank_request_review_title_approved')}
      </SweetAlert>
    );
  }

  function RejectInformationModal() {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={redirectAfterRejection}>
        {t('bank_request_review_title_rejected')}
      </SweetAlert>
    );
  }

  function RequestChangeInformationModal() {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={redirectAfterRequestChange}>
        {t('bank_request_review_title_request_change')}
      </SweetAlert>
    );
  }

  const redirectAfterApproval = async () => {
    store.dispatch(toggleApproveModalStatus());
    try {
      const events = await getApprovalEventNames();
      const FilteredEvents = await formatSelectInput(events.ApprovalEvents, "EventName", "EventCode")
      store.dispatch(loadApprovalEventNames({ MasterData: FilteredEvents }));
      const currentPage = store.getState().approvalsmanagement.currentPage;
      const tableName = store.getState().approvalsmanagement.filteredEventCode;
      const pendingApprovalDeatails = await getAllApprovalRequests(currentPage, tableName);
      store.dispatch(loadApprovals(pendingApprovalDeatails));
    } catch (error) {
      console.error(error);
    }
    document.getElementById('closeViewPendingRequest')?.click();
  }

  const redirectAfterRejection = async () => {
    store.dispatch(toggleRejectModalStatus());
    try {
      const events = await getApprovalEventNames();
      const FilteredEvents = await formatSelectInput(events.ApprovalEvents, "EventName", "EventCode")
      store.dispatch(loadApprovalEventNames({ MasterData: FilteredEvents }));
      const currentPage = store.getState().approvalsmanagement.currentPage;
      const tableName = store.getState().approvalsmanagement.filteredEventCode;
      const pendingApprovalDeatails = await getAllApprovalRequests(currentPage, tableName);
      store.dispatch(loadApprovals(pendingApprovalDeatails));
    } catch (error) {
      console.error(error);
    }
    document.getElementById('closeViewPendingRequest')?.click();
  }

  const redirectAfterRequestChange = async () => {
    store.dispatch(toggleRequestChangeModalStatus());
    try {
      const events = await getApprovalEventNames();
      const FilteredEvents = await formatSelectInput(events.ApprovalEvents, "EventName", "EventCode")
      store.dispatch(loadApprovalEventNames({ MasterData: FilteredEvents }));
      const currentPage = store.getState().approvalsmanagement.currentPage;
      const tableName = store.getState().approvalsmanagement.filteredEventCode;
      const pendingApprovalDeatails = await getAllApprovalRequests(currentPage, tableName);
      store.dispatch(loadApprovals(pendingApprovalDeatails));
    } catch (error) {
      console.error(error);
    }
    document.getElementById('closeViewPendingRequest')?.click();
  }

  return (
    <>
      {selectedItem.ReviewStatus !== 'ARS_RJTD' && (
        <div className='row mt-1 pe-0'>
          <ValidationErrorComp errors={errors} />
          {/* review comments */}
          <div className='row ms-0 pe-0'>
            <label className='ps-0'>{t('bank_request_review_label_review_comment')}</label>
            <textarea
              value={ReviewComment}
              className="form-control"
              rows={3}
              name="ReviewComment"
              maxLength={128}
              onChange={onUpdateField}
            ></textarea>
            <div className="small text-danger mb-2 ps-0 ">{t(errors["ReviewComment"])}</div>
          </div>
          {/* Approve option */}
          <div className='mb-1 row'>
            <div className="text-danger smal mb-2 mt-2">
              {t(errors['ReviewStatus'])}
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
                <label className="form-check-label fw-bold ms-1">{t('bank_request_review_label_aprove')}</label>
              </div>
              {/* checkbox & label ends */}
              {/* helptext */}
              <div className="ms-3 text-muted">
                <small>{t('bank_request_review_approve_helptext')}</small>
              </div>
              {/* helptext ends */}
            </div>
            {/* Approve option ends */}

            {/* Reject option */}
            <div className='mb-1 m-0'>
              {/* checkbox & label */}
              <input
                className={`form-check-input ${errors["ReviewStatus"] ? "is-invalid" : ""}`}
                type="radio"
                onChange={handleCheckbox}
                value={STATUS_REJECT}
                name="ReviewStatus"
              />
              <label className="form-check-label fw-bold ms-1">{t('bank_request_review_label_reject')}</label>
            </div>
            {/* checkbox & label ends */}
            {/* helptext */}
            <div className="ms-3 text-muted">
              <small>{t('bank_request_review_reject_helptext')}</small>
            </div>
            {/* helptext ends */}
          </div>
          {/* Reject option ends */}
          {/* Request change option */}
          <div className='mb-1 m-0'>
            {/* checkbox & label */}
            <div>
              <input
                className={`form-check-input ${errors["ReviewStatus"] ? "is-invalid" : ""}`}
                type="radio"
                onChange={handleCheckbox}
                value={STATUS_REVIEW}
                name="ReviewStatus"
              />
              <label className="form-check-label fw-bold ms-1">{t('bank_request_review_label_request_change')}</label>
            </div>
            {/* checkbox & label ends */}
            {/* helptext */}
            <div className="ms-3 text-muted">
              <small>{t('bank_request_review_request_change_helptext')}</small>
            </div>
            {/* helptext ends */}
          </div>
          {/* Request change option ends */}

          {/* review comments ends */}
          {/* review buttons */}
          <div className='row ms-0 pe-0 mb-2'>
            <button type='button' disabled={selectedItem.ReviewStatus == 'ARS_RJTD' && true} className="btn text-white app-primary-bg-color pe-0" onClick={submitReview(approvalReviewDetails)}>
              {t('bank_request_review_button_submit')}
            </button>
          </div>
          {/* review buttons ends */}
          {/*Information Modal */}
          {approveModalStatus ? <ApproveInformationModal /> : ''}
          {rejectModalStatus ? <RejectInformationModal /> : ''}
          {requestChangeModalStatus ? <RequestChangeInformationModal /> : ''}
          {/*Information Modal */}
        </div>
      )}
    </>
  );
}