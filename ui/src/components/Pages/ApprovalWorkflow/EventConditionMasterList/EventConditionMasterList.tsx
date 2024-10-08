import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../state/storeHooks';
import { store } from '../../../../state/store';
import { initializeEventConditionMasterList, loadEventConditionMasters, loadApprovalEvents, updateField } from './EventConditionMasterList.slice';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { checkForPermission } from "../../../../helpers/permissions";
import { getEventConditionMasterList } from "../../../../services/ApprovalWorkflow/eventConditionMaster";
import Select from "react-select";
import { getApprovalEventNames } from "../../../../services/ApprovalWorkflow/approvalEvent";
import { formatSelectInput } from "../../../../helpers/formats";

export const EventConditionMasterList = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);

    const {
        eventconditionmasterlist: { eventConditionMasters, approvalEventList, approvalEventId },
    } = useStore(({ eventconditionmasterlist, app }) => ({ eventconditionmasterlist, app }));

    useEffect(() => {
        if (checkForPermission('APPROVALWORKFLOW_VIEW'))
            onLoad();
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeEventConditionMasterList());
        try {
            const eventList = await getApprovalEventNames();
            const FilteredEvents = await formatSelectInput(eventList.ApprovalEvents, "EventName", "Id")
            store.dispatch(loadApprovalEvents({ MasterData: FilteredEvents }));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    async function filterEventConditionMasterList(approvalEventId: number) {
        const result = await getEventConditionMasterList(approvalEventId)
        store.dispatch(loadEventConditionMasters(result));
    }

    useEffect(() => {
        if (approvalEventId)
            filterEventConditionMasterList(approvalEventId)
    }, [approvalEventId])

    const getEventCountByGroup = (MasterTableId: number) => {
        const eventCount = eventConditionMasters.filter((event) =>
            event.MasterTableId == MasterTableId
        ).length
        return `(${eventCount})`
    }

    const onSelectChange = async (selectedOption: any, Name: any) => {
        const name = Name;
        store.dispatch(updateField({ name, value: selectedOption ? selectedOption.value : null }));
    };

    return (
        <>
            <div
                className="modal fade modal-lg"
                id='EventConditionMasterList'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('eventconditionmasterlist_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEventConditionMasterListModal'
                                aria-label='Close'
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {checkForPermission("APPROVALWORKFLOW_VIEW") &&
                                <div className="ps-0 pe-0">
                                    <div className="ps-0 pe-2">
                                        <Select
                                            options={approvalEventList}
                                            value={approvalEventList && approvalEventList.find(option => option.value == approvalEventId) || null}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "approvalEventId")}
                                            isSearchable
                                            name="roleId"
                                            placeholder={t('eventconditionmasterlist_select_table')}
                                        />
                                    </div>
                                    {eventConditionMasters.length > 0 ?
                                        <div className="row pe-0 ps-0 mb-2">
                                            <div className="accordion accordion-flush pe-3 me-0 mt-4" id="eventconditionmasterlist">
                                                {eventConditionMasters.map((event, index) => (
                                                    <div key={index}>
                                                        {index === 0
                                                            || event.MasterTableId !== eventConditionMasters?.[index - 1]?.MasterTableId
                                                            ? (
                                                                <div className="accordion d-flex bg-light mb-1 pt-2">
                                                                    <div className=" mb-1 align-self-center">
                                                                        <div className="accordion-header" id="accordion">
                                                                            <div className={`accordion-button collapsed py-1  m-0`} role="button" data-bs-toggle="collapse" data-bs-target={`#flush-${event.MasterTableId}`} aria-expanded="false" aria-controls={`flush-${event.MasterTableId}`}>
                                                                                <span className=" py-1"></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col mb-1">
                                                                        <div className="accordion-header">
                                                                            <span className="col-md-4 py-1">{event.TableName}</span>
                                                                            <span className="align-self-center ps-2">
                                                                                {getEventCountByGroup(event.MasterTableId ?? 0)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : null
                                                        }
                                                        <div id={`flush-${event.MasterTableId}`} className="ms-4 accordion-collapse  collapse">
                                                            <div className="accordion-body px-0 py-2 pt-1 bg-white ps-5">
                                                                <span>{event.ColumnName}</span>
                                                                <span className="text-end ms-4 py-1 px-2 bg-primary-subtle">{event.ValueType}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        : approvalEventId ?<div className="ps-0 mt-2">{t('eventconditionmasterlist_no_data')}</div>:<div className="my-4"></div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}