import Select from "react-select";
import { useEffect } from 'react';
import { dispatchOnCall, store } from "../../../../../state/store";
import { formatSelectInput, formatSelectInputWithCode } from "../../../../../helpers/formats";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import { getRoleTitles } from "../../../../../services/roles";
import { RoleWiseState, getSelectedPermissionMessage, initialize, loadBusinessFunctionTypes, loadBusinessModules, loadRoleTitles, loadRoleWiseList, startSubmitting, stopSubmitting, toggleInformationModalStatus, toggleUpdate, updateCheckbox, updateField, updateModuleCheckbox } from "./RoleWiseList.slice";
import { getRoleWisePermissionList, updateRoleFunctionPermissions } from "../../../../../services/roleFunctionPermission";
import { checkForPermission } from "../../../../../helpers/permissions";
import OffCanvasRoleView from "./OffCanvasRoleView";
import { getBusinessModuleListForDropDown } from "../../../../../services/businessModule";
import { getValuesInMasterDataByTable } from "../../../../../services/masterData";

export const RoleWiseList = () => {
    const { roleFunctionPermissions, roleId, isUpdateEnabled, submitting, displayInformationModal, roleTitles, activeTab, selectedPermissionMessage, BusinessModuleList, SelectedModuleId, BusinessFunctionTypeList } = useStoreWithInitializer(
        ({ rolewiselist }) => rolewiselist,
        dispatchOnCall(initialize())
    );

    const { t } = useTranslation();

    const onLoad = async () => {
        try {
            const { BusinessModule } = await getBusinessModuleListForDropDown();
            const formattedModules = await formatSelectInput(BusinessModule, "BusinessModuleName", "Id").sort((a, b) => a.label.localeCompare(b.label))
            store.dispatch(loadBusinessModules({ MasterData: formattedModules }));
            const roleList = await getRoleTitles();
            const formattedRoleList = (formatSelectInput(roleList.RoleTitles, "RoleName", "Id"))
            store.dispatch(loadRoleTitles({ RoleFunctionPermissionTitles: formattedRoleList }))
            const functionTypeList = await getValuesInMasterDataByTable("BusinessFunctionType");
            const FilteredFunctionTypes = await formatSelectInputWithCode(functionTypeList.MasterData, "Name", "Id", "Code")
            store.dispatch(loadBusinessFunctionTypes({ MasterData: FilteredFunctionTypes }));
        } catch (error) {
            return;
        }
    }

    useEffect(() => {
        onLoad();
    }, []);

    const onSelectChange = async (selectedOption: any, Name: any) => {
        const name = Name;
        store.dispatch(updateField({ name, value: selectedOption ? selectedOption.value : null }));
    };

    const filterPermissionList = async () => {
        const roleWisePermissions = await getRoleWisePermissionList(roleId, activeTab, SelectedModuleId);
        store.dispatch(loadRoleWiseList(roleWisePermissions.unwrap()));
    }

    useEffect(() => {
        if (roleId > 0) {
            store.dispatch(updateField({ name: 'selectedRole', value: roleTitles.find(item => item.value == roleId)?.label ?? '' }))
            filterPermissionList()
        }
    }, [activeTab, roleId])

    useEffect(() => {
        if (roleId > 0)
            filterPermissionList()
    }, [SelectedModuleId])

    const enableEdit = (ev: any) => {
        store.dispatch(toggleUpdate(ev.target.checked))
    }

    const updateBusinessSettings = async () => {
        store.dispatch(startSubmitting())
        const result = await updateRoleFunctionPermissions(roleFunctionPermissions)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: () => {
                return;
            }
        });
        store.dispatch(stopSubmitting())
    }

    const onUpdateCheckbox = (ev: any) => {
        const name = ev.target.name;
        const value = ev.target.value;
        const status = ev.target.checked
        store.dispatch(updateCheckbox({ name: name as keyof RoleWiseState['roleFunctionPermissions'], value, status }));
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={updateRoles}>
                {t('rolewise_update_success')}
            </SweetAlert>
        );
    }

    const updateRoles = async () => {
        store.dispatch(toggleInformationModalStatus())
        store.dispatch(toggleUpdate(false))
        filterPermissionList();
    }

    const onUpdateModuleCheckbox = (ev: any) => {
        const moduleId = ev.target.value;
        const status = ev.target.checked
        store.dispatch(updateModuleCheckbox({ moduleId, status }))
    }

    const moduleCheckedStatus = (moduleId: number) => {
        return roleFunctionPermissions.filter(permission => permission.BusinessModuleId === moduleId)
            .every(permission => permission.Status === true);
    }

    useEffect(() => {
        store.dispatch(getSelectedPermissionMessage())
    }, [roleFunctionPermissions])

    const getPermissionCountByModule = (moduleId: number) => {
        const assignedPermissions = roleFunctionPermissions.filter((item) =>
            item.Status == true && item.BusinessModuleId == moduleId
        ).length
        const totalPermissions = roleFunctionPermissions.filter((item) =>
            item.BusinessModuleId == moduleId
        ).length
        return `${assignedPermissions}/${totalPermissions}`
    }

    const getPermissionCount = () => {
        return roleFunctionPermissions.filter((item) =>
            item.Status == true
        ).length
    }

    return (
        <div className="col-md-12 col ps-1" >
            <div className="mt-4 pt-4 text-dark">
                <h4 className="app-primary-color">{t('rolefunctionpermissionlist_title')}</h4>
                <p className="small">{t('rolefunctionpermissionlist_help_text')}</p>
                <div className="mt-2">
                    {checkForPermission("ROLEPERMISSION_VIEW") &&
                        <>
                            <div className="col col-md-6">
                                <Select
                                    options={roleTitles}
                                    value={roleTitles && roleTitles.find(option => option.value == roleId) || null}
                                    onChange={(selectedOption) => onSelectChange(selectedOption, "roleId")}
                                    isSearchable
                                    name="roleId"
                                    placeholder={t('rolewise_select_role')}
                                />
                            </div>
                        </>
                    }
                </div>
            </div>
            {roleId > 0 && (
                <div className="row">
                    <nav className="mb-2 mt-3">
                        <div className="nav nav-tabs " id="nav-tab" role="tablist">
                            {BusinessFunctionTypeList.map((option) => (
                                <button
                                    key={option.value}
                                    className={`nav-link ${activeTab === option.code ? "active" : ''} `}
                                    onClick={() => store.dispatch(updateField({ name: "activeTab", value: option.code }))}
                                    role="tab"
                                    aria-controls={`status-tab-${option.value}`}
                                    id={`nav-${option.label}-tab`}
                                    data-bs-toggle="tab"
                                    data-bs-target={`#${option.label}`}
                                    type="button"
                                    aria-selected="true"
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
            )}
            {roleId > 0 && (
                <div className="pe-2 ps-0 row ">
                    <div className="d-flex justify-content-between">
                        <div>
                            <span>{selectedPermissionMessage}
                                {getPermissionCount() ? <a className="ms-2" data-bs-toggle="offcanvas" href="#roleWiseOffCanvas" role="button" aria-controls="roleWiseOffCanvas">
                                    {t('rolewiselist_link_selectedpermission')}
                                </a> : <></>}</span>
                        </div>
                        <div className="col-4">
                            <Select
                                value={BusinessModuleList && BusinessModuleList.filter(option => option.value == SelectedModuleId) || null}
                                options={BusinessModuleList}
                                onChange={(selectedOption) => onSelectChange(selectedOption, "SelectedModuleId")}
                                isSearchable
                                isClearable
                                name="SelectedModuleId"
                                placeholder={t('rolewiselist_moduleselect_placeholder')} />
                        </div>
                    </div>
                    <div className="row pe-0">
                        <div className="accordion accordion-flush pe-0 me-0 mt-4" id="part-indent-orders">
                            {roleFunctionPermissions.map((item, index) => (
                                <div key={index}>
                                    {index === 0 || item.BusinessModuleId !== roleFunctionPermissions[index - 1].BusinessModuleId ? (
                                        <div className="accordion d-flex bg-light mb-1 pt-2">
                                            <div className=" mb-1 align-self-center">
                                                <div className="accordion-header" id="rolewiseaccordion">
                                                    <div className={`accordion-button collapsed py-1  m-0`} role="button" data-bs-toggle="collapse" data-bs-target={`#flush-${item.BusinessModuleId}`} aria-expanded="false" aria-controls={`flush-${item.BusinessModuleId}`}>
                                                        <span className=" py-1"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-light mb-1 ps-1  align-top">
                                                <input
                                                    name="ModuleStatus me-2 ps-0 pt-0"
                                                    type="checkbox"
                                                    className="me-1 form-check-input switch-input-lg"
                                                    value={item.BusinessModuleId}
                                                    checked={moduleCheckedStatus(item.BusinessModuleId)}
                                                    disabled={!isUpdateEnabled}
                                                    onChange={onUpdateModuleCheckbox}
                                                />
                                            </div>
                                            <div className="col mb-1">
                                                <div className="accordion-header">
                                                    <span className="col-md-4 py-1">{item.BusinessModuleName}</span>
                                                    <p className="small">{item.BusinessModuleDescription} </p>
                                                </div>
                                            </div>
                                            <div className="align-self-center pe-2">
                                                {getPermissionCountByModule(item.BusinessModuleId ?? 0)}
                                            </div>
                                        </div>
                                    ) : null
                                    }
                                    <div id={`flush-${item.BusinessModuleId}`} className="ms-4 accordion-collapse  collapse">
                                        <div className="accordion-body px-0 py-2 pt-1 bg-white ps-5">
                                            <input
                                                name="Status"
                                                type="checkbox"
                                                className="me-1 form-check-input"
                                                value={index}
                                                checked={item.Status}
                                                disabled={!isUpdateEnabled}
                                                onChange={onUpdateCheckbox}
                                            />
                                            <span>{item.Name}</span>
                                            {/* TODO:"The placeholder text, lorem ipsum, will be replaced with an accurate and meaningful description once it becomes available." */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="row mt-4">
                        {checkForPermission("ROLEPERMISSION_MANAGE") &&
                            <div className="d-flex justify-content-between fixed-bottom app-primary-bg-color text-white py-2 mt-2 pe-0">
                                <div className="form-check form-switch ms-2 py-1 text-middle">
                                    <input className="form-check-input bg-sucess custom-switch" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={isUpdateEnabled} onClick={enableEdit} />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{t('rolewise_view_label_edit_permissions')}</label>
                                </div>
                                {isUpdateEnabled && (<button type='button' className='btn my-0  me-4 btn-sm app-primary-color bg-white fw-bold  float-end' disabled={submitting} onClick={updateBusinessSettings}  >
                                    {submitting && (
                                        <>
                                            <span className="spinner-grow spinner-grow-sm me-2" role="status" ></span>
                                            <span className="spinner-grow spinner-grow-sm me-2" role="status" ></span>
                                        </>
                                    )}
                                    {t('rolewise_view_button_update')}
                                </button>)}
                            </div>
                        }
                    </div>
                    {displayInformationModal ? <InformationModal /> : ""}
                    <OffCanvasRoleView />
                </div>
            )}
        </div>
    )
}