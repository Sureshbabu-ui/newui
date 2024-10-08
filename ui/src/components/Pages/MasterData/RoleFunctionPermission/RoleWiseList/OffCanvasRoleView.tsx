import { useTranslation } from "react-i18next";
import {  store } from "../../../../../state/store";
import { useStore} from "../../../../../state/storeHooks";
import { RoleWiseState, updateCheckbox} from "./RoleWiseList.slice";

const OffCanvasRoleView = () => {
  const {
    rolewiselist: { roleFunctionPermissions, selectedPermissionMessage, isUpdateEnabled, selectedRole },
  } = useStore(({ rolewiselist }) => ({ rolewiselist }));

  const { t } = useTranslation();

  const onUpdateCheckbox = (ev: any) => {
    const name = ev.target.name;
    const value = ev.target.value;
    const status = ev.target.checked
    store.dispatch(updateCheckbox({ name: name as keyof RoleWiseState['roleFunctionPermissions'], value, status }));
  }

  const getPermissionCountMessageByModule = (moduleId: number) => {
    const assignedPermissions = roleFunctionPermissions.filter((item) =>
      item.Status == true && item.BusinessModuleId == moduleId
    ).length
    const totalPermissions = roleFunctionPermissions.filter((item) =>
      item.BusinessModuleId == moduleId
    ).length

    return `(${assignedPermissions}/${totalPermissions})`
  }

  const getPermissionCountByModule = (moduleId: number) => {
    const assignedPermissions = roleFunctionPermissions.filter((item) =>
      item.Status == true && item.BusinessModuleId == moduleId
    ).length
    return assignedPermissions
  }

  return (
    <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="roleWiseOffCanvas" aria-labelledby="roleWiseOffCanvasLabel">
      <div className="offcanvas-header">
        <h6 className="offcanvas-title" id="staticBackdropLabel">{`${t('rolewiseoffcanvas_message')}${selectedRole}`}</h6>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body pt-0 mt-0">
        <div><p>{selectedPermissionMessage}</p></div>
        <div>
          {roleFunctionPermissions.map((item, index) => (
            <div key={index}>
              {(getPermissionCountByModule(item.BusinessModuleId)>0) && (index === 0 || item.BusinessModuleId !== roleFunctionPermissions[index - 1].BusinessModuleId) ? (
              
              <div className="accordion d-flex py-0">
                  <div className="justify-content-center ">
                    <div className="accordion-header py-0" id="offcanvasrolewiseaccordion">
                      <div className="accordion-button py-1 m-0 text-middle" role="button" data-bs-toggle="collapse" data-bs-target={`#flush-offcanvas-${item.BusinessModuleId}`} aria-expanded="true" aria-controls={`flush-offcanvas-${item.BusinessModuleId}`}>
                      </div>
                    </div>
                  </div>
                  <div className="col mb-1">
                    <div className="accordion-header">
                      <span className="col-md-4 py-1">{item.BusinessModuleName} <span>{getPermissionCountMessageByModule(item.BusinessModuleId)}</span> </span>
                    </div>
                  </div>
                </div>
              ) : <></>
              }
              {(item.Status == true) ?
                <div id={`flush-offcanvas-${item.BusinessModuleId}`} className="ms-4 accordion-collapse  collapse show">
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
                  </div>
                </div>
                :
                <></>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default OffCanvasRoleView