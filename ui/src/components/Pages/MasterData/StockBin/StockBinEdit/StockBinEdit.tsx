import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { EditStockBinState,initializeStockBinEdit, toggleInformationModalStatus, updateErrors, updateField } from "./StockBinEdit.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { getStockBinList, stockBinEdit } from "../../../../../services/stockbin";
import { loadStockBins } from "../StockBinList/StockBin.slice";
import { checkForPermission } from "../../../../../helpers/permissions";

export const StockBinEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        stockbinedit: { stockbin, displayInformationModal, errors },
    } = useStore(({ stockbinedit }) => ({ stockbinedit }));

    useEffect(() => {
        store.dispatch(initializeStockBinEdit())
    }, [])

    const onUpdateField = (ev: any) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof EditStockBinState['stockbin'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(stockbin, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await stockBinEdit(stockbin)
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

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateRole}>
                {t('stockbin_update_success_message')}
            </SweetAlert>
        );
    }

    const updateRole = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getStockBinList(store.getState().stockbinlist.search, 1);
        store.dispatch(loadStockBins(result));
        modalRef.current?.click()
    }
    const onModalClose = () => {
        store.dispatch(initializeStockBinEdit())
    }
    const validationSchema = yup.object().shape({
        BinName: yup.string().required('validation_error_stockbin_update_binname_required').max(32,'validation_error_stockbin_update_binname_max'),
    });
    return (
        <>
            {checkForPermission("STOCKBIN_MANAGE") && 
                <div
                    className="modal fade"
                    id='Editstockbin'
                    data-bs-backdrop='static'
                    data-bs-keyboard='false'
                    aria-hidden='true'
                >
                    <div className="modal-dialog ">
                        <div className="modal-content">
                            <div className="modal-header mx-2">
                                <h5 className="modal-title">{t('stockbin_update_title')}</h5>
                                <button
                                    type='button'
                                    className="btn-close"
                                    data-bs-dismiss='modal'
                                    id='closeEditStockBinModal'
                                    aria-label='Close'
                                    onClick={onModalClose}
                                    ref={modalRef}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('stockbin_update_input_binname')}</label>
                                                <input name='BinName' onChange={onUpdateField} type='text'
                                                    value={stockbin.BinName}
                                                    className={`form-control  ${t(errors["BinName"] ? "is-invalid" : "")}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['BinName'])}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('stockbin_update_label_status')}</label>
                                                <select name="IsActive" onChange={onUpdateField} className="form-select">
                                                    <option value="1">{t('stockbin_update_select_option_1')}</option>
                                                    <option value="0">{t('stockbin_update_select_option_0')}</option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 mt-4 ">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                    {t('stockbin_update_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </ContainerPage>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}