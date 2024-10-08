import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { EditPaymentFrequencyState, initializePaymentFrequencyEdit, toggleInformationModalStatus, updateErrors, updateField } from "./PaymentFrequencyEdit.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { getPaymentFrequencyList, paymentFrequencyUpdate } from "../../../../../services/paymentFrequency";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadPaymentFrequencies } from "../PaymentFrequencyList/PaymentFrequencyList.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { checkForPermission } from "../../../../../helpers/permissions";

export const PaymentFrequencyEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        paymentfrequencyupdate: { paymentFrequency, displayInformationModal, errors },
    } = useStore(({ paymentfrequencyupdate, app }) => ({ paymentfrequencyupdate, app }));

    useEffect(() => {
        store.dispatch(initializePaymentFrequencyEdit())
    }, [])

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof EditPaymentFrequencyState['paymentFrequency'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(paymentFrequency, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await paymentFrequencyUpdate(paymentFrequency)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updatePaymentFrequency}>
                {t('paymentFrequency_update_success_message')}
            </SweetAlert>
        );
    }

    const updatePaymentFrequency = async () => {
        store.dispatch(toggleInformationModalStatus());
        const PaymentFrequencies = await getPaymentFrequencyList(store.getState().paymentfrequencylist.search, 1);
        store.dispatch(loadPaymentFrequencies(PaymentFrequencies));
        modalRef.current?.click()
    }
    const onModalClose = () => {
        store.dispatch(initializePaymentFrequencyEdit())
    }
    const validationSchema = yup.object().shape({
        CalendarMonths: yup.number().typeError('validation_error_paymentfrequency_update_calendarmonths_type').required('validation_error_paymentfrequency_update_calendarmonths_required').positive('validation_error_paymentFrequency_update_calendarmonths_required'),
        Name: yup.string().required('validation_error_paymentfrequency_update_name_required'),
    });
    return (
        <>
            <div
                className="modal fade"
                id='EditPaymentFrequency'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title app-primary-color">{t('paymentfrequency_update_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditPaymentFrequencyModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("PAYMENTFREQUENCY_MANAGE") &&
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('paymentfrequency_update_input_name')}</label>
                                                <input name='Name' onChange={onUpdateField} type='text'
                                                    value={paymentFrequency.Name}
                                                    className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('paymentfrequency_update_input_calendarmonths')}</label>
                                                <input name='CalendarMonths' onChange={onUpdateField} type='text'
                                                    value={paymentFrequency.CalendarMonths}
                                                    className={`form-control  ${errors["CalendarMonths"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['CalendarMonths'])}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('paymentfrequency_update_label_status')}</label>
                                                <select name="IsActive" onChange={onUpdateField} className="form-select">
                                                    <option value="1">{t('paymentfrequency_update_select_option_1')}</option>
                                                    <option value="0">{t('paymentfrequency_update_select_option_0')}</option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('paymentfrequency_update_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </ContainerPage>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}