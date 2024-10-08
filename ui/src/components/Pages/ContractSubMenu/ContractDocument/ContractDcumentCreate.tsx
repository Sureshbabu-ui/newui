import { store } from '../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { ContractDocumentCreation } from '../../../../types/contractDocument';
import {
    CreateDocumentState,
    initializeContractDocument,
    toggleInformationModalStatus,
    updateErrors,
    updateField,
} from './ContractDocumentCreate.slice';
import { createContractDocument, getContractDocumentList } from '../../../../services/contractDocument';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { convertBackEndErrorsToValidationErrors, formatBytes, formatSelectInput } from '../../../../helpers/formats';
import Select from 'react-select';
import { getValuesInMasterDataByTable } from '../../../../services/masterData';
import { loadContractDocuments } from './ContractDocumentList.slice';

export const CreateDocument = () => {
    const { t, i18n } = useTranslation();
    const { ContractId } = useParams<{ ContractId: string }>();
    const modalRef = useRef<HTMLButtonElement>(null);

    const onLoad = async () => {
        store.dispatch(updateField({ name: "ContractId", value: ContractId }));
        if (visibleModal == "UploadDocument") {
            var { MasterData } = await getValuesInMasterDataByTable("ContractDocumentCategory")
            setDocumentCategory(formatSelectInput(MasterData, "Name", "Id"));
        }
    }

    const { contractdocumentcreate: { documents, displayInformationModal, errors }, contractdocumentlist: { visibleModal } } = useStore(
        ({ contractdocumentcreate, contractdocumentlist }) => ({ contractdocumentcreate, contractdocumentlist })
    );
    const [documentCategory, setDocumentCategory] = useState<any>([])

    useEffect(() => {
        onLoad()
    }, [ContractId != null && visibleModal == "UploadDocument"]);

    const validationSchema = yup.object().shape({
        DocumentFile: yup.mixed<FileList>().required(t('validation_error_contract_document_create_file_required') ?? '')
            .test('fileFormat', t('validation_error_contract_document_create_file_type_mismatch') ?? '', (value: any) => {
                // return value && ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'].includes(value.type);
                return value && process.env.REACT_APP_CONTRACT_DOCUMENT_TYPES?.split(",").includes(value.type);
            })
            .test('fileSize', t('validation_error_contract_document_create_file_maxsize') ?? '', (value: any) => {
                return value.size <= process.env.REACT_APP_CONTRACT_DOCUMENT_MAX_FILESIZE!
            })
        ,
        DocumentCategoryId: yup.string().required(t('validation_error_contract_document_create_document_category_required') ?? ''),
        DocumentDescription: yup.string().required(t('validation_error_contract_document_create_description_required') ?? ''),
    });

    const onSubmit = async () => {
        store.dispatch(updateErrors({}));
        try {
            await validationSchema.validate(store.getState().contractdocumentcreate.documents, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await createContractDocument(documents)
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

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        var value = selectedOption.value
        var name = actionMeta.name
        store.dispatch(updateField({ name: name as keyof CreateDocumentState['documents'], value }));
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        if (name == "DocumentFile")
            var value = ev.target.files[0];
        else
            var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateDocumentState['documents'], value }));
    }

    const InformationModal = () => {
        const { t, i18n } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={updateDocuments}>
                {t('contract_document_create_message_success')}
            </SweetAlert>
        );
    }

    const updateDocuments = async () => {
        store.dispatch(toggleInformationModalStatus());
        const CurrentPage = store.getState().contractdocumentlist.currentPage;
        const SearchKey = store.getState().contractdocumentlist.search;
        const ContractDocuments = await getContractDocumentList(SearchKey, CurrentPage, ContractId);
        store.dispatch(loadContractDocuments(ContractDocuments));
        modalRef.current?.click()
        store.dispatch(updateField({ name: "ContractId", value: ContractId }));
    }

    const fileUploadElement = useRef<HTMLInputElement | null>(null);

    const onModalClose = () => {
        if (fileUploadElement.current !== null) {
            fileUploadElement.current.value = "";
        }
        store.dispatch(initializeContractDocument())
        store.dispatch(updateField({ name: "ContractId", value: ContractId }));
    }

    return (
        <div
            className="modal fade"
            id='UploadDocument'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mx-3">
                        <h5 className="modal-title app-primary-color">{t('contract_document_create_modal_title')}</h5>
                        <button
                            type='button'
                            className="btn-close"
                            data-bs-dismiss='modal'
                            id='closeCreatedDocumentModal'
                            aria-label='Close'
                            ref={modalRef}
                            onClick={onModalClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className='contract-documents'>
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className='col-md-12'>
                                    <div className='mb-1'>
                                        <div className='col-md-12'>
                                            <label className="form-label red-asterisk">{t('contract_document_create_input_file')}</label>
                                            <input name='DocumentFile' onChange={onUpdateField} ref={fileUploadElement} type='file' className='form-control'></input>
                                            <div><small className="text-muted">{`${t('contract_document_create_message_warning_size_type')} ${formatBytes(parseInt(process.env.REACT_APP_CONTRACT_DOCUMENT_MAX_FILESIZE!))}`}</small></div>
                                            <div className="small text-danger"> {errors['DocumentFile']}</div>
                                        </div>
                                    </div>
                                    <div className='mb-2'>
                                        <label className="mt-2 red-asterisk">{t('contract_document_create_input_document_category')}</label>
                                        <Select
                                            options={documentCategory}
                                            value={documentCategory && documentCategory.find(option => option.value == documents.DocumentCategoryId) || null}
                                            onChange={onSelectChange}
                                            isSearchable
                                            name="DocumentCategoryId"
                                            placeholder="Select option"
                                        />
                                        <div className="small text-danger"> {errors['DocumentCategoryId']}</div>
                                    </div>
                                    <div className="mb-1 mt-2">
                                        <div className='col-md-12'>
                                            <label className="form-label mb-0 red-asterisk">{t('contract_document_create_input_description')}</label>
                                            <textarea name="DocumentDescription" id="" cols={12} rows={4} onChange={onUpdateField} className='form-control' value={documents.DocumentDescription ?? ""}></textarea>
                                            <div className="small text-danger"> {errors['DocumentDescription']}</div>
                                        </div>
                                    </div>
                                    <button type='button' onClick={onSubmit} className='btn app-primary-bg-color text-white mt-2'>
                                        {t('contract_document_create_button_upload')}
                                    </button>
                                    {displayInformationModal ? <InformationModal /> : ''}
                                </div>
                            </ContainerPage>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
