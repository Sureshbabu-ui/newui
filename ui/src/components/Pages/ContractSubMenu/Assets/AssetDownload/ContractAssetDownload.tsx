
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import { useStore } from '../../../../../state/storeHooks';
import { store } from '../../../../../state/store';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { ContractAssetDownloadState, initializeContractAssetDownload, updateErrors, updateField } from './ContractAssetDownload.slice';
import { downloadContractAssetListReport } from '../../../../../services/reports';
import FileSaver from 'file-saver';
import { formatDocumentName } from '../../../../../helpers/formats';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';
import Select from 'react-select';

export const ContractAssetDownload = () => {
    const modalRef = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation();

    const { contractassetdownload: { ContractAssetFilter, errors } } =
        useStore(({ contractassetdownload }) => ({ contractassetdownload }));

    const { ContractId } = useParams<{ ContractId: string }>();

    const onSubmit = async () => {
        store.dispatch(startPreloader());
        const response = await downloadContractAssetListReport(ContractId, ContractAssetFilter);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName());
        store.dispatch(stopPreloader())
    }

    const onModalClose = () => {
        store.dispatch(initializeContractAssetDownload());
        store.dispatch(updateErrors({}))
    }

    const preAmcOptions = [
        { value: 2, label: 'All' },
        { value: 1, label: 'PreAmc Completed' },
        { value: 0, label: 'PreAmc Not Completed' }
    ]

    const supportOptions = [
        { value: 2, label: 'All' },
        { value: 0, label: 'Direct Service' },
        { value: 1, label: 'Back To Back' }
    ]

    const onSelectChange = async (selectedOption: any, actionMeta: any) => {
        const value = selectedOption ? selectedOption.value : null
        const name = actionMeta.name
        store.dispatch(updateField({ name: name as keyof ContractAssetDownloadState['ContractAssetFilter'], value }));
    }

    return (
        <>
            <div
                className="modal fade"
                id='ContractAssetDownload'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('contractassetdownload_modal_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeContractAssetDownloadModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ValidationErrorComp errors={errors} />
                            <div className=''>
                                <div className='row mb-1'>
                                    <div className="mt-3" >
                                        <label className="mt-2">{t('contractassetdownload_input_preamcstatus')}</label>
                                        <Select
                                            options={preAmcOptions}
                                            onChange={onSelectChange}
                                            name="PreAmcStatus"
                                            value={preAmcOptions && preAmcOptions.find(option => option.value == ContractAssetFilter.PreAmcStatus) || null}
                                            isSearchable
                                            classNamePrefix="react-select"
                                        />
                                    </div>
                                    <div className="mt-3" >
                                        <label className="mt-2">{t('contractassetdownload_input_supporttype')}</label>
                                        <Select
                                            options={supportOptions}
                                            onChange={onSelectChange}
                                            name="SupportType"
                                            value={supportOptions && supportOptions.find(option => option.value == ContractAssetFilter.SupportType) || null}
                                            isSearchable
                                            classNamePrefix="react-select"
                                        />
                                    </div> 

                                    <div className="col-md-12 mt-4">
                                        <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                            {t('contractassetdownload_button_submit')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


