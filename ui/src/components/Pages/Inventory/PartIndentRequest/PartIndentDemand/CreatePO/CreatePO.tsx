import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import { getVendorNames } from "../../../../../../services/vendor";
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithCode } from "../../../../../../helpers/formats";
import { useEffect, useRef, useState } from "react";
import { CreatePOState, initializeCreatePurchaseOrder, loadCustomerSite, loadPartDetail, loadStockType, loadTenantOffices, loadVendorBranchNames, loadVendorNames, loadVendorType, setBillToGst, setToSite, setVendorToGst, setvendorBranchGst, toggleInformationModalStatus, updateErrors, updateField } from "./CreatePO.slice";
import { useStoreWithInitializer } from "../../../../../../state/storeHooks";
import * as yup from 'yup';
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { CreatePOForIndentDemand, getUserTenantOfficeNameWithCwh } from "../../../../../../services/purchaseorder";
import { store } from "../../../../../../state/store";
import { useHistory } from "react-router-dom";
import { getClickedPartDetails } from "../../../../../../services/part";
import { TenantInfoDetails } from "../../../../../../types/tenantofficeinfo";
import { VendorNameList } from "../../../../../../types/vendor";
import { BranchInVendorDetail } from "../../../../../../types/vendorBranch";
import { getVendorBranchNames } from "../../../../../../services/vendorBranch";
import { getValuesInMasterDataByTable } from "../../../../../../services/masterData";
import { getCustomerSiteNames } from "../../../../../../services/customer";

export const CreatePurchaseOrder = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const modalRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { displayInformationModal, partdetail, DemandQuantity, ToSite, CustomerSiteList, CustomerInfoId, StockTypes, createforpurchaseorder, errors, vendorBranchGstNo,VendorTypes } = useStoreWithInitializer(
        ({ createpurchaseorder, }) => createpurchaseorder,
        initializeCreatePurchaseOrder
    );

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
    }, [createforpurchaseorder.PartId, createforpurchaseorder.VendorId, CustomerInfoId]);

    useEffect(() => {
        const vendorinfo = formattedVendorList.find((item) => (item.value === createforpurchaseorder.VendorId));
        if (vendorinfo != undefined) {
            store.dispatch(setVendorToGst(vendorinfo.code))
        }

    }, [formattedVendorList]);

    const onLoad = async () => {
        try {
            if (createforpurchaseorder.VendorId != 0) {
                const branches = await getVendorBranchNames(createforpurchaseorder.VendorId.toString());
                setVendorBranchList(branches.VendorBranches)
                setFormattedVendorBranchList(formatSelectInputWithCode(branches.VendorBranches, "BranchName", "Id", "GstStateCode"))
                store.dispatch(loadVendorBranchNames(branches));
            }

            if (createforpurchaseorder.PartId != 0) {
                const partdetail = await getClickedPartDetails(createforpurchaseorder.PartId)
                store.dispatch(loadPartDetail(partdetail.Partdetails))
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

            if (CustomerInfoId != 0) {
                const sitenames = await getCustomerSiteNames(CustomerInfoId);
                const customersites = await formatSelectInputWithCode(sitenames, "SiteName", "Id", "Address")
                store.dispatch(loadCustomerSite({ Select: customersites }));
            }

        } catch (error) {
            console.error(error);
        }
    };

    function handleCheckboxClick(ev: any) {
        const value = ev.target.checked ? true : false;
        store.dispatch(setToSite(value))
    }

    const redirectToDemandList = async () => {
        store.dispatch(toggleInformationModalStatus());
        history.push('/logistics/partindentdemands/cwh')
        modalRef.current?.click()
    }

    const onModalClose = async () => {
        store.dispatch(initializeCreatePurchaseOrder())
    }

    const validationSchema = yup.object().shape({
        BillToTenantOfficeInfoId: yup.number().required('create_po_validation_error_message_billtoaddress').min(1, ('create_po_validation_error_message_billtoaddress')),
        ShipToCustomerSiteId: yup.number().when('ToSite', (ToSite, schema) =>
            store.getState().createpurchaseorder.ToSite === true
                ? schema.required('create_po_validation_error_message_shiptosite').moreThan(0, 'create_po_validation_error_message_shiptosite')
                : schema.nullable()
        ),
        ShipToTenantOfficeInfoId: yup.number().when('ToSite', (ToSite, schema) =>
            store.getState().createpurchaseorder.ToSite === false
                ? schema.required('create_po_validation_error_message_shiptoaddress').moreThan(0, 'create_po_validation_error_message_shiptoaddress')
                : schema.nullable()
        ),
        Price: yup.number().required('create_po_validation_error_message_price').min(1, ('create_po_validation_error_message_price')).typeError('request_po_validation_error_message_price'),
        VendorId: yup.number().required('create_po_validation_error_message_vendor').min(1, ('create_po_validation_error_message_vendor')),
        VendorTypeId: yup.number().required('create_po_validation_error_message_vendortype').min(1, ('create_po_validation_error_message_vendortype')),
        CgstRate: yup.number().required('create_po_validation_error_message_cgst').typeError('create_po_validation_error_message_cgst'),
        SgstRate: yup.number().required('create_po_validation_error_message_sgst').typeError('create_po_validation_error_message_Sgst'),
        IgstRate: yup.number().required('create_po_validation_error_message_igst').typeError('create_po_validation_error_message_Igst'),
    });

    const onSubmit = async () => {
        store.dispatch(updateErrors({}));
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
        store.dispatch(startPreloader());
        const result = await CreatePOForIndentDemand(createforpurchaseorder)
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
        store.dispatch(updateField({ name: name as keyof CreatePOState['createforpurchaseorder'], value }));
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
        store.dispatch(updateField({ name: name as keyof CreatePOState['createforpurchaseorder'], value }));
    }

    return (
        <div
            className="modal fade"
            id='CreatePO'
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
                            id='closeCreatePO'
                            onClick={onModalClose}
                            aria-label='Close'
                            ref={modalRef}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <ContainerPage>
                            <>
                                <ValidationErrorComp errors={errors} />
                                <div className="table-responsive mt-2">
                                    <table className="table table-bordered ">
                                        <thead>
                                            <tr>
                                                <th scope="col">{t('create_purchaseorder_th_part_code')}</th>
                                                <th scope="col">{t('create_purchaseorder_th_part_name')}</th>
                                                <th scope="col">{t('create_purchaseorder_th_part_quantity')}</th>
                                                <th scope='col'>{t('create_purchaseorder_th_cgst')}</th>
                                                <th scope='col'>{t('create_purchaseorder_th_sgst')}</th>
                                                <th scope='col'>{t('create_purchaseorder_th_igst')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="mt-2">
                                                <td>{partdetail.PartCode}</td>
                                                <td>{partdetail.PartName}</td>
                                                <td>{DemandQuantity}</td>
                                                <td>{createforpurchaseorder.CgstRate}</td>
                                                <td>{createforpurchaseorder.SgstRate}</td>
                                                <td>{createforpurchaseorder.IgstRate}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
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
                                        {/* Stock Type */}
                                        <div className="mb-2 col-6">
                                            <label className="mt-2">{t('partindentcart_label_stocktype')}</label>
                                            <Select
                                                value={StockTypes && StockTypes.find(option => option.value == createforpurchaseorder.StockTypeId) || null}
                                                options={StockTypes}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "StockTypeId")}
                                                isSearchable
                                                name="StockTypeId"
                                                placeholder={t('create_purchaseorder_stocktype_select')}
                                            />
                                            <div className="small text-danger"> {t(errors['StockTypeId'])}</div>
                                        </div>
                                        <div className="col-6 mt-2">
                                            <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_price')}</label>
                                            <input name="Price" className={`form-control  ${errors["Price"] ? "is-invalid" : ""}`}
                                                onChange={onUpdateField} value={createforpurchaseorder.Price} />
                                            <div className="small text-danger"> {t(errors['Price'])}</div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mt-1" >
                                            <input
                                                onChange={handleCheckboxClick}
                                                type="checkbox"
                                                value={ToSite.toString()}
                                                checked={ToSite}
                                                className={`form-check-input border-dark`} />&nbsp;
                                            <label className="form-check-label ms-2">{t('create_po_label_transfer_to_site')}</label>&nbsp;
                                        </div>
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
                                        {ToSite == true ? (
                                            <div className="col-md-6 mt-2">
                                                <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_ship_to_customersite')}</label>
                                                <Select
                                                    options={CustomerSiteList}
                                                    value={CustomerSiteList && CustomerSiteList.find(option => option.value == createforpurchaseorder.ShipToCustomerSiteId) || null}
                                                    name="ShipToCustomerSiteId"
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "ShipToCustomerSiteId")}
                                                    isSearchable
                                                    placeholder={t('create_po_placeholder_select_option')}
                                                />
                                                <div className="small text-danger"> {t(errors['ShipToCustomerSiteId'])}</div>
                                                {(CustomerSiteList.length > 0 &&
                                                    <div className="text-muted mt-1">
                                                        {(CustomerSiteList.filter((value) => (value.value == createforpurchaseorder.ShipToCustomerSiteId)
                                                        )).length > 0 ? `${t('create_po_label_address')} : ${(CustomerSiteList.filter((value) => (value.value == createforpurchaseorder.ShipToCustomerSiteId)
                                                        ))[0].code}` : ''}
                                                    </div>
                                                )}
                                            </div>

                                        ) : (
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
                                        )}
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