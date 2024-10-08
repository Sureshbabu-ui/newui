import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useStore } from '../../../../../state/storeHooks';
import { store } from '../../../../../state/store';
import {
  toggleInformationModalStatus,
  updateErrors,
  updateCallExpiryField,
  contractExpiryDetails,
} from './CallExpiryExtend.slice';
import { useEffect } from 'react';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { getContractExpiryDetail, updateContractCallExpiry } from '../../../../../services/contractSetting';
import { convertBackEndErrorsToValidationErrors, formatDate } from '../../../../../helpers/formats';
import * as yup from 'yup';
import SweetAlert from 'react-bootstrap-sweetalert';
import { checkForPermission } from '../../../../../helpers/permissions';
import { useRef } from 'react'
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';

export const CallExpiryExtend = () => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLButtonElement>(null);
  const { ContractId } = useParams<{ ContractId: string }>();

  const { displayInformationModal, errors, callExpiryDate, contractExpiryDetail } =
    useStore(
      ({ callexpiryextend }) => callexpiryextend);

  useEffect(() => {
    if (checkForPermission('CONTRACT_CREATE')) {
      onLoad();
    }
  }, [ContractId]);

  const onLoad = async () => {
    store.dispatch(startPreloader());
    try {
      const expiryDetail = await getContractExpiryDetail(ContractId);
      store.dispatch(contractExpiryDetails(expiryDetail));
    } catch (error) {
      console.error(error);
    }
    store.dispatch(stopPreloader());
  };

  const onUpdateField = (ev: any) => {
    var value = ev.target.value;
    store.dispatch(updateCallExpiryField(value))
  };

  const updateCallStatus = async () => {
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate({ CallExpiryDate: callExpiryDate }, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors));
      if (errors) return;
    }
    store.dispatch(startPreloader());
    const result = await updateContractCallExpiry(ContractId, callExpiryDate);
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
    CallExpiryDate: yup
      .string()
      .required(t('validation_error_contractcallextend_date_required') ?? '')
  });

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={updateSetting}>
        {t('contractcallextend_success_message')}
      </SweetAlert>
    );
  };

  const updateSetting = async () => {
    store.dispatch(toggleInformationModalStatus());
    document.getElementById('closeCallExpiryExtend')?.click();
    const expiryDetail = await getContractExpiryDetail(ContractId);
    store.dispatch(contractExpiryDetails(expiryDetail));
    store.dispatch(updateCallExpiryField(""))
  };

  const onModalClose = () => {
    document.getElementById('closeCallExpiryExtend')?.click();
    store.dispatch(updateErrors({}));
    store.dispatch(updateCallExpiryField(""))
  }

  return (
    <>
      <div
        className="modal fade"
        id='CallExpiryExtend'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        aria-hidden='true'
      >
        <div className="modal-dialog modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header mx-2">
              <h5 className="modal-title">{t('contractcallextend_title_extended_expirydate')}</h5>
              <button
                type='button'
                className="btn-close"
                data-bs-dismiss='modal'
                id='closeCallExpiryExtend'
                aria-label='Close'
                onClick={onModalClose}
                ref={modalRef}
              ></button>
            </div>
            {checkForPermission('CONTRACT_CREATE') && (
              <div className='ps-4 pe-2 pb-2'>
                <ValidationErrorComp errors={errors} />
                <>
                  <div className='row'>
                    <div className='mb-3 mt-2 pe-3'>
                      <label>{t('contractcallextend_title_current_expirydate')}</label>
                      <div className="fs-6 fw-bold app-primary-color">{contractExpiryDetail.CallExpiryDate ? formatDate(contractExpiryDetail.CallExpiryDate) : "---"}</div>
                    </div>

                    <div className='mb-3 mt-1 pe-3'>
                      <label className='red-asterisk'>{t('contractcallextend_title_extended_expirydate')}</label>
                      <input value={callExpiryDate} name='CallExpiryDate' onChange={onUpdateField} type='date' className='form-control'></input>
                      <div className="small text-danger"> {errors["CallExpiryDate"]}</div>
                    </div>

                    <div className='pe-2'>
                      <button type='submit' onClick={updateCallStatus} className='btn app-primary-bg-color float-end text-white mb-3 me-2'>
                        {t('contractcallstopupdate_btn_statusupdate')}
                      </button>
                      <button type='submit' onClick={onModalClose} className='btn btn-danger text-white mb-3 float-end'>
                        {t('contractcallstopupdate_btn_cancel')}
                      </button>
                    </div>
                  </div>
                </>
              </div>
            )}
          </div>
        </div>
      </div>
      {displayInformationModal ? <InformationModal /> : ''}
    </>
  );
};
