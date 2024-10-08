import { useTranslation } from "react-i18next";
import { CreateGoodsReceivedNoteState, initializeGRN, loadTransactionTypes, updateErrors, updateField } from "./CreateGRN.slice";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { useEffect, useRef, useState } from "react";
import { GoodsReceivedNoteCreate, getGrnTransactionTypes } from "../../../../../services/goodsreceivednote";
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithCode } from "../../../../../helpers/formats";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import * as yup from 'yup';
import { useHistory } from "react-router-dom";
import { PurchaseOrders } from "../PurchaseOrders/PurchaseOrders";
import { checkForPermission } from "../../../../../helpers/permissions";
import { DeliveryChallanList } from "../DeliveryChallanList/DeliveryChallanList";
import { store } from "../../../../../state/store";
import { PartReturnList } from "../PartReturnList/PartReturnList";

export function CreateGRN() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const history = useHistory();
  const { creategrn, errors, transactiontypes } = useStoreWithInitializer(({ creategrn }) => creategrn, initializeGRN);

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_grn_list', Link: '/logistics/goodsreceivednote' },
    { Text: 'breadcrumbs_create_grn' }
  ];

  useEffect(() => {
    {
      checkForPermission("GOODSRECEIVEDNOTE_CREATE") &&
        onLoad();
    }
  }, []);

  const onLoad = async () => {
    try {
      const transactiontypes = await getGrnTransactionTypes();
      const grntransactiontypes = await formatSelectInputWithCode(transactiontypes.Transactiontypes, "TransactionType", "Id", "TransactionTypeCode")
      store.dispatch(loadTransactionTypes({ Select: grntransactiontypes }));

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    store.dispatch(updateField({ name: 'TransactionId', value: 0 }));
    store.dispatch(updateField({ name: 'SourceEngineerId', value: null }));
    store.dispatch(updateField({ name: 'SourceLocationId', value: null }));
    store.dispatch(updateField({ name: 'SourceVendorId', value: null }));
  }, [creategrn.TransactionTypeCode]);

  const onSubmit = async () => {
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(creategrn, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader());
    const result = await GoodsReceivedNoteCreate(creategrn)
    result.match({
      ok: (data) => {
        redirectToGRN(data.GoodsReceivedNoteId);
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(errorMessages));
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    store.dispatch(stopPreloader());
  }

  const validationSchema = yup.object().shape({
    TransactionTypeCode: yup.string().required('validation_error_grn_create_transactiontype_req'),
    ReferenceNumber: yup.string().when('ReferenceDate', (ReferenceDate, schema) =>
      creategrn.ReferenceDate != null
        ? schema.required(t('validation_error_grn_create_refno') ?? '').typeError(t('validation_error_grn_create_refno') ?? '')
        : schema.default(null).nullable()
    ),
    ConfirmReferenceNumber: yup.string().when('ReferenceNumber', (ReferenceNumber, schema) =>
      creategrn.ReferenceNumber !== ""
        ? schema.required('validation_error_grn_create_confirminvoiceno')
        : schema.nullable()
    ),

  });

  function redirectToGRN(grnId: any) {
    history.push(`/logistics/goodsreceivednotedetail/create/${grnId}`)
  }

  function onUpdateField(ev: any) {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof CreateGoodsReceivedNoteState['creategrn'], value }));
  }

  function handleCheckbox(Code: any, Name: any) {
    var name = Name;
    if (name == "TransactionTypeCode") {
      store.dispatch(updateField({ name: 'TransactionTypeCode', value: Code }));
    }
  }

  return (
    <>
      <div className="mx-4 mt-2">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      {checkForPermission("GOODSRECEIVEDNOTE_CREATE") ? (
        <div className="row mx-3 mt-4 ">
          <div className="row mx-1 ps-0 pt-2 mt-2">
            <label className="red-asterisk p-0">{t('grn_create_transactiontype')}</label><br />
            <div className="text-danger small"> {t(errors['TransactionTypeCode'])}</div>
            {transactiontypes.map((item) => {
              return (
                <div key={item.value} className="ps-0 pt-2 pb-2">
                  <input
                    className={`form-check-input border-secondary ${errors["TransactionTypeCode"] ? "is-invalid" : ""}`}
                    type="radio"
                    onChange={(Code) => handleCheckbox(item.code, "TransactionTypeCode")}
                    value={creategrn.TransactionTypeCode}
                    name="TransactionTypeCode"
                    data-testid={`create_user_input_checkbox_${item.label}`}
                    checked={creategrn.TransactionTypeCode == item.code}
                  />
                  <label className="form-check-label ms-2">{item.label}
                    {/* Helper Text */}
                    {/* TODO: Lorem text should replaced with actual help-text */}
                    <div className="form-text mt-0"> <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span></div>
                  </label>&nbsp;
                </div>
              );
            })}
          </div>
          <div className="row mb-0">
            {creategrn.TransactionTypeCode == "GTT_PORD" ? (
              <div className="row mt-1 mx-2 p-0">
                <PurchaseOrders TransactionTypeCode="GTT_PORD" />
              </div>
            ) : creategrn.TransactionTypeCode == "GTT_EPRT" ? (
              <div className="row mt-1 mx-2 p-0">
                <PartReturnList TransactionTypeCode="GTT_EPRT" />
              </div>
            ) : creategrn.TransactionTypeCode == "GTT_DCHN" && (
              <><DeliveryChallanList TransactionTypeCode="GTT_DCHN" /></>
            )}
          </div>
          {creategrn.TransactionTypeCode !== "GTT_EPRT" &&
            <div className="row mt-1 ms-2 ps-0 pe-0 ms-0 me-4 ">
              <label className="fs-6 app-primary-color p-0">{t('grn_create_ref_details')}</label>
              <div className="help-text form-text pt-1 p-0 pb-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </div>
              <div className="col-md-4 mt-2 ps-0">
                <label>{t('grn_create_refno')}</label>
                <input name='ReferenceNumber' type='text' onChange={onUpdateField} className="form-control"></input>
                <div className='small text-danger'> {t(errors['ReferenceNumber'])}</div>
              </div>
              <div className="col-md-4 mt-2">
                <label className={`${creategrn.ReferenceNumber !== "" ? 'red-asterisk' : ''}`}>{t('grn_create_confirm_invoiceno')}</label>
                <input
                  className={`form-control ${errors["ConfirmReferenceNumber"] ? "is-invalid" : ""}`}
                  name="ConfirmReferenceNumber"
                  type="text"
                  onChange={onUpdateField}
                  value={creategrn.ConfirmReferenceNumber}
                  onPaste={(e) => {
                    e.preventDefault(); // Prevent paste event
                  }}
                  onCopy={(e) => {
                    e.preventDefault(); // Prevent copy event
                  }}
                  autoComplete="off"
                  disabled={creategrn.ReferenceNumber === ""}
                />
                <div className="small text-danger">{t(errors['ConfirmReferenceNumber'])}</div>
              </div>
              <div className='col-md-4 mt-2'>
                <label>{t('grn_create_refdate')}</label>
                <input name='ReferenceDate' onChange={onUpdateField} type='date' className='form-control'></input>
              </div>
            </div>
          }
          <div className="row ps-0 mx-2 pt-2">
            <label className="p-0">{t('grn_create_remarks')}</label>
            <textarea
              value={creategrn.Remarks ? creategrn.Remarks : ''} className="form-control" rows={3} name="Remarks" maxLength={128} onChange={onUpdateField} >
            </textarea>
            <div className="p-0 mb-2">
              <button type="button" onClick={() => onSubmit()} className="btn app-primary-bg-color float-end text-white mt-2" disabled={creategrn.TransactionId > 0 ? false : true}>
                {t('grn_create_submit')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )
      }
    </ >
  )
}
