import { useEffect, useRef } from 'react';
import {  store } from '../../../../../../state/store';
import {  useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { initializePendingReason, updateErrors, updateField, InvoicePendingState, toggleInformationModalStatus } from './InvoicePendingReason.slice';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../../../../ValidationErrors/ValidationError';
import { useParams } from 'react-router-dom';
import { convertBackEndErrorsToValidationErrors, formatDateTime } from '../../../../../../helpers/formats';
import { addContractInvoicePendingReason, getContractInvoiceDetails } from '../../../../../../services/contractInvoice';
import SweetAlert from 'react-bootstrap-sweetalert';
import { loadContractInvoiceDetails } from '../ContractInvoiceView.slice';

export const InvoicePendingReason = (props: { PendingReasons: string | null }) => {
  const { t} = useTranslation();
  const modalRef = useRef<HTMLButtonElement>(null);
  const { errors, pendingReason, submitted, displayInformationModal } = useStoreWithInitializer(
    ({ invoicependingreason }) => invoicependingreason, initializePendingReason
  );
  const { ContractInvoiceId } = useParams<{ ContractInvoiceId: string }>();
  useEffect(() => {
    store.dispatch(updateField({ name: "ContractInvoiceId", value: ContractInvoiceId }));
  }, [ContractInvoiceId])

  const validationSchema = yup.object().shape({
    InvoicePendingReason: yup.string().required(('validation_error_invoicependingreason_required') ?? ''),
  });
  const handleSubmit = async () => {
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(pendingReason, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader())
    const result = await addContractInvoicePendingReason(pendingReason);
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(errorMessages));
      },
    });
    store.dispatch(stopPreloader())
  }
  const onModalClose = () => {
    store.dispatch(updateField({ name: "InvoicePendingReason", value: "" }));
    store.dispatch(updateErrors({}));
  }

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof InvoicePendingState['pendingReason'], value }));
  }

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title="Success" onConfirm={updateContractInvoice}>
        {t('invoicependingreason_create_success_message')}
      </SweetAlert>
    );
  }

  const updateContractInvoice= async () => {
    store.dispatch(toggleInformationModalStatus());
    const result = await getContractInvoiceDetails(ContractInvoiceId);
    store.dispatch(loadContractInvoiceDetails(result));
    modalRef.current?.click()
  }

  return (
    <div
      className="modal fade"
      id='InvoicePendingReason'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      aria-hidden='true'
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mx-2">
            <h5 className="modal-title app-primary-color">{t('invoicependingreason_title')}</h5>
            <button
              type='button'
              className="btn-close"
              data-bs-dismiss='modal'
              id='closeInvoicePendingReason'
              aria-label='Close'
              onClick={onModalClose}
              ref={modalRef}
            ></button>
          </div>
          <div className="modal-body">
            <ContainerPage>
              <div className="">
                <div className="mx-2 py-0 my-0">
                  <div>
                    <h6> {t('invoicependingreason_list')} </h6>
                  </div>

                  <div className="row">
                    {
                      props.PendingReasons && JSON.parse(props.PendingReasons).map((reason) => (
                        <div key={reason.Id}>
                          {reason.Reason.split("\\n").map(reason => {
                            return <div>
                              <p className="mb-0 " >{reason}</p></div>
                          })}
                          <div >
                          </div>
                          <div className="small border-bottom mb-3">
                            <p>{reason.CreatedBy} <span> {formatDateTime(reason.CreatedOn)}
                            </span></p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  <div className="p-0">
                    <ValidationErrorComp errors={errors} />
                    <fieldset className="form-group p-0">
                      <label className='ps-0 red-asterisk'>{t('invoicependingreason_label_reason')}</label>
                      <textarea
                        className={`form-control ${errors["InvoicePendingReason"] ? "is-invalid" : ""}`}
                        name="InvoicePendingReason"
                        onChange={onUpdateField}
                        value={pendingReason.InvoicePendingReason ?? ''}
                        data-testid="invoicependingreason_input_reason"
                        disabled={submitted}
                        rows={4}
                      />
                      <div className="invalid-feedback"> {t(errors['InvoicePendingReason'])}</div>
                      <div className="d-flex flex-row mt-3 justify-content-between">
                        <button className="btn  app-primary-bg-color text-white px-6" onClick={handleSubmit}>{t('invoicependingreason_submit_button')}</button>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </ContainerPage>
          </div>
        </div>
      </div>
      {displayInformationModal && <InformationModal />}
    </div>
  );
}