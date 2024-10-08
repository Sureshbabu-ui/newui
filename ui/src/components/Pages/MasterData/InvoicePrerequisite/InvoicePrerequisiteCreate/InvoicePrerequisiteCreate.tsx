import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateInvoicePrerequisiteState, initializeInvoicePrerequisiteCreate, toggleInformationModalStatus, updateErrors, updateField } from "./InvoicePrerequisiteCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { getInvoicePrerequisiteList, createInvoicePrerequisite } from "../../../../../services/invoicePrerequisite";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadInvoicePrerequisites } from "../InvoicePrerequisiteList/InvoicePrerequisiteList.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
 
export const InvoicePrerequisiteCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        invoiceprerequisitecreate: { invoicePrerequisite, displayInformationModal, errors },
    } = useStore(({ invoiceprerequisitecreate, app }) => ({ invoiceprerequisitecreate, app }));

    useEffect(() => {
        store.dispatch(initializeInvoicePrerequisiteCreate())
    }, [])

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateInvoicePrerequisiteState['invoicePrerequisite'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
          await validationSchema.validate(invoicePrerequisite, { abortEarly: false });
        } catch (error: any) {
          const errors = error.inner.reduce((allErrors: any, currentError: any) => {
            return { ...allErrors, [currentError.path as string]: currentError.message };
          }, {});
          store.dispatch(updateErrors(errors))
          if (errors)
            return;
        }
        store.dispatch(startPreloader());
        const result = await createInvoicePrerequisite(invoicePrerequisite)
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
            <SweetAlert success title="Success" onConfirm={updateInvoicePrerequisite}>
                {t('invoiceprerequisitecreate_success_message')}
            </SweetAlert>
        );
    }

    const updateInvoicePrerequisite = async () => {
        store.dispatch(toggleInformationModalStatus());
        const InvoicePrerequisites = await getInvoicePrerequisiteList(store.getState().invoiceprerequisitelist.search,1);
        store.dispatch(loadInvoicePrerequisites(InvoicePrerequisites));
        modalRef.current?.click()
    }
const onModalClose=()=>{
    store.dispatch(initializeInvoicePrerequisiteCreate())
}
    const validationSchema = yup.object().shape({
        Description: yup.string().required('validation_error_invoiceprerequisitecreate_description_required'),
        DocumentName: yup.string().required('validation_error_invoiceprerequisitecreate_name_required'), 
        DocumentCode: yup.string().required('validation_error_invoiceprerequisitecreate_code_required'), 
      });
    return (
        <>
            <div
                className="modal fade"
                id='CreateInvoicePrerequisite'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            > 
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title app-primary-color">{t('invoiceprerequisitecreate_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateInvoicePrerequisiteModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div >
                                    <div className="row mb-1">
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('invoiceprerequisitecreate_input_name')}</label>
                                            <input name='DocumentName' onChange={onUpdateField} type='text'
                                            value={invoicePrerequisite.DocumentName}
                                                className={`form-control  ${errors["DocumentName"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['DocumentName'])}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('invoiceprerequisitecreate_input_documentcode_name')}</label>
                                            <input name='DocumentCode' onChange={onUpdateField} type='text'
                                                value={invoicePrerequisite.DocumentCode}
                                                className={`form-control  ${errors["DocumentCode"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['DocumentCode'])}</div>  
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('invoiceprerequisitecreate_input_description')}</label>
                                            <textarea name='Description' onChange={onUpdateField} 
                                            value={invoicePrerequisite.Description}
                                                className={`form-control  ${errors["Description"] ? "is-invalid" : ""}`}
                                            ></textarea>
                                            <div className="invalid-feedback"> {t(errors['Description'])}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('invoiceprerequisitecreate_label_status')}</label>
                                            <select name="IsActive" onChange={onUpdateField} className="form-select">
                                                <option value="1">{t('invoiceprerequisitecreate_select_option_1')}</option>
                                                <option value="0">{t('invoiceprerequisitecreate_select_option_0')}</option>
                                            </select>
                                        </div>
                                        <div className="col-md-12 mt-4">
                                            <button type='button' className='btn  app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                {t('invoiceprerequisitecreate_button')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </ContainerPage>
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    ); 
}