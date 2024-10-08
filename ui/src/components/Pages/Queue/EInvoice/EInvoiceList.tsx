import { useEffect } from 'react';
import { store } from '../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { changePage, loadEInvoices, setSearch } from './EInvoiceList.slice';
import { getEInvoiceList } from '../../../../services/eInvoice';
import { checkForPermission } from '../../../../helpers/permissions';
import { formatCurrency, formatDateTime } from '../../../../helpers/formats';
import { useHistory } from 'react-router-dom';

export const EInvoiceList = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory();

    const {
        einvoicelist: { eInvoices, totalRows, perPage,currentPage, search },
    } = useStore(({ einvoicelist, app }) => ({ einvoicelist, app }));

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_queue', Link: '/queue' },
            { Text: 'breadcrumbs_manage_einvoice' }
        ];
    }

    const fetchInvoiceList = async () => {
        const invoices = await getEInvoiceList(search, currentPage);
        store.dispatch(loadEInvoices(invoices));
    }

    useEffect(() => {
        fetchInvoiceList()
    }, [currentPage])

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
    }

    const filterEInvoiceList = async () => {
        await store.dispatch(changePage(1));
        fetchInvoiceList()
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
    }

    useEffect(() => {
        if (search == "") {
            fetchInvoiceList()
        }
    }, [search])

    return (<ContainerPage >
        <BreadCrumb items={breadcrumbItems()} />

        <div>
            {eInvoices.match({
                none: () => <div >{t('einvoicelist_loading_message')}</div>,
                some: (invoices) =>
                    <div className=" pe-2 mt-2  mx-0 ps-2">

                        <div className="mb-3">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={search} placeholder={'Search' ?? ''} onChange={addData}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterEInvoiceList();
                                        }
                                    }} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterEInvoiceList}>
                                    {t('einvoicelist_button_search')}
                                </button>
                            </div>
                        </div>

                        {invoices.length > 0 ? (
                            <div className=" mt-3">
                                {invoices.map((field, index) => (
                                    <div className="bg-light px-1 py-1 mb-1">
                                        <div className="row m-0">
                                            <div className="col-md-1">
                                                <div className="text-muted"><small>{t('einvoicelist_th_slno')}</small></div>
                                                <div className="small app-primary-color fw-bold">{(currentPage - 1) * 10 + index + 1}</div>
                                            </div>
                                            <div className="col-md-3"> 
                                                <div className="text-muted"><small>{t('einvoicelist_th_invoicenumber')}</small></div>
                                                <div className="small app-primary-color fw-bold">{field.eInvoice.Invoiceno}</div>
                                            </div>  
                                            <div className="col-md-3">
                                                <div className="text-muted"><small>{t('einvoicelist_th_createdon')}</small></div>
                                                <div className="small app-primary-color fw-bold">{formatDateTime(field.eInvoice.CreatedOn)}</div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="text-muted"><small>{t('einvoicelist_th_eisent')}</small></div>
                                                <div className="app-primary-color fw-bold">
                                                    <span className={` material-symbols-outlined fs-5  ${field.eInvoice.EISent ? "text-success" : "text-secondary"}`}>check_circle</span>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="text-muted"><small>{t('einvoicelist_th_eisuccess')}</small></div>
                                                <div className="app-primary-color fw-bold">
                                                    <span className={`material-symbols-outlined fs-5 ${field.eInvoice.EISuccess ? "text-success" : "text-secondary"}`}>check_circle</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="m-0">
                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted ps-0">{t('einvoicelist_no_data')}</div>
                        )}
                    </div>
            }
            )}
        </div>
    </ContainerPage>
    )
}
