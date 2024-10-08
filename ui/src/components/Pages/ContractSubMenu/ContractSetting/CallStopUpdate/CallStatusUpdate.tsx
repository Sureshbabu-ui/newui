import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { dispatchOnCall, store } from '../../../../../state/store';
import {
  CallStopSettingsState,
  initializeCallStopStatusDetails,
  loadCallStopStatus,
  loadCallStophistory,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
} from './CallStatusUpdate.slice';
import { useEffect } from 'react';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { getCallStopHistory, getCallStopStatus, updateCallStatusDetails } from '../../../../../services/contractSetting';
import { convertBackEndErrorsToValidationErrors, formatDate } from '../../../../../helpers/formats';
import * as yup from 'yup';
import SweetAlert from 'react-bootstrap-sweetalert';
import { checkForPermission } from '../../../../../helpers/permissions';
import { useRef } from 'react'

export const CallStatusUpdate = () => {
  const { t } = useTranslation();
  const { ContractId } = useParams<{ ContractId: string }>();
  const modalRef = useRef<HTMLButtonElement>(null);
  const CALL_STATS_UPDATE = "CALL_STATUS_UPDATE"
  const { callStatusDetails, callStatusUpdateData, callStopHistory, isUpdateEnabled, displayInformationModal, errors } =
    useStoreWithInitializer(
      ({ callstopsetting }) => callstopsetting,
      dispatchOnCall(initializeCallStopStatusDetails())
    );

  useEffect(() => {
    if (checkForPermission('CONTRACT_CREATE')) {
      onLoad();
    }
  }, [ContractId]);

  const onLoad = async () => {
    store.dispatch(startPreloader());
    try {
      const CallStopStatus = await getCallStopStatus(ContractId);
      store.dispatch(loadCallStopStatus(CallStopStatus));
    } catch (error) {
      console.error(error);
    }
    store.dispatch(stopPreloader());
  };

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof CallStopSettingsState['callStatusUpdateData'], value }));
  };

  const updateCallStatus = async () => {
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(callStatusUpdateData, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors));
      if (errors) return;
    }
    store.dispatch(startPreloader());
    const result = await updateCallStatusDetails(ContractId, callStatusUpdateData);
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e);
        store.dispatch(updateErrors(errorMessages));
      },
    });
    store.dispatch(stopPreloader());
  };

  const validationSchema = yup.object().shape({
    Reason: yup
      .string()
      .required(t('validation_error_contractcallstatus_reason_required') ?? '')
      .max(64, t('validation_error_designation_create_name_max') ?? ''),
    CallStopDate: yup
      .string()
      .required(t('validation_error_contractcallstatus_startorstop_required') ?? '')
  });

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={updateSetting}>
        {t('contractcallstatusupdate_success_message')}
      </SweetAlert>
    );
  };

  const updateSetting = async () => {
    store.dispatch(toggleInformationModalStatus());
    const CallStopStatus = await getCallStopStatus(ContractId);
    store.dispatch(loadCallStopStatus(CallStopStatus));
    const { CallStopHistoryDetails } = await getCallStopHistory(ContractId)
    store.dispatch(loadCallStophistory(CallStopHistoryDetails))
    document.getElementById('closeCallStatusUpdate')?.click();
  };

  const onModalClose = () => {
    store.dispatch(updateErrors({}));
    store.dispatch(updateField({ name: "CallStopDate", value: "" }))
    store.dispatch(updateField({ name: "Reason", value: "" }))
    document.getElementById('closeCallStatusUpdate')?.click();
  }

  return (
    <>
      <div
        className="modal fade"
        id='CallStatusUpdate'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        aria-hidden='true'
      >
        <div className="modal-dialog modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header mx-2">
              <h5 className="modal-title">{isUpdateEnabled === CALL_STATS_UPDATE ? t('contractcallstopupdate_title') : t('contractcallstop_history_title')}</h5>
              <button
                type='button'
                className="btn-close"
                data-bs-dismiss='modal'
                id='closeCallStatusUpdate'
                aria-label='Close'
                onClick={onModalClose}
                ref={modalRef}
              ></button>
            </div>
            {checkForPermission('CONTRACT_CREATE') && (
              <div className='ps-4 pe-2 pb-2'>
                {isUpdateEnabled === CALL_STATS_UPDATE ? (
                  <>
                    <div className='row'>
                      <div className='col col-sm-12'>
                        <div className='mb-3 mt-2 pe-3'>
                          <label className='red-asterisk'> {callStatusDetails.CallStopDate
                            ? t('contractcallstopupdate_callstartdate')
                            : t('contractcallstopupdate_callstopdate')}</label>
                          <input name='CallStopDate' value={callStatusUpdateData.CallStopDate} onChange={onUpdateField} type='date' className='form-control'></input>
                          <div className="small text-danger"> {errors["CallStopDate"]}</div>
                        </div>

                        <div className='mb-3 mt-1 pe-3'>
                          <label className='red-asterisk form-label'>
                            {callStatusDetails.CallStopDate
                              ? t('contractcallstopupdate_callstartreason')
                              : t('contractcallstopupdate_callstopreason')}
                          </label>
                          <textarea
                            value={callStatusUpdateData.Reason}
                            className={`form-control  ${errors['Reason'] ? 'is-invalid' : ''}`}
                            id='reason'
                            rows={3}
                            onChange={onUpdateField}
                            name='Reason'
                          ></textarea>
                          <div className='invalid-feedback'>{errors['Reason']}</div>
                        </div>
                      </div>
                      <div className='col-sm-12 pe-4'>
                        <button type='submit' onClick={updateCallStatus} className='btn app-primary-bg-color  text-white mb-3 float-end'>
                          {t('contractcallstopupdate_btn_statusupdate')}
                        </button>
                        <button type='submit' onClick={onModalClose} className='btn btn-danger float-end text-white mb-3'>
                          {t('contractcallstopupdate_btn_cancel')}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  callStopHistory.length > 0 && (
                    <>
                      {callStopHistory.map((history) => (
                        <div className=''>
                          {history.ResetDate && (
                            <div className="row my-3">
                              <div className="d-flex align-items-center">
                                <span className={`border border-light bg-light shadow-sm fs-3 material-symbols-outlined text-success`}>play_arrow</span>
                                <div className="ms-2"><small>{formatDate(history.ResetDate)}</small></div>
                              </div>
                              <div>
                                <div className=''><small>{history.ResetReason}</small></div>
                                <small className='form-text'>{history.ResetBy}</small>
                              </div>
                            </div>
                          )}
                          <div className="row my-3">
                            <div className="d-flex align-items-center">
                              <span className={`border border-light bg-light shadow-sm fs-3 material-symbols-outlined text-danger`}>pause</span>
                              <span className="ms-2"><small>{formatDate(history.StopDate)}</small></span>
                            </div>
                            <div className=''><small>{history.StopReason}</small></div>
                            <small className='form-text'>{history.StoppedBy}</small>
                          </div>
                        </div>
                      ))}
                    </>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {displayInformationModal ? <InformationModal /> : ''}
    </>
  );
};
