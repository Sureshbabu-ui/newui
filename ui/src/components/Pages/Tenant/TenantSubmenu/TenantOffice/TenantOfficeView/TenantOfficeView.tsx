import { store } from '../../../../../../state/store';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { initializeTenantOfficeLocation } from './TenantOfficeView.slice';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { formatDate, formatDateTime } from '../../../../../../helpers/formats';

export const TenantOfficeDetails = () => {
    const { t } = useTranslation();
    const { selectedLocationDetails } = useStoreWithInitializer(
        ({ locationDetails }) => locationDetails, initializeTenantOfficeLocation);

    return (
        <ContainerPage>
            <div
                className="modal fade"
                id='ViewLocationDetails'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title app-primary-color">{t('tenantofficedetails_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeLocationDetails'
                                aria-label='Close'
                                onClick={onModalClose}
                            ></button>
                        </div>
                        <div className="modal-body pt-0">
                            {selectedLocationDetails.Id !== 0 && (
                                <ContainerPage>      
                                        <div className="col-md-6">
                                            <div className="row mb-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_name')}</label>
                                                <div >{selectedLocationDetails.TenantOfficeName}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_code')}</label>
                                                <div >{selectedLocationDetails.Code}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_type')}</label>
                                                <div >{selectedLocationDetails.TenantOfficeType}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_country')}</label>
                                                <div >{selectedLocationDetails.Country}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_state')}</label>
                                                <div >{selectedLocationDetails.State}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_city')}</label>
                                                <div >{selectedLocationDetails.City}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_pincode')}</label>
                                                <div >{selectedLocationDetails.Pincode}</div>
                                            </div>
                                            <div className="col-md-9">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_address')}</label>
                                                <div >{selectedLocationDetails.Address}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_gststate')}</label>
                                                <div >{selectedLocationDetails.GstState}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_tin')}</label>
                                                <div >{selectedLocationDetails.Tin}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_email')}</label>
                                                <div >{selectedLocationDetails.Email}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_mobile')}</label>
                                                <div >{selectedLocationDetails.Mobile}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_phone')}</label>
                                                <div >{selectedLocationDetails.Phone}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_manager')}</label>
                                                <div >{selectedLocationDetails.Manager}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_gstnumber')}</label>
                                                <div >{selectedLocationDetails.GstNumber}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_region')}</label>
                                                <div >{selectedLocationDetails.RegionName}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_geolocation')}</label>
                                                <div >{selectedLocationDetails.GeoLocation == null || "" ? "---" : selectedLocationDetails.GeoLocation}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_verified')}</label>
                                                <div >{selectedLocationDetails.IsVerified == true ? "Verified" : "Unverified"}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_effectivefrom')}</label>
                                                <div >{formatDate(selectedLocationDetails.EffectiveFrom)}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_effectiveto')}</label>
                                                <div >{formatDate(selectedLocationDetails.EffectiveTo) == "" || null ? "---" : formatDate(selectedLocationDetails.EffectiveTo)}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_createdby')}</label>
                                                <div >{selectedLocationDetails.CreatedBy}</div>
                                            </div>
                                            <div className="row mb-1 mt-1">
                                                <label className="form-text">{t('tenantofficedetails_label_tenant_office_createdon')}</label>
                                                <div >{formatDateTime(selectedLocationDetails.CreatedOn)}</div>
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
    store.dispatch(initializeTenantOfficeLocation())
}