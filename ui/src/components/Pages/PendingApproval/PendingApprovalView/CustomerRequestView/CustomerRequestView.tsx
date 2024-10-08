import { store } from '../../../../../state/store';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { convertBackEndErrorsToValidationErrors, formatDateTime, formatSelectInput } from '../../../../../helpers/formats';
import { useEffect, useState } from 'react';
import { getAllApprovalRequests, getCustomerApprovalDetails } from '../../../../../services/approval';
import { loadCustomerSelectedApproval, setReviewDetails, toggleApproveModalStatus, toggleRejectModalStatus, toggleRequestChangeModalStatus, updateErrors, updateReviewStatus } from './CustomerRequestView.slice';
import { initializeUserRequestDetails } from '../UserRequestView/UserRequestView.slice';
import { customerApprovalDetail } from '../../../../../types/customerpendingapproval';
import * as yup from 'yup';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { loadApprovalEventNames, loadApprovals } from '../../PendingApprovalList/PendingApprovals.slice';
import { getApprovalEventNames } from '../../../../../services/ApprovalWorkflow/approvalEvent';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useStore } from '../../../../../state/storeHooks';
import { ApprovalRequestReviewList } from '../../../../ApprovalRequestReviewList/ApprovalRequestReviewList';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';
import { approveCustomer } from '../../../../../services/customer';
import { approvalRequestChange, rejectApprovalRequest } from '../../../../../services/bank';

export const CustomerRequestView = () => {
  const { t } = useTranslation();
  const STATUS_APPROVED = "ARS_APRV"
  const STATUS_REJECT = "ARS_RJTD"
  const STATUS_REVIEW = "ARS_CAND"
  const [isExpanded, setIsExpanded] = useState(true);

  const { customerrequestinfo: { approveModalStatus, isApprovalNeeded, rejectModalStatus, requestChangeModalStatus, selectedApprovals, errors, ReviewStatus, ReviewList, ReviewDetails } } = useStore(({ customerrequestinfo }) => ({ customerrequestinfo }));

  const onLoad = async () => {
    if (Number(store.getState().approvalsmanagement.approvalRequestDetailId) > 0) {
      try {
        const result = await getCustomerApprovalDetails(store.getState().approvalsmanagement.approvalRequestDetailId ?? 0)
        store.dispatch(loadCustomerSelectedApproval(result));
      }
      catch (error) {
        return error;
      }
    }
  }

  useEffect(() => {
    onLoad()
  }, [store.getState().approvalsmanagement.approvalRequestDetailId])

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
    ReviewStatus: yup.string().required('validation_error_customerrequestview_reviewstatus_required'),
  });

  const submitReview = async (reviewDetails: customerApprovalDetail) => {
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
      var result = await approveCustomer(reviewDetails.Id, FetchTime, ReviewDetails.ReviewComment);
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
        {t('customerrequestview_title_approved')}
      </SweetAlert>
    );
  }

  function RejectInformationModal() {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={redirectAfterRejection}>
        {t('customerrequestview_title_rejected')}
      </SweetAlert>
    );
  }

  function RequestChangeInformationModal() {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={redirectAfterRequestChange}>
        {t('customerrequestview_title_requestchanged')}
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
      return error;
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
        {selectedApprovals?.Id != 0 && (
          <>
            {/* helptext */}
            <div className=" row">
              <strong>{t('customerrequest_view_details_helper_text_bold')}</strong>
              <p>{t('customerrequest_view_details_helper_text')}
              </p>
            </div>
            {/* helptext ends */}
            {/* submitted customer details */}
            <div className={`row ${isExpanded ? 'expanded-row' : 'collapsed-row'}`}>
              <div className='px-2'>
                <span className="badge rounded-pill bg-success text-white fw-normal">{selectedApprovals?.Id ? t('customerrequest_view_details_pill_type_updated') : t('customerrequest_view_details_pill_type_new')}</span>
              </div>
              <div className='border-bottom p-2'>
                <div className="row pt-2">
                  <label className="form-text">{t('customerrequest_view_details_label_customer_name')}</label>
                  <div>{selectedApprovals?.Name}</div>
                </div>
                <div className="row pt-2">
                  <label className="form-text">{t('customerrequest_view_details_label_nameonprint')}</label>
                  <div >{selectedApprovals?.NameOnPrint}</div>
                </div>
                <div className="row pt-2">
                  <label className="form-text">{t('customerrequest_view_details_label_office_name')}</label>
                  <div>{selectedApprovals?.Location}</div>
                </div>
              </div>
              {/* Contact Details Start */}
              <div className='border-bottom p-2'>
                <div className='pt-2 app-primary-color'><strong>{t('customerrequest_view_details_title_contact_details')}</strong></div>
                <div className='row pt-2'>
                  <div className="col-6">
                    <div className=''>
                      <label className="form-text">{t('customerrequest_view_details_label_primary_contact_name')}</label>
                      <div >{selectedApprovals?.PrimaryContactName}</div>
                    </div>
                    <div className=''>
                      <label className="form-text">{t('customerrequest_view_details_label_primary_contact_email')}</label>
                      <div >{selectedApprovals?.PrimaryContactEmail}</div>
                    </div>
                    <div className="">
                      <label className="form-text">{t('customerrequest_view_details_label_primary_contact_phone')}</label>
                      <div >{selectedApprovals?.PrimaryContactPhone}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className=''>
                      <label className="form-text">{t('customerrequest_view_details_label_secondary_contact_name')}</label>
                      <div >{selectedApprovals?.SecondaryContactName == null ? "---" : selectedApprovals?.SecondaryContactName}</div>
                    </div>
                    <div className=''>
                      <label className="form-text">{t('customerrequest_view_details_label_secondary_contact_email')}</label>
                      <div >{selectedApprovals?.SecondaryContactEmail == null ? "---" : selectedApprovals?.SecondaryContactEmail}</div>
                    </div>
                    <div className="">
                      <label className="form-text">{t('customerrequest_view_details_label_secondary_contact_phone')}</label>
                      <div >{selectedApprovals?.SecondaryContactPhone == null ? "---" : selectedApprovals?.SecondaryContactPhone}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Contact Details End */}

              {/* Location Details Start */}
              <div className='border-bottom p-2'>
                <div className='pt-2 app-primary-color'><strong>{t('customerrequest_view_details_title_location_details')}</strong></div>
                <div className="row pt-2">
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_billedtoaddress')}</label>
                    <div className='text-break'>{selectedApprovals?.BilledToAddress}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_shippedtoaddress')}</label>
                    <div className='text-break'>{selectedApprovals?.ShippedToAddress}</div>
                  </div>
                </div>
                <div className="row pt-2">
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_billedtopincode')}</label>
                    <div>{selectedApprovals?.BilledToPincode}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_shippedtopincode')}</label>
                    <div >{selectedApprovals?.ShippedToPincode}</div>
                  </div>
                </div>
                <div className='row pt-2'>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_billedtocity')}</label>
                    <div>{selectedApprovals?.BilledToCity}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_shippedtocity')}</label>
                    <div>{selectedApprovals?.ShippedToCity}</div>
                  </div>
                </div>
                <div className='row pt-2'>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_billedtostate')}</label>
                    <div>{selectedApprovals?.BilledToState}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_shippedtostate')}</label>
                    <div>{selectedApprovals?.ShippedToState}</div>
                  </div>
                </div>
                <div className="row pt-2">
                  <div className='col-md-6'>
                    <label className="form-text">{t('customerrequest_view_details_label_billedtocountry')}</label>
                    <div>{selectedApprovals?.BilledToCountry}</div>
                  </div>
                  <div className='col-md-6'>
                    <label className="form-text">{t('customerrequest_view_details_label_shippedtocountry')}</label>
                    <div>{selectedApprovals?.ShippedToCountry}</div>
                  </div>
                </div>
                <div className="row pt-2">
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_billedtogstnumber')}</label>
                    <div >{selectedApprovals?.BilledToGstNumber}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_shippedtogstnumber')}</label>
                    <div >{selectedApprovals?.ShippedToGstNumber}</div>
                  </div>
                </div>
              </div>
              {/* Location Details Ends */}
              <div className='border-bottom p-2'>
                <div className='row pt-2'>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_tinnumber')}</label>
                    <div >{selectedApprovals?.TinNumber ? selectedApprovals?.TinNumber : "---"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_cinnumber')}</label>
                    <div >{selectedApprovals?.CinNumber ? selectedApprovals?.CinNumber : "---"}</div>
                  </div>
                </div>
                <div className='row pt-2'>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_is_msme')}</label>
                    <div >{selectedApprovals?.IsMsme == true ? "Yes" : "No"}</div>
                  </div>
                  <div className='row pt-2'>
                    <div className="col-md-6">
                      <label className="form-text">{t('customerrequest_view_details_label_customer_customergroup')}</label>
                      <div>{selectedApprovals?.CustomerGroup}</div>
                    </div>
                  </div>
                  {selectedApprovals?.IsMsme == true && (
                    <div className="col-md-6">
                      <label className="form-text">{t('customerrequest_view_details_label_msme_registration_number')}</label>
                      <div >{selectedApprovals?.MsmeRegistrationNumber ? selectedApprovals?.MsmeRegistrationNumber : "---"}</div>
                    </div>
                  )}
                </div>
                <div className='row pt-2'>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_tannumber')}</label>
                    <div >{selectedApprovals?.TanNumber ? selectedApprovals?.TanNumber : "---"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_pannumber')}</label>
                    <div >{selectedApprovals?.PanNumber ? selectedApprovals?.PanNumber : "---"}</div>
                  </div>
                </div>
              </div>
              <div className='border-bottom p-2'>
                <div className='row pt-2'>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_createdby')}</label>
                    <div >{selectedApprovals.CreatedUserName}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-text">{t('customerrequest_view_details_label_createdon')}</label>
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
                      <label className='ps-0 mt-2'>{t('customerrequestview_label_reviewcomment')}</label>
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
                          <label className="form-check-label fw-bold ms-1">{t('customerrequestview_label_approve')}</label>
                        </div>
                        <div className="ms-3 text-muted">
                          <small>{t('customerrequestview_approve_helptext')}</small>
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
                        <label className="form-check-label fw-bold ms-1">{t('customerrequestview_label_reject')}</label>
                      </div>
                      <div className="ms-3 text-muted">
                        <small>{t('customerrequestview_reject_helptext')}</small>
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
                          <label className="form-check-label fw-bold ms-1">{t('customerrequestview_label_requestchange')}</label>
                        </div>
                        <div className="ms-3 text-muted">
                          <small>{t('customerrequestview_requestchange_helptext')}</small>
                        </div>
                      </div>
                    </div>
                    <div className='row ms-0 pe-0 mb-2'>
                      <button type='button' disabled={selectedApprovals.ReviewStatus == 'ARS_RJTD' && true} className="btn text-white app-primary-bg-color pe-0"
                        onClick={() => submitReview(selectedApprovals)}
                      >
                        {t('customerrequestview_button_submit')}
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
    </ContainerPage >
  )
}