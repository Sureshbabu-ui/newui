import Select from "react-select";
import { useEffect } from 'react';
import { t } from "i18next";
import { dispatchOnCall, store } from "../../../../../state/store";
import { initialize, loadRoleTitles, loadRoleWiseList, updateField, toggleUpdate, startSubmitting, toggleInformationModalStatus, stopSubmitting, RoleWiseState, updateCheckbox } from "./RoleWise.slice";
import { formatSelectInput } from "../../../../../helpers/formats";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import { getRoleWiseNotificationList, updateNotifications } from "../../../../../services/notificationSetting";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import NoRecordFoundSvg from "../../../../../../src/svgs/NoRecordFound.svg"
import { getRoleTitles } from "../../../../../services/roles";

export const RoleWise = () => {
  const { notificationSettings, roleId, isUpdateDisabled, submitting, displayInformationModal, roleTitles } = useStoreWithInitializer(
    ({ rolewise }) => rolewise,
    dispatchOnCall(initialize())
  );

  const onLoad = async () => {
    try {
      const roleList = await getRoleTitles();
      const formattedRoleList = (formatSelectInput(roleList.RoleTitles, "RoleName", "Id"))
      store.dispatch(loadRoleTitles({ NotificationTitles: formattedRoleList }))
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onLoad();
  }, []);

  const onSelectChange = async (selectedOption: any, Name: any) => {
    const value = selectedOption.value
    const name = Name
    store.dispatch(updateField({ name, value }));
    const groupWiseSettings = await getRoleWiseNotificationList(value)
    store.dispatch(loadRoleWiseList(groupWiseSettings.unwrap()))
  }

  const enableEdit = () => {
    store.dispatch(toggleUpdate())
  }

  const updateBusinessSettings = async () => {
    store.dispatch(startSubmitting())
    const result = await updateNotifications(notificationSettings)
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: () => {
        return
      }
    });
    store.dispatch(stopSubmitting())
  }

  const onUpdateCheckbox = (ev: any) => {
    const name = ev.target.name;
    const value = ev.target.value;
    const status = ev.target.checked
    store.dispatch(updateCheckbox({ name: name as keyof RoleWiseState['notificationSettings'], value, status }));
  }

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={updateRoles}>
        {t('rolwise_notification_update_success')}
      </SweetAlert>
    );
  }

  const updateRoles = async () => {
    store.dispatch(toggleInformationModalStatus())
    store.dispatch(toggleUpdate())
    const groupWiseSettings = await getRoleWiseNotificationList(roleId)
    store.dispatch(loadRoleWiseList(groupWiseSettings.unwrap()))
  }

  return (
    <div className="pt-2" >
      <div className="row">
        <div className="col">
          <Select
            options={roleTitles}
            value={roleTitles && roleTitles.find(option => option.value == roleId) || null}
            onChange={(selectedOption) => onSelectChange(selectedOption, "roleId")}
            isSearchable
            name="roleId"
            placeholder={t('rolwise_notification_select_role')}
          />
        </div>
      </div>
      {notificationSettings.length > 0 && (
        <div className="row pt-3 pe-2 ps-0 ms-0">
          <table className='table table-bordered'>
            <thead className="">
              <tr>
                <th>{t('rolwise_notification_th_event')}</th>
                <th className="text-center">{t('rolwise_notification_th_email')}</th>
              </tr>
            </thead>
            <tbody>
              {notificationSettings.map((item, index) => (
                <tr key={index}>
                  <td>{item.Name}</td>
                  <td className="text-center">
                    <input
                      name="Email"
                      type="checkbox"
                      disabled={isUpdateDisabled}
                      className="form-check-input"
                      value={index}
                      checked={item.Email}
                      onChange={onUpdateCheckbox}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="col-md-12 mt-2 pe-0">
            {isUpdateDisabled && (<button type='button' className='btn  app-primary-bg-color text-white float-end' onClick={enableEdit}>
              {t('rolwise_notification_view_button_edit')}
            </button>)}
            {!isUpdateDisabled && (<button type='button' className='btn  app-primary-bg-color text-white mt-2  float-end' disabled={submitting} onClick={updateBusinessSettings}  >
              {submitting && (
                <>
                  <span className="spinner-grow spinner-grow-sm me-2" role="status" ></span>
                  <span className="spinner-grow spinner-grow-sm me-2" role="status" ></span>
                </>
              )}
              {t('rolwise_notification_view_button_update')}
            </button>)}
          </div>
          {displayInformationModal ? <InformationModal /> : ""}
        </div>
      )}
      <>
        {notificationSettings.length == 0 && (
          <div className="text-center mt-2">
            <img src={NoRecordFoundSvg} width="50" />
            <div className="small text-muted mt-1">{t('rolwise_notification_view_nodata')}</div>
          </div>)}
      </>
    </div>
  )
}