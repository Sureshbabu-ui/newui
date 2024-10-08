import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../../helpers/formats';
import { useEffect, useState } from 'react';
import { store } from '../../../../state/store';
import { getBankPendingViewDetail } from '../../../../services/bank';
import { loadSelectedPendingBankDetail } from './BankPendingView.slice';
import { ApprovalRequestReviewList } from '../../../ApprovalRequestReviewList/ApprovalRequestReviewList';

export const BankPendingView = () => {
  const { t } = useTranslation();
  const { ApprovalRequestId, BankDetail,ReviewList } = useStore(({ bankpendingview }) => bankpendingview);

  const onLoad = async () => {
    if (Number(ApprovalRequestId) > 0) {
      try {
        const result = await getBankPendingViewDetail(ApprovalRequestId)
        store.dispatch(loadSelectedPendingBankDetail(result));
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    onLoad()
  }, [ApprovalRequestId])

   const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="modal fade"
      id='BankPendingView'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      aria-hidden='true'
    >
      <div className="modal-dialog ">
        <div className="modal-content">
          <div className="modal-header mx-2">
            <h5 className="modal-title">{t('bankpndingview_title')}</h5>
            <button
              type='button'
              className="btn-close"
              data-bs-dismiss='modal'
              id='closeBankPendingViewModal'
              aria-label='Close'
              onClick={onModalClose}
            // ref={modalRef}
            ></button>
          </div>
          <div className="modal-body">
          <>
          {BankDetail.ApprovalRequestDetailId !== 0 && (
            <div className="row">
              {/* helptext */}
              <div className=" row">
                <strong>{t('bankpendingview_helper_text_bold')}</strong>
                
              </div>
              {/* helptext ends */}
              {/* submitted bank details */}
              <div className={`row ${isExpanded ? 'expanded-row' : 'collapsed-row'}`}>                  <div className="row">
                <label className="form-text">{t('bankpendingview_label_bank_name')}</label>
                <div >{BankDetail.BankName}</div>
              </div>
                <div className="row pt-2">
                  <label className="form-text">{t('bankpendingview_label_bank_code')}</label>
                  <div >{BankDetail.BankCode}</div>
                </div>
                <div className="row pt-2">
                  <label className="form-text">{t('bankpendingview_label_createdby')}</label>
                  <div >{BankDetail.CreatedUserName}</div>
                </div>
                <div className="row pt-2">
                  <label className="form-text">{t('bankpendingview_label_createdon')}</label>
                  <div >{formatDateTime(BankDetail.CreatedOn)}</div>
                </div>
                {/* <div className="row pt-2">
                  <label className="form-text">{t('bankpendingview_label_reviewstatus')}</label>
                  <div >                    {BankDetail.ReviewStatusName}</div>
                </div> */}

                {ReviewList.length > 0 && (
                  <div className="row pt-2">
                    <ApprovalRequestReviewList ReviewList={ReviewList}/>
                  </div>
                )}
              </div>
              <div>

                <a className='float-end pseudo-link'
                  onClick={() => setIsExpanded(!isExpanded)}
                >{isExpanded ? t('approvalrequest_view_collapse') : t('approvalrequest_view_expand')}</a>
              </div>
           
            </div>
          )}
        </>
          </div>

        </div>
      </div>
    </div>
  )
}

const onModalClose = () => {
  // store.dispatch(initializeRequestDetails())
  // store.dispatch(setReviewComment( "" ))
  // store.dispatch(updateReviewStatus(""))
  // store.dispatch(updateErrors({}));
}