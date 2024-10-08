import { useEffect } from 'react';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { changePage, loadInvoiceReconciliations, setSearch } from './InvoiceReconciliationList.slice';
import { getInvoiceReconciliationList } from '../../../../services/invoiceReconciliation';
import { checkForPermission } from '../../../../helpers/permissions';
import { formatCurrency } from '../../../../helpers/formats';
import { useHistory } from 'react-router-dom';
import { TaxUpload } from '../TaxUpload/TaxUpload';

export const InvoiceReconciliationList = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const {
        invoicereconciliationlist: { invoiceReconciliations, totalRows, currentPage, search, perPage },
    } = useStore(({ invoicereconciliationlist, app }) => ({ invoicereconciliationlist, app }));

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_invoicereconciliationlist' }
        ];
    }

    useEffect(() => {
        fetchCollectionList()
    }, [])

    useEffect(() => {
        fetchCollectionList()
    }, [currentPage])

    const fetchCollectionList = async () => {
        const collections = await getInvoiceReconciliationList(search, currentPage);
        store.dispatch(loadInvoiceReconciliations(collections));
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
    }

    const filterInvoiceReconciliationList = async () => {
        await store.dispatch(changePage(1));
        if (checkForPermission("INVOICERECONCILIATION_LIST"))
            fetchCollectionList()
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
    }

    useEffect(() => {
        if (search == "") {
            fetchCollectionList()
        }
    }, [search])

    return (<ContainerPage >
        <BreadCrumb items={breadcrumbItems()} />

        <div>
            {checkForPermission("INVOICERECONCILIATION_LIST") &&
                <div>
                    {invoiceReconciliations.match({
                        none: () => <div >{t('invoicereconciliationlist_loading_message')}</div>,
                        some: (collection) =>
                            <div className=" pe-2 mt-2  mx-0 ps-2">
                                <div className="row">
                                    <div className={`${checkForPermission('INVOICERECONCILIATION_UPDATE')?'col-md-10':'col md-12'} mb-3`}>
                                        <div className="input-group">
                                            <input type='search' className="form-control custom-input" value={search} placeholder={t('invoicereconciliationlist_button_search_placeholder') ?? ''} onChange={addData}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        filterInvoiceReconciliationList();
                                                    }
                                                }} />
                                            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterInvoiceReconciliationList}>
                                                {t('invoicereconciliationlist_button_search')}
                                            </button>
                                        </div>
                                    </div>
                                    {checkForPermission('INVOICERECONCILIATION_UPDATE') &&
                                        <div className="col-md-2">
                                            <button className="btn text-white  app-primary-bg-color float-end w-100" type="button" data-bs-toggle='modal' data-bs-target='#TaxUpload'>
                                                {t('invoicereconciliationlist_btn_taxupload')}</button>
                                        </div>
                                    }
                                </div>
                                {collection.length > 0 ? (
                                    <div className="row mt-3">
                                        <div className=" table-responsive ">
                                            <table className="table table-hover  table-bordered ">
                                                <thead>
                                                    <tr>
                                                        <th className='text-center' scope="col">{t('invoicereconciliationlist_th_slno')}</th>
                                                        <th  className='text-center'scope="col">{t('invoicereconciliationlist_th_customername')}</th>
                                                        <th scope="col">{t('invoicereconciliationlist_th_invoicenumber')}</th>
                                                        <th scope="col">{t('invoicereconciliationlist_th_netinvoiceamount')}</th>
                                                        <th scope="col">{t('invoicereconciliationlist_th_collectedamount')}</th>
                                                        <th scope="col">{t('invoicereconciliationlist_th_outstandingamount')}</th>
                                                        <th scope="col">{t('invoicereconciliationlist_th_gsttdsdeductedamount')}</th>
                                                        <th scope="col">{t('invoicereconciliationlist_th_tdsdeductedamount')}</th>
                                                        <th scope="col">{t('invoicereconciliationlist_th_customerexpenseamount')}</th>
                                                        <th scope="col">{t('invoicereconciliationlist_th_otherdeductionamount')}</th>
                                                        <th scope="col">{t('invoicereconciliationlist_th_penaltyamount')}</th>
                                                        <th scope="col">{t('invoicereconciliationlist_th_securitydepositamount')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {collection.map((field, index) => (
                                                        <tr className="">
                                                            <td >{(currentPage - 1) * 10 + index + 1}</td>
                                                            <td className="text-center">{field.invoiceReconciliation.CustomerName}</td>
                                                            <td>{field.invoiceReconciliation.InvoiceNumber}</td>
                                                            <td className="text-end">{formatCurrency(field.invoiceReconciliation.NetInvoiceAmount)}</td>
                                                            <td className="text-end">{formatCurrency(field.invoiceReconciliation.CollectedAmount)}</td>
                                                            <td className="text-end">{formatCurrency(field.invoiceReconciliation.OutstandingAmount)}</td>
                                                            <td className="text-end">{formatCurrency(field.invoiceReconciliation.GstTdsDeductedAmount)}</td>
                                                            <td className="text-end">{formatCurrency(field.invoiceReconciliation.TdsDeductedAmount)}</td>
                                                            <td className="text-end">{formatCurrency(field.invoiceReconciliation.CustomerExpenseAmount)}</td>
                                                            <td className="text-end">{formatCurrency(field.invoiceReconciliation.OtherDeductionAmount)}</td>
                                                            <td className="text-end">{formatCurrency(field.invoiceReconciliation.PenaltyAmount)}</td>
                                                            <td className="text-end">{formatCurrency(field.invoiceReconciliation.SecurityDepositAmount)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            <div className="m-0">
                                                <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-muted ps-3">{t('invoicereconciliationlist_nodata')}</div>
                                )}
                            </div>
                    }
                    )}
                </div>
            }
        </div>
        {checkForPermission('INVOICERECONCILIATION_UPDATE') ? <TaxUpload />:<></>}
    </ContainerPage>
    )
}
