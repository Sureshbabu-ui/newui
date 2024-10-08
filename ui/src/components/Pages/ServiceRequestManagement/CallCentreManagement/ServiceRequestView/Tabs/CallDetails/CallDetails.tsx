import { formatDateTime } from '../../../../../../../helpers/formats';
import { useStore } from '../../../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';

const CallDetails = () => {
    const { t } = useTranslation();

    const { selectedServiceRequest } = useStore(
        ({ callcentreservicerequestdetails }) => callcentreservicerequestdetails);

    return (
        <>
            {selectedServiceRequest ? (
                <div className="row mb-3">
                    <div className="col-6" >
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_workordernumber')}</label>
                            <div >{selectedServiceRequest.WorkOrderNumber ? selectedServiceRequest.WorkOrderNumber : "---"}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_callstatus')}</label>
                            <div >{selectedServiceRequest.CallStatus}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_calltype')}</label>
                            <div >{selectedServiceRequest.CallType}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_customercontacttype')}</label>
                            <div >{selectedServiceRequest.CustomerContactType}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_caserepempname')}</label>
                            <div >{selectedServiceRequest.CaseReportedCustomerEmployeeName}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_customerreportedissue')}</label>
                            <div >{selectedServiceRequest.CustomerReportedIssue}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_calllsource')}</label>
                            <div >{selectedServiceRequest.CallSource}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_enduser_name')}</label>
                            <div >{selectedServiceRequest.EndUserName ? selectedServiceRequest.EndUserName : '---'}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_enduser_phone')}</label>
                            <div >{selectedServiceRequest.EndUserPhone ? selectedServiceRequest.EndUserPhone : '---'}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_enduser_email')}</label>
                            <div >{selectedServiceRequest.EndUserEmail ? selectedServiceRequest.EndUserEmail : '---'}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_ticket_number')}</label>
                            <div >{selectedServiceRequest.TicketNumber?selectedServiceRequest.TicketNumber:'---'}</div>
                        </div>
                    </div>
                    <div className="col-6" >
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_optedforremotesupport')}</label>
                            <div >{selectedServiceRequest.OptedForRemoteSupport ? "yes" : "No"}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_createdby')}</label>
                            <div >{selectedServiceRequest.CreatedBy}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_contact_caseid')}</label>
                            <div >{selectedServiceRequest.CaseId}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_contact_assignedby')}</label>
                            <div >{selectedServiceRequest.AssignedBy ? selectedServiceRequest.AssignedBy : "---"}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_casereportedon')}</label>
                            <div >{formatDateTime(selectedServiceRequest.CaseReportedOn)}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_callcentreremarks')}</label>
                            <div >{selectedServiceRequest.CallCenterRemarks ? selectedServiceRequest.CallCenterRemarks : "---"}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_incidentid')}</label>
                            <div >{selectedServiceRequest.IncidentId ? selectedServiceRequest.IncidentId : "---"}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_optedforremotesupportreason')}</label>
                            <div >{selectedServiceRequest.OptedForRemoteSupport ? "---" : selectedServiceRequest.RemoteSupportNotOptedReason}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_createdon')}</label>
                            <div >{formatDateTime(selectedServiceRequest.CreatedOn)}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_repairreason')}</label>
                            <div >{selectedServiceRequest.RepairReason ? selectedServiceRequest.RepairReason : '---'}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {t('callcentredetails_no_data')}
                </div>
            )}
        </>
    )
}

export default CallDetails