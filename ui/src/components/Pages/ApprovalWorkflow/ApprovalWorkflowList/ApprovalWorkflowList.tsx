import { useEffect } from 'react';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { initializeApprovalWorkflowList, loadApprovalWorkflows, setSearch } from './ApprovalWorkflowList.slice';
import { getApprovalWorkflowList } from '../../../../services/approvalWorkflow';
import { checkForPermission } from '../../../../helpers/permissions';
import { Link } from 'react-router-dom';
import { ApprovalWorkflowEdit } from '../ApprovalWorkflowEdit/ApprovalWorkflowEdit';
import { ApprovalWorkflowListDetail } from '../../../../types/approvalWorkflow';
import { loadWorkflowDetailsForEdit } from '../ApprovalWorkflowEdit/ApprovalWorkflowEdit.slice';
import { ApprovalWorkflowCreate } from '../ApprovalWorkflowCreate/ApprovalWorkflowCreate';

export const ApprovalWorkflowList = () => {
    const { t } = useTranslation();
    const {
        approvalworkflowlist: { approvalWorkflows, totalRows, search },
    } = useStore(({ approvalworkflowlist, app }) => ({ approvalworkflowlist, app }));

    useEffect(() => {
        if (checkForPermission("APPROVALWORKFLOW_VIEW")) {
            onLoad();
        }
    }, []);

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_workflowconfiguration', Link: '/config/workflowconfiguration' },
            { Text: 'breadcrumbs_manage_approvalworkflowlist' }
        ];
    }

    const onLoad = async () => {
        store.dispatch(initializeApprovalWorkflowList());
        try {
            fetchWorkflowList()
        }
        catch (error) {
            return;
        }
    }

    const fetchWorkflowList = async () => {
        try {
            const workflows = await getApprovalWorkflowList(search);
            store.dispatch(loadApprovalWorkflows(workflows));
        }
        catch (error) {
            return;
        }
    }

    const filterApprovalWorkflowList = async () => {
        if (checkForPermission("APPROVALWORKFLOW_VIEW"))
            fetchWorkflowList()
    }

    const handleSearch = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
    }

    useEffect(() => {
        fetchWorkflowList()
    }, [search])

    const loadClickedWorkflowDetails = (EditDetails: ApprovalWorkflowListDetail) => {
        store.dispatch(loadWorkflowDetailsForEdit({ Id: EditDetails.Id, Name: EditDetails.Name, Description: EditDetails.Description, IsActive: EditDetails.IsActive }))
    }

    return (<ContainerPage >
        <BreadCrumb items={breadcrumbItems()} />
        <div>
            <div className="row">
                {checkForPermission("APPROVALWORKFLOW_MANAGE") &&
                    <div className="col-md-12 ">
                        <button className="btn app-primary-bg-color text-white float-end me-2" data-bs-toggle='modal' data-bs-target='#CreateApprovalWorkflow'>
                            {t('approvalworkflowlist_create_btn')}
                        </button>
                    </div>
                }
            </div>
            {checkForPermission("APPROVALWORKFLOW_VIEW") &&
                <div>
                    {approvalWorkflows.match({
                        none: () => <div className="px-2 py-3">{t('approvalworkflowlist_loading_message')}</div>,
                        some: (collection) =>
                            <div className=" pe-2 mt-2  mx-0 ps-2">
                                <div className="mb-3">
                                    <div className="input-group">
                                        <input type='search' className="form-control custom-input" value={search ?? ''} placeholder={'Search' ?? ''} onChange={handleSearch}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    filterApprovalWorkflowList();
                                                }
                                            }} />
                                        <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterApprovalWorkflowList}>
                                            {t('approvalworkflowlist_button_search')}
                                        </button>
                                    </div>

                                </div>
                                {collection.length > 0 ? (
                                    <>
                                        {collection.map((field, index) => (
                                            <div className="row bg-light py-2 my-1 mx-0" key={index}>
                                                <div className="col-11 bg-light  py-0">
                                                    <div className="py-0">
                                                        {field.approvalWorkflow.IsActive ? <span className="small">&#128994;</span> : <span className="small">&#128308;</span>}
                                                        <span>{field.approvalWorkflow.Name}</span>
                                                        {checkForPermission("APPROVALWORKFLOW_MANAGE") &&
                                                            <span className="material-symbols-outlined me-2 small ms-1" role="button"
                                                                onClick={() => loadClickedWorkflowDetails(field.approvalWorkflow)}
                                                                data-bs-toggle="modal"
                                                                data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                data-bs-target="#EditApprovalWorkflow"
                                                            >
                                                                edit
                                                            </span>
                                                        }
                                                    </div>
                                                    <p className="text-muted small mb-0">{field.approvalWorkflow.Description}</p>
                                                </div>
                                                <div className="col-1 text-middle my-0 py-0 my-0">
                                                    <div className='bg-light text-middle text-center ps-3'>
                                                        <Link
                                                            className="pseudo-href app-primary-color me-2"
                                                            to={`/config/workflowconfiguration/approvalworkflow/${field.approvalWorkflow.Id}`}
                                                        >
                                                            <span className='fw-bold'>{field.approvalWorkflow.SequenceCount}</span>
                                                        </Link>
                                                        <div className='fw-bold'>{`${(field.approvalWorkflow?.SequenceCount ?? 0) > 1 ? t('approvalworkflowlist_th_levels') : t('approvalworkflowlist_th_level')}`}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {checkForPermission("APPROVALWORKFLOW_MANAGE") && <ApprovalWorkflowEdit />}
                                    </>
                                ) :
                                    <div className="text-muted ps-3">{t('approvalworkflowlist_nodata')}</div>
                                }
                            </div>
                    }
                    )}
                </div>
            }
        </div>
        <ApprovalWorkflowCreate />
    </ContainerPage>
    )
}