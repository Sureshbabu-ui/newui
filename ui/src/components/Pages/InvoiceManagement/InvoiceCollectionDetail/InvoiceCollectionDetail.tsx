import { useTranslation } from "react-i18next";
import { store } from "../../../../state/store";
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import { startPreloader, stopPreloader } from "../../../Preloader/Preloader.slice";
import { useHistory, useParams } from "react-router-dom";
import { formatCurrency, formatDate} from "../../../../helpers/formats";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";
import { initializeInvoiceCollectionDetail, loadInvoiceCollectionDetail } from "./InvoiceCollectionDetail.slice";
import { getInvoiceCollectionDetail } from "../../../../services/invoice";

const InvoiceCollectionDetail = () => {

    const { t } = useTranslation();
    const { InvoiceId } = useParams<{ InvoiceId: string }>();
    const history = useHistory()

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeInvoiceCollectionDetail());
        try {
            const result = await getInvoiceCollectionDetail(InvoiceId);
            store.dispatch(loadInvoiceCollectionDetail(result));
        } catch (error) {
            return;
        }
        finally {
            store.dispatch(stopPreloader())
        }
    }
    const { InvoiceDetail, InvoiceReceiptDetailList } = useStoreWithInitializer(
        ({ invoicecollectiondetail }) => invoicecollectiondetail,
        onLoad
    );
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_invoice', Link: '/finance/invoices' },
        { Text: 'breadcrumbs_invoice_collectiondetail' }
    ];

    return (
        <div className="mx-0">
            <BreadCrumb items={breadcrumbItems} />
            <div className="row mx-0"  >
                <div className="col col-md-12 ps-3 ps-1" >
                    <div className="row mt-1">
                        <div className="col-md-6 pt-4">
                            <p className="mb-0 small">{t('invoicecollectiondetail_invoicenumber')}</p>
                            <p className=" mb-1">{InvoiceDetail.InvoiceNumber}</p>
                            <p className="mb-0 small">{t('invoicecollectiondetail_invoicedate')}</p>
                            <p className=" mb-1">{formatDate(InvoiceDetail.InvoiceDate)}</p>
                            <p className="mb-0 small">{t('invoicecollectiondetail_customer')}</p>
                            <p className=" mb-1">{InvoiceDetail.CustomerName}</p>
                            <p className="mb-0 small">{t('invoicecollectiondetail_contractnumber')}</p>
                            <p className=" mb-1">{InvoiceDetail.ContractNumber}</p>
                        </div>
                        <div className="col-md-6 pt-4">
                            <table className=" w-50 table-bordered ">
                                <tbody>
                                    <tr className="">
                                        <td><p className="mb-0 small">{t('invoicecollectiondetail_netinvoiceamount')}</p></td>
                                        <td className="text-end"><p className=" mb-1">{InvoiceDetail.NetInvoiceAmount?.toFixed(2)}</p></td>
                                    </tr>
                                    <tr>
                                        <td><p className="mb-0 small">{t('invoicecollectiondetail_collectedamount')}</p></td>
                                        <td className="text-end"><p className=" mb-1">{InvoiceDetail.CollectedAmount?.toFixed(2)}</p></td>
                                    </tr>
                                    <tr>
                                        <td><p className="mb-0 small">{t('invoicecollectiondetail_gsttdspaidamount')}</p></td>
                                        <td className="text-end"><p className=" mb-1">{InvoiceDetail.GstTdsPaidAmount?.toFixed(2)}</p></td>
                                    </tr>
                                    <tr>
                                        <td><p className="mb-0 small">{t('invoicecollectiondetail_tdspaidamount')}</p></td>
                                        <td className="text-end"><p className=" mb-1">{InvoiceDetail.TdsPaidAmount?.toFixed(2)}</p></td>
                                    </tr>
                                    <tr>
                                        <td><p className="mb-0 small">{t('invoicecollectiondetail_outstandingamount')}</p></td>
                                        <td className="text-end"><p className=" mb-1">{InvoiceDetail.OutstandingAmount?.toFixed(2)}</p></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row mt-3 ps-3 pe-3 mb-0 pb-0">
                    <div>{t('invoicecollectiondetail_header_receipt')}</div>
                </div>
                <div className="row ps-3 pe-3">
                    {InvoiceReceiptDetailList.length > 0 ? (
                        <div className="table-responsive pe-0 me-0">
                            <table className="table table-hover table-bordered mx-0 px-0">
                                <thead>
                                    <tr>
                                        <td className="text-center">{t('invoicecollectiondetail_receiptlist_th_sl_no')}</td>
                                        <td>{t('invoicecollectiondetail_receiptlist_th_receiptnumber')}</td>
                                        <td>{t('invoicecollectiondetail_receiptlist_th_receiptdate')}</td>
                                        <td className="text-end">{t('invoicecollectiondetail_receiptlist_th_receiptamount')}</td>
                                        <td className="text-end">{t('invoicecollectiondetail_receiptlist_th_mappedamount')}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {InvoiceReceiptDetailList.map((Item, Index) => {
                                        return <tr key={Index} className="">
                                            <td className="text-center">{Index + 1}</td>
                                            <td className="px-2">{Item.ReceiptNumber}</td>
                                            <td>{formatDate(Item.ReceiptDate)}</td>
                                            <td className="px-2 text-end">{formatCurrency(Item.ReceiptAmount.toFixed(2))}</td>
                                            <td className="px-2 text-end">{formatCurrency(Item.MappedAmount.toFixed(2))}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>) : (
                        <div>
                            <small className="text-muted">{t('invoicecollectiondetail_text_nodata')}</small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InvoiceCollectionDetail