import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../../ValidationErrors/ValidationError";
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import { getVendorNames } from "../../../../../../../services/vendor";
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithCode } from "../../../../../../../helpers/formats";
import { useEffect, useRef, useState } from "react";
import {
    CreateBulkPOState, PartIndendErrors, initializeCreateBulkPurchaseOrder, loadCustomerSite, loadPartDetail,
    loadStockType, loadTenantOffices, loadVendorBranchNames, loadVendorNames, loadVendorType, onCloseModal, selectParts, setBillToGst, setPartQuantity, setStockType,
    setVendorToGst, setvendorBranchGst, toggleInformationModalStatus, updateErrors, updateField, updatePartErrorList
} from "./CreateBulkPO.slice";
import { useStoreWithInitializer } from "../../../../../../../state/storeHooks";
import * as yup from 'yup';
import { startPreloader, stopPreloader } from "../../../../../../Preloader/Preloader.slice";
import { BulkPurchaseOrderCreate, getUserTenantOfficeNameWithCwh } from "../../../../../../../services/purchaseorder";
import { store } from "../../../../../../../state/store";
import { TenantInfoDetails } from "../../../../../../../types/tenantofficeinfo";
import { VendorNameList } from "../../../../../../../types/vendor";
import { BranchInVendorDetail } from "../../../../../../../types/vendorBranch";
import { getVendorBranchNames } from "../../../../../../../services/vendorBranch";
import { getValuesInMasterDataByTable } from "../../../../../../../services/masterData";
import { DemandListCWHAttentionNeeded, getPartIndendDemandList } from "../../../../../../../services/partindentdemand";
import { loadCWHPartIndentDemand } from "../PartIndentDemandListCWH.slice";

export const CreateBulkPO = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { displayInformationModal, IsProceed, errorlist, DemandIdList, StockTypes, createforpurchaseorder, errors, vendorBranchGstNo, VendorTypes } = useStoreWithInitializer(
        ({ createbulkpo, }) => createbulkpo,
        initializeCreateBulkPurchaseOrder
    );

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={redirectToDemandList}>
                {t('create_purchaseorder_success_message')}
            </SweetAlert>
        );
    }

    const [TenantOfficeList, setTenantOfficeList] = useState<TenantInfoDetails[]>([]);
    const [formattedOfficeList, setFormattedOfficeList] = useState<any>([])

    const [VendorList, setVendorList] = useState<VendorNameList[]>([]);
    const [formattedVendorList, setFormattedVendorList] = useState<any>([])

    const [VendorBranchList, setVendorBranchList] = useState<BranchInVendorDetail[]>([]);
    const [formattedVendorBranchList, setFormattedVendorBranchList] = useState<any>([])

    useEffect(() => {
        onLoad();
    }, []);

    useEffect(() => {
        const SelectDemandDetail = async () => {
            const PartList = await getPartIndendDemandList(DemandIdList)
            store.dispatch(loadPartDetail(PartList.Indentdemandetails))
        }
        SelectDemandDetail()
    }, [IsProceed])

    useEffect(() => {
        const vendorinfo = formattedVendorList.find((item) => (item.value === createforpurchaseorder.VendorId));
        if (vendorinfo != undefined) {
            store.dispatch(setVendorToGst(vendorinfo.code))
        }
    }, [formattedVendorList]);


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

    const onLoad = async () => {
        try {
            if (createforpurchaseorder.VendorId != 0) {
                const branches = await getVendorBranchNames(createforpurchaseorder.VendorId.toString());
                setVendorBranchList(branches.VendorBranches)
                setFormattedVendorBranchList(formatSelectInputWithCode(branches.VendorBranches, "BranchName", "Id", "GstStateCode"))
                store.dispatch(loadVendorBranchNames(branches));
            }

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
            store.dispatch(loadVendorType({ Select: Vendortype }));
        } catch (error) {
            return;
        }
    };

    const redirectToDemandList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await DemandListCWHAttentionNeeded(store.getState().partindentdemandlistcwh.demandcwhcurrentPage, store.getState().partindentdemandlistcwh.demandcwhsearch);
        store.dispatch(loadCWHPartIndentDemand(result));
        store.dispatch(selectParts({ DemandId: 0, Action: '' }))
        modalRef.current?.click()
    }

    const onModalClose = async () => {
        store.dispatch(onCloseModal())
    }

    const validationSchema = yup.object().shape({
        BillToTenantOfficeInfoId: yup.number().required('create_po_validation_error_message_billtoaddress').min(1, ('create_po_validation_error_message_billtoaddress')),
        ShipToTenantOfficeInfoId: yup.number().required('create_po_validation_error_message_shiptoaddress').typeError('create_po_validation_error_message_shiptoaddress').moreThan(0, ('create_po_validation_error_message_shiptoaddress')),
        VendorId: yup.number().required('create_po_validation_error_message_vendor').min(1, ('create_po_validation_error_message_vendor')),
        VendorTypeId: yup.number().required('create_po_validation_error_message_vendortype').min(1, ('create_po_validation_error_message_vendortype')),
    });

    const validationSchemaForPart = yup.object().shape({
        Price: yup.number().required('create_po_validation_error_message_price_req').typeError('create_po_validation_error_message_price_req').moreThan(0, ('create_po_validation_error_message_price_req')),
        StockTypeId: yup.number().required('create_po_validation_error_message_stocktype').typeError('create_po_validation_error_message_stocktype'),
    });

    const onSubmit = async () => {
        store.dispatch(updateErrors({}));
        if (createforpurchaseorder.PartList != null) {
            try {
                const allErrors: PartIndendErrors[] = [];
                await Promise.all(createforpurchaseorder.PartList.map(async (partitem, index) => {
                    try {
                        await validationSchemaForPart.validate(partitem, { abortEarly: false });
                    } catch (error: any) {
                        const errors: PartIndendErrors = { Id: partitem.DemandId, Price: 0, StockTypeId: 0 };
                        error.inner.forEach((currentError: any) => {
                            if (currentError.path === 'Price') {
                                errors.Price = currentError.message;
                            } else if (currentError.path === 'StockTypeId') {
                                errors.StockTypeId = currentError.message;
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
                store.dispatch(updatePartErrorList(allErrors));
                if (allErrors.length === 0 && JSON.stringify(errors) === '{}') {
                    store.dispatch(startPreloader());
                    const result = await BulkPurchaseOrderCreate(createforpurchaseorder)
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


    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateBulkPOState['createforpurchaseorder'], value }));
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        if (name == "BillToTenantOfficeInfoId") {
            store.dispatch(setBillToGst(selectedOption.code))
        } else if (name == "VendorId") {
            store.dispatch(setVendorToGst(selectedOption.code))
        } else if (name == "VendorBranchId") {
            store.dispatch(setvendorBranchGst(selectedOption.code))
        }
        store.dispatch(updateField({ name: name as keyof CreateBulkPOState['createforpurchaseorder'], value }));
    }

    function getErrorForPartId(errorList: PartIndendErrors[], fieldId: number, fieldName: string): string | null {
        const errorItem = errorList.find(item => item.Id === fieldId);
        if (errorItem) {
            return errorItem[fieldName];
        }
        return null;
    }

    const setPartType = (selectedOption: any, actionMeta: any) => {
        var value = selectedOption.value
        var name = actionMeta.name
        store.dispatch(setStockType({ DemandId: name, StockTypeId: value }))
    }

    const setPrice = (ev: any) => {
        store.dispatch(setPartQuantity({ DemandId: ev.target.name, Price: ev.target.value }))
    }

    return (
        <div
            className="modal fade"
            id='CreateBulkPO'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header mx-3">
                        <h5 className="modal-title app-primary-color">{t('create_purchaseorder_main_heading')}</h5>
                        <button
                            type='button'
                            className="btn-close me-2"
                            data-bs-dismiss='modal'
                            id='closeCreateBulkPO'
                            onClick={onModalClose}
                            aria-label='Close'
                            ref={modalRef}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <ContainerPage>
                            <>
                                <ValidationErrorComp errors={errors} />
                                {createforpurchaseorder.PartList.map((field, index) => (
                                    <div className="row mx-1 border mb-2 p-1 shadow-sm bg-body rounded pb-2" key={index}>
                                        <div className="text-size-12">
                                        </div>
                                        <div className="col-md-6 p-1">
                                            <div className="fw-bold">{field.Description}</div>
                                            <div>
                                                <small className="ps-0 badge text-dark me-2">{t('create_purchaseorder_partcode')} {field.PartCode}</small>
                                                <small className="badge text-dark me-2">{t('create_purchaseorder_hsncode')} {field.HsnCode}</small>
                                                <small className="badge text-dark me-2">{t('create_purchaseorder_oem')} {field.OemPartNumber}</small>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-1">
                                                    <div className=" ">
                                                        <h6 className="border rounded bg-light text-center fw-bold text-dark">{field.Cgst || 0}</h6>
                                                        <h6 className="form-text">{t('create_purchaseorder_cgst')}</h6>
                                                    </div>
                                                </div>
                                                <div className="col-md-1">
                                                    <div className="counter red">
                                                        <h6 className="border rounded bg-light text-center fw-bold text-dark">{field.Sgst || 0}</h6>
                                                        <h6 className="form-text">{t('create_purchaseorder_sgst')}</h6>
                                                    </div>
                                                </div>
                                                <div className="col-md-1">
                                                    <div className="counter">
                                                        <h6 className="border rounded bg-light text-center fw-bold text-dark">{field.Igst || 0}</h6>
                                                        <h6 className="form-text">{t('create_purchaseorder_igst')}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-md-3">
                                                    <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_price')}</label>
                                                    <input
                                                        className={`form-control ${getErrorForPartId(errorlist, field.DemandId, 'Price') ? "is-invalid" : ""}`}
                                                        name={String(field.DemandId)} value={field.Price ?? ''} onChange={setPrice}
                                                    />
                                                    {getErrorForPartId(errorlist, field.DemandId, 'Price') ? (
                                                        <div className="invalid-feedback">
                                                            {t(getErrorForPartId(errorlist, field.DemandId, 'Price') || '')}
                                                        </div>
                                                    ) : <></>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_stocktype')}</label>
                                                    <Select
                                                        options={StockTypes}
                                                        onChange={setPartType}
                                                        value={StockTypes && StockTypes.find(option => option.value == field.StockTypeId) || null}
                                                        isSearchable
                                                        name={String(field.DemandId)}
                                                        placeholder={t('create_purchaseorder_stocktype_select')}
                                                        classNames={{ control: (state) => getErrorForPartId(errorlist, field.DemandId, 'StockTypeId') ? "border-danger" : "" }}
                                                    />
                                                    {getErrorForPartId(errorlist, field.DemandId, 'StockTypeId') ? (
                                                        <div className="text-danger form-text">
                                                            {t(getErrorForPartId(errorlist, field.DemandId, 'StockTypeId') || '')}
                                                        </div>
                                                    ) : <></>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                }
                                <div className='mb-2 '>
                                    <div className="row">
                                        <div className="col-6">
                                            <label className="mt-2 red-asterisk">{t('create_purchaseorder_vendor_type')}</label>
                                            <Select
                                                value={VendorTypes && VendorTypes.find(option => option.value == createforpurchaseorder.VendorTypeId) || null}
                                                options={VendorTypes}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "VendorTypeId")}
                                                isSearchable
                                                name="VendorTypeId"
                                                placeholder={t('create_purchaseorder_vendor_type_select')}
                                            />
                                            <div className="small text-danger"> {t(errors['VendorTypeId'])}</div>
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
                                                    )).length > 0 ? `${t('create_po_label_address')} : ${(VendorList.filter((value) => (value.Id == createforpurchaseorder.VendorId)
                                                    ))[0].Address}` : ''}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 col-md-6">
                                            <label className="form-label mb-0">{t('create_purchaseorder_vendor_branch')}</label>
                                            <Select
                                                options={formattedVendorBranchList}
                                                name="VendorBranchId"
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "VendorBranchId")}
                                                isSearchable
                                                placeholder={t('create_purchaseorder_vendor_branch_select')}
                                            />
                                            {(formattedVendorBranchList.length > 0 &&
                                                <div className="text-muted mt-1">
                                                    {(VendorBranchList.filter((value) => (value.Id == createforpurchaseorder.VendorBranchId)
                                                    )).length > 0 ? `${t('create_po_label_address')} : ${(VendorBranchList.filter((value) => (value.Id == createforpurchaseorder.VendorBranchId)
                                                    ))[0].Address}` : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mt-2">
                                            <label className="red-asterisk">{t('create_purchaseorder_bill_to_address')}</label>
                                            <Select
                                                options={formattedOfficeList}
                                                name="BillToTenantOfficeInfoId"
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "BillToTenantOfficeInfoId")}
                                                isSearchable
                                                placeholder={t('create_po_placeholder_select_option')}
                                            />
                                            <div className="small text-danger"> {t(errors['BillToTenantOfficeInfoId'])}</div>
                                            {(formattedOfficeList.length > 0 &&
                                                <div className="text-muted mt-1">
                                                    {(TenantOfficeList.filter((value) => (value.Id == createforpurchaseorder.BillToTenantOfficeInfoId)
                                                    )).length > 0 ? `${t('create_po_label_address')} : ${(TenantOfficeList.filter((value) => (value.Id == createforpurchaseorder.BillToTenantOfficeInfoId)
                                                    ))[0].Address}` : ''}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mt-2">
                                            <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_ship_to_address')}</label>
                                            <Select
                                                options={formattedOfficeList}
                                                name="ShipToTenantOfficeInfoId"
                                                value={formattedOfficeList && formattedOfficeList.find(option => option.value == createforpurchaseorder.ShipToTenantOfficeInfoId) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "ShipToTenantOfficeInfoId")}
                                                isSearchable
                                                placeholder={t('create_po_placeholder_select_option')}
                                            />
                                            <div className="small text-danger"> {t(errors['ShipToTenantOfficeInfoId'])}</div>
                                            {(formattedOfficeList.length > 0 &&
                                                <div className="text-muted mt-1">
                                                    {(TenantOfficeList.filter((value) => (value.Id == createforpurchaseorder.ShipToTenantOfficeInfoId)
                                                    )).length > 0 ? `${t('create_po_label_address')} : ${(TenantOfficeList.filter((value) => (value.Id == createforpurchaseorder.ShipToTenantOfficeInfoId)
                                                    ))[0].Address}` : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="m-0 mt-2">
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
                                <div className='col-md-12'>
                                    <button type="button" onClick={() => onSubmit()} className="btn app-primary-bg-color  float-end text-white mt-2">
                                        {t('create_purchaseorder_submit')}
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