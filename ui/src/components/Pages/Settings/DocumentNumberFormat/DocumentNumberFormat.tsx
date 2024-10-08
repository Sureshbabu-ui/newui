import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../state/storeHooks';
import { store } from '../../../../state/store';
import { changePage, initializeDocumentNumberFormatList, setSearch, loadDocumentNumberFormatList, loadDocTypes } from './DocumentNumberFormat.slice'
import { Pagination } from "../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import Select from 'react-select';
import { getValuesInMasterDataByTable } from "../../../../services/masterData";
import { formatSelectInput } from "../../../../helpers/formats";
import { getDocumentNumberFormatList } from "../../../../services/documentnumberformat";
import { DocumentNumberFormatCreate } from "./DocumentNumberFormatCreate/DocumentNumberFormatCreate";
import { loadDocumentNumberFormatDetails } from "./DocumentNumberFormatEdit/DocumentNumberFormatEdit.slice";
import { DocumentNumberFormatEdit } from "./DocumentNumberFormatEdit/DocumentNumberFormatEdit";
import { checkForPermission } from "../../../../helpers/permissions";

const DocumentNumberFormat = () => {
    const { t, i18n } = useTranslation();

    const { documentnumberformat: { documentnumberformat, DocumentTypes, totalRows, perPage, currentPage, search } } = useStore(({ documentnumberformat, app }) => ({ documentnumberformat, app }));

    useEffect(() => {
        if (checkForPermission("DOCUMENTNUMBERFORMAT_VIEW"))
            onLoad();
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeDocumentNumberFormatList());
        try {
            const result = await getDocumentNumberFormatList(null, currentPage);
            store.dispatch(loadDocumentNumberFormatList(result));

            var { MasterData } = await getValuesInMasterDataByTable('DocumentType');
            const doctypes = await formatSelectInput(MasterData, 'Name', 'Id');
            store.dispatch(loadDocTypes({ MasterData: doctypes }));
        } catch (error) {
            return error;
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getDocumentNumberFormatList(search, index);
        store.dispatch(loadDocumentNumberFormatList(result));
    }

    const searchFilter = async (selectedOption: any) => {
        var value = selectedOption.value
        if (value) {
            const result = await getDocumentNumberFormatList(value, 1);
            store.dispatch(loadDocumentNumberFormatList(result));
            store.dispatch(setSearch(value));
        }
    }

    return (
        <div className="row mx-0 mt-3 p-0">
            {checkForPermission("DOCUMENTNUMBERFORMAT_VIEW") &&
                <>
                    <div className="row mt-3 mx-0 p-0">
                        <div className="col-md-8 p-0">
                            <label className="">{t('documentnumberformat_dctype')}</label>
                            <Select
                                options={DocumentTypes}
                                onChange={searchFilter}
                                isSearchable
                                placeholder={t('documentnumberformat_search_placeholder')}
                                name="search"
                            />
                        </div>
                        {checkForPermission("DOCUMENTNUMBERFORMAT_MANAGE") &&
                            <div className='col-md-4 pt-4 pe-0 app-primary-color'>
                                <div className="d-flex  justify-content-end">
                                    <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateNumberFormat'>
                                        {t('documentnumberformat_create_button')}
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                    {documentnumberformat.length > 0 ?
                        (
                            <div className="row mt-3 mx-0 p-0">
                                <div className=" table-responsive p-0">
                                    <table className="table table-hover  table-bordered ">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th scope="col">{t('documentnumberformat_list_th_sl_no')}</th>
                                                <th scope="col">{t('documentnumberformat_list_th_doc_name')}</th>
                                                <th scope="col">{t('documentnumberformat_list_th_doc_number_format')}</th>
                                                <th scope="col">{t('documentnumberformat_list_th_numberpadding')}</th>
                                                <th scope="col">{t('documentnumberformat_list_th_status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documentnumberformat.map((field, index) => (
                                                <tr className="mt-2" key={index}>
                                                    <td>
                                                        <a
                                                            className="pseudo-href app-primary-color"
                                                            onClick={() => store.dispatch(loadDocumentNumberFormatDetails(field))}
                                                            data-bs-toggle="modal" role="button"
                                                            data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                            data-bs-target="#EditNumberFormat"
                                                        >
                                                            <span className="material-symbols-outlined "> edit_note </span>
                                                        </a>
                                                    </td>
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>{field.DocumentType} </td>
                                                    <td>{field.DocumentNumberFormat} </td>
                                                    <td>{field.NumberPadding}</td>
                                                    <td>
                                                        {field.IsActive == false ? (
                                                            <span className='badge text-bg-warning'>{t('documentnumberformat_status_inactive')}</span>
                                                        ) : (
                                                            <span className='badge text-bg-success'>{t('documentnumberformat_status_active')}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="row mt-3 ps-3">{t('documentnumberformat_list_no_data')}</div>
                        )
                    }
                    <DocumentNumberFormatCreate />
                    <DocumentNumberFormatEdit />
                </>}
        </div>
    )
}

export default DocumentNumberFormat