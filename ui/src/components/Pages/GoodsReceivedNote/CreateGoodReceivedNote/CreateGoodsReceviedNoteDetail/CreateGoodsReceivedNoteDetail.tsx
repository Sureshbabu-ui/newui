import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../state/storeHooks";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { useEffect, useState } from "react";
import { store } from "../../../../../state/store";
import Select from 'react-select';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useHistory, useParams } from "react-router-dom";
import { ErrorList, initializeGoodsReceivedNoteDetail, loadGRNDetails, loadMasterData, removeGrnDetails, setGrnCompleted, setProceedError, toggleInformationModalStatus, updateErrorList, updateErrors, updateField } from "./CreateGoodsReceivedNoteDetail.slice";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { GoodsReceivedNoteDetail } from "../../../../../types/goodsreceivednote";
import { GoodsReceivedNoteDetailCreate, getGRNDetails } from "../../../../../services/goodsreceivednote";
import { convertBackEndErrorsToValidationErrors, formatSelectInputWithCode } from "../../../../../helpers/formats";
import { checkForPermission } from "../../../../../helpers/permissions";
import { getValuesInMasterDataByTable } from "../../../../../services/masterData";
import i18n from '../../../../../i18n';
import toast, { Toaster } from 'react-hot-toast';
import * as yup from 'yup';

export function CreateGoodReceivedNoteDetail() {
  const { t } = useTranslation();
  const history = useHistory();
  const { grndetailList, displayInformationModal, GrnTransactionTypeCode, errorlist, masterDataList, proceederror, errors, IsGrnCompleted } = useStore(({ creategoodsreceivednotedetail }) => creategoodsreceivednotedetail);
  const { GRNId } = useParams<{ GRNId: string }>();

  useEffect(() => {
    {
      checkForPermission("GOODSRECEIVEDNOTE_CREATE") &&
        onLoad();
    }
  }, [GRNId]);

  const validationSchema = yup.object().shape({
    SerialNumber: yup.string().required('validation_error_creategrn_slno_required').typeError('validation_error_creategrn_slno_required'),
    Barcode: yup.string().required('validation_error_creategrn_barcode_required').typeError('validation_error_creategrn_barcode_required'),
    StockTypeId: yup.number().required('validation_error_creategrn_stocktype_required').typeError('validation_error_creategrn_stocktype_required'),
    Rate: yup.number().required('validation_error_creategrn_rate_required').typeError('validation_error_creategrn_rate_required'),
  });

  const onLoad = async () => {
    try {
      const grndetail = await getGRNDetails(GRNId);
      store.dispatch(loadGRNDetails(grndetail));
      // MasterData tables
      var { MasterData } = await getValuesInMasterDataByTable("StockType")
      const stocktype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
      const filteredStocktypes = stocktype.filter(i => i.code !== "STT_GRPC")
      store.dispatch(loadMasterData({ name: "StockType", value: { Select: filteredStocktypes } }));
    } catch (error) {
      console.error(error);
    }
  }

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_grn_list', Link: '/logistics/goodsreceivednote' },
    { Text: 'breadcrumbs_create_grndetail' }
  ];

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title="Success" onConfirm={redirectToGRN}>
        {t('grndetail_success_message')}
      </SweetAlert>
    );
  }

  function redirectToGRN() {
    store.dispatch(toggleInformationModalStatus());
    history.push("/logistics/goodsreceivednote")
    store.dispatch(initializeGoodsReceivedNoteDetail())
  }

  function onUpdateField(ev: any, id: number | undefined) {
    const { name, value } = ev.target;
    if (id !== undefined) {
      store.dispatch(updateField({ id, name, value }));
    }
  }

  async function onSubmitStock(grndetaillist: GoodsReceivedNoteDetail[]) {
    store.dispatch(setProceedError(false));
    store.dispatch(updateErrors({}));
    store.dispatch(updateErrorList([]));
    const partstockinfo = store.getState().creategoodsreceivednotedetail.grndetailList.filter(item => {
      return item.Barcode !== null && item.Barcode !== "" || item.SerialNumber !== null && item.SerialNumber !== "" ||
        item.Rate !== null && item.Rate !== 0 ||
        item.StockTypeId !== null && item.StockTypeId !== 0;
    });

    if (partstockinfo.length === 0) {
      store.dispatch(setProceedError(true))
    } else {
      store.dispatch(startPreloader());
      try {
        const allErrors: ErrorList[] = [];
        await Promise.all(partstockinfo.map(async (contractItem, index) => {
          try {
            await validationSchema.validate(contractItem, { abortEarly: false });
          } catch (error: any) {
            const errors: ErrorList = { Id: contractItem.Id, Barcode: '', Rate: '', StockTypeId: '',SerialNumber:'' };
            error.inner.forEach((currentError: any) => {
              if (currentError.path === 'Barcode') {
                errors.Barcode = currentError.message;
              } else if (currentError.path === 'Rate') {
                errors.Rate = currentError.message;
              } else if (currentError.path === 'StockTypeId') {
                errors.StockTypeId = currentError.message;
              } else if (currentError.path === 'SerialNumber'){
                errors.SerialNumber = currentError.message;
              }
            });
            allErrors.push(errors);
          }
        }));
        store.dispatch(updateErrorList(allErrors));
        if (allErrors.length === 0) {
          const result = await GoodsReceivedNoteDetailCreate(partstockinfo, GRNId, IsGrnCompleted, GrnTransactionTypeCode);
          result.match({
            ok: () => {
              store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
              const errorMessages = convertBackEndErrorsToValidationErrors(e)
              store.dispatch(updateErrors(errorMessages));
            }
          });
        }
      } catch (error: any) {
        console.error(error);
      }
      store.dispatch(stopPreloader());
    }
  }

  const onRemoveObject = (objectId) => {
    store.dispatch(removeGrnDetails(objectId));
    toast(i18n.t('grndetail_record_deleted_message'), {
      duration: 1900,
      style: {
        borderRadius: '0',
        background: '#00D26A',
        color: '#fff',
      },
    });
    setId(0);
  };

  function handleCheckbox(ev: any) {
    var checked = ev.target.checked ? true : false;
    store.dispatch(setGrnCompleted(checked))
  }

  const onSelectChange = (id, selectedOption: any, Name: any) => {
    var value = selectedOption.value
    var name = Name
    if (id !== undefined) {
      store.dispatch(updateField({ id, name, value }));
    }
  }

  const [Id, setId] = useState(0);

  async function handleConfirm(Id: any) {
    setId(Id)
  }

  async function handleCancel() {
    setId(0);
  }

  function ConfirmationModal() {
    return (
      <SweetAlert
        showCancel
        customClass='w-50'
        confirmBtnText='Yes, Delete!'
        cancelBtnText='Cancel'
        cancelBtnBsStyle='light'
        confirmBtnBsStyle='danger'
        title='Are you sure?'
        onConfirm={() => onRemoveObject(Id)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        <p>{t('grndetail_delete_confirmation')}</p>
      </SweetAlert>
    );
  }

  function getErrorForFieldId(errorList: ErrorList[], fieldId: number, fieldName: string): string | undefined {
    const errorItem = errorList.find(item => item.Id === fieldId);
    if (errorItem) {
      return errorItem[fieldName];
    }
    return undefined;
  }

  <div className="mx-4 mt-2 mb-2 alert alert-danger" role="alert"> {t('grndetail_warning_message')} </div>
  return (
    <div>
      <div className="mx-4 mt-2">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      {grndetailList.length > 0 ?
        (
          <div className="mt-5 grn-detail">
            <div>{proceederror == true ? <div className="mx-4 mt-2 p-1 alert alert-danger" role="alert">
              <span className="material-symbols-outlined align-bottom">warning</span>&nbsp;
              <span>{t('grndetail_warning')}</span>
            </div> : ""}
            </div>
            <div className="mx-4 pe-0">
              {/* header */}
              <div className="row m-0 p-0 mb-2">
                <div className="w-30 text-size-14 px-1"> # </div>
                <div className="col-md-1 px-1 text-size-14"><div>{t('grndetail_partcode')}</div></div>
                <div className="col-md-3 px-1 text-size-14"><div>{t('grndetail_partname')}</div></div>
                <div className="col-md-1 px-1 text-size-14"><div>{t('grndetail_hsncode')}</div></div>
                <div className="col-md-1 px-1 text-size-14"><div>{t('grndetail_oem')}</div></div>
                <div className="col-md-2 px-1 text-size-14">
                  <label className="red-asterisk">{t('grndetail_serialno')}</label>
                </div>
                <div className="col-md-1 px-1 text-size-14">
                  <label className="red-asterisk">{t('grndetail_barcode')}</label>
                </div>
                <div className="col-md-1 px-1 text-size-14">
                  <label className="red-asterisk">{t('grndetail_rate')}</label>
                </div>
                <div className="col-md-1 px-1 text-size-14">
                  <label className="red-asterisk">{t('partindentcart_label_stocktype')}</label>
                </div>
              </div>
              {/* header ends */}
              {grndetailList.map((field, index) => (
                <div className="row mx-0 mt-1" key={index}>
                  <div className="w-30 text-size-14 px-1 pt-2"> {index + 1} </div>
                  <div className="col-md-1 px-1 text-size-14 pt-2"><small></small><span className="text-dark">{field.PartCode}</span></div>
                  <div className="col-md-3 px-1 text-size-14 pt-2"><small></small><span className="text-dark">{field.PartName}</span></div>
                  <div className="col-md-1 px-1 text-size-14 pt-2"><small></small><span className="text-dark">{field.HsnCode}</span></div>
                  <div className="col-md-1 px-1 text-size-14 pt-2"><small></small><span className="text-dark">{field.OemPartNumber}</span></div>
                  <div className="col-md-2 px-1 text-size-14">
                    <input
                      name='SerialNumber'
                      value={field?.SerialNumber ?? ""}
                      onChange={(ev) => onUpdateField(ev, field.Id)}
                      className={`form-control ${getErrorForFieldId(errorlist, field.Id, 'SerialNumber') ? "is-invalid" : ""}`}
                    />
                    {getErrorForFieldId(errorlist, field.Id, 'SerialNumber') && (
                      <div className="invalid-feedback">
                        {t(getErrorForFieldId(errorlist, field.Id, 'SerialNumber') || '')}
                      </div>
                    )}
                  </div>
                  <div className="col-md-1 px-1 text-size-14">
                    <input
                      name='Barcode'
                      value={field.Barcode ?? ""}
                      onChange={(ev) => onUpdateField(ev, field.Id)}
                      className={`form-control ${getErrorForFieldId(errorlist, field.Id, 'Barcode') ? "is-invalid" : ""}`}
                    />
                    {getErrorForFieldId(errorlist, field.Id, 'Barcode') && (
                      <div className="invalid-feedback">
                        {t(getErrorForFieldId(errorlist, field.Id, 'Barcode') || '')}
                      </div>
                    )}
                  </div>

                  <div className="col-md-1 px-1 text-size-14">
                    <input
                      name='Rate'
                      value={field.Rate ?? ""}
                      onChange={(ev) => onUpdateField(ev, field.Id)}
                      className={`form-control ${getErrorForFieldId(errorlist, field.Id, 'Rate') ? "is-invalid" : ""}`}
                    />
                    {getErrorForFieldId(errorlist, field.Id, 'Rate') && (
                      <div className="invalid-feedback">
                        {t(getErrorForFieldId(errorlist, field.Id, 'Rate') || '')}
                      </div>
                    )}
                  </div>

                  {/* Stock Type */}
                  <div className="col-md-1 px-1 text-size-14">
                    <Select
                      value={masterDataList.StockType && masterDataList.StockType.find(option => option.value == field.StockTypeId) || null}
                      options={masterDataList.StockType}
                      onChange={(selectedOption) => onSelectChange(field.Id, selectedOption, "StockTypeId")}
                      isSearchable
                      classNames={{ control: (state) => getErrorForFieldId(errorlist, field.Id, 'StockTypeId') ? "border-danger" : "" }}
                      className="rounded-0"
                      name="StockTypeId"
                      placeholder="Choose"
                    />
                    {getErrorForFieldId(errorlist, field.Id, 'StockTypeId') && (
                      <div className="text-danger form-text">
                        {t(getErrorForFieldId(errorlist, field.Id, 'StockTypeId') || '')}
                      </div>
                    )}
                  </div>

                  {/* action button */}
                  <div className="col pt-2 grn-button" onClick={() => handleConfirm(field.Id)}>
                    <span className="material-symbols-outlined me-2 text-danger">Delete</span>
                  </div>
                  {/* action button ends */}
                </div>
              ))}
            </div>
            {/* grn proceed button */}

            <div className="mx-4 mt-4 pe-5">
              <input
                className={`form-check-input me-2 border-secondary`}
                type="checkbox"
                onChange={handleCheckbox}
                checked={IsGrnCompleted}
                value={IsGrnCompleted.toString()}
                name="IsGrnCompleted"
              />
              {t('grndetail_checkbox_message')}
            </div>
            <div className="d-flex mx-4 mt-4 pe-5 flex-row-reverse">
              <button type='button' onClick={() => onSubmitStock(grndetailList)} className=" btn  app-primary-bg-color text-white me-5">
                {t('grndetail_complete_grn_button')}
              </button>
            </div>
            {/* grn proceed button ends */}

          </div>
        ) : (<>{t('grndetail_no_data')}</>)
      }
      <div className="row ms-0 me-2 mt-5">
        <Toaster />
        {displayInformationModal ? <InformationModal /> : ""}
        {Id ? <ConfirmationModal /> : ""}
      </div>
    </div >
  )
}
