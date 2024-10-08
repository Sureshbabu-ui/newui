import { useEffect } from 'react';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { initializeEventConditionListView, loadEventConditionDetails } from './EventConditionList.slice';
import { getEventConditionListView } from '../../../../services/ApprovalWorkflow/eventCondition';
import { checkForPermission } from '../../../../helpers/permissions';
import { Link, useParams } from 'react-router-dom';
import { EventConditionSort } from '../EventConditionSort/EventConditionSort';

export const EventConditionList = () => {
    const { t } = useTranslation();
    const { EventId } = useParams<{ EventId: string }>();

    const {
        eventconditionlist: { eventDetail, eventConditionList, search },
    } = useStore(({ eventconditionlist }) => ({ eventconditionlist }));

    useEffect(() => {
        if (checkForPermission("APPROVALWORKFLOW_VIEW")) {
            onLoad();
        }
    }, [EventId]);

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_workflowconfiguration', Link: '/config/workflowconfiguration' },
            { Text: 'breadcrumbs_manage_eventconditionlist' }
        ];
    }

    const onLoad = async () => {
        store.dispatch(initializeEventConditionListView());
        try {
            fetchConditionList()
        }
        catch (error) {
            return;
        }
    }

    const fetchConditionList = async () => {
        try {
            const approvalWorkFlows = await getEventConditionListView(EventId, search);
            store.dispatch(loadEventConditionDetails(approvalWorkFlows));
        }
        catch (error) {
            console.error(error);
        }
    }

    return (<ContainerPage >
        <BreadCrumb items={breadcrumbItems()} />
        <div>
            {checkForPermission("APPROVALWORKFLOW_VIEW") &&
                <div>

                    {eventConditionList.match({
                        none: () => <div className="px-2 py-3">{t('eventconditionlist_loading_message')}</div>,
                        some: (conditionList) =>
                            <div className=" pe-2 mt-2  mx-0 ps-2">
                                <div className="row m-0 mb-1">
                                    <div className="col-md-6 text-end">{t('eventconditionlist_groupname')} :</div>
                                    <div className="col-md-6">{eventDetail.EventGroupName}</div>
                                </div>
                                <div className="row m-0">
                                    <div className="col-md-6 text-end">{t('eventconditionlist_eventname')} :</div>
                                    <div className="col-md-6">{eventDetail.EventName}</div>
                                </div>

                                {/* button */}
                                {
                                    checkForPermission('APPROVALWORKFLOW_MANAGE') &&
                                    <div className="row">
                                        <div className="mt-3 text-end col">
                                            <Link to={`/config/workflowconfiguration/condition/${EventId}/create`}
                                                className="app-primary-bg-color btn btn-small text-white"
                                            >
                                                {t('eventconditionlist_create_button')}
                                            </Link>
                                        </div>
                                        <div className="col col-md-5 mt-3">
                                        {conditionList.length > 1 && <span className="material-symbols-outlined mt-1 bold app-primary-color" role="button" data-bs-toggle='modal' data-bs-target='#EventConditionSort'>swap_vert</span>}
                                        </div>
                                    </div>
                                }
                                {/* button */}

                                {conditionList.length > 0 ? (
                                    <div className=" mt-3 mx-0">
                                        {conditionList.map((condition, index) => (
                                            <div className="row bg-light mb-1 m-0" key={index}>
                                                <div className="col-md-3 small mt-1">
                                                    <div>{condition.eventConditionDetails.ConditionName}</div>
                                                </div>
                                                <div className="col-md-5 mt-1">
                                                    <div>
                                                        <span className="small fw-bold pe-2">{t("eventconditionlist_when")}</span>
                                                        <span className="text-size-12">{condition.eventConditionDetails.ConditionValue}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 mt-1">
                                                    <div>
                                                        <span className="small fw-bold pe-2">{t("eventconditionlist_trigger")}</span>
                                                        <span className="text-size-12">{condition.eventConditionDetails.WorkflowName}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-1">

                                                    {checkForPermission('APPROVALWORKFLOW_MANAGE') &&
                                                        <div>
                                                            <Link to={`/config/workflowconfiguration/condition/${EventId}/edit/${condition.eventConditionDetails.Id}`}
                                                                className="app-primary-color"
                                                            >
                                                                <span className="material-symbols-outlined " role="button">edit</span>
                                                            </Link>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <>
                                    <div className="text-muted ps-3">{t('approvalworkflowview_nodata')}</div>
                                </>
                                }

                            </div>
                    }
                    )}
                    <EventConditionSort />

                </div>
            }
        </div>
    </ContainerPage>
    )
}