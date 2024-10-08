import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../state/storeHooks';
import { store } from '../../../../state/store';
import { initializeApprovalEventList, loadApprovalEvents, setSearch } from './ApprovalEventList.slice';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { getApprovalEventList } from "../../../../services/ApprovalWorkflow/approvalEvent";
import { checkForPermission } from "../../../../helpers/permissions";
import { Link } from "react-router-dom";

export const ApprovalEventList = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);

    const {
        approvaleventlist: { approvalEvents, search },
    } = useStore(({ approvaleventlist, app }) => ({ approvaleventlist, app }));

    useEffect(() => {
        if (checkForPermission('APPROVALWORKFLOW_VIEW'))
            onLoad();
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeApprovalEventList());
        try {
            const ApprovalEvent = await getApprovalEventList(search);
            store.dispatch(loadApprovalEvents(ApprovalEvent));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    async function filterApprovalEventList(e) {
        const result = await getApprovalEventList(store.getState().approvaleventlist.search)
        store.dispatch(loadApprovalEvents(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            const result = await getApprovalEventList(store.getState().approvaleventlist.search);
            store.dispatch(loadApprovalEvents(result));
        }
    }

    const getEventCountByGroup = (EventGroupId: number) => {
        const eventCount = approvalEvents.filter((event) =>
            event.EventGroupId == EventGroupId
        ).length
        return `(${eventCount})`
    }

    return (
        <>
            <div
                className="modal fade modal-lg"
                id='ApprovalEventList'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('approvaleventlist_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeApprovalEventListModal'
                                aria-label='Close'
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {checkForPermission("APPROVALWORKFLOW_VIEW") &&
                                <div className="ps-0 pe-0">
                                    <div className="ps-0 pe-2">
                                        <div className="input-group">
                                            <input type='search' className="form-control custom-input" value={search ?? ""} placeholder={t('approvaleventlist_placeholder_search') ?? ''}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        filterApprovalEventList(e);
                                                    }
                                                }} onChange={addData} />
                                            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterApprovalEventList}>
                                                {t('approvaleventlist_btn_search')}
                                            </button>
                                        </div>
                                    </div>
                                    {approvalEvents.length > 0 ?
                                        <div className="row pe-0 ps-0 mb-2">
                                            <div className="accordion accordion-flush pe-3 me-0 mt-4" id="part-indent-orders">
                                                {approvalEvents.map((event, index) => (
                                                    <div key={index}>
                                                        {index === 0
                                                            || event.EventGroupId !== approvalEvents?.[index - 1]?.EventGroupId
                                                            ? (
                                                                <div className="accordion d-flex bg-light mb-1 pt-2">
                                                                    <div className=" mb-1 align-self-center">
                                                                        <div className="accordion-header" id="accordion">
                                                                            <div className={`accordion-button collapsed py-1  m-0`} role="button" data-bs-toggle="collapse" data-bs-target={`#flush-${event.EventGroupId}`} aria-expanded="false" aria-controls={`flush-${event.EventGroupName}`}>
                                                                                <span className=" py-1"></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col mb-1">
                                                                        <div className="accordion-header">
                                                                            <span className="col-md-4 py-1">{event.EventGroupName}</span>
                                                                            <span className="align-self-center ps-2">
                                                                                {getEventCountByGroup(event.EventGroupId ?? 0)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : null
                                                        }
                                                        <div id={`flush-${event.EventGroupId}`} className="ms-4 accordion-collapse  collapse">
                                                            <div className="accordion-body px-0 py-2 pt-1 bg-white ps-5">
                                                                <Link to={`/config/workflowconfiguration/condition/${event.ApprovalEventId}`}
                                                                    onClick={() => { modalRef.current?.click(); }}
                                                                >
                                                                    <span>{event.EventName}</span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        : <div className="ps-0 mt-2">{t('approvalrequestlist_no_data')}</div>
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