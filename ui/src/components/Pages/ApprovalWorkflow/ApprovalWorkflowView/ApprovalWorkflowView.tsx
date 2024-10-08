import { useEffect } from 'react';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { initializeApprovalWorkflowView, loadApprovalWorkflowDetails, setSearch } from './ApprovalWorkflowView.slice';
import { getApprovalWorkflowView } from '../../../../services/approvalWorkflowDetail';
import { checkForPermission } from '../../../../helpers/permissions';
import { useParams } from 'react-router-dom';
import { ApprovalWorkflowDetailCreate } from '../ApprovalWorkflowDetailCreate/ApprovalWorkflowDetailCreate';
import { ApprovalWorkflowDetailEdit } from '../ApprovalWorkflowDetailEdit/ApprovalWorkflowDetailEdit';
import { loadWorkflowDetailsForEdit } from '../ApprovalWorkflowDetailEdit/ApprovalWorkflowDetailEdit.slice';
import { ApprovalWorkflowViewDetail } from '../../../../types/approvalWorkflowDetail';

export const ApprovalWorkflowView = () => {
    const { t } = useTranslation();
    const { ApprovalWorkflowId } = useParams<{ ApprovalWorkflowId: string }>();

    const {
        approvalworkflowview: { approvalWorkflowDetails, approvalWorkflow, search },
    } = useStore(({ approvalworkflowview, app }) => ({ approvalworkflowview, app }));

    useEffect(() => {
        if (checkForPermission("APPROVALWORKFLOW_VIEW")) {
            onLoad();
        }
    }, [ApprovalWorkflowId]);

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_workflowconfiguration', Link: '/config/workflowconfiguration' },
            { Text: 'breadcrumbs_manage_approvalworkflowlist', Link: '/config/workflowconfiguration/approvalworkflow' },
            { Text: 'breadcrumbs_manage_approvalworkflowview' }
        ];
    }

    const onLoad = async () => {
        store.dispatch(initializeApprovalWorkflowView());
        try {
            fetchCollectionList()
        }
        catch (error) {
            return;
        }
    }

    const fetchCollectionList = async () => {
        try {
            const approvalWorkFlows = await getApprovalWorkflowView(ApprovalWorkflowId, search);
            store.dispatch(loadApprovalWorkflowDetails(approvalWorkFlows));
        }
        catch (error) {
            console.error(error);
        }
    }

    const filterApprovalWorkflowView = async () => {
        if (checkForPermission("APPROVALWORKFLOW_VIEW"))
            fetchCollectionList()
    }

    const handleSearch = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
    }

    useEffect(() => {
        if (search == "") {
            fetchCollectionList()
        }
    }, [search])

    const loadClickedWorkflowDetails = (EditDetails: ApprovalWorkflowViewDetail) => {
        store.dispatch(loadWorkflowDetailsForEdit({
            Id: EditDetails.Id,
            ApproverRoleId: EditDetails.ApproverRoleId,
            ApproverUserId: EditDetails.ApproverUserId,
            IsActive: EditDetails.IsActive,
            Sequence: EditDetails.Sequence,
            ApproverType:EditDetails.ApproverRoleId?'role':'user'
        }))
    }

    return (<ContainerPage >
        <BreadCrumb items={breadcrumbItems()} />
        <div>
            {checkForPermission("APPROVALWORKFLOW_VIEW") &&
                <div>

                    {approvalWorkflowDetails.match({
                        none: () => <div className="px-2 py-3">{t('approvalworkflowview_loading_message')}</div>,
                        some: (detail) =>
                            <div className=" pe-2 mt-2  mx-0 ps-2">
                                <div className="row ps-0 pe-2">
                                    <div>
                                        {approvalWorkflow.IsActive ? <span className="small">&#128994;</span> : <span className="small">&#128308;</span>}
                                        <span> {approvalWorkflow.Name}</span>
                                        <p className="text-muted small">{approvalWorkflow.Description}</p>
                                    </div>
                                </div>
                                <div className="mb-3 px-1">
                                    <div className="input-group">
                                        <input type='search' className="form-control custom-input" value={search ?? ''} placeholder={'Search' ?? ''} onChange={handleSearch}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    filterApprovalWorkflowView();
                                                }
                                            }} />
                                        <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterApprovalWorkflowView}>
                                            {t('approvalworkflowview_button_search')}
                                        </button>
                                    </div>
                                </div>

                                {detail.length > 0 ? (
                                    <div className=" mt-3 px-3">
                                        {detail.map((field, index) => (
                                            <div className="row" key={index}>
                                                <div className="col-1 text-center bg-light mb-3  align-middle">
                                                    <div className="align-middle py-2">
                                                        {field.approvalWorkflowDetails.Sequence}
                                                    </div>
                                                </div>
                                                <div className="col-10 px-0 ps-3">
                                                    <div className='bg-light ps-3 py-0'>
                                                        <div className='fw-bold'>
                                                            {field.approvalWorkflowDetails.IsActive ? <span className="small">&#128994;</span> : <span className="small">&#128308;</span>}
                                                            {field.approvalWorkflowDetails.RoleName}
                                                        </div>
                                                        <p> {field.approvalWorkflowDetails.ApproverUserName ?? ''}</p>
                                                    </div>
                                                </div>
                                                <div className="col-1 mx-0 px-0">
                                                    <div className="bg-light mx-0 px-0 py-2 text-middle">
                                                        <span className="material-symbols-outlined me-2 ms-1" role="button"
                                                            onClick={() => loadClickedWorkflowDetails(field.approvalWorkflowDetails)}
                                                            data-bs-toggle="modal"
                                                            data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                            data-bs-target="#ApprovalWorkflowDetailEdit"
                                                        >
                                                            edit
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <ApprovalWorkflowDetailEdit />
                                    </div>

                                ) : <>
                                    <div className="text-muted ps-3">{t('approvalworkflowview_nodata')}</div>
                                </>
                                }
                                {checkForPermission('APPROVALWORKFLOW_MANAGE') && <div className="row mb-3">
                                    <div className="col-12 text-center ">
                                        <div className='bg-light ps-3 py-2'>
                                            <div className='fw-bold'
                                                data-bs-toggle="modal"
                                                data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                data-bs-target="#ApprovalWorkflowDetailCreate"
                                                role="button"
                                            >
                                                {t('approvalworkflowview_create_button')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                    }
                    )}
                    {checkForPermission('APPROVALWORKFLOW_MANAGE') && <ApprovalWorkflowDetailCreate />}
                </div>
            }
        </div>
    </ContainerPage>
    )
}