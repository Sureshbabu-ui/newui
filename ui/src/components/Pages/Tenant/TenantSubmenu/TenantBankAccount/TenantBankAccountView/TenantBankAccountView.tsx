import { dispatchOnCall} from '../../../../../../state/store';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { initializeTenantBankAccountDetails} from './TenantBankAccountView.slice';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../../../../helpers/formats';

export const TenantBankAccountView = () => {
    const { t } = useTranslation();
    const { tenantBankAccount } = useStoreWithInitializer(
        ({ tenantbankaccountdetails }) => tenantbankaccountdetails,
        dispatchOnCall(initializeTenantBankAccountDetails())
    );
    return (
        <div
            className="modal fade"
            id='tenantBankAccountView'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header mx-2">
                        <h5 className="modal-title app-primary-color">{t('tenantbankaccountview_title')}</h5>
                        <button
                            type='button'
                            className="btn-close"
                            data-bs-dismiss='modal'
                            id='closeCreateBankBranchModal'
                            aria-label='Close'
                        ></button>
                    </div>
                    <div className="modal-body pt-0">
                        <ContainerPage>
                            <div className="row pt-0">
                                <div className="col-md-12">
                                    <label className="text-muted pb-0 mb-0">{t('tenantbankaccountview_bankname')}</label>
                                    <div >{tenantBankAccount.BankName}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <label className="text-muted mt-2">{t('tenantbankaccountview_branchname')}</label>
                                    <div >{tenantBankAccount.BranchName}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <label className="text-muted mt-2">{t('tenantbankaccountview_accountnumber')}</label>
                                    <div >{tenantBankAccount.AccountNumber}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <label className="text-muted mt-2">{t('tenantbankaccountview_contactnumber')}</label>
                                    <div >{tenantBankAccount.ContactNumber}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <label className="text-muted mt-2">{t('tenantbankaccountview_relationshipmanager')}</label>
                                    <div >{tenantBankAccount.RelationshipManager}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <label className="text-muted mt-2">{t('tenantbankaccountview_email')}</label>
                                    <div >{tenantBankAccount.Email}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <label className="text-muted mt-2">{t('tenantbankaccountview_bankaccounttype')}</label>
                                    <div >{tenantBankAccount.BankAccountTypeName}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <label className="text-muted mt-2">{t('tenantbankaccountview_createdby')}</label>
                                    <div >{tenantBankAccount.CreatedUserName}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <label className="text-muted mt-2">{t('tenantbankaccountview_createdon')}</label>
                                    <div >{formatDateTime(tenantBankAccount.CreatedOn ?? "")}</div>
                                </div>
                            </div>
                            {
                                tenantBankAccount.UpdatedOn ?
                                    (<>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label className="text-muted mt-2">{t('tenantbankaccountview_updatedby')}</label>
                                                <div >{tenantBankAccount.UpdatedUserName}</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label className="text-muted mt-2">{t('tenantbankaccountview_updatedon')}</label>
                                                <div >{formatDateTime(tenantBankAccount.UpdatedOn)}</div>
                                            </div>
                                        </div>
                                    </>) : <></>
                            }
                        </ContainerPage>
                    </div>
                </div>
            </div>
        </div>
    );
}