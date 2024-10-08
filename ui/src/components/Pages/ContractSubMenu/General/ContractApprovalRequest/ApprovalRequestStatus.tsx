import { Link } from 'react-router-dom'
import { store } from '../../../../../state/store'
import { useParams } from 'react-router-dom';
import { t } from 'i18next'
import { checkForPermission } from '../../../../../helpers/permissions';

const ApprovalRequest = () => {
    const { ContractId } = useParams<{ ContractId: string }>();
    return (
        <>
            {(store.getState().contractview.contractStatus == 'CTS_PGRS' && store.getState().generalcontractdetails.singlecontract.CreatedById == store.getState().app.user.unwrap().user[0].Id
                ) ? (
                <div className="row ms-0 me-4">
                   {checkForPermission("CONTRACT_REVIEW") &&<>
                    <div className="p-2 mx-2 moving-bg float-start">
                        <div className="fw-bold app-primary-color">{t('contract_approval_request_status_submit_for_approval_title')}</div>
                        {/* helptext */}
                        <div className="mt-1 small">
                            {t('contract_approval_request_status_submit_for_approval_helptext')}
                        </div>
                        {/* helptext */}
                        <div className="float-start mt-2">
                            <Link to={`/contracts/requestapproval/${ContractId}`}>
                                <button type="button" className="btn text-white app-primary-bg-color">
                                    {t('contract_approval_request_status_submit_for_approval_button')}
                                </button>
                            </Link>
                        </div>
                    </div>
                                            </>}
                </div>
            ) : (store.getState().contractview.contractStatus == 'CTS_PNDG') &&
            (
                (store.getState().generalcontractdetails.singlecontract.FirstApprovedOn == null &&
                    store.getState().generalcontractdetails.singlecontract.FirstApproverId == store.getState().app.user.unwrap().user[0].Id) ||
                (store.getState().generalcontractdetails.singlecontract.SecondApprovedOn == null &&
                    store.getState().generalcontractdetails.singlecontract.SecondApproverId == store.getState().app.user.unwrap().user[0].Id)) &&
            (
                <div className="row me-4">
                   {checkForPermission("CONTRACT_REVIEW") &&<>
                    <div className="p-2 mx-2 moving-bg float-start">
                        <div className="fw-bold app-primary-color">{t('contract_approval_request_status_review_contract_title')}</div>
                        {/* helptext */}
                        <div className="mt-1 small">
                            {t('contract_approval_request_status_review_contract_help_text')}
                        </div>
                        {/* helptext ends */}
                        {/* review button */}
                        <div className="float-start mt-2">
                            <Link to={`/contracts/requestapproval/${ContractId}`}>
                                <button type="button" className="btn text-white app-primary-bg-color">{t('contract_approval_request_status_review_contract_button')}</button>
                            </Link>
                        </div>
                        {/* review button ends */}
                    </div>
                   </>}
                </div >
            )
            }
        </>
    )
}
export default ApprovalRequest