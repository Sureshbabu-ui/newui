import SweetAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Select from 'react-select'
import { InvoiceReconciliationTaxUploadState, initializeTaxUpload, startSubmitting, stopSubmitting, toggleInformationModalStatus, updateErrors, updateField } from './TaxUpload.slice';
import { store } from '../../../../state/store';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { useRef } from 'react';
import { checkForPermission } from '../../../../helpers/permissions';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { useStore } from '../../../../state/storeHooks';
import { getInvoiceReconciliationList,uploadInvoiceReconciliationTaxFile} from '../../../../services/invoiceReconciliation';
import { convertBackEndErrorsToValidationErrors } from '../../../../helpers/formats';
import { loadInvoiceReconciliations } from '../InvoiceReconciliationList/InvoiceReconciliationList.slice';
export const TaxUpload = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);

    const { documents, displayInformationModal, errors } = useStore(({ invoicereconciliationtaxupload }) => invoicereconciliationtaxupload);

    const validationSchema = yup.object().shape({
        CollectionFile: yup.mixed<FileList>().required(('validation_error_invoicereconciliationtaxupload_file_required') ?? '')       
            .test('fileFormat', t('validation_error_invoicereconciliationtaxupload_file_type_mismatch') ?? '', (value: any) => {
            return value && ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(value.type);
        }),
        TaxType: yup.string().required(('validation_error_invoicereconciliationtaxupload_taxtype_required') ?? '')
    });

    const onSubmit = async () => {
        store.dispatch(updateErrors({}));
        try {
            await validationSchema.validate(documents, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        store.dispatch(startSubmitting());
     
          const  result = await uploadInvoiceReconciliationTaxFile(documents)
        
        store.dispatch(stopSubmitting());
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(formattedErrors))
            },
        });
        store.dispatch(stopPreloader());
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        if (name == "CollectionFile")
            var value = ev.target.files[0];
        else
            var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof InvoiceReconciliationTaxUploadState['documents'], value }));
    }

    const onFieldChangeSelect = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof InvoiceReconciliationTaxUploadState['documents'], value }));
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={closeModal}>
                {documents.TaxType == 'TDS' ? t('bankcollectionupload_tds_message_success') : t('bankcollectionupload_gsttds_message_success')}
            </SweetAlert>
        );
    }

    const closeModal = async () => {
        store.dispatch(toggleInformationModalStatus());
        const collections = await getInvoiceReconciliationList('', 1);
        store.dispatch(loadInvoiceReconciliations(collections));
        modalRef.current?.click()
    }

    const fileUploadElement = useRef<HTMLInputElement | null>(null);

    const onModalClose = () => {
        if (fileUploadElement.current !== null) {
            fileUploadElement.current.value = "";
        }
        store.dispatch(updateField({ name: "CollectionFile", value: [] }));
        store.dispatch(initializeTaxUpload())
    }

    const taxTypeList = [
        {
            label: "TDS",
            value: "TDS"
        },
        {
            label: "GST TDS",
            value: "GSTTDS"
        }
    ]
    return (
        <div
            className="modal fade"
            id='TaxUpload'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mx-3 ">
                        <h5 className="modal-title app-primary-color">{t('invoicereconciliationtaxupload_modal_title')}</h5>
                        <button
                            type='button'
                            className="btn-close"
                            data-bs-dismiss='modal'
                            id='closeTaxUploadModal'
                            aria-label='Close'
                            onClick={onModalClose}
                            ref={modalRef}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {checkForPermission('INVOICERECONCILIATION_UPDATE') &&
                            <div >
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row'>
                                        <div className="col-md-12">
                                            <label className="mt-0 red-asterisk">{t('invoicereconciliationlist_select_taxtype')}</label>
                                            <Select
                                                value={taxTypeList && taxTypeList.find(option => option.value == documents.TaxType) || null}
                                                options={taxTypeList}
                                                onChange={onFieldChangeSelect}
                                                isSearchable
                                                name="TaxType"
                                            />
                                            <div className="small text-danger"> {t(errors['TaxType'])}</div>
                                        </div>
                                        <div className='col-md-12 mt-3'>
                                            <label className="form-label red-asterisk mb-0">{t('invoicereconciliationtaxupload_input_file')}</label>
                                            <input name='CollectionFile' 
                                            ref={fileUploadElement} 
                                            onChange={onUpdateField} type='file' 
                                            className='form-control'
                                            accept='.xlsx'
                                            ></input>
                                            <div className="small text-danger"> {t(errors['CollectionFile'])}</div>
                                        </div>
                                    </div>
                                    <div className="mt-1">{t('invoicereconciliationtaxupload_helptext')}</div>
                                    <button type='button' onClick={onSubmit} className='btn app-primary-bg-color text-white mt-2'>
                                        {t('invoicereconciliationtaxupload_button_upload')}
                                    </button>
                                    {displayInformationModal ? <InformationModal /> : ''}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}