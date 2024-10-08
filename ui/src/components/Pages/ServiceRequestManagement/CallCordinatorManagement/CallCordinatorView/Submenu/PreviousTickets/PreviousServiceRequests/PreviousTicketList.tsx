import { dispatchOnCall, store } from '../../../../../../../../state/store';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadTickets, initializePrevTickets } from './PreviousTicketList.slice';
import { formatDateTime } from '../../../../../../../../helpers/formats';
import { getPreviousServiceRequests } from '../../../../../../../../services/serviceRequest';
import FeatherIcon from 'feather-icons-react';
import { useStoreWithInitializer } from '../../../../../../../../state/storeHooks';

const PreviousTicketsList = (props: { ContractAssetId: number, Show?: Boolean, Hide?: Boolean, View?: string }) => {
    const { t, i18n } = useTranslation();
    const { tickets, totalRows } = useStoreWithInitializer(
        ({ previoustickets }) => previoustickets,
        dispatchOnCall(initializePrevTickets())
    );
    const [isExpanded, setIsExpanded] = useState(props.Show);

    useEffect(() => {
        onLoad(props.ContractAssetId);
    }, []);
    const ServiceRequestId = store.getState().callcordinatormanagement.serviceRequestId;

    const onLoad = async (ContractAssetId: number) => {
        store.dispatch(initializePrevTickets());
        try {
            const result = await getPreviousServiceRequests(ContractAssetId.toString(), ServiceRequestId);
            store.dispatch(loadTickets(result));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            {tickets.match({
                none: () => <>{t('assign_engineer_list_th_loading')}</>,
                some: (tickets) => (
                    <div className="row">
                        {tickets.length > 0 && props.View ? (
                            <>
                                <div className='ps-0 table-responsive overflow-auto pe-0'>
                                    <table className="table table-bordered text-nowrap">
                                        <thead>
                                            <tr>
                                                <th scope='col'></th>
                                                <th scope="col">{t('previous_tickets_listth_sl_no')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_caseid')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_workorderno')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_workordercreatedon')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_reportedissue')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_closedon')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_casestatus')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickets.map((field, index) => (
                                                <tr className={index > 1 && !isExpanded ? 'd-none' : 'mt-2'} key={field.tickets.Id}>
                                                    <td>
                                                        <a className="pseudo-href app-primary-color" target="_blank" data-toggle="tooltip" data-placement="left" title={'View'} href={`/calls/${field.tickets.Id}`}>
                                                            <FeatherIcon icon={"eye"} size="16" />
                                                        </a>
                                                    </td>
                                                    <th scope="row">{(index + 1)}</th>
                                                    <td>{field.tickets.CaseId} </td>
                                                    <td>{field.tickets.WorkOrderNumber} </td>
                                                    <td>{formatDateTime(field.tickets.WorkOrderCreatedOn)} </td>
                                                    <td>{field.tickets.CustomerReportedIssue} </td>
                                                    <td>{formatDateTime(field.tickets.ClosedOn)} </td>
                                                    <td>
                                                        {field.tickets.CaseStatusCode === "SRS_CLSD" ? (
                                                            <span className="badge text-bg-success">{field.tickets.CaseStatus}</span>
                                                        ) : field.tickets.CaseStatusCode === "SRS_RCLD" ? (
                                                            <span className="badge text-bg-success">{field.tickets.CaseStatus}</span>
                                                        ) : (
                                                            <span className="badge text-bg-danger">{field.tickets.CaseStatus}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {!props.Hide && totalRows > 2 && (
                                    <div className="pe-0">
                                        <a className='float-end pseudo-link' onClick={() => setIsExpanded(!isExpanded)}>
                                            {isExpanded ? "Show Less" : "Show More"}
                                        </a>
                                    </div>
                                )}
                            </>
                        ) : tickets.length > 0 ? (
                            <>
                                <h5 className="bold-text ps-0 m-0">{t('previous_tickets_main_heading')}</h5>
                                <div className='ps-0 table-responsive  mt-3 overflow-auto pe-0'>
                                    <table className="table table-bordered text-nowrap">
                                        <thead>
                                            <tr>
                                                <th scope="col">{t('previous_tickets_listth_sl_no')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_caseid')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_workorderno')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_workordercreatedon')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_reportedissue')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_closedon')}</th>
                                                <th scope="col">{t('previous_tickets_list_th_casestatus')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickets.map((field, index) => (
                                                <tr className={index > 1 && !isExpanded ? 'd-none' : 'mt-2'} key={field.tickets.Id}>
                                                    <th scope="row">{(index + 1)}</th>
                                                    <td>{field.tickets.CaseId} </td>
                                                    <td>{field.tickets.WorkOrderNumber} </td>
                                                    <td>{formatDateTime(field.tickets.WorkOrderCreatedOn)} </td>
                                                    <td>{field.tickets.CustomerReportedIssue} </td>
                                                    <td>{formatDateTime(field.tickets.ClosedOn)} </td>
                                                    <td>
                                                        {field.tickets.CaseStatusCode === "SRS_CLSD" ? (
                                                            <span className="badge text-bg-success">{field.tickets.CaseStatus}</span>
                                                        ) : field.tickets.CaseStatusCode === "SRS_RCLD" ? (
                                                            <span className="badge text-bg-success">{field.tickets.CaseStatus}</span>
                                                        ) : (
                                                            <span className="badge text-bg-danger">{field.tickets.CaseStatus}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {!props.Hide && totalRows > 2 && (
                                    <div className="pe-0">
                                        <a className='float-end pseudo-link' onClick={() => setIsExpanded(!isExpanded)}>
                                            {isExpanded ? "Show Less" : "Show More"}
                                        </a>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className='mt-0'>
                                {!props.View && (
                                    <h5 className="bold-text ps-0 m-0">{t('previous_tickets_main_heading')}</h5>
                                )}
                                <div className="text-muted mt-2">{t('previous_tickets_not_found')}</div>
                            </div>
                        )}
                    </div>
                ),
            })}
        </div>
    );
}

export default PreviousTicketsList