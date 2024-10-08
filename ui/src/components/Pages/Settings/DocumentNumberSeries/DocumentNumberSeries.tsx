import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../state/storeHooks';
import { store } from '../../../../state/store';
import { changePage, initializeDNSList, setSearch, loadDNSList, loadDocTypes } from './DocumentNumberSeries.slice'
import { Pagination } from "../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { getDocumentNumberSeriesList } from "../../../../services/documentnumberseries";
import Select from 'react-select';
import { getValuesInMasterDataByTable } from "../../../../services/masterData";
import { formatSelectInput } from "../../../../helpers/formats";
import { checkForPermission } from "../../../../helpers/permissions";

const DocumentNumberSeries = () => {
    const { t, i18n } = useTranslation();
    const { documentnumberserieslist: { documentnumberseries, DocumentTypes, totalRows, perPage, currentPage, search } } = useStore(({ documentnumberserieslist, app }) => ({ documentnumberserieslist, app }));

    useEffect(() => {
        {
            checkForPermission("DOCUMENTNUMBERSERIES_VIEW") &&
                onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeDNSList());
        try {
            const result = await getDocumentNumberSeriesList(null, currentPage);
            store.dispatch(loadDNSList(result));

            var { MasterData } = await getValuesInMasterDataByTable('DocumentType');
            const doctypes = await formatSelectInput(MasterData, 'Name', 'Id');
            store.dispatch(loadDocTypes({ MasterData: doctypes }));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getDocumentNumberSeriesList(search, index);
        store.dispatch(loadDNSList(result));
    }

    const searchFilter = async (selectedOption: any) => {
        var value = selectedOption.value
        if (value) {
            const result = await getDocumentNumberSeriesList(value, 1);
            store.dispatch(loadDNSList(result));
        }
        store.dispatch(setSearch(value));
    }

    return (
        <div className="row mx-0 mt-3">
            {checkForPermission("DOCUMENTNUMBERSERIES_VIEW") &&
                <>
                    <div className="row mt-3 mx-0 p-0">
                        <div className="col-md-8 p-0">
                            <label className="mt-2">{t('dns_dctype')}</label>
                            <Select
                                options={DocumentTypes}
                                onChange={searchFilter}
                                isSearchable
                                placeholder={t('dns_search_placeholder')}
                                name="search"
                            />
                        </div>
                    </div>
                    {documentnumberseries.length > 0 ?
                        (
                            <div className="row mt-3 ps-1">
                                <div className=" table-responsive ">
                                    <table className="table table-hover  table-bordered ">
                                        <thead>
                                            <tr>
                                                <th scope="col">{t('dns_list_th_sl_no')}</th>
                                                <th scope="col">{t('dns_list_th_doc_name')}</th>
                                                <th scope="col">{t('dns_list_th_location')}</th>
                                                <th scope="col">{t('dns_list_th_year')}</th>
                                                <th scope="col">{t('dns_list_th_number')}</th>
                                                <th scope="col">{t('dns_list_th_status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documentnumberseries.map((field, index) => (
                                                <tr className="mt-2" key={index}>
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>{field.DocumentType} </td>
                                                    <td>{field.OfficeName} </td>
                                                    <td>{field.DNSYear}</td>
                                                    <td>{field.DocumentNumber} </td>
                                                    <td>
                                                        {field.IsActive == false ? (
                                                            <span className='badge text-bg-warning'>{t('dns_status_inactive')}</span>
                                                        ) : (
                                                            <span className='badge text-bg-success'>{t('dns_status_active')}</span>
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
                            <div className="row mt-3 ps-3">{t('dns_list_no_data')}</div>
                        )
                    }
                </>}
        </div>
    )
}

export default DocumentNumberSeries