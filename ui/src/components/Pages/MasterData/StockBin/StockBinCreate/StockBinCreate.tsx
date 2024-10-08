import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateStockBinState,initializeStockBinCreate, toggleInformationModalStatus, updateErrors, updateField } from "./StockBinCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { checkForPermission } from "../../../../../helpers/permissions";
import { getStockBinList, stockBinCreate } from "../../../../../services/stockbin";
import { loadStockBins } from "../StockBinList/StockBin.slice";

export const StockBinCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        stockbincreate: { stockbin, displayInformationModal, errors },
    } = useStore(({ stockbincreate, app }) => ({ stockbincreate, app }));

    useEffect(() => {
        store.dispatch(initializeStockBinCreate())
    }, [])

    const onUpdateField = (ev: any) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateStockBinState['stockbin'], value }));
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
        const result = await stockBinCreate(stockbin)
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
                {t('stockbin_create_success_message')}
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
        store.dispatch(initializeStockBinCreate())
    }
    const validationSchema = yup.object().shape({
        BinName: yup.string().required('validation_error_stockbin_create_binname_required').max(32,'validation_error_stockbin_create_binname_max'),
        BinCode: yup.string().required('validation_error_stockbin_create_bincode_required').max(8, 'validation_error_stockbin_create_bincode_max').min(4, 'validation_error_stockbin_create_bincode_min'),
    });
    return (
        <>
            {
            // {/* {checkForPermission("stockbin_CREATE") && */}
                <div
                    className="modal fade"
                    id='Createstockbin'
                    data-bs-backdrop='static'
                    data-bs-keyboard='false'
                    aria-hidden='true'
                >
                    <div className="modal-dialog ">
                        <div className="modal-content">
                            <div className="modal-header mx-2">
                                <h5 className="modal-title">{t('stockbin_create_title')}</h5>
                                <button
                                    type='button'
                                    className="btn-close"
                                    data-bs-dismiss='modal'
                                    id='closeCreateStockBinModal'
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
                                                <label className="mt-2 red-asterisk">{t('stockbin_create_input_bincode')}</label>
                                                <input name='BinCode' onChange={onUpdateField} type='text'
                                                    value={stockbin.BinCode ? stockbin.BinCode : ""}
                                                    className={`form-control  ${t(errors["BinCode"] ? "is-invalid" : "")}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['BinCode'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('stockbin_create_input_binname')}</label>
                                                <input name='BinName' onChange={onUpdateField} type='text'
                                                    value={stockbin.BinName}
                                                    className={`form-control  ${t(errors["BinName"] ? "is-invalid" : "")}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['BinName'])}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('stockbin_create_label_status')}</label>
                                                <select name="IsActive" onChange={onUpdateField} className="form-select">
                                                    <option value="1">{t('stockbin_create_select_option_1')}</option>
                                                    <option value="0">{t('stockbin_create_select_option_0')}</option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 mt-4 ">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                    {t('stockbin_create_button')}
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