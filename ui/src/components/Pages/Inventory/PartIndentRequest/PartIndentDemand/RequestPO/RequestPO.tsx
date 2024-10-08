import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import { getVendorNames } from "../../../../../../services/vendor";
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithCode } from "../../../../../../helpers/formats";
import { useEffect, useRef } from "react";
import { RequestPOState, initializeRequestPurchaseOrder, loadStockTypes, loadVendorNames, loadVendorType, toggleInformationModalStatus, updateErrors, updateField } from "./RequestPO.slice";
import { useStoreWithInitializer } from "../../../../../../state/storeHooks";
import * as yup from 'yup';
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { RequestPOForIndentDemand } from "../../../../../../services/purchaseorder";
import { store } from "../../../../../../state/store";
import { useHistory } from "react-router-dom";
import { getValuesInMasterDataByTable } from "../../../../../../services/masterData";

export const RequestPurchaseOrder = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const modalRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { vendornames, displayInformationModal, PartName, StockTypes, requestforpurchaseorder, errors, VendorTypes } = useStoreWithInitializer(
        ({ requestpurchaseorder, }) => requestpurchaseorder,
        initializeRequestPurchaseOrder
    );

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        try {
            // MasterData tables
            var { MasterData } = await getValuesInMasterDataByTable("StockType")
            const stocktype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
            const filteredStocktypes = stocktype.filter(i => i.code !== "STT_DFCT" && i.code !== "STT_GRPC")
            store.dispatch(loadStockTypes({ Select: filteredStocktypes }));

            var { MasterData } = await getValuesInMasterDataByTable("VendorType")
            const Vendortype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
            const filteredVendortypes = Vendortype.find(i => i.code == "VTP_PRTS")?.value
            store.dispatch(updateField({ name: "VendorTypeId", value: filteredVendortypes }));
            store.dispatch(loadVendorType({ Select: Vendortype }));
        } catch (error) {
            console.error(error);
        }
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={redirectToDemandList}>
                {t('request_po_success_message')}
            </SweetAlert>
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            if (requestforpurchaseorder.VendorTypeId != null) {
                try {
                    const vendors = await getVendorNames(requestforpurchaseorder.VendorTypeId);
                    const result = await formatSelectInput(vendors.VendorNames, 'Name', 'Id');
                    store.dispatch(loadVendorNames({ Select: result }));
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchData();
    }, [requestforpurchaseorder.Id, requestforpurchaseorder.VendorTypeId]);

    const redirectToDemandList = async () => {
        store.dispatch(toggleInformationModalStatus());
        history.push('/logistics/partindentdemands/logistics')
        modalRef.current?.click()
    }

    const onModalClose = async () => {
        store.dispatch(initializeRequestPurchaseOrder())
        onLoad();
    }

    const validationSchema = yup.object().shape({
        Price: yup.number().required('request_po_validation_error_message_price').min(1, ('request_po_validation_error_message_price')).typeError('request_po_validation_error_message_price'),
        VendorId: yup.number().required('request_po_validation_error_message_vendor').min(1, ('request_po_validation_error_message_vendor')),
        StockTypeId: yup.number().required('request_po_validation_error_message_stocktype').min(1, ('request_po_validation_error_message_stocktype')),
        VendorTypeId: yup.number().required('request_po_validation_error_message_vendortype').min(1, ('request_po_validation_error_message_vendortype')),
        WarrantyPeriod: yup.number().required('request_po_validation_error_message_warrantyperiod').min(1, ('request_po_validation_error_message_warrantyperiod')),
    });

    const onSubmit = async () => {
        store.dispatch(updateErrors({}));
        try {
            await validationSchema.validate(requestforpurchaseorder, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await RequestPOForIndentDemand(requestforpurchaseorder)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
                containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        store.dispatch(stopPreloader());
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof RequestPOState['requestforpurchaseorder'], value }));
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name;
        store.dispatch(updateField({ name: name as keyof RequestPOState['requestforpurchaseorder'], value }));
    }

    return (
        <div
            className="modal fade"
            id='RequestPO'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header mx-3">
                        <h5 className="modal-title app-primary-color">{t('request_po_heading')}</h5>
                        <button
                            type='button'
                            className="btn-close me-2"
                            data-bs-dismiss='modal'
                            id='closeCreateGIRN'
                            onClick={onModalClose}
                            aria-label='Close'
                            ref={modalRef}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <ContainerPage>
                            <>
                                <ValidationErrorComp errors={errors} />
                                <div className="mb-3 text-muted">{t('request_po_sub_heading')}<span className="fw-bold">{PartName}</span></div>
                                <div className="mb-2">
                                    <label className="red-asterisk">{t('request_po_vendortype')}</label>
                                    <Select
                                        value={VendorTypes && VendorTypes.find(option => option.value == requestforpurchaseorder.VendorTypeId) || null}
                                        options={VendorTypes}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "VendorTypeId")}
                                        isSearchable
                                        name="VendorTypeId"
                                        placeholder={t('request_po_vendortype_select')}
                                    />
                                    <div className="small text-danger"> {t(errors['VendorTypeId'])}</div>
                                </div>
                                <div className='mb-2'>
                                    <label className="red-asterisk">{t('request_po_vendor')}</label>
                                    <Select
                                        options={vendornames}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "VendorId")}
                                        isSearchable
                                        name='VendorId'
                                        placeholder={t('request_po_vendor_select')}
                                    />
                                    <div className="small text-danger"> {t(errors['VendorId'])}</div>
                                </div>
                                <div className="mb-2">
                                    <label className='mt-2 red-asterisk'>{t('request_po_price')}</label>
                                    <input
                                        name='Price'
                                        onChange={onUpdateField}
                                        type='text'
                                        value={requestforpurchaseorder.Price ?? 0}
                                        className={`form-control  ${errors["Price"] ? "is-invalid" : ""}`}
                                    />
                                    <div className="small text-danger"> {t(errors['Price'])}</div>
                                </div>
                                {/* Stock Type */}
                                <div className="mb-2">
                                    <label className="mt-2 red-asterisk">{t('request_po_stocktype')}</label>
                                    <Select
                                        value={StockTypes && StockTypes.find(option => option.value === requestforpurchaseorder.StockTypeId) || null}
                                        options={StockTypes}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "StockTypeId")}
                                        isSearchable
                                        name="StockTypeId"
                                        className={`${errors["StockTypeId"] ? " border border-danger rounded-2" : ""}`}
                                        placeholder={t('request_po_stocktype_select')}
                                    />
                                    <div className="small text-danger"> {t(errors['StockTypeId'])}</div>
                                </div>
                                <div className="mb-2">
                                    <label className='mt-2 red-asterisk'>{t('request_po_warrantyperiod')}</label>
                                    <input
                                        name='WarrantyPeriod'
                                        onChange={onUpdateField}
                                        type='text'
                                        value={requestforpurchaseorder.WarrantyPeriod ?? 0}
                                        className={`form-control  ${errors["WarrantyPeriod"] ? "is-invalid" : ""}`}
                                    />
                                    <div className="small text-danger"> {t(errors['WarrantyPeriod'])}</div>
                                </div>
                                <div className='col-md-12'>
                                    <button type="button" onClick={() => onSubmit()} className="btn app-primary-bg-color text-white mt-2  me-4">
                                        {t('request_po_submit_button')}
                                    </button>
                                </div>
                            </>
                        </ContainerPage>
                        {displayInformationModal ? <InformationModal /> : ""}
                    </div>
                </div>
            </div>
        </div>
    )
} 