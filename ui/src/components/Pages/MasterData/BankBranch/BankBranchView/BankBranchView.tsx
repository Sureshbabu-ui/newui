import { store } from '../../../../../state/store';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { formatDateTime } from '../../../../../helpers/formats';
import { initializeBankBranch } from './BankBranchView.slice';
import FeatherIcon from 'feather-icons-react';

export const BankBranchDetails = () => {
    const { t } = useTranslation();
    const { selectedBranch } = useStoreWithInitializer(
        ({ bankbranchinfo }) => bankbranchinfo, initializeBankBranch);

    return (
        <ContainerPage>
            <div
                className="modal fade"
                id='BranchDetails'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title app-primary-color ms-4 text-bold">{t('bankbranchdetails_main_heading')}</h5>

                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeBranchDetails'
                                aria-label='Close'
                                onClick={onModalClose}
                            ></button>
                        </div>
                        <div className="modal-body pt-0">
                            {selectedBranch.Id !== 0 && (
                                <ContainerPage>
                                    <div className="row ms-2 mt-0 me-0">
                                        <div className="row mb-1">
                                            <span>
                                                <label className="form-text">{t('bankbranchdetails_label_bankname')}</label>
                                                <h5 className="app-primary-color">{selectedBranch.BankName}</h5></span>
                                        </div>
                                        <div className="row">
                                            <div className="card border-0 mb-3 col-6 m-0" >
                                                <div className="card-header">{t('bankbranchdetails_label_branch_header')} <FeatherIcon icon={"info"} size="16" /></div>
                                                <div className="card-body text-dark">
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('bankbranchdetails_label_branchcode')}</label>
                                                        <div >{selectedBranch.BranchCode}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('bankbranchdetails_label_branchname')}</label>
                                                        <div >{selectedBranch.BranchName}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('bankbranchdetails_label_ifsc')}</label>
                                                        <div >{selectedBranch.Ifsc}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('bankbranchdetails_label_micrcode')}</label>
                                                        <div >{selectedBranch.MicrCode}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card border-0 mb-3 col-6 m-0" >
                                                <div className="card-header ">{t('bankbranchdetails_label_contact_header')} <FeatherIcon icon={"phone"} size="16" /></div>
                                                <div className="card-body text-dark">
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('bankbranchdetails_label_contact_person')}</label>
                                                        <div >{selectedBranch.ContactPerson}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('bankbranchdetails_label_email')}</label>
                                                        <div >{selectedBranch.Email}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('bankbranchdetails_label_cnone')}</label>
                                                        <div >{selectedBranch.ContactNumberOneCountryCode} {selectedBranch.ContactNumberOne}</div>
                                                    </div>
                                                    <div className="row mb-1 mt-1">
                                                        <label className="form-text">{t('bankbranchdetails_label_cntwo')}</label>
                                                        <div >{selectedBranch.ContactNumberTwoCountryCode == "" ? "" : `+${selectedBranch.ContactNumberTwoCountryCode}`} {selectedBranch.ContactNumberTwo == "" ? "---" : selectedBranch.ContactNumberTwo}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="card border-0 mb-3 col-6 m-0" >
                                                <div className="card-header ">{t('bankbranchdetails_label_location_header')} <FeatherIcon icon={"map-pin"} size="16" /></div>
                                                <div className="card-body text-dark">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="row mb-1 mt-1">
                                                                <label className="form-text">{t('bankbranchdetails_label_country')}</label>
                                                                <div>{selectedBranch.Country}</div>
                                                            </div>
                                                            <div className="row mb-1 mt-1">
                                                                <label className="form-text">{t('bankbranchdetails_label_state')}</label>
                                                                <div >{selectedBranch.State}</div>
                                                            </div>
                                                            <div className="row mb-1 mt-1">
                                                                <label className="form-text">{t('bankbranchdetails_label_city')}</label>
                                                                <div >{selectedBranch.City}</div>
                                                            </div>
                                                            <div className="row mb-1 mt-1">
                                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_pincode')}</label>
                                                                <div >{selectedBranch.Pincode}</div>
                                                            </div>
                                                            <div className="row mb-1 mt-1">
                                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_address')}</label>
                                                                <div >{selectedBranch.Address}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card border-0 mb-3 col-6 m-0" >
                                                <div className="card-header ">{t('bankbranchdetails_label_other_header')} <FeatherIcon icon={"user"} size="16" /></div>
                                                <div className="card-body text-dark">
                                                    <div className="row">
                                                        <div className="row mb-1 mt-1">
                                                            <label className="form-text">{t('bankbranchdetails_label_createdby')}</label>
                                                            <div >{selectedBranch.CreatedBy}</div>
                                                        </div>
                                                        <div className="row mb-1 mt-1">
                                                            <label className="form-text">{t('bankbranchdetails_label_createdon')}</label>
                                                            <div >{formatDateTime(selectedBranch.CreatedOn)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </ContainerPage>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ContainerPage>
    )
}

const onModalClose = () => {
    store.dispatch(initializeBankBranch())
}