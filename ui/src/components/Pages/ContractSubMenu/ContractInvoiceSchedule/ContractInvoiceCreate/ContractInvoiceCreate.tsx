import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useStore } from "../../../../../state/storeHooks";
import { useEffect, useState } from 'react'
import { ContractInvoiceCreateState, initializeContractInvoiceCreate, loadGstRates, loadPOLineItemsList, toggleInformationModalStatus, updateContractInvoiceScheduleDetail, updateDetailDiscountField, updateErrors, updateField } from "./ContractInvoiceCreate.slice";
import { store } from "../../../../../state/store";
import * as yup from 'yup';
import SweetAlert from "react-bootstrap-sweetalert";
import { createContractInvoice } from "../../../../../services/contractInvoice";
import { checkIfSameState, convertBackEndErrorsToValidationErrors, formatCurrency, formatDate } from "../../../../../helpers/formats";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { getGstRates } from "../../../../../services/contracts";
import { getContractInvoiceScheduleDetails } from "../../../../../services/contractInvoiceSchedule";
import { GstActiveRates } from "../../../../../types/contract";
import { ContractInvoiceDetailCreate } from "../../../../../types/contractInvoiceDetail";
import { checkForPermission } from "../../../../../helpers/permissions";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";

export const ContractInvoiceScheduleCreate = () => {
    const { ContractId, InvoiceScheduleId } = useParams<{ ContractId: string, InvoiceScheduleId: string }>();
    const { t } = useTranslation();
    const history = useHistory()
    const buttonBackClick = () => {
        history.goBack()
    }
    const {
        contractinvoicecreate: { contractInvoiceDetailList, GstRates, contractInvoice, displayInformationModal, errors, contractInvoiceScheduleDetails },
    } = useStore(({ contractinvoicecreate, app }) => ({ contractinvoicecreate, app }));

    useEffect(() => {
        store.dispatch(initializeContractInvoiceCreate())
    }, [])

    useEffect(() => {
        const name = "ContractInvoiceScheduleId"
        const value = InvoiceScheduleId
        store.dispatch(updateField({ name: name as keyof ContractInvoiceCreateState['contractInvoice'], value }));
        getInvoiceSchedleDetails()
    }, [InvoiceScheduleId])

    const getInvoiceSchedleDetails = async () => {
        const scheduleDetails = await getContractInvoiceScheduleDetails(InvoiceScheduleId)
        store.dispatch(updateContractInvoiceScheduleDetail(scheduleDetails))
        const gstRates = await getGstRates();
        store.dispatch(loadGstRates(gstRates));
    }

    const [amcGstRate, setAmcGstRate] = useState<GstActiveRates>();
    const [fmsGstRate, setFmsGstRate] = useState<GstActiveRates>();

    useEffect(() => {
        const filteredAMCRate = GstRates.filter(item => item.TenantServiceCode === 'AMCC')[0];
        setAmcGstRate(filteredAMCRate);
        const filteredFMSRate = GstRates.filter(item => item.TenantServiceCode === 'FMS')[0];
        setFmsGstRate(filteredFMSRate);
    }, [GstRates]);

    const getPOLineItems = async () => {
        const invoiceDetails: ContractInvoiceDetailCreate[] = [];
        const Quantity = 1;
        //If contract is either amc or amc+fms we need only one entry in contract detail ie of amc
        if (contractInvoiceScheduleDetails.AmcValue > 0 && amcGstRate !== undefined) {
            invoiceDetails.push({
                ItemDescription: amcGstRate.ServiceAccountDescription,
                ServicingAccountingCode: amcGstRate.TenantServiceCode,
                Quantity: Quantity,
                Unit: 1,
                Rate: (
                    //In future if we need separate entry for amc and fms for both type remove fms value from here and in the else part of this if condition remove else in else if.
                    (Number(contractInvoiceScheduleDetails.ScheduledInvoiceAmount) * (Number(contractInvoiceScheduleDetails.AmcValue) + Number(contractInvoiceScheduleDetails.FmsValue))) /
                    contractInvoiceScheduleDetails.ContractValue
                ).toFixed(2),
                Amount: (
                    Quantity *
                    (Number(contractInvoiceScheduleDetails.ScheduledInvoiceAmount) * (Number(contractInvoiceScheduleDetails.AmcValue) + Number(contractInvoiceScheduleDetails.FmsValue))) /
                    contractInvoiceScheduleDetails.ContractValue
                ).toFixed(2),
                Sgst: (checkIfSameState(contractInvoiceScheduleDetails.GstNumber, contractInvoiceScheduleDetails.BilledToGstNumber) == true ? amcGstRate.Sgst : 0),
                Cgst: (checkIfSameState(contractInvoiceScheduleDetails.GstNumber, contractInvoiceScheduleDetails.BilledToGstNumber) == true ? amcGstRate.Cgst : 0),
                Igst: (checkIfSameState(contractInvoiceScheduleDetails.GstNumber, contractInvoiceScheduleDetails.BilledToGstNumber) == false ? amcGstRate.Igst : 0),
                NetAmount: (
                    Quantity *
                    (Number(contractInvoiceScheduleDetails.ScheduledInvoiceAmount) * (Number(contractInvoiceScheduleDetails.AmcValue) + Number(contractInvoiceScheduleDetails.FmsValue))) /
                    contractInvoiceScheduleDetails.ContractValue
                ).toFixed(2),
                Discount: 0,

            });
        }
        //If contract is fms then only fms will be added to invoice detail
        else if (contractInvoiceScheduleDetails.FmsValue > 0 && fmsGstRate !== undefined) {
            invoiceDetails.push({
                ItemDescription: fmsGstRate !== undefined ? fmsGstRate.ServiceAccountDescription : "",
                ServicingAccountingCode: fmsGstRate !== undefined ? fmsGstRate.TenantServiceCode : "",
                Quantity: Quantity,
                Unit: 1,
                Rate: (
                    (Number(contractInvoiceScheduleDetails.ScheduledInvoiceAmount) * Number(contractInvoiceScheduleDetails.FmsValue)) /
                    contractInvoiceScheduleDetails.ContractValue
                ).toFixed(2),
                Amount: (
                    Quantity *
                    (Number(contractInvoiceScheduleDetails.ScheduledInvoiceAmount) * Number(contractInvoiceScheduleDetails.FmsValue)) /
                    contractInvoiceScheduleDetails.ContractValue
                ).toFixed(2),
                Sgst: (checkIfSameState(contractInvoiceScheduleDetails.GstNumber, contractInvoiceScheduleDetails.BilledToGstNumber) == true && !contractInvoiceScheduleDetails.IsSez? fmsGstRate.Sgst : 0),
                Cgst: (checkIfSameState(contractInvoiceScheduleDetails.GstNumber, contractInvoiceScheduleDetails.BilledToGstNumber) == true && !contractInvoiceScheduleDetails.IsSez? fmsGstRate.Cgst : 0),
                Igst: (checkIfSameState(contractInvoiceScheduleDetails.GstNumber, contractInvoiceScheduleDetails.BilledToGstNumber) == false && !contractInvoiceScheduleDetails.IsSez ? fmsGstRate.Igst : 0),
                NetAmount: (
                    Quantity *
                    (Number(contractInvoiceScheduleDetails.ScheduledInvoiceAmount) * Number(contractInvoiceScheduleDetails.AmcValue)) /
                    contractInvoiceScheduleDetails.ContractValue
                ).toFixed(2),
                Discount: 0,
            });
        }
        store.dispatch(loadPOLineItemsList(invoiceDetails))
    }

    useEffect(() => {
        const value = ContractId
        store.dispatch(updateField({ name: "ContractId", value }));
    }, [ContractId])

    useEffect(() => {
        getPOLineItems()
    }, [contractInvoiceScheduleDetails.Id, amcGstRate, fmsGstRate])

    const onUpdateField = (ev: any) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof ContractInvoiceCreateState['contractInvoice'], value }));
    }

    const onUpdateDetailDiscountField = (ev: any) => {
        const index = Number(ev.target.name);
        if (!isNaN(ev.target.value)) {
            const value = ev.target.value;
            store.dispatch(updateDetailDiscountField({ index, value }));
        }
    }

    const onSubmit = async () => {
        if (checkForPermission('INVOICE_CREATE')) {
            store.dispatch(updateErrors({}))
            try {
                await validationSchema.validate(contractInvoice, { abortEarly: false });
            } catch (error: any) {
                const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                    return { ...allErrors, [currentError.path as string]: currentError.message };
                }, {});
                store.dispatch(updateErrors(errors))
                if (errors)
                    console.log(errors);
                return;
            }
            store.dispatch(startPreloader());
            const result = await createContractInvoice({
                ContractInvoice: contractInvoice,
                ContractInvoiceDetails: contractInvoiceDetailList
            }
            )
            result.match({
                ok: () => {
                    store.dispatch(toggleInformationModalStatus());
                },
                err: (e) => {
                    const errorMessages = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(errorMessages));
                },
            });
            store.dispatch(stopPreloader());
        }
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateContractInvoiceDetail}>
                {t('contractinvoicecreate_success_message')}
            </SweetAlert>
        );
    }

    const updateContractInvoiceDetail = async () => {
        store.dispatch(toggleInformationModalStatus());
        history.goBack()
    }

    const validationSchema = yup.object().shape({
        InvoiceDate: yup.string().required(t('validation_error_contractinvoicecreate_invoicedate_required') ?? ''),
        CollectionDueDate: yup.string().required(t('validation_error_contractinvoicecreate_collectionduedate_required') ?? '')
    });

    return (
        <>{checkForPermission('INVOICE_CREATE') &&
            <div>
                <div className="row mt-1  p-0 m-0 mb-2 pe-3">
                    <div className="col-md-2">
                        <button onClick={buttonBackClick} className="btn ms-2 app-primary-bg-color text-white mt-2 ">Back</button>
                    </div>
                    <div className="col-md-10 mt-2  ">
                    <ValidationErrorComp errors={errors}/>
                        <div className=" ms-0">
                            <h5 className="ms-0 app-primary-color "> {t('contractinvoiceschedulecreate_title')}</h5>
                        </div>
                        <div className=" ms-0 row">
                            <p className="ms-0 ps-0"> {t('contractinvoiceschedulecreate_subtitle')} #{contractInvoiceScheduleDetails.ContractNumber}</p>
                        </div>

                        <div className="row pe-3 mb-1">
                            <div className="col-8">
                                <table >
                                    <tr>
                                        <td>{t('contractinvoiceschedulecreate_gstnumber')}</td>
                                        <td> {contractInvoiceScheduleDetails.GstNumber}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('contractinvoiceschedulecreate_name')}</td>
                                        <td> {contractInvoiceScheduleDetails.TenantOfficeName} </td>
                                    </tr>
                                    <tr>
                                        <td className="align-text-top">{t('contractinvoiceschedulecreate_address')}</td>
                                        <td>{contractInvoiceScheduleDetails.Address}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('contractinvoiceschedulecreate_invoicedate')} </td>
                                        <td > {formatDate(contractInvoiceScheduleDetails.ScheduledInvoiceDate)} </td>
                                    </tr>
                                    <tr>
                                        <td className="text-nowrap pe-4"> {t('contractinvoiceschedulecreate_pannumber')}</td>
                                        <td>  {contractInvoiceScheduleDetails.PanNumber}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-md-6">
                                <div className="">
                                    <p className="px-0 mb-0"> <strong>{t('contractinvoiceschedulecreate_billedtoinfo')}</strong></p>
                                    <address>
                                        <p className="mb-0">{contractInvoiceScheduleDetails.NameOnPrint}</p>
                                        <p className="mb-0">{contractInvoiceScheduleDetails.BilledToAddress}</p>
                                        <p className="mb-0">{contractInvoiceScheduleDetails.BilledToCityName}</p>
                                        <p className="mb-0">{contractInvoiceScheduleDetails.BilledToStateName}</p>
                                        <p className="mb-0">{contractInvoiceScheduleDetails.BilledToCountryName}</p>
                                        <p> {`${t('contractinvoiceschedulecreate_gst')}: ${contractInvoiceScheduleDetails.BilledToGstNumber}`} </p>
                                    </address>
                                </div>
                            </div>
                            <div className="col col-md-6">
                                <div className="">
                                    <p className="ms-0 mb-0"> <strong>{t('contractinvoiceschedulecreate_shippedtoinfo')}</strong></p>
                                    <address>
                                        <p className="mb-0">{contractInvoiceScheduleDetails.NameOnPrint}</p>
                                        <p className="mb-0">{contractInvoiceScheduleDetails.ShippedToAddress}</p>
                                        <p className="mb-0">{contractInvoiceScheduleDetails.ShippedToCityName}</p>
                                        <p className="mb-0">{contractInvoiceScheduleDetails.ShippedToStateName}</p>
                                        <p className="mb-0">{contractInvoiceScheduleDetails.ShippedToCountryName}</p>
                                        <p> {`${t('contractinvoiceschedulecreate_gst')}: ${contractInvoiceScheduleDetails.ShippedToGstNumber}`} </p>
                                    </address>
                                </div>
                            </div>
                        </div>

                        <div className="row ">
                            <div className="table-responsive px-2">
                                <table className="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" scope="col">{t('contractinvoiceschedulecreate_contractnum')}</th>
                                            <th className="text-center" scope="col">{t('contractinvoiceschedulecreate_contractdate')}</th>
                                            <th className="text-center" scope="col">{t('contractinvoiceschedulecreate_customerpono')}</th>
                                            <th className="text-center" scope="col">{t('contractinvoiceschedulecreate_contracttype')} </th>
                                            <th className="text-center" scope="col">{t('contractinvoiceschedulecreate_contractperiod')} </th>
                                            <th className="text-center" scope="col">{t('contractinvoiceschedulecreate_invoiceperiod')} </th>
                                            <th className="text-center" scope="col">{t('contractinvoiceschedulecreate_paymentdueon')}</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        <tr>
                                            <td className="text-center">{contractInvoiceScheduleDetails.ContractNumber}</td>
                                            {/* TODOS this is the ponumber in contract */}
                                            <td className="text-center">{formatDate(contractInvoiceScheduleDetails.BookingDate)}</td>
                                            <td className="text-center"> {contractInvoiceScheduleDetails.PoNumber} </td>
                                            <td className="text-center">  {contractInvoiceScheduleDetails.AgreementType} </td>
                                            <td className="text-center">{`${formatDate(contractInvoiceScheduleDetails.ContractStartDate)} to  ${formatDate(contractInvoiceScheduleDetails.ContractEndDate)}`}</td>
                                            <td className="text-center">{`${formatDate(contractInvoiceScheduleDetails.InvoiceStartDate)} to ${formatDate(contractInvoiceScheduleDetails.InvoiceEndDate)}`}</td>
                                            <td className="text-center">{formatDate(contractInvoiceScheduleDetails.InvoiceDueDate)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="row my-3">
                            <div className="col">
                                <h5 className="ms-0 "> {t('contractinvoiceschedulecreate_itemdetailtitle')}</h5>
                            </div>
                        </div>
                        <div className="row">
                            {contractInvoiceDetailList.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover  table-bordered ">
                                        <thead>
                                            <tr>
                                                <th className="text-center" scope="col">{t('contractinvoicecreate_detaillist_th_slno')}</th>
                                                <th className="text-center" scope="col">{t('contractinvoicecreate_detaillist_th_description')}</th>
                                                {/* <th scope="col">{t('contractinvoicecreate_detaillist_th_unit')}</th> */}
                                                <th className="text-center" scope="col">{t('contractinvoicecreate_detaillist_th_quantity')}</th>
                                                <th className="text-center" scope="col">{t('contractinvoicecreate_detaillist_th_rate')}</th>
                                                <th className="text-center" scope="col">{t('contractinvoicecreate_detaillist_th_amount')}</th>
                                                <th className="text-center" scope="col">{t('contractinvoicecreate_detaillist_th_discount')}</th>
                                                <th className="text-center" scope="col">{t('contractinvoicecreate_detaillist_th_taxableamount')}</th>
                                                <th className="text-center" scope="col">{t('contractinvoicecreate_detaillist_th_sgst')}</th>
                                                <th className="text-center" scope="col">{t('contractinvoicecreate_detaillist_th_cgst')}</th>
                                                <th className="text-center" scope="col">{t('contractinvoicecreate_detaillist_th_igst')}</th>
                                                <th className="text-center" scope='col'>{t('contractinvoicecreate_detaillist_th_netamount')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {contractInvoiceDetailList.map((Item, Index) => {
                                                const amount = (Number(Item.Quantity) * Number(Item.Rate) - Number(Item.Discount))
                                                return <tr key={Index} className="">
                                                    <td>{Index + 1}</td>
                                                    <td>{Item.ItemDescription}</td>
                                                    {/* <td> {Item.Unit}  </td> */}
                                                    <td className="text-center">{Item.Quantity}</td>
                                                    <td><span className="d-flex float-end">{formatCurrency(Item.Rate)}</span></td>
                                                    <td><span className="d-flex float-end">{Item.Amount}</span></td>
                                                    <td className=""  >
                                                        <div className="mb-0 mt-0 " >
                                                            <input name={Index.toString()} className={'form-control '}
                                                                value={Item.Discount}
                                                                onChange={onUpdateDetailDiscountField}
                                                            ></input>
                                                        </div>
                                                    </td>
                                                    <td><span className="d-flex float-end">{formatCurrency((Number(Item.Amount) - Number(Item.Discount)).toFixed(2))}</span></td>
                                                    <td><span className="d-flex float-end">{`${formatCurrency(((Number(Item.Amount) - Number(Item.Discount)) * Item.Sgst / 100).toFixed(2))} (${Item.Sgst}%)`}</span></td>
                                                    <td><span className="d-flex float-end">{`${formatCurrency(((Number(Item.Amount) - Number(Item.Discount)) * Item.Cgst / 100).toFixed(2))} (${Item.Cgst}%)`}</span></td>
                                                    <td><span className="d-flex float-end">{`${formatCurrency(((Number(Item.Amount) - Number(Item.Discount)) * Item.Igst / 100).toFixed(2))} (${Item.Igst}%)`}</span></td>
                                                    <td><span className="d-flex float-end">{formatCurrency((amount + amount * Number(Item.Sgst) / 100 + amount * Number(Item.Cgst) / 100 + amount * Number(Item.Igst) / 100).toFixed(2))}</span></td>

                                                </tr>
                                            })}
                                            <tr>
                                                <td colSpan={4} className="text-end">Total</td>
                                                <td><span className="d-flex float-end">{formatCurrency(Number(contractInvoice.InvoiceAmount).toFixed(2))}</span></td>
                                                <td><span className="d-flex float-end">{formatCurrency(contractInvoice.DeductionAmount)}</span></td>
                                                <td><span className="d-flex float-end">{formatCurrency((Number(contractInvoice.InvoiceAmount) - Number(contractInvoice.DeductionAmount)).toFixed(2))}</span></td>
                                                <td><span className="d-flex float-end">{formatCurrency(contractInvoice.Sgst)}</span></td>
                                                <td><span className="d-flex float-end">{formatCurrency(contractInvoice.Cgst)}</span></td>
                                                <td><span className="d-flex float-end">{formatCurrency(contractInvoice.Igst)}</span></td>
                                                <td><span className="d-flex float-end">{formatCurrency((Number(contractInvoice.InvoiceAmount) - Number(contractInvoice.DeductionAmount) + Number(contractInvoice.Sgst) + Number(contractInvoice.Cgst) + Number(contractInvoice.Igst)).toFixed(2))}</span></td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>) : (<> </>)}
                        </div>
                        <div className="mb-1 mt-3">
                            <label className="text-muted mb-0 ">{t('contractinvoiceschedulecreate_description')}</label>
                            <textarea name="Description"
                                className={`form-control ${errors["Description"] ? "is-invalid" : ""}`}
                                value={contractInvoice.Description}
                                onChange={onUpdateField}
                            ></textarea>
                            <div className="invalid-feedback"> {errors["Description"]}</div>
                        </div>
                        <div>

                            <button className="btn mt-3 app-primary-bg-color text-white float-end" onClick={onSubmit}
                                disabled={contractInvoiceDetailList.length == 0}
                            >
                                {t('contractinvoicecreate_button_submit')}
                            </button>
                            {displayInformationModal ? <InformationModal /> : ''}
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    )
}