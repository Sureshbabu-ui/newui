import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from "../../../ContainerPage/ContainerPage";
import { store } from '../../../../state/store';
import { changePage, initializeReceiptList, loadReceipts, setSearch } from './ReceiptList.slice';
import { Pagination } from "../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { formatCurrency, formatDate} from "../../../../helpers/formats";
import { getReceiptList } from "../../../../services/receipt";
import { Link } from "react-router-dom";
import FeatherIcon from 'feather-icons-react';
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";

export const ReceiptList = () => {
    const { t } = useTranslation();
    const { 
        receiptlist: { receipts, totalRows, perPage, currentPage, search },
    } = useStore(({ receiptlist, app }) => ({ receiptlist, app }));

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeReceiptList());
        try {
            const Receipt = await getReceiptList(search, currentPage);
            store.dispatch(loadReceipts(Receipt));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getReceiptList(search, index);
        store.dispatch(loadReceipts(result));
    }

    async function filterReceiptList(e) {
        store.dispatch(changePage(1))
        const result = await getReceiptList(store.getState().receiptlist.search,1)
        store.dispatch(loadReceipts(result));
      }
      const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
          const result = await getReceiptList(store.getState().receiptlist.search, store.getState().receiptlist.currentPage);
          store.dispatch(loadReceipts(result));
        }
      }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_receipt' }
       
    ];

    return (<>
        <BreadCrumb items={breadcrumbItems} />
        <ContainerPage>
        {receipts.match({
            none: () => <div className="p-3">{t('receipt_list_loading')}</div>,
            some: (Receipt) => <div className="ps-3 pe-4 ">
                <div className="row mt-1 mb-3 p-0 ">
                    <div className="col-md-9 app-primary-color ">
                        <h5 className="ms-0 ps-1"> {t('receiptlist_title')}</h5>
                    </div>
                   </div>
                <div className="mb-3  ps-1 pe-0">
                    <div className="input-group">
                        <input type='search' className="form-control custom-input" value={search??""} placeholder={t('receiptlist_placeholder_search') ?? ''}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    filterReceiptList(e);
                                }
                            }} onChange={addData} />
                        <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterReceiptList}>
                            Search
                        </button>
                    </div>
                </div>
                <div className="row mt-3 ps-1">
                    {Receipt.length > 0 ? ( 
                        <div className=" table-responsive ">
                            <table className="table table-hover text-nowrap table-bordered ">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th scope="col">{t('receiptlist_th_sl_no')}</th>
                                        <th scope="col">{t('receiptlist_th_receiptnumber')}</th>
                                        <th scope="col">{t('receiptlist_th_receiptdate')}</th>
                                        <th scope="col">{t('receiptlist_th_customername')}</th>
                                        <th scope="col">{t('receiptlist_th_paymentmethod')}</th>
                                        <th scope="col">{t('receiptlist_th_amount')}</th>
 </tr>
                                </thead>
                                <tbody>
                                    {Receipt.map((field, index) => (
                                        <tr className="mt-2" key={index}>
                                              <td><a className="pseudo-href app-primary-color" href={`/finance/receipts/${field.receipt.Id}`}>
                                                    <FeatherIcon icon={"eye"} size="16" />
                                                </a></td>
                                            <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                            <td>{field.receipt.ReceiptNumber} </td> 
                                            <td>{formatDate(field.receipt.ReceiptDate)}</td>
                                           <td>{field.receipt.CustomerName}</td> 
                                            <td>{field.receipt.PaymentMethod}</td>
                                            <td><span className="d-flex floar-end">{formatCurrency(field.receipt.ReceiptAmount)}</span></td> 
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="row m-0">
                                <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-muted ps-3">{t('receiptlist_no_data')}</div>
                    )}
                </div>
            </div>
        })}
    </ContainerPage></>) 
}