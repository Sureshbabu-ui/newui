import SweetAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useStore } from '../../../../../state/storeHooks';
import { store } from '../../../../../state/store';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { BankCollectionUploadState, initializeCollectionExcelUpload, loadTenantBankNames, startSubmitting, stopSubmitting, toggleInformationModalStatus, updateErrors, updateField } from './BankCollectionUploadExcel.slice';
import { convertBackEndErrorsToValidationErrors, formatBytes, formatSelectInputWithThreeArg } from '../../../../../helpers/formats';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { uploadBankCollectionFile } from '../../../../../services/bankCollection';
import { getTenantBankAccountNames } from '../../../../../services/tenantBankAccount';
import { useEffect, useRef } from 'react'
import Select from 'react-select'
import { useHistory } from 'react-router-dom';
import { checkForPermission } from '../../../../../helpers/permissions';
export const BankCollectionUploadExcel = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { documents, displayInformationModal, errors, filteredTenantBankAccounts } = useStore(
        ({ bankcollectionuploadexcel }) => bankcollectionuploadexcel,
    );

    useEffect(() => {
        if (checkForPermission('BANKCOLLECTION_UPLOAD'))
            getTenantBankNames()
    }, [])

    const getTenantBankNames = async () => {
        const { TenantBankAccounts } = await getTenantBankAccountNames();
        const FilteredTenantBanks = await formatSelectInputWithThreeArg(TenantBankAccounts, "BankName", "BranchName", "Id")
        store.dispatch(loadTenantBankNames({ MasterData: FilteredTenantBanks }))
    }
    const validationSchema = yup.object().shape({
        BankCollectionFile: yup.mixed<FileList>().required(('validation_error_bankcollectionupload_file_required') ?? '')
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
        const result = await uploadBankCollectionFile(documents)
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
        if (name == "BankCollectionFile")
            var value = ev.target.files[0];
        else
            var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof BankCollectionUploadState['documents'], value }));
    }

    const onFieldChangeSelect = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof BankCollectionUploadState['documents'], value }));
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={reDirectRoute}>
                {t('bankcollectionupload_message_success')}
            </SweetAlert>
        );
    }

    const reDirectRoute = async () => {
        store.dispatch(toggleInformationModalStatus());
        document.getElementById('closeBankCollectionUploadModal')?.click();
        history.push('/finance/collections/Pending')
    }

    const fileUploadElement = useRef<HTMLInputElement | null>(null);

    const onModalClose = () => {
        if (fileUploadElement.current !== null) {
            fileUploadElement.current.value = "";
        }
        store.dispatch(updateField({ name: "BankCollectionFile",value: []})); 
        store.dispatch(initializeCollectionExcelUpload())
        getTenantBankNames()
    }

    return (
        <div
            className="modal fade"
            id='BankCollectionUpload'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mx-3">
                        <h5 className="modal-title app-primary-color">{t('bankcollectionupload_modal_title')}</h5>
                        <button
                            type='button'
                            className="btn-close"
                            data-bs-dismiss='modal'
                            id='closeBankCollectionUploadModal'
                            aria-label='Close'
                            onClick={onModalClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {checkForPermission('BANKCOLLECTION_UPLOAD') &&
                            <div >
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className='col-md-12'>
                                        <div className='mb-1'>
                                            <div className="col-md-12">
                                                <label className="mt-2">{t('bankcollectionupload_select_tenantbank')}</label>
                                                <Select
                                                    value={filteredTenantBankAccounts && filteredTenantBankAccounts.find(option => option.value == documents.TenantBankAccountId) || null}
                                                    options={filteredTenantBankAccounts}
                                                    onChange={onFieldChangeSelect}
                                                    isSearchable
                                                    name="TenantBankAccountId"
                                                />
                                            </div>
                                            <div className='col-md-12 mt-3'>
                                                <label className="form-label red-asterisk">{t('bankcollectionupload_input_file')}</label>
                                                <input name='BankCollectionFile' ref={fileUploadElement} onChange={onUpdateField} type='file' className='form-control'></input>
                                                <div className="small text-danger"> {t(errors['BankCollectionFile'])}</div>
                                            </div>
                                        </div>
                                        <button type='button' onClick={onSubmit} className='btn app-primary-bg-color text-white mt-2'>
                                            {t('bankcollectionupload_button_upload')}
                                        </button>
                                        {displayInformationModal ? <InformationModal /> : ''}
                                    </div>
                                </ContainerPage>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}