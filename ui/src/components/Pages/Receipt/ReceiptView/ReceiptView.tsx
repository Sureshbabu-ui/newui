import { useTranslation } from "react-i18next";
import { store } from "../../../../state/store";
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import { startPreloader, stopPreloader } from "../../../Preloader/Preloader.slice";
import { useParams } from "react-router-dom";
import { formatCurrency, formatCurrencyToWords, formatDate } from "../../../../helpers/formats";
import { initializeReceiptView, loadReceiptViewDetails } from "./ReceiptView.slice";
import { getReceiptDetails } from "../../../../services/receipt";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";

export const ReceiptView = () => {

    const { t } = useTranslation();
    const { ReceiptId } = useParams<{ ReceiptId: string }>();

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeReceiptView());
        try {
            const result = await getReceiptDetails(ReceiptId);
            store.dispatch(loadReceiptViewDetails(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }
    const { receipt, invoiceReceiptDetailList } = useStoreWithInitializer(
        ({ receiptview }) => receiptview,
        onLoad
    );
        const breadcrumbItems = [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_receipt', Link: '/finance/receipts' },
            { Text: 'breadcrumbs_receipt_view' } 
        ];

    return (
            <>
            <BreadCrumb items={breadcrumbItems} /> 
            <div className="row mx-0"  >
                <div className="col col-md-1" ></div>
                <div className="col col-md-10 ps-1" >
                    <div className="row mt-4">
                        <div><p className="h5 fw-bold  text-start app-primary-color">{`${t('receiptview_title')} #${receipt.ReceiptNumber}`}</p></div>
                    </div>
                    {/*gst irn section */}
                    <div className="row mt-1">
                        <div className="col-md-6">
                            <p className="mb-0 small">{t('receiptview_customer')}</p>
                            <p className=" mb-1">{receipt.CustomerName}</p>
                            <p className="mb-0 small">{t('receiptview_amount')}</p>
                            <p className=" mb-1">{receipt.ReceiptAmount?.toFixed(2)}</p>
                            <p className="mb-0 small">{t('receiptview_receiptdate')}</p>
                            <p className=" mb-1">{formatDate(receipt.ReceiptDate)}</p>
                            <p className="mb-0 small">{t('receiptview_paymentmethod')}</p>
                            <p className=" mb-1">{receipt.PaymentMethod}</p>
                        </div>
                        <div className="col-md-6">
                           
                                {receipt.TransactionReferenceNumber &&
                                <>
                                 <p className="mb-0 small">{t('receiptview_trn')}</p>
                                    <p className=" mb-1">{receipt.TransactionReferenceNumber}</p>
                                     </>}
                            {
                                receipt.TenantBankAccount && <>
                                    <p className="mb-0 small">{t('receiptview_tenantbank')}</p>
                                    <p className=" mb-1">{receipt.TenantBankAccount}</p>
                                </>
                            }
                        </div>
                    </div>



                    <div className="row mt-3">
                        {invoiceReceiptDetailList.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered ms-0">
                                    <thead>
                                        <tr>
                                            <td>{t('receiptview_detaillist_th_sl_no')}</td>
                                            <td>{t('receiptview_detaillist_th_innvoicenumber')}</td>
                                            <td>{t('receiptview_detaillist_th_invoiceamount')}</td>
                                            <td>{t('receiptview_detaillist_th_receiptamount')}</td>
                                            {/* <td>{t('contractinvoicecreate_detaillist_th_netamount')}</td> */}
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {invoiceReceiptDetailList.map((Item, Index) => {
                                            return <tr key={Index} className="">
                                                <td>{Index + 1}</td>
                                                <td className="px-2"><a className="pseudo-href app-primary-color" href={`/invoice/${Item.InvoiceId}`}>
                                                    {Item.InvoiceNumber}
                                                </a></td>
                                                <td className="px-2">{formatCurrency(Item.InvoiceAmount.toFixed(2))}</td>
                                                <td className="px-2">{formatCurrency(Item.ReceiptAmount.toFixed(2))}</td>
                                            </tr>
                                        })}


                                    </tbody>
                                </table>
                            </div>) : (<> </>)}
                    </div>
                </div>

            </div>
        </>
    );
}