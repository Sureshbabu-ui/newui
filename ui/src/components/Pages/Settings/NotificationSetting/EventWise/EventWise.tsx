
import Select from "react-select";
import { useState } from 'react';
import { useEffect } from 'react';
import { getBusinessEventTitles } from "../../../../../services/businessEvents";
import { formatSelectInput } from "../../../../../helpers/formats";
import { t } from "i18next";
import { EventWiseState, initialize, loadBusinessEventTitles, loadEventWiseList, startSubmitting, stopSubmitting, toggleInformationModalStatus, toggleUpdate, updateCheckbox, updateField } from "./EventWise.slice";
import { dispatchOnCall, store } from "../../../../../state/store";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import { getEventWiseNotificationList, updateNotifications } from "../../../../../services/notificationSetting";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import NoRecordFoundSvg from "../../../../../../src/svgs/NoRecordFound.svg"

export const EventWise = () => {
  const { notificationSettings, isUpdateDisabled, submitting, displayInformationModal, businessEventId, eventTitles } = useStoreWithInitializer(
    ({ eventwise }) => eventwise,
    dispatchOnCall(initialize())
  );

  const onLoad = async () => {
    try {
      const BusinessEventTitle = await getBusinessEventTitles();
      const eventTitles = (formatSelectInput(BusinessEventTitle.BusinessEventTitle, "Name", "Id"))
      store.dispatch(loadBusinessEventTitles({ NotificationTitles: eventTitles }))
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
    const eventWiseSettings = await getEventWiseNotificationList(value)
    store.dispatch(loadEventWiseList(eventWiseSettings.unwrap()))
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
        console.log("")
      }
    });
    store.dispatch(stopSubmitting())
  }

  const onUpdateCheckbox = (ev: any) => {
    const name = ev.target.name;
    const value = ev.target.value;
    const status = ev.target.checked
    store.dispatch(updateCheckbox({ name: name as keyof EventWiseState['notificationSettings'], value, status }));
  }

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={updateEvents}>
        {t('eventwise_update_success')}
      </SweetAlert>
    );
  }

  const updateEvents = async () => {
    store.dispatch(toggleInformationModalStatus())
    store.dispatch(toggleUpdate())
    const eventWiseSettings = await getEventWiseNotificationList(businessEventId)
    store.dispatch(loadEventWiseList(eventWiseSettings.unwrap()))
  }

  return (
    <div className="pt-2" >
      <div className="row">
        <div className="col">
          <Select
            options={eventTitles}
            value={eventTitles && eventTitles.find(option => option.value == businessEventId) || null}
            onChange={(selectedOption) => onSelectChange(selectedOption, "businessEventId")}
            isSearchable
            name="businessEventId"
            placeholder={t('eventwise_select_business_event')}
          />
        </div>
      </div>
      {notificationSettings.length > 0 && (
        <div className="row pt-3 ms-0 pe-2 ps-0">
          <table className='table table-bordered'>
            <thead className="">
              <tr>
                <th>{t('eventwise_th_roles')}</th>
                <th className="text-center">{t('eventwise_th_email')}</th>
              </tr>
            </thead>
            <tbody>
              {/* {groupList} */}
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
              {t('eventwise_view_button_edit')}
            </button>)}
            {!isUpdateDisabled && (<button type='button' className='btn  app-primary-bg-color text-white mt-2  float-end' disabled={submitting} onClick={updateBusinessSettings}  >
              {submitting && (
                <>
                  <span className="spinner-grow spinner-grow-sm me-2" role="status" ></span>
                  <span className="spinner-grow spinner-grow-sm me-2" role="status" ></span>
                </>
              )}
              {t('eventwise_view_button_update')}
            </button>)}
          </div>

          {displayInformationModal ? <InformationModal /> : ""}
        </div>
      )}
      <>
        {notificationSettings.length == 0 && (
          <div className="text-center mt-2">
            <img src={NoRecordFoundSvg} width="50" />
            <div className="small text-muted mt-1">{t('eventwise_view_nodata')}</div>
          </div>)}
      </>
    </div>
  )
}