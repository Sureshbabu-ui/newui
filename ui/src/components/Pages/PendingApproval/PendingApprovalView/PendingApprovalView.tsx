import { store } from '../../../../state/store'
import { BankRequestView } from './BankRequestView/BankRequestView'
import { useTranslation } from 'react-i18next';
import { initializeRequestDetails } from './PendingApprovalView.slice';
import { setReviewComment, updateErrors, updateReviewStatus } from '../PendingApprovalReview/PendingApprovalReview.slice';
import { CustomerRequestView } from './CustomerRequestView/CustomerRequestView';
import { setApprovalEvent} from '../PendingApprovalList/PendingApprovals.slice';
import { PartCodificationRequestView } from './PartCodificationRequestView/PartCodificationRequestView';
import { useRef } from 'react';
import { initializePartRequestDetails } from './PartCodificationRequestView/PartCodificationRequestView.slice';
import { UserRequestView } from './UserRequestView/UserRequestView';
import { isApprovalNeededStatus } from './UserRequestView/UserRequestView.slice';

const PendingApprovalView = () => {
    const { t } = useTranslation();
    const approvalType = store.getState().approvalsmanagement.selectedApprovalEventCode
    const eventName = store.getState().approvalsmanagement.selectedApprovalEvent

    const reviewCloseButtonRef = useRef<HTMLButtonElement>(null);

    const onModalClose = () => {
        store.dispatch(initializeRequestDetails())
        store.dispatch(setReviewComment( "" ))
        store.dispatch(updateReviewStatus(""))
        store.dispatch(updateErrors({}));
        store.dispatch(setApprovalEvent({approvalEvent:null,approvalEventCode:null}));
        store.dispatch(initializePartRequestDetails())
        window.location.pathname == "/config/users" && store.dispatch(isApprovalNeededStatus());
    }

    return (
        <div
            className="modal fade"
            id='ViewPendingRequest'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mx-2">
                        <h5 className="modal-title">{`${eventName} ${t('pendingrequest_details_modal_title')}`}</h5>
                        <button
                            type='button'
                            className="btn-close"
                            data-bs-dismiss='modal'
                            id='closeViewPendingRequest'
                            aria-label='Close'
                            ref={reviewCloseButtonRef}
                            onClick={onModalClose}
                        ></button>
                    </div>
                    <div className="modal-body pt-0">
                        {(() => {
                            switch (approvalType) {
                                case "AE_BANK_CREATE":
                                    return <BankRequestView />;
                                case "AE_CUSTOMER_CREATE":
                                    return <CustomerRequestView />;
                                case "Part":
                                    return <PartCodificationRequestView />
                                case "AE_USER_CREATE":
                                    return <UserRequestView />;
                                default:  return null;
                            }
                        })()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PendingApprovalView