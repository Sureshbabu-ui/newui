import { store } from '../../../../../state/store';
import { useStore } from '../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../../../helpers/formats';
import { useEffect, useRef } from 'react';
import { getCustomerApprovalRequests, getCustomerPendingDetails } from '../../../../../services/customer';
import { loadSelectedApproval } from './CustomerPendingView.slice';
import { loadPendingCustomers } from '../CustomerPendingList.slice';

export const CustomerPendingRequestView = () => {
    const { t, i18n } = useTranslation();
    const { customerpendingview: { selectedApprovals, SelectedId, ReviewDetails } } = useStore(({ customerpendingview }) => ({ customerpendingview }));
    const modalRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        onLoad()
    }, [SelectedId])

    const onLoad = async () => {
        if (Number(store.getState().approvalsmanagement.approvalRequestDetailId) > 0) {
            try {
                const result = await getCustomerPendingDetails(SelectedId ?? 0)
                store.dispatch(loadSelectedApproval(result));
            }
            catch (error) {
                console.log(error);

            }
        }
    }

    const onModalClose = async () => {
        const result = await getCustomerApprovalRequests(1);
        store.dispatch(loadPendingCustomers(result));
    }

    return (
        <>
            <div
                className="modal fade"
                id='ViewCustomerPendingRequest'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{`${t('customer_pendingrequest_details_modal_title')}`}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='ViewCustomerPendingRequest'
                                aria-label='Close'
                                ref={modalRef}
                                onClick={onModalClose}
                            ></button>
                        </div>
                        <div className="modal-body pt-0">
                            <>
                                {selectedApprovals?.Id != 0 && (
                                    <>
                                        {/* submitted customer details */}
                                        <div>
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
                                                            <div>{selectedApprovals?.CustomerGroup ?? "--"}</div>
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
                                            {/* <ApprovalRequestReviewList ReviewList={ReviewList} /> */}
                                        </div>
                                    </>
                                )}
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}