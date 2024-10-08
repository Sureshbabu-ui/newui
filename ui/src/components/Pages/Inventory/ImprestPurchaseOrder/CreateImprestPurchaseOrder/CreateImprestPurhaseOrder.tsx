import { useTranslation } from "react-i18next";
import {
    ImprestPurchaseOrderState, PartErrorList, initializeImprestPurchaseOrder, loadStockType, loadTenantOffices, loadVendorBranchNames, loadVendorNames, setBillToGst,
    setPartPrice, setPartQuantity, setPartType, setVendorToGst, toggleInformationModalStatus, updateErrors, updateField, updateErrorList,
    RemoveFromCart,
    addOrRemoveFromCart,
    setVendorBranchToGst,
    loadVendorType
} from "./CreateImprestPurhaseOrder.slice";
import { store } from "../../../../../state/store";
import { useEffect, useState } from "react";
import { TenantInfoDetails } from "../../../../../types/tenantofficeinfo";
import { BranchInVendorDetail } from "../../../../../types/vendorBranch";
import { VendorNameList } from "../../../../../types/vendor";
import { getVendorNames } from "../../../../../services/vendor";
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithCode, formatSelectInputWithThreeArg } from "../../../../../helpers/formats";
import { getVendorBranchNames } from "../../../../../services/vendorBranch";
import { ImprestPurchaseOrderCreate, getUserTenantOfficeNameWithCwh } from "../../../../../services/purchaseorder";
import { useStore } from "../../../../../state/storeHooks";
import Select from 'react-select';
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { getValuesInMasterDataByTable } from "../../../../../services/masterData";
import * as yup from 'yup';
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory } from "react-router-dom";
import { checkForPermission } from "../../../../../helpers/permissions";
import { icons } from "feather-icons/generated/feather-icons";

export const CreateImprestPurchaseOrder = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [TenantOfficeList, setTenantOfficeList] = useState<TenantInfoDetails[]>([]);
    const [formattedOfficeList, setFormattedOfficeList] = useState<any>([])

    const [VendorList, setVendorList] = useState<VendorNameList[]>([]);
    const [formattedVendorList, setFormattedVendorList] = useState<any>([])

    const [VendorBranchList, setVendorBranchList] = useState<BranchInVendorDetail[]>([]);
    const [formattedVendorBranchList, setFormattedVendorBranchList] = useState<any>([])

    useEffect(() => {
        if (checkForPermission("IMPRESTPURCHASEORDER_MANAGE")) {
            onLoad();
        }
    }, []);


    const onLoad = async () => {
        try {
            const TenantLocations = await getUserTenantOfficeNameWithCwh();
            setTenantOfficeList(TenantLocations.TenantOfficeName)
            const TenantLocation = formatSelectInputWithCode(TenantLocations.TenantOfficeName, 'OfficeName', 'Id', "GstStateCode");
            setFormattedOfficeList(TenantLocation);
            store.dispatch(loadTenantOffices({ Select: TenantLocation }));

            // MasterData tables
            var { MasterData } = await getValuesInMasterDataByTable("StockType")
            const stocktype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
            const filteredStocktypes = stocktype.filter(i => i.code !== "STT_DFCT" && i.code != 'STT_GRPC')
            store.dispatch(loadStockType({ Select: filteredStocktypes }));

            var { MasterData } = await getValuesInMasterDataByTable("VendorType")
            const Vendortype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
            const filteredVendortypes = Vendortype.find(i => i.code == "VTP_PRTS")?.value
            store.dispatch(updateField({ name: "VendorTypeId", value: filteredVendortypes }));
            store.dispatch(loadVendorType({ Select: Vendortype }));
        } catch (error) {
            console.error(error);
        }
    };

    const { StockTypes, createforpurchaseorder, displayInformationModal, errors, errorlist, totalrows, VendorBranchGstNo, vendornames, VendorTypes } = useStore(({ createimprestpo }) => createimprestpo);

    useEffect(() => {
        if (createforpurchaseorder.VendorTypeId != null) {
            getFilteredVendors()
        }
    }, [createforpurchaseorder.VendorTypeId])

    const getFilteredVendors = async () => {
        if (createforpurchaseorder.VendorTypeId != null) {
            const vendornames = await getVendorNames(createforpurchaseorder.VendorTypeId);
            setVendorList(vendornames.VendorNames)
            setFormattedVendorList(formatSelectInputWithCode(vendornames.VendorNames, "Name", "Id", "GstStateCode"))
            store.dispatch(loadVendorNames(vendornames));
        }
    }

    useEffect(() => {
        const getVendorBranches = async () => {
            if (createforpurchaseorder.VendorId != 0) {
                const branches = await getVendorBranchNames(createforpurchaseorder.VendorId.toString());
                setVendorBranchList(branches.VendorBranches)
                setFormattedVendorBranchList(formatSelectInputWithCode(branches.VendorBranches, "BranchName", "Id", "GstStateCode"))
                store.dispatch(loadVendorBranchNames(branches));
            }
        }
        getVendorBranches()
    }, [createforpurchaseorder.VendorId]);

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        if (name == "IsWarrantyReplacement") {
            value = ev.target.checked ? true : false;
        }

        store.dispatch(updateField({ name: name as keyof ImprestPurchaseOrderState['createforpurchaseorder'], value }));
    }

    const validationSchema = yup.object().shape({
        BillToTenantOfficeInfoId: yup.number().required('create_po_validation_error_message_billtoaddress').min(1, ('create_po_validation_error_message_billtoaddress')),
        ShipToTenantOfficeInfoId: yup.number().required('create_po_validation_error_message_shiptoaddress').typeError('create_po_validation_error_message_shiptoaddress').moreThan(0, ('create_po_validation_error_message_shiptoaddress')),
        VendorId: yup.number().required('create_po_validation_error_message_vendor').min(1, ('create_po_validation_error_message_vendor')),
        VendorTypeId: yup.number().required('create_po_validation_error_message_vendortype').min(1, ('create_po_validation_error_message_vendortype'))
    });

    const validationSchemaForPart = yup.object().shape({
        Quantity: yup.number().required('create_po_validation_error_message_quantity_req').typeError('create_po_validation_error_message_quantity_req').moreThan(0, ('create_po_validation_error_message_quantity_req')),
        Price: yup.number().required('create_po_validation_error_message_price_req').typeError('create_po_validation_error_message_price_req').moreThan(0, ('create_po_validation_error_message_price_req')),
        StockTypeId: yup.number().required('create_po_validation_error_message_stocktype').typeError('create_po_validation_error_message_stocktype'),
    });

    function getErrorForPartId(errorList: PartErrorList[], fieldId: number, fieldName: string): string | undefined {
        const errorItem = errorList.find(item => item.Id === fieldId);
        if (errorItem) {
            return errorItem[fieldName];
        }
        return undefined;
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}));
        if (createforpurchaseorder.PartList != null) {
            try {
                const allErrors: PartErrorList[] = [];
                await Promise.all(createforpurchaseorder.PartList.map(async (partitem, index) => {
                    try {
                        await validationSchemaForPart.validate(partitem, { abortEarly: false });
                    } catch (error: any) {
                        const errors: PartErrorList = { Id: partitem.Id, Price: 0, StockTypeId: 0, Quantity: 0, };
                        error.inner.forEach((currentError: any) => {
                            if (currentError.path === 'Price') {
                                errors.Price = currentError.message;
                            } else if (currentError.path === 'StockTypeId') {
                                errors.StockTypeId = currentError.message;
                            } else if (currentError.path === 'Quantity') {
                                errors.Quantity = currentError.message;
                            }
                        });
                        allErrors.push(errors);
                    }
                    try {
                        await validationSchema.validate(createforpurchaseorder, { abortEarly: false });
                    } catch (error: any) {
                        const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                            return { ...allErrors, [currentError.path as string]: currentError.message };
                        }, {});
                        store.dispatch(updateErrors(errors))
                        if (errors)
                            return;
                    }
                }));
                store.dispatch(updateErrorList(allErrors));
                if (allErrors.length === 0 && JSON.stringify(errors) === '{}') {
                    store.dispatch(startPreloader());
                    const result = await ImprestPurchaseOrderCreate(createforpurchaseorder)
                    result.match({
                        ok: () => {
                            store.dispatch(toggleInformationModalStatus());
                        },
                        err: (e) => {
                            const errorMessages = convertBackEndErrorsToValidationErrors(e)
                            store.dispatch(updateErrors(errorMessages));
                        }
                    });
                    store.dispatch(stopPreloader());
                }
            }
            catch (error) {
                return;
            }
        }
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={redirectToPoList}>
                {t('imprestpo_create_success_message')}
            </SweetAlert>
        );
    }

    const redirectToPoList = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(initializeImprestPurchaseOrder())
        history.push('/logistics/purchaseorders');
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        if (name == "BillToTenantOfficeInfoId") {
            store.dispatch(setBillToGst(selectedOption.code))
        } else if (name == "VendorId") {
            store.dispatch(setVendorToGst(selectedOption.code))
        } else if (name == "VendorBranchId") {
            store.dispatch(setVendorBranchToGst(selectedOption.code))
        }
        store.dispatch(updateField({ name: name as keyof ImprestPurchaseOrderState['createforpurchaseorder'], value }));

    }

    const setQuantity = (ev: any) => {
        store.dispatch(setPartQuantity({ PartId: ev.target.name, Quantity: ev.target.value }))
    }

    const setPrice = (ev: any) => {
        store.dispatch(setPartPrice({ PartId: ev.target.name, Price: ev.target.value }))
    }

    const setStockType = (selectedOption: any, actionMeta: any) => {
        var value = selectedOption.value
        var name = actionMeta.name
        store.dispatch(setPartType({ PartId: name, StockTypeId: value }))
    }

    const OnModalClose = (Id: number | string, Action: string) => {
        return () => {
            const part = createforpurchaseorder.PartList.find(part => part.Id == Id)
            if (part)
                store.dispatch(RemoveFromCart({ Part: part, Action: Action }))
        }
    }

    return (
        <div className="row  ">
            <ValidationErrorComp errors={errors} />
            <div className="row mx-0 mt-3 pe-0">
                <div className="row mx-0 p-0 mb-2">
                    <div className="mt-2 col-md-6 pe-0">
                        <label className="form-label red-asterisk mb-0">{t('create_purchaseorder_vendor_type')}</label>
                        <Select
                            options={VendorTypes}
                            name="VendorTypeId"
                            className={`${errors["VendorTypeId"] ? "is-invalid" : ""}`}
                            onChange={(selectedOption) => onSelectChange(selectedOption, "VendorTypeId")}
                            value={(VendorTypes && VendorTypes.find((option) => option.value === createforpurchaseorder.VendorTypeId)) || null}
                            isSearchable
                            placeholder={t('create_purchaseorder_vendor_type_select')}
                        />
                    </div>
                    <div className="mt-2 col-md-6">
                        <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_vendor')}</label>
                        <Select
                            options={formattedVendorList}
                            name="VendorId"
                            value={(formattedVendorList && formattedVendorList.find((option) => option.value === createforpurchaseorder.VendorId)) || null}
                            className={`${errors["VendorId"] ? "is-invalid" : ""}`}
                            onChange={(selectedOption) => onSelectChange(selectedOption, "VendorId")}
                            isSearchable
                            placeholder={t('create_purchaseorder_vendor_select')}
                        />
                        <div className="small text-danger"> {t(errors['VendorId'])}</div>
                        {(formattedVendorList.length > 0 &&
                            <div className="text-muted mt-1">
                                {(VendorList.filter((value) => (value.Id == createforpurchaseorder.VendorId)
                                )).length > 0 ? `Address : ${(VendorList.filter((value) => (value.Id == createforpurchaseorder.VendorId)
                                ))[0].Address}` : ''}
                            </div>
                        )}
                    </div>
                    <div className="mt-2 col-md-6 pe-0">
                        <label className="form-label mb-0">{t('create_purchaseorder_vendor_branch')}</label>
                        <Select
                            options={formattedVendorBranchList}
                            name="VendorBranchId"
                            onChange={(selectedOption) => onSelectChange(selectedOption, "VendorBranchId")}
                            isSearchable
                            placeholder={t('create_purchaseorder_vendor_branch_select')}
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="mt-2 ps-0">
                            <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_bill_to_address')}</label>
                            <Select
                                options={formattedOfficeList}
                                name="BillToTenantOfficeInfoId"
                                onChange={(selectedOption) => onSelectChange(selectedOption, "BillToTenantOfficeInfoId")}
                                isSearchable
                                placeholder={t('partindentcart_select_tenantoffice')}
                            />
                            <div className="small text-danger"> {t(errors['BillToTenantOfficeInfoId'])}</div>
                            {(formattedOfficeList.length > 0 &&
                                <div className="text-muted mt-1">
                                    {(TenantOfficeList.filter((value) => (value.Id == createforpurchaseorder.BillToTenantOfficeInfoId)
                                    )).length > 0 ? `Address : ${(TenantOfficeList.filter((value) => (value.Id == createforpurchaseorder.BillToTenantOfficeInfoId)
                                    ))[0].Address}` : ''}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6 pe-0 me-0">
                        <div className="mt-2 ps-0">
                            <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_ship_to_address')}</label>
                            <Select
                                options={formattedOfficeList}
                                name="ShipToTenantOfficeInfoId"
                                onChange={(selectedOption) => onSelectChange(selectedOption, "ShipToTenantOfficeInfoId")}
                                isSearchable
                                placeholder={t('partindentcart_select_tenantoffice')}
                            />
                            <div className="small text-danger"> {t(errors['ShipToTenantOfficeInfoId'])}</div>
                            {(formattedOfficeList.length > 0 &&
                                <div className="text-muted mt-1">
                                    {(TenantOfficeList.filter((value) => (value.Id == createforpurchaseorder.ShipToTenantOfficeInfoId)
                                    )).length > 0 ? `Address : ${(TenantOfficeList.filter((value) => (value.Id == createforpurchaseorder.ShipToTenantOfficeInfoId)
                                    ))[0].Address}` : ''}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-2 pe-0">
                        <label>{t('create_purchaseorder_remarks')}</label>
                        <textarea
                            value={createforpurchaseorder.Description ? createforpurchaseorder.Description : ''}
                            className={`form-control`}
                            rows={3}
                            name="Description"
                            maxLength={128}
                            onChange={onUpdateField}
                        ></textarea>
                    </div>
                </div>
                {createforpurchaseorder.PartList.map((field, index) => (
                    <div className="row mx-1 border mb-2 p-1 shadow-sm bg-body rounded pb-2" key={index}>
                        <div className="text-size-12">
                            <button className="text-white float-end btn-close btn-sm" aria-label='Close'
                                onClick={OnModalClose(field.Id, "remove")} disabled={createforpurchaseorder.PartList.length == 0} type="button" >
                            </button>
                        </div>
                        <div className="col-md-8 p-1">
                            <div className="fw-bold">{field.Description}</div>
                            <div><small className="ps-0 badge text-dark me-2">{t('create_purchaseorder_partcode')} {field.PartCode}</small><small className="badge text-dark me-2">{t('create_purchaseorder_hsncode')} {field.HsnCode}</small><small className="badge text-dark me-2">{t('create_purchaseorder_oem')} {field.OemPartNumber}</small></div>
                        </div>
                        <div className="col-md-4">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className=" ">
                                        <h6 className="border rounded bg-light text-center fw-bold text-dark">{field.Cgst || 0}</h6>
                                        <h6 className="form-text">{t('create_purchaseorder_cgst')}</h6>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="counter red">
                                        <h6 className="border rounded bg-light text-center fw-bold text-dark">{field.Sgst || 0}</h6>
                                        <h6 className="form-text">{t('create_purchaseorder_sgst')}</h6>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="counter">
                                        <h6 className="border rounded bg-light text-center fw-bold text-dark">{field.Igst || 0}</h6>
                                        <h6 className="form-text">{t('create_purchaseorder_igst')}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-4">
                                <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_price')}</label>
                                <input
                                    className={`form-control ${getErrorForPartId(errorlist, field.Id, 'Price') ? "is-invalid" : ""}`}
                                    name={String(field.Id)} value={field.Price ?? ''} onChange={setPrice}
                                />
                                {getErrorForPartId(errorlist, field.Id, 'Price') ? (
                                    <div className="invalid-feedback">
                                        {t(getErrorForPartId(errorlist, field.Id, 'Price') || '')}
                                    </div>
                                ) : <></>}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_quantity')}</label>
                                <div className="">
                                    <input className={`form-control ${getErrorForPartId(errorlist, field.Id, 'Quantity') ? "is-invalid" : ""}`} name={String(field.Id)} onChange={setQuantity} value={field.Quantity ?? ''} />
                                    {getErrorForPartId(errorlist, field.Id, 'Quantity') ? (
                                        <div className="invalid-feedback">
                                            {t(getErrorForPartId(errorlist, field.Id, 'Quantity') || '')}
                                        </div>
                                    ) : <></>
                                    }
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_stocktype')}</label>
                                <Select
                                    options={StockTypes}
                                    onChange={setStockType}
                                    isSearchable
                                    name={String(field.Id)}
                                    placeholder={t('create_purchaseorder_stocktype_select')}
                                    classNames={{ control: (state) => getErrorForPartId(errorlist, field.Id, 'StockTypeId') ? "border-danger" : "" }}
                                />
                                {getErrorForPartId(errorlist, field.Id, 'StockTypeId') ? (
                                    <div className="text-danger form-text">
                                        {t(getErrorForPartId(errorlist, field.Id, 'StockTypeId') || '')}
                                    </div>
                                ) : <></>}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
            <div className="row mx-0 mt-2 pe-0 ms-1">
                <button className="btn app-primary-bg-color text-white" type="button" onClick={onSubmit}>
                    {t('partindentcart_button_submit')}
                </button>
            </div>
            {displayInformationModal ? <InformationModal /> : ""}
        </div>
    )
}