import { useEffect } from 'react';
import { store } from '../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import { changePage, initializeContractList, loadContractDocuments, setSearch, setVisibleModal } from './ContractDocumentList.slice';
import { CreateDocument } from './ContractDcumentCreate';
import { useParams } from 'react-router-dom';
import { getContractDocumentList, downloadContractDocument } from '../../../../services/contractDocument';
import FileSaver from 'file-saver';
import { formatBytes, formatDocumentName } from '../../../../helpers/formats';
import { checkForPermission } from '../../../../helpers/permissions';

const ContractDocumentList = () => {
    const { t, i18n } = useTranslation();
    const { ContractId } = useParams<{ ContractId: string }>();

    const onLoad = async () => {
        store.dispatch(initializeContractList());
        try {
            const ContractDocuments = await getContractDocumentList("", 1, ContractId);
            store.dispatch(loadContractDocuments(ContractDocuments));
        } catch (error) {
            console.error(error);
        }
    }

    const {
        contractdocumentlist: { contractDocuments, totalRows, currentPage, perPage, search },
    } = useStoreWithInitializer(({ contractdocumentlist, app }) => ({ contractdocumentlist, app }), onLoad);


    const filterContractDocumentList = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        const result = await getContractDocumentList(event.target.value, store.getState().contractdocumentlist.currentPage, ContractId);
        store.dispatch(loadContractDocuments(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            const result = await getContractDocumentList(store.getState().contractdocumentlist.search, store.getState().contractdocumentlist.currentPage, ContractId);
            store.dispatch(loadContractDocuments(result));
        }
    }

    const onDownloadClick = async (e: any) => {
        const response = await downloadContractDocument(e.target.value)
        FileSaver.saveAs(response.DocumentUrl, formatDocumentName())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const searchKey = store.getState().contractdocumentlist.search;
        const result = await getContractDocumentList(searchKey, index, ContractId);
        store.dispatch(loadContractDocuments(result));
    }

    return (
        <ContainerPage>
            <>
                {checkForPermission("CONTRACT_CREATE") && contractDocuments.match({
                    none: () => <div className="row m-1">{t('contract_document_list_message_loading')}</div>,
                    some: (contractDocuments) => (
                        <div className="row p-0  m-1 mt-3">
                            <div className="d-flex justify-content-between pe-3 mt-2">
                                <div className="col-md-9 p-0">
                                    <h5 className="app-primary-color"> {t('contract_document_list_title')}</h5>
                                </div>
                                {store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' && (
                                    <div className="col-md-3 p-0">
                                        <button disabled={store.getState().generalcontractdetails.singlecontract.ContractStatusCode === 'CTS_PNDG'} onClick={() => store.dispatch(setVisibleModal("UploadDocument"))} className="btn app-primary-bg-color text-white float-end" data-bs-toggle='modal' data-bs-target='#UploadDocument'>
                                            {t('contract_document_list_button_upload')}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3 mt-3 pe-3">
                                <div className="input-group ">
                                    <input type='search' className="form-control custom-input" value={search} placeholder={t('contract_document_search_placeholder') ?? ''} onChange={addData}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                filterContractDocumentList(e);
                                            }
                                        }} />
                                    <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterContractDocumentList}>
                                        Search
                                    </button>
                                </div>
                            </div>
                            <div className="row m-1">
                                {contractDocuments.length > 0 ? (
                                    <table className="table contract-documents">
                                        <tbody>
                                            {contractDocuments.map((field, index) => (
                                                <tr className="mt-2">
                                                    <td>
                                                        <div>{field.contractDocument.DocumentUploadedName}</div>
                                                        <div><small className="text-muted">{field.contractDocument.DocumentCategory}</small></div>
                                                        <div><small className="text-muted">{field.contractDocument.DocumentDescription}</small></div>
                                                        <div><small> <span className='text-muted'>{`Uploaded By ${field.contractDocument.CreatedUserName} `}</span><span>{formatBytes(field.contractDocument.DocumentSize)}</span></small></div>
                                                    </td>
                                                    <td>
                                                        <button value={field.contractDocument.Id} style={{ background: 'none', border: 'none', fontWeight: 'bold' }} className="btn app-primary-color mt-3 float-end" onClick={onDownloadClick}>
                                                            &nbsp;{t('contract_document_list_button_download')}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-muted p-0">{t('contract_documentlist_no_data')}</div>
                                )}
                            </div>
                            <div className="row m-0">
                                <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                            </div>
                            <CreateDocument />
                        </div>
                    ),
                })}
            </>
        </ContainerPage>
    );
}

export default ContractDocumentList 