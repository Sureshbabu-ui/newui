import { useEffect,useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage,  initializeRoleList, loadRoles, setSearch, setSearchSubmit } from './RoleList.slice'
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime } from "../../../../../helpers/formats";
import { deleteRole, getRoleList } from "../../../../../services/roles";
import { RoleCreate } from "../RoleCreate/RoleCreate";
import { RoleEdit } from "../../../../../types/role";
import { loadRoleEditDetails } from "../RoleEdit/RoleEdit.slice";
import { EditRole } from "../RoleEdit/RoleEdit";
import { checkForPermission } from "../../../../../helpers/permissions";
import FeatherIcon from 'feather-icons-react';
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const RoleList = () => {
    const { t ,i18n} = useTranslation();
    const {
        rolelist: { roles, totalRows, perPage, currentPage, search },
    } = useStore(({ rolelist, app }) => ({ rolelist, app }));

    useEffect(() => {
        if (checkForPermission("ROLE_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeRoleList());
        try {
            const Roles = await getRoleList(search, currentPage);
            store.dispatch(loadRoles(Roles));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getRoleList(search, index);
        store.dispatch(loadRoles(result));
    }

    async function filterRolesList(e) {
        store.dispatch(changePage(1))
        const result = await getRoleList(store.getState().rolelist.search,1)
        store.dispatch(loadRoles(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getRoleList(store.getState().rolelist.search, store.getState().rolelist.currentPage);
            store.dispatch(loadRoles(result));
        }
    }

    const loadClickedRoleDetails = (roleEditDetails: RoleEdit) => {
        store.dispatch(loadRoleEditDetails(roleEditDetails))
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_role' },
    ];

    const [Id, setId] = useState(0);

    const handleConfirm = (Id: number) => {
      setId(Id);
    };
  
    const handleCancel = () => {
      setId(0);
    };
  
    function DeleteConfirmationModal() {
      return (
        <SweetAlert
          warning
          showCancel
          confirmBtnText={t('rolelist_delete_confirm_btn')}
          confirmBtnBsStyle="warning"
          title={t('rolelist_delete_title')}
          onConfirm={() => handleDeleteRole(Id)}
          onCancel={handleCancel}
          focusCancelBtn
        >
          {t('role_list_delete_question')}
        </SweetAlert>
      );
    }

    async function handleDeleteRole(Id: number) {
        var result = await deleteRole(Id);
        result.match({
          ok: () => {
            setId(0);
            toast(i18n.t('rolelist_message_success_delete'), {
              duration: 2100,
              style: {
                borderRadius: '0',
                background: '#00D26A',
                color: '#fff',
              },
            });
            onLoad();
          },
          err: (err) => {
            toast(i18n.t(err.Message), {
              duration: 3600,
              style: {
                borderRadius: '0',
                background: '#F92F60',
                color: '#fff',
              },
            });
            setId(0);
          },
        });
      }    

    return (<ContainerPage>
        <>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission("ROLE_VIEW") && roles.match({
                none: () => <>{t('role_list_loading')}</>,
                some: (Roles) => 
                <div className="ps-3 pe-4 ">
                    <div className="row mt-1 mb-3 p-0 ">
                        <div className="col-md-9 app-primary-color ">
                            <h5 className="ms-0 ps-1"> {t('role_list_title')}</h5>
                        </div>
                        {checkForPermission("ROLE_MANAGE") &&
                            <div className="col-md-3 ">
                                <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateRole'>
                                    {t('role_list_button_create')}
                                </button>
                            </div>
                        }
                    </div>
                        <div className="mb-3 ps-1">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('role_list_placeholder_search') ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterRolesList(e);
                                            store.dispatch(setSearchSubmit(true))
                                        }
                                    }} onChange={addData} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={(e) => { filterRolesList(e), store.dispatch(setSearchSubmit(true)) }}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 ps-1"> 
                            {Roles.length > 0 ? (
                                <div className=" table-responsive ">
                                
                                    <table className="table table-hover text-nowrap table-bordered ">
                                        <thead>
                                            <tr>
                                                <th scope="col">{t('role_list_th_sl_no')}</th>
                                                <th scope="col">{t('role_list_th_name')}</th>
                                                <th scope="col">{t('role_list_th_issystemrole')}</th>
                                                <th scope="col">{t('role_list_th_createdon')}</th>
                                                <th scope="col">{t('role_list_th_createdby')}</th>
                                                <th scope="col">{t('role_list_th_updatedon')}</th>
                                                <th scope='col'>{t('role_list_th_updatedby')}</th>
                                                <th scope='col'>{t('role_list_th_status')}</th>
                                                <th scope='col'>{t('role_action_th_status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Roles.map((field, index) => (
                                                <tr className="mt-2">
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td> {field.role.Name} </td>
                                                    <td>{field.role.IsSystemRole?t('role_list_th_issystemrole_yes'):t('role_list_th_issystemrole_no')}</td>
                                                    <td>{formatDateTime(field.role.CreatedOn)} </td>
                                                    <td>{field.role.CreatedBy}</td>
                                                    <td>{field.role.UpdatedOn ? formatDateTime(field.role.UpdatedOn) : "Not yet updated"} </td>
                                                    <td>{field.role.UpdatedBy ? field.role.UpdatedBy : "Not yet updated"}</td>
                                                    <td >{field.role.IsActive == true ? "ACTIVE" : "INACTIVE"}</td>
                                                    <td >
                                                    {checkForPermission("ROLE_MANAGE") && !field.role.IsSystemRole &&
                                                    <><span
                                                            className="pseudo-href app-primary-color ms-3"
                                                            onClick={() => loadClickedRoleDetails({ IsActive: field.role.IsActive, Name: field.role.Name, RoleId: field.role.Id })}
                                                            data-bs-toggle="modal"
                                                            data-bs-target='#EditRole'
                                                        >
                                                            <FeatherIcon icon={"edit"} size="16" />
                                                        </span>
                                                             <span className="pseudo-href app-primary-color" onClick={() => handleConfirm(field.role.Id)}>
                                                             <FeatherIcon icon={"trash-2"} size="16" />
                                                           </span>
                                                           </>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row m-0">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('rolelist_no_data')}</div>
                            )}
                        </div>
                    <RoleCreate />
                    <EditRole />
                    {Id ? <DeleteConfirmationModal /> : ""}
          {/* Confirmation Modal End*/}
          <Toaster />
                </div>
            })}
        </>
    </ContainerPage>)
}