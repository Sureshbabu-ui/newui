import { useTranslation } from "react-i18next";
import { store } from "../../../../../state/store";
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useRef } from "react";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { initializeInvoiceView, loadContractInvoiceDetails } from "./ContractInvoiceView.slice";
import { useParams } from "react-router-dom";
import { downloadContractInvoice, getContractInvoiceDetails } from "../../../../../services/contractInvoice";
import { formatCurrencyToWords, formatDate, formatDateTime, formatDocumentName } from "../../../../../helpers/formats";
import { formatCurrency } from "../../../../../helpers/formats";
import FeatherIcon from 'feather-icons-react';
import { InvoicePendingReason } from "./InvoicePendingReason/InvoicePendingReason";
import FileSaver from "file-saver";

export const ContractInvoiceView = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    const { t } = useTranslation();
    const { ContractInvoiceId } = useParams<{ ContractInvoiceId: string }>();

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeInvoiceView());
        try {
            const result = await getContractInvoiceDetails(ContractInvoiceId);
            store.dispatch(loadContractInvoiceDetails(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }
    const { contractInvoice, contractInvoiceDetailList } = useStoreWithInitializer(
        ({ contractinvoiceview }) => contractinvoiceview,
        onLoad
    );

    const onDownloadClick = async (e: any) => {
        const response = await downloadContractInvoice(ContractInvoiceId)
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName())
    }

    return (
        <div className="border overflow-hidden">
            <div className="row" >
                <div className="col col-md-6 text-end">
                    <button className="btn app-primary-color float-end" onClick={onDownloadClick}>
                        <FeatherIcon icon="download-cloud" className="app-primary-color" size="24" />
                    </button>
                </div>
                <div className="col col-md-5 text-end mt-2 pe-0 me-0">
                    <a
                        className=" app-primary-color"
                        data-bs-toggle="modal"
                        data-bs-target="#InvoicePendingReason"
                        role="button"
                    >
                      {t('contractinvoice_hyperlink_pendingreason')}
                    </a>
                </div>
            </div>
            <div>

                <InvoicePendingReason PendingReasons={contractInvoice.InvoicePendingReason} />
            </div>
            <div className="row "  >
                {/* section left */}
                <div className="col col-md-1" ></div>
                {/* section left ends */}
                {/* invoice wrapper */}
                <div className="col col-md-10 border" ref={ref}>

                    <div className="row border-bottom">
                        <div><p className="h6 fw-bold mt-3 text-start ">{t('contractinvoiceview_title')}</p></div>
                        <div><p className="text-center h6 fw-bold">{t('contractinvoiceview_tax')}</p></div>
                    </div>
                    {/*gst irn section */}
                    <div className="row border-bottom mt-1">
                        <p className="mb-0 fw-bold">{t('contractinvoiceview_irn')}:</p>
                        <p className="fw-bold mb-1">{t('contractinvoiceview_ack')}: {`${contractInvoice.AckNo??''} ${formatDateTime(contractInvoice.AckDate)??''}`}</p>
                    </div>
                    {/*gst irn section ends here*/}
                    {/* {tenant details} */}
                    <div className="row border-bottom pb-2 mt-2">
                        <div className="col-8">
                            <table className="small">
                                <tr>
                                    <td>{t('contractinvoiceview_gstnumber')}</td>
                                    <td> {contractInvoice.GstNumber}</td>
                                </tr>
                                <tr>
                                    <td>{t('contractinvoiceview_name')}</td>
                                    <td> {contractInvoice.TenantOfficeName} </td>
                                </tr>
                                <tr>
                                    <td className="align-text-top">{t('contractinvoiceview_address')}</td>
                                    <td>{contractInvoice.Address}</td>
                                </tr>
                                <tr>
                                    <td>{t('contractinvoiceview_state')}:</td>
                                    <td>{contractInvoice.StateName}</td>
                                </tr>
                                <tr>
                                    <td>{t('contractinvoiceview_statecode')}:</td>
                                    <td>{contractInvoice.GstNumber.substring(0, 2)}</td>
                                </tr>
                                <tr>
                                    <td className="text-nowrap">
                                        {t('contractinvoiceview_serialno')} :
                                    </td>
                                    <td>{contractInvoice.InvoiceNumber}</td>
                                </tr>
                                <tr>
                                    <td className="text-nowrap">{t('contractinvoiceview_invoicedate')} </td>
                                    <td > {formatDate(contractInvoice.ScheduledInvoiceDate)} </td>
                                </tr>
                                <tr>
                                    <td className="text-nowrap pe-4"> {t('contractinvoiceview_pannumber')}</td>
                                    <td>  {contractInvoice.PanNumber}</td>
                                </tr>
                            </table>
                        </div>
                        <div className="row">
                            <div className="col-4"></div>
                            <div className="col-8"></div>
                        </div>
                    </div>
                    {/* {tenant details ends here} */}
                    {/* Customer details */}
                    <div className="row border-bottom pt-2 pb-0">
                        <div className="col col-md-6">
                            <div className="">
                                <p className="px-0 mb-0"> <strong>{t('contractinvoiceview_billedtoinfo')}</strong></p>
                                <address>
                                    <p className="mb-0">{contractInvoice.NameOnPrint}</p>
                                    <p className="mb-0">{contractInvoice.BilledToAddress}</p>
                                    <p className="mb-0">{contractInvoice.BilledToCityName}</p>
                                    <p className="mb-0">{contractInvoice.BilledToStateName}</p>
                                    <p className="mb-0">{`${t('contractinvoiceview_statecode')}: ${contractInvoice.BilledToGstNumber.substring(0, 2)}`}</p>
                                    <p> {`${t('contractinvoiceview_gst')}: ${contractInvoice.BilledToGstNumber}`} </p>
                                </address>
                            </div>
                        </div>
                        <div className="col col-md-6">
                            <div className="">
                                <p className="ms-0 mb-0"> <strong>{t('contractinvoiceview_shippedtoinfo')}</strong></p>
                                <address>
                                    <p className="mb-0">{contractInvoice.NameOnPrint}</p>
                                    <p className="mb-0">{contractInvoice.ShippedToAddress}</p>
                                    <p className="mb-0">{contractInvoice.ShippedToCityName}</p>
                                    <p className="mb-0">{contractInvoice.ShippedToStateName}</p>
                                    <p className="mb-0">{`${t('contractinvoiceview_statecode')}: ${contractInvoice.ShippedToGstNumber.substring(0, 2)}`}</p>
                                    <p> {`${t('contractinvoiceview_gst')}: ${contractInvoice.ShippedToGstNumber}`} </p>
                                </address>
                            </div>
                        </div>
                    </div>
                    {/* Customer details ends here*/}
                    {/* contract details */}
                    <div className="row pt-2">
                        <div className="table-responsive ">
                            <table className="table table-hover table-bordered small pe-0">
                                <thead>
                                    <tr>
                                        <td className="pe-0 text-center">{t('contractinvoiceview_contractnum')}</td>
                                        <td className="px-0 text-center"> {t('contractinvoiceview_contractdate')}</td>
                                        <td className="px-0 text-center">{t('contractinvoiceview_customerpono')}</td>
                                        <td className="pe-0 text-center">{t('contractinvoiceview_contracttype')} </td>
                                        <td className="pe-0 text-center">{t('contractinvoiceview_contractperiod')} </td>
                                        <td className="pe-0 text-center">{t('contractinvoiceview_invoiceperiod')} </td>
                                        <td>{t('contractinvoiceview_paymentdueon')}</td>
                                        <td>{t('contractinvoiceview_invoicevalue')}</td>
                                    </tr>
                                </thead>
                                <tbody >
                                    <tr>
                                        <td>{contractInvoice.ContractNumber}</td>
                                        {/* TODOS this is the ponumber in contract */}
                                        <td className="px-0 text-center">{formatDate(contractInvoice.BookingDate)}</td>
                                        <td className="px-0 text-center"> {contractInvoice.PoNumber} </td>
                                        <td className="px-0 text-center">  {contractInvoice.AgreementType} </td>
                                        <td className="pe-0 text-center">{`${formatDate(contractInvoice.ContractStartDate)} to ${formatDate(contractInvoice.ContractEndDate)}`}</td>
                                        <td className="px-0 text-center">{`${formatDate(contractInvoice.InvoiceStartDate)} to ${formatDate(contractInvoice.InvoiceEndDate)}`}</td>
                                        <td className="px-0 text-center">{formatDate(contractInvoice.InvoiceDueDate)}</td>
                                        <td className="px-0 text-center">{contractInvoice.InvoiceAmount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* contract details ends here*/}
                    {/* invoice details */}
                    <div className="row">
                        {contractInvoiceDetailList.length > 0 ? (
                            <div className="table-responsive0">
                                <table className="table table-hover small  table-bordered ">
                                    <thead>
                                        <tr>
                                            <td>{t('contractinvoiceview_detaillist_th_slno')}</td>
                                            <td>{t('contractinvoiceview_detaillist_th_description')}</td>
                                            {/* <td>{t('contractinvoicecreate_detaillist_th_unit')}</td> */}
                                            <td>{t('contractinvoiceview_detaillist_th_soc')}</td>
                                            <td className="text-center">{t('contractinvoiceview_detaillist_th_quantity')}</td>
                                            <td>{t('contractinvoiceview_detaillist_th_rate')}</td>
                                            <td>{t('contractinvoiceview_detaillist_th_amount')}</td>
                                            <td>{t('contractinvoiceview_detaillist_th_discount')}</td>
                                            <td>{t('contractinvoiceview_detaillist_th_taxableamount')}</td>
                                            <td>{t('contractinvoiceview_detaillist_th_sgst')}</td>
                                            <td>{t('contractinvoiceview_detaillist_th_cgst')}</td>
                                            <td>{t('contractinvoiceview_detaillist_th_igst')}</td>
                                            {/* <td>{t('contractinvoicecreate_detaillist_th_netamount')}</td> */}
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {contractInvoiceDetailList.map((Item, Index) => {
                                            const amount = (Number(Item.Quantity) * Number(Item.Rate) - Number(Item.Discount))
                                            return <tr key={Index} className="">
                                                <td>{Index + 1}</td>
                                                <td className="px-0">{Item.ItemDescription}</td>
                                                <td>{Item.ServicingAccountingCode}</td>
                                                {/* <td> {Item.Unit}  </td> */}
                                                <td className="px-0">{Item.Quantity}</td>
                                                <td className="px-0 text-end">{formatCurrency(Item.Rate.toFixed(2))}</td>
                                                <td className="px-0 text-end">{formatCurrency(Item.Amount.toFixed(2))}</td>
                                                <td className="px-0 text-end">{formatCurrency(Item.Discount.toFixed(2))}</td>
                                                <td className="px-0 text-end">{formatCurrency((Item.Amount - Number(Item.Discount)).toFixed(2))}</td>
                                                <td className="px-0 text-end">{`${formatCurrency(((Item.Amount - Number(Item.Discount)) * Item.Sgst / 100).toFixed(2))} (${Item.Sgst}%)`}</td>
                                                <td className="px-0 text-end">{`${formatCurrency(((Item.Amount - Number(Item.Discount)) * Item.Cgst / 100).toFixed(2))} (${Item.Cgst}%)`}</td>
                                                <td className="px-0 text-end">{`${formatCurrency(((Item.Amount - Number(Item.Discount)) * Item.Igst / 100).toFixed(2))} (${Item.Igst}%)`}</td>

                                                {/* <td className="px-0 text-end">{((amount + amount * Number(Item.Sgst) / 100 + amount * Number(Item.Cgst) / 100 + amount * Number(Item.Igst) / 100)).toFixed(2)}</td> */}
                                            </tr>
                                        })}
                                        <tr >
                                            <td colSpan={5} className="text-end">{t('contractinvoiceview_detaillist_th_amount')}</td>
                                            <td className="px-0 text-end">{formatCurrency(Number(contractInvoice.InvoiceAmount).toFixed(2))}</td>
                                            <td className="px-0 text-end">{formatCurrency(Number(contractInvoice.DeductionAmount).toFixed(2))}</td>
                                            <td className="px-0 text-end">{formatCurrency((Number(contractInvoice.InvoiceAmount) - Number(contractInvoice.DeductionAmount)).toFixed(2))}</td>
                                            <td className="px-0 text-end">{formatCurrency(contractInvoice.Sgst.toFixed(2))}</td>
                                            <td className="px-0 text-end">{formatCurrency(contractInvoice.Cgst.toFixed(2))}</td>
                                            <td className="px-0 text-end">{formatCurrency(contractInvoice.Igst.toFixed(2))}</td>

                                            {/* <td className="px-0 text-end">{(Number(contractInvoice.InvoiceAmount) - Number(contractInvoice.DeductionAmount) + Number(contractInvoice.Sgst) + Number(contractInvoice.Cgst) + Number(contractInvoice.Igst)).toFixed(2)}</td> */}
                                        </tr>

                                    </tbody>
                                </table>
                            </div>) : (<> </>)}
                    </div>
                    {/* invoice details ends here*/}
                    {/* invoice summary */}
                    <div className="row border-bottom py-2 small">
                        <tr>
                            <td>{t('contractinvoiceview_value_in_figure')}:</td>
                            <td className="fw-bold ps-4">{formatCurrency((Number(contractInvoice.InvoiceAmount) - Number(contractInvoice.DeductionAmount) + Number(contractInvoice.Sgst) + Number(contractInvoice.Cgst) + Number(contractInvoice.Igst)).toFixed(2))}{t('contractinvoiceview_roundoff')}</td>
                        </tr>
                        <tr>
                            <td className="text-nowrap pe-4">{t('contractinvoiceview_value_in_words')}:</td>
                            <td >{`${formatCurrencyToWords((Number(contractInvoice.InvoiceAmount) - Number(contractInvoice.DeductionAmount) + Number(contractInvoice.Sgst) + Number(contractInvoice.Cgst) + Number(contractInvoice.Igst)))} ${t('contractinvoiceview_roundoff')}`}</td>
                        </tr>
                    </div>
                    {/* invoice summary ends here */}
                    {/* signature */}
                    <div className="row border-bottom">
                        <p>{`For ${contractInvoice.TenantOfficeName}`}</p>
                        <p className="pt-4 mb-0 small">{t('contractinvoiceview_authorized_sign')}</p>
                        <p className="text-center fw-bold small">{t('contractinvoiceview_sign_warning')}</p>
                    </div>
                    {/* signature ends here */}
                    {/* bank details */}
                    <div className="row fw-bold small border-bottom">
                        <p className="mb-0">{t('contractinvoiceview_bankdetail')}:</p>
                        <p className="mb-0">{`${t('contractinvoiceview_bankname')} : ${contractInvoice.BankName}`}</p>
                        <p className="mb-0">{`${t('contractinvoiceview_accno')}  : ${contractInvoice.AccountNumber}`}
                            <span className="mb-0 ps-3">  {` || ${t('contractinvoiceview_ifsc')} : ${contractInvoice.Ifsc}`}</span></p>
                        <p>{`${t('contractinvoiceview_email')} : ${contractInvoice.BankEmail}`}</p>
                    </div>
                    {/* bank details ends here */}
                    {/* footer note */}
                    <div className="row fw-bold small border-bottom">
                        <p className="mb-0">{t('contractinvoiceview_footernote1')}</p>
                        <p className="mt-0">"{t('contractinvoiceview_footernote2')}"</p>
                    </div>
                    {/* footer note ends here */}
                </div>
                {/* invoice wrapper ends */}
                {/* section right */}
                <div className="col col-md-1"></div>
                {/* section right ends */}
            </div>
        </div>
    );
}