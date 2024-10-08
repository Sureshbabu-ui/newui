import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../state/storeHooks';
import { store } from '../../../../state/store';
import { clearEventConditionSort, downwardMove, initializeEventConditionSort, loadEventConditionSortDetails, toggleInformationModalStatus, updateErrors, upwardMove } from './EventConditionSort.slice';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { checkForPermission } from "../../../../helpers/permissions";
import { getEventConditionListView, sortEventCondition } from "../../../../services/ApprovalWorkflow/eventCondition";
import { useParams } from "react-router-dom";
import { convertBackEndErrorsToValidationErrors } from "../../../../helpers/formats";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadEventConditionDetails } from "../EventConditionList/EventConditionList.slice";

export const EventConditionSort = () => {
    const { t } = useTranslation();
    const { EventId } = useParams<{ EventId: string }>();

    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        eventconditionsort: { eventConditionList, eventDetail, displayInformationModal,selectedId },
    } = useStore(({ eventconditionsort }) => ({ eventconditionsort, }));

    useEffect(() => {
        if (checkForPermission('APPROVALWORKFLOW_VIEW'))
            onLoad();
    }, [EventId]);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeEventConditionSort());
        try {
            const approvalWorkFlows = await getEventConditionListView(EventId, null);
            store.dispatch(loadEventConditionSortDetails(approvalWorkFlows));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const handleUpwardMove = (ev: any) => {
        const name = ev.currentTarget.name
        const value = ev.currentTarget.value
        store.dispatch(upwardMove({ name: name, value: value }))
    }

    const handleDownwardMove = (ev: any) => {
        const name = ev.currentTarget.name
        const value = ev.currentTarget.value
        store.dispatch(downwardMove({ name: name, value: value }))
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        store.dispatch(startPreloader());
        const result = await sortEventCondition(EventId, eventConditionList);
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateEventConditions}>
                {t('eventconditionsort_success_message')}
            </SweetAlert>
        );
    }

    const updateEventConditions = async () => {
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click()
    }
    const onModalClose = async () => {
        const approvalWorkFlows = await getEventConditionListView(EventId, null);
        store.dispatch(clearEventConditionSort())
        store.dispatch(loadEventConditionDetails(approvalWorkFlows));
   }
    return (
        <>
            <div
                className="modal fade modal-lg"
                id='EventConditionSort'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('eventconditionsort_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEventConditionSortModal'
                                aria-label='Close'
                                ref={modalRef}
                                onClick={onModalClose}
                            ></button>
                        </div>
                        <div className="modal-body text-wrap">
                            {checkForPermission("APPROVALWORKFLOW_MANAGE") &&
                                <div>
                                    <div className=" pe-2 mt-2  mx-0 ps-2">
                                        <div className="row m-0 mb-1">
                                            <div className="col-md-6 text-end">{t('eventconditionsort_groupname')} :</div>
                                            <div className="col-md-6">{eventDetail.EventGroupName}</div>
                                        </div>
                                        <div className="row m-0">
                                            <div className="col-md-6 text-end">{t('eventconditionsort_eventname')} :</div>
                                            <div className="col-md-6">{eventDetail.EventName}</div>
                                        </div>

                                        {eventConditionList.length > 0 ? (
                                            <div className=" mt-3 mx-0">
                                                {eventConditionList?.map((condition, index) => (
                                                    <div className={`row mb-1 m-0 ${selectedId ==condition.Id ?"btn-highlight":"bg-light "}`} key={index}>
                                                        <div className="col-md-3 small mt-1">
                                                            <div>{condition.ConditionName}</div>
                                                        </div>
                                                        <div className="col-md-4 mt-1">
                                                            <div>
                                                                <span className="small fw-bold pe-2">{t("eventconditionsort_when")}</span>
                                                                <span className="text-size-12">{condition.ConditionValue}</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 mt-1">
                                                            <div>
                                                                <span className="small fw-bold pe-2">{t("eventconditionsort_trigger")}</span>
                                                                <span className="text-size-12">{condition.WorkflowName}{condition.Sequence}</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            {checkForPermission('APPROVALWORKFLOW_MANAGE') &&
                                                                <div className="btn-group" role="group">
                                                                    {index != 0 && <button className="btn px-1" name={condition.Id?.toString()} onClick={handleUpwardMove} value={condition.Sequence ?? 0}>
                                                                        <span className="material-symbols-outlined " role="button">arrow_upward</span>
                                                                    </button>}
                                                                    {index < eventConditionList.length - 1 && <button className="btn px-1" name={condition.Id?.toString()} onClick={handleDownwardMove} value={condition.Sequence ?? 0}>
                                                                        <span className="material-symbols-outlined " role="button">arrow_downward</span>
                                                                    </button>
                                                                    }
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="col-md-1 text-middle">
                                                    <button className="btn app-primary-bg-color text-white mt-2" onClick={onSubmit} >
                                                        submit
                                                    </button>
                                                    {displayInformationModal ? <InformationModal /> : ""}
                                                </div>
                                            </div>
                                        ) : <>
                                            <div className="text-muted ps-3">{t('approvalworkflowview_nodata')}</div>
                                        </>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}