import { useEffect } from "react";
import { store } from "../../../../../../../../../state/store";
import { loadCallStatusDetails } from "./CallStatusView.slice";
import { getCallStatusDetails } from "../../../../../../../../../services/serviceRequest";
import { useStore } from "../../../../../../../../../state/storeHooks";
import { t } from "i18next";
import { useParams } from "react-router-dom";
import { formatDateTime } from "../../../../../../../../../helpers/formats";

const CallStatusReport = () => {

    const { ServiceRequestId } = useParams<{ ServiceRequestId: string }>();
    useEffect(() => {
        onLoad(Number(ServiceRequestId));
    }, []);
    const onLoad = async (ServiceRequestId: number) => {
        try {
            const callDetails = await getCallStatusDetails(ServiceRequestId);
            store.dispatch(loadCallStatusDetails(callDetails));
        }
        catch (error) {
            console.error(error);
        }
    }
    const { callStatusDetails, callStatusPartIndentRequestDetails, callStatusEngineerVisitDetails, callStatusPartAllocationDetails } = useStore(({ callstatusdetails }) => callstatusdetails);
    return (
        <div className="border p-3 overflow-auto ">
            <div className=" d-flex col-md-12">
                <div className="div col-md-12 fw-bold fs-5 pt-2 text-center">{t('callstatusview_title')}</div>
            </div>
            <div className="div pt-3">
                <div className="fw-bold fs-5 mb-1">{t('callstatusview_subtitle_call_details')}</div>
                <table className="table table-bordered  table-sm">
                    <tbody className="">
                        <tr>
                            <td className="label">{t('callstatusview_label_caseid')}</td>
                            <td className="value">{callStatusDetails.CaseId}</td>
                            <td className="label">{t('callstatusview_label_workordernumber')}</td>
                            <td className="value">{callStatusDetails.WorkOrderNumber}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('callstatusview_label_customerreportedissue')}</td>
                            <td className="value">{callStatusDetails.CustomerReportedIssue}</td>
                            <td className="label">{t('callstatusview_label_callcenterremarks')}</td>
                            <td className="value">{callStatusDetails.CallCenterRemarks ? callStatusDetails.CallCenterRemarks : "---"}</td>
                            <td className="value"></td>
                        </tr>
                        <tr>
                            <td className="label">{t('callstatusview_label_callcreatedby')}</td>
                            <td className="value">{callStatusDetails.CallCreatedBy}</td>
                            <td className="label">{t('callstatusview_label_callcreatedon')}</td>
                            <td className="value">{formatDateTime(callStatusDetails.CallCreatedOn)}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('callstatusview_label_callsource')}</td>
                            <td className="value">{callStatusDetails.CallSource}</td>
                            <td className="label">{t('callstatusview_label_isinterim')}</td>
                            <td className="value">{callStatusDetails.IsInterim ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('callstatusview_label_calltype')}</td>
                            <td className="value">{callStatusDetails.CallType}</td>
                            <td className="label">{t('callstatusview_label_optedforremotesuport')}</td>
                            <td className="value">{callStatusDetails.OptedForRemoteSupport ? "Yes" : "No"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="pt-2">
                <div className="fw-bold fs-5 mb-1">{t('callstatusview_subtitle_contractinfo')}</div>
                <div className="row">
                    <div className="col-md-3">{t('callstatusview_label_contractno')}{callStatusDetails.ContractNumber}</div>
                    <div className="col-md-3">{t('callstatusview_label_startson')}{formatDateTime(callStatusDetails.ContractStartDate)}</div>
                    <div className="col-md-3">{t('callstatusview_label_endson')}{formatDateTime(callStatusDetails.ContractEndDate)}</div>
                    <div className="col-md-3">{t('callstatusview_label_agrementtye')}{callStatusDetails.AgreementType}</div>
                </div>
            </div>
            <div className="div pt-2">
                <div className="fw-bold fs-5 mb-1">{t('callstatusview_subtitle_customerandcontactinformation')}</div>
                <table className="table table-bordered table-sm">
                    <tbody>
                        <tr>
                            <td className="label">{t('callstatusview_label_customername')}</td>
                            <td className="value">{callStatusDetails.CustomerName}</td>
                            <td className="label">{t('callstatusview_label_siteaddress')}</td>
                            <td className="value">{callStatusDetails.SiteAddress}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('callstatusview_label_endusername')}</td>
                            <td className="value">{callStatusDetails.EndUserName}</td>
                            <td className="label">{t('callstatusview_label_enduserphone')}</td>
                            <td className="value">{callStatusDetails.EndUserPhone}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('callstatusview_label_enduseremail')}</td>
                            <td className="value">{callStatusDetails.EndUserEmail}</td>
                            <td className="label">{t('callstatusview_label_customerserviceaddress')}</td>
                            <td className="value">{callStatusDetails.CustomerAddress}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="div pt-2">
                <div className="fw-bold fs-5 mb-1">{t('callstatusview_subtitle_assetdetails')}</div>
                <table className="table table-bordered  table-sm">
                    <tbody>
                        <tr>
                            <td className="label">{t('callstatusview_label_assetserialnumber')}</td>
                            <td className="value">{callStatusDetails.ProductSerialNumber}</td>
                            <td className="label">{t('callstatusview_label_assetcategory')}</td>
                            <td className="value">{callStatusDetails.CategoryName}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('callstatusview_label_assetmake')}</td>
                            <td className="value">{callStatusDetails.Make}</td>
                            <td className="label">{t('callstatusview_label_assetmodel')}</td>
                            <td className="value">{callStatusDetails.ModelName}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('callstatusview_label_warrantyenddate')}</td>
                            <td className="value">{callStatusDetails.WarrantyEndDate}</td>
                            <td className="label">{t('callstatusview_label_preamcstatus')}</td>
                            <td className="value">{callStatusDetails.IsPreAmcCompleted ? "Done" : "Pending"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="div pt-2">
                <div className="fw-bold fs-5 mb-1">{t('callstatusview_subtitle_serviceengineerassignments')}</div>
                <table className="table table-bordered  table-sm">
                    <thead>
                        <tr>
                            <th>{t('callstatusview_label_assigneename')}</th>
                            <th>{t('callstatusview_label_assignedby')}</th>
                            <th>{t('callstatusview_label_assignedon')}</th>
                            <th>{t('callstatusview_label_assignedfrom')}</th>
                            <th>{t('callstatusview_label_assignedto')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{callStatusDetails.AssigneeName ? callStatusDetails.AssigneeName : "---"}</td>
                            <td>{callStatusDetails.AssignedBy ? callStatusDetails.AssignedBy : "---"}</td>
                            <td>{callStatusDetails.AssignedOn ? callStatusDetails.AssignedOn : "---"}</td>
                            <td>{callStatusDetails.AssignedFrom ? callStatusDetails.AssignedFrom : "---"}</td>
                            <td>{callStatusDetails.AssignedTo ? callStatusDetails.AssignedTo : "---"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {callStatusPartIndentRequestDetails.length > 0 && (
                <div className="div pt-3">
                    <div className="fw-bold fs-5 mb-1">{t('callstatusview_subtitle_partindentrequest')}</div>
                    <table className="table table-bordered  table-sm">
                        <thead>
                            <tr>
                                <th>{t('callstatusview_label_part')}</th>
                                <th>{t('callstatusview_label_stocktype')}</th>
                                <th>{t('callstatusview_label_description')}</th>
                                <th>{t('callstatusview_label_quantity')}</th>
                                <th>{t('callstatusview_label_isunderwarranty')} </th>
                                <th>{t('callstatusview_label_requesteddate')}</th>
                                <th>{t('callstatusview_label_requestedby')}</th>
                                <th>{t('callstatusview_label_status')}</th>
                                <th>{t('callstatusview_label_approved_date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {callStatusPartIndentRequestDetails.map((a) => (
                                <tr>
                                    <>
                                        <td className="label">{a.PartName}</td>
                                        <td className="value">{a.StockType}</td>
                                        <td className="value">{a.Description}</td>
                                        <td className="value">{a.Quantity}</td>
                                        <td className="value">{a.IsWarrantyReplacement ? "Yes" : "No"}</td>
                                        <td className="value">{a.RequestedDate}</td>
                                        <td className="value">{a.RequestedBy}</td>
                                        <td className="value">{a.PartIndentRequestStatus}</td>
                                        <td className="value">{a.ApprovedDate}</td>
                                    </>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {callStatusPartAllocationDetails.length > 0 && (
                <div className="div pt-3">
                    <div className="fw-bold fs-5 mb-1">{t('callstatusview_subtitle_partallocation')}</div>
                    <table className="table table-bordered  table-sm">
                        <thead>
                            <tr>
                                <th>{t('callstatusview_label_partallocatedon')}</th>
                                <th>{t('callstatusview_label_partallocatedon')}</th>
                                <th>{t('callstatusview_label_partreceivedon')}</th>
                                <th>{t('callstatusview_label_partreceivedby')}</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {callStatusPartAllocationDetails.map((a) => (
                                <>
                                    <tr>
                                        <td className="value">{a.AllocatedOn ? a.AllocatedOn : "---"}</td>
                                        <td className="value">{a.AllocatedBy ? a.AllocatedBy : "---"}</td>
                                        <td className="value">{a.ReceivedOn ? a.ReceivedOn : "---"}</td>
                                        <td className="value">{a.ReceivedBy ? a.ReceivedBy : "---"}</td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {callStatusEngineerVisitDetails.length > 0 && (
                <div className="div pt-2">
                    <div className="fw-bold fs-5 mb-1">{t('callstatusview_subtitle_serviceengineervisitandclosure')}</div>
                    <table className="table table-bordered  table-sm">
                        <thead>
                            <tr>
                                <th>{t('callstatusview_label_engineer_name')}</th>
                                <th>{t('callstatusview_label_visits_starts_on')}</th>
                                <th>{t('callstatusview_label_visits_ends_on')}</th>
                                <th>{t('callstatusview_label_call_status')}</th>
                                <th>{t('callstatusview_label_remarks')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {callStatusEngineerVisitDetails.map((data) => (
                                <tr>
                                    <td>{data.ServiceEngineer}</td>
                                    <td>{formatDateTime(data.VisitStartsOn)}</td>
                                    <td>{data.VisitEndsOn}</td>
                                    <td>{data.CallStatus}</td>
                                    <td>{data.Remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default CallStatusReport