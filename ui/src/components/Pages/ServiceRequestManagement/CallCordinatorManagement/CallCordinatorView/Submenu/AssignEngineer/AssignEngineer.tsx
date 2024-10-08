import { dispatchOnCall, store } from '../../../../../../../state/store';
import { useStoreWithInitializer } from '../../../../../../../state/storeHooks';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { assigneesList } from '../../../../../../../services/assignEngineer';
import { loadAssignees, initializeAssignEngineer } from './AssignEngineer.slice';
import { formatDateTime } from '../../../../../../../helpers/formats';
import { AssignEngineerCreate } from './AssignEngineerCreate/AssignEngineerCreate';
import { DeleteEngineer } from './DeleteEngineer/DeleteEngineer';
import { setId } from './DeleteEngineer/DeleteEngineer.slice';
import FeatherIcon from 'feather-icons-react';
import { getFirstAssignment, setServiceRequestId } from './AssignEngineerCreate/AssignEngineerCreate.slice';
import { checkForPermission } from '../../../../../../../helpers/permissions';

const AssignEngineer = () => {
    const { t } = useTranslation();
    const { Assignees, currentPage, totalRows } = useStoreWithInitializer(
        ({ assigneeslist }) => assigneeslist,
        dispatchOnCall(initializeAssignEngineer())
    );
    const ServiceRequestId = store.getState().callcordinatormanagement.serviceRequestId

    useEffect(() => {
        if (ServiceRequestId) {
            onLoad(ServiceRequestId);
        }
    }, []);

    const onLoad = async (ServiceRequestId: number) => {
        try {
            const result = await assigneesList(ServiceRequestId);
            store.dispatch(loadAssignees(result))
        } catch (error) {
            console.error(error);
        }
    }

    const passServiceRequestId = async (Id: number) => {
        store.dispatch(setServiceRequestId(Id));
    }

    const getServiceRequestId = async (ServiceRequestId: number) => {
        store.dispatch(setServiceRequestId(ServiceRequestId));
        store.dispatch(getFirstAssignment(true))
    }
    const passServiceRequestAssigneeId = async (Id: number) => {
        store.dispatch(setId(Id));
    }
    const { WorkOrderNumber, CallStatusCode } = store.getState().callcordinatormanagement.selectedServiceRequest;

    return (
        <>
            <div className='row mt-4'> <h5 className="bold-text">{t('assign_engineer_main_heading')}</h5>
            </div>
            <>
                {checkForPermission("SERVICE_REQUEST_ENGINEER_ASSIGN") && Assignees.match({
                    none: () => <>{t('assign_engineer_list_th_loading')}</>,
                    some: (assignee) => (
                        <div className="row mt-3 ps-3">
                            {assignee.length > 0 ? (
                                <>
                                    {checkForPermission("SERVICE_REQUEST_ENGINEER_ASSIGN") &&
                                        <>
                                            {(CallStatusCode && CallStatusCode !== 'SRS_CLSD' && CallStatusCode !== 'SRS_RCLD' && WorkOrderNumber !== null) && (
                                                <div className="col-md-7 mt-1 mb-2 ps-0 mx-2">
                                                    <button
                                                        className="btn btn app-primary-bg-color text-white" data-bs-toggle='modal'
                                                        onClick={() => passServiceRequestId(ServiceRequestId ?? 0)}
                                                        data-bs-target='#AssignEngineer'
                                                    >
                                                        {t('assign_engineer_button_create_assign_more')}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    }
                                    <div className='ps-0 table-responsive overflow-auto pe-0 mb-2 mx-2'>
                                        <table className="table table-bordered text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th scope="col"></th>
                                                    <th scope="col">{t('assign_engineer_list_th_sl_no')}</th>
                                                    <th scope="col">{t('assign_engineer_list_th_assigneename')}</th>
                                                    <th scope="col">{t('assign_engineer_list_th_assignedby')}</th>
                                                    <th scope="col">{t('assign_engineer_list_th_assigneddate')}</th>
                                                    <th scope="col">{t('assign_engineer_list_th_sheduleddate')}</th>
                                                    <th scope="col">{t('assign_engineer_list_th_accepteddate')}</th>
                                                    <th scope="col">{t('assign_engineer_list_th_visitstart')}</th>
                                                    <th scope="col">{t('assign_engineer_list_th_visitclosed')}</th>
                                                    <th scope="col">{t('assign_engineer_list_th_status')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {assignee.map(({ Assignee }, index) => (
                                                    <tr className="mt-2">
                                                        <td className='text-center'>
                                                            {Assignee.EndsOn == null ? (
                                                                <a
                                                                    className='pseudo-href app-primary-color'
                                                                    data-toggle="tooltip" data-placement="left" title={'Revoke Assignment'}
                                                                    onClick={() => passServiceRequestAssigneeId(Assignee.Id)}
                                                                    data-bs-toggle='modal'
                                                                    data-bs-target='#DeleteEngineer'
                                                                >
                                                                    <FeatherIcon icon={"trash-2"} size="20" />
                                                                </a>) : null
                                                            }
                                                        </td>
                                                        <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                        <td>{Assignee.AssigneeName} </td>
                                                        <td>{Assignee.AssignedBy} </td>
                                                        <td>{formatDateTime(Assignee.CreatedOn)}</td>
                                                        <td>{formatDateTime(Assignee.StartsFrom)}</td>
                                                        <td>{formatDateTime(Assignee.AcceptedOn)}</td>
                                                        <td>{formatDateTime(Assignee.VisitStartDate)}</td>
                                                        <td>{formatDateTime(Assignee.VisitCloseDate)}</td>
                                                        <td>
                                                            {Assignee.IsDeleted ? (
                                                                <span className="badge text-bg-danger">{t('assign_engineer_deleted')}</span>
                                                            ) : Assignee.EndsOn == null ? (
                                                                <span className="badge text-bg-success">{t('assign_engineer_active')}</span>
                                                            ) : (
                                                                <span className="badge text-bg-warning">{t('assign_engineer_inactive')}</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mx-2 mt-1 mb-2 ps-0">
                                        {checkForPermission("SERVICE_REQUEST_ENGINEER_ASSIGN") &&
                                            <>
                                                {(CallStatusCode && CallStatusCode !== 'SRS_CLSD' && CallStatusCode !== 'SRS_RCLD' && WorkOrderNumber !== null) && (
                                                    <button className="btn app-primary-bg-color text-white "
                                                        onClick={() => getServiceRequestId((ServiceRequestId) ?? 0)}
                                                        data-bs-toggle='modal' data-bs-target='#AssignEngineer'
                                                    >{t('assign_engineer_button_create')}
                                                    </button>
                                                )}
                                            </>
                                        }
                                    </div>
                                    <div className=''>{t('assign_engineer_button_no_data_message')}</div>
                                </>
                            )}
                        </div>
                    ),
                })}
            </>
            <DeleteEngineer />
            <AssignEngineerCreate />
        </>
    );
}

export default AssignEngineer