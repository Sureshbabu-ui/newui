import Select from 'react-select';
import { useTranslation } from "react-i18next";
import { store } from '../../../../../../../state/store';
import { getContractCustomerSites, getCustomersList } from '../../../../../../../services/customer';
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithCode, formatSelectInputWithThreeArgWithParenthesis } from '../../../../../../../helpers/formats';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useStore } from '../../../../../../../state/storeHooks';
import { getFilteredContractsByCustomer } from '../../../../../../../services/serviceRequest';
import { PartBasketItemState, updateField, updateErrors, updateImprestStockField, toggleInformationModalStatus, initializeBasketItemList, setIsCustomerSite, updateErrorsForDc, clearDeliveryChallan, setReserveLocation, setDCTypeCode, setCourierOrNot } from '../../PartStockBasket/PartStockBasket.slice';
import { startPreloader, stopPreloader } from '../../../../../../Preloader/Preloader.slice';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getPartStockList } from '../../../../../../../services/partStock';
import { loadPartStocks } from '../../PartStockList/PartStockList.slice';
import { getPartStockDetailList } from '../../../../../../../services/partStockDetail';
import { loadPartStockDetails } from '../../../PartStockDetail/PartStockDetailList/PartStockDetailList.slice';
import { CreateImprestStockForCustomer } from '../../../../../../../services/impreststock';
import { getRegionWiseServiceEngineers } from '../../../../../../../services/users';
import { loadContractNumbers, loadCustomerList, loadCustomerSites, loadMasterData, loadServiceEngineersForIS, loadVendorNames, setProceedToPreview } from './ImprestStockCustomer.slice';
import { getValuesInMasterDataByTable } from '../../../../../../../services/masterData';
import { ServiceEngineersList } from '../../../../../../../types/user';
import { CustomerSites } from '../../../../../../../types/customer';
import { ImprestStockCustomerPreview } from './ImprestStockCutomerPreview';
import { getVendorNames } from '../../../../../../../services/vendor';

export const ImprestStockCustomer = () => {
    const { t } = useTranslation();
    const [SEList, setSEList] = useState<ServiceEngineersList[]>([]);
    const [formattedSEList, setFormattedSEList] = useState<any>([]);

    const [SiteList, setSiteList] = useState<CustomerSites[]>([]);
    const [formattedSiteList, setFormattedSiteList] = useState<any>([]);

    const { partstockbasket: { errors, errorsDC, ReserveLocation, impreststock, PartId, displayInformationModal, deliverychallan } } = useStore(({ partstockbasket }) => ({ partstockbasket }));
    const { impreststockcustomer: { CustomerNames, VendorNames, ProceedPreview, masterDataList, ServiceEngineers, ContractNumbers, CustomerSiteNames } } = useStore(({ impreststockcustomer }) => ({ impreststockcustomer }));

    useEffect(() => {
        onLoad();
    }, [])

    const onLoad = async () => {
        const { CustomersList } = await getCustomersList();
        const Customers = await formatSelectInputWithThreeArgWithParenthesis(CustomersList, "Name", "CustomerCode", "Id")
        store.dispatch(loadCustomerList({ SelectDetails: Customers }));

        const { ServiceEngineers } = await getRegionWiseServiceEngineers()
        setSEList(ServiceEngineers)
        const EngineersName = await (formatSelectInputWithCode(ServiceEngineers, "FullName", "Id", "Address"))
        setFormattedSEList(EngineersName)
        store.dispatch(loadServiceEngineersForIS({ SelectDetails: EngineersName }));
    }

    useEffect(() => {
        GetDCData();
    }, [])

    useEffect(() => {
        if (deliverychallan.LogisticsVendorTypeId != null) {
            getFilteredVendors()
        }
    }, [deliverychallan.LogisticsVendorTypeId])

    const getFilteredVendors = async () => {
        if (deliverychallan.LogisticsVendorTypeId != null) {
            const { VendorNames } = await getVendorNames(deliverychallan.LogisticsVendorTypeId);
            const formattedVendornames = formatSelectInputWithCode(VendorNames, "Name", "Id", "Address")
            store.dispatch(loadVendorNames({ SelectDetails: formattedVendornames }));
        }
    }

    const GetDCData = async () => {
        // MasterData tables
        var { MasterData } = await getValuesInMasterDataByTable("DCType")
        const dctype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
        const formatedData = dctype.filter((item) => item.code == "DCN_SITE" || item.code == "DCN_ENGR");
        store.dispatch(loadMasterData({ name: "DCType", value: { SelectDetails: formatedData } }));

        var { MasterData } = await getValuesInMasterDataByTable("TransportationMode")
        const transportationMode = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
        store.dispatch(loadMasterData({ name: "TransportationMode", value: { SelectDetails: transportationMode } }));

        var { MasterData } = await getValuesInMasterDataByTable("VendorType")
        const Vendortype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
        store.dispatch(loadMasterData({ name: "VendorTypes", value: { SelectDetails: Vendortype } }));
    }

    useEffect(() => {
        if (impreststock.ContractId != 0) {
            getFilteredSiteNameByContract()
        }
    }, [impreststock.ContractId])


    const getFilteredSiteNameByContract = async () => {
        const { ContractCustomerSites } = await getContractCustomerSites(impreststock.ContractId.toString());
        setSiteList(ContractCustomerSites)
        const SiteNames = await formatSelectInputWithCode(ContractCustomerSites, "SiteName", "Id", "Address")
        setFormattedSiteList(SiteNames)
        store.dispatch(loadCustomerSites({ SelectDetails: SiteNames }));
    }

    const validationSchema = yup.object().shape({
        CustomerId: yup.number().positive('validation_error_interim_impreststock_create_customer_name_required'),
        ContractId: yup.number().positive('validation_error_interim_impreststock_create_contract_required').max(8, ('validation_error_interim_impreststock_create_contract_required')),
        ReservedTo: yup.string().required('validation_error_interim_impreststock_reservedto_required'),
        ReservedFrom: yup.string().required('validation_error_interim_impreststock_reservedfrom_required'),
        CustomerSiteId: yup.number().when('ReserveLocation', (ReserveLocation, schema) =>
            store.getState().partstockbasket.ReserveLocation === "RLN_CSMR" ?
                schema.required('validation_error_interim_impreststock_site_required').moreThan(-1, 'validation_error_interim_impreststock_site_required') :
                schema.nullable()
        ),
        ServiceEngineerId: yup.number().when('IsbyCourier', (IsbyCourier, schema) =>
            store.getState().partstockbasket.impreststock.IsbyCourier === "ISC_BHND" ?
                schema.required('validation_error_interim_impreststock_service_engineer_required').moreThan(-1, 'validation_error_interim_impreststock_service_engineer_required') :
                schema.nullable()
        )
    });

    const validationSchemaForDC = yup.object().shape({
        DcTypeId: yup.number().positive('validation_error_deliverychallan_create_transfertype_required'),
        DestinationEmployeeId: yup.number().when('DCTypeCode', (DCTypeCode, schema) =>
            store.getState().partstockbasket.deliverychallan.DCTypeCode === "DCN_ENGR"
                ? schema.required('validation_error_deliverychallan_create_destination_engineer_required').moreThan(-1, 'validation_error_deliverychallan_create_destination_engineer_required')
                : schema.nullable()
        ),
        DestinationTenantOfficeId: yup.number().when('DCTypeCode', (DCTypeCode, schema) =>
            store.getState().partstockbasket.deliverychallan.DCTypeCode === 'DCN_ITRN'
                ? schema.required('validation_error_deliverychallan_create_destination_location_required').moreThan(-1, ('validation_error_deliverychallan_create_destination_location_required'))
                : schema.nullable()
        ),
        DestinationVendorId: yup.number().when('DCTypeCode', (DCTypeCode, schema) =>
            store.getState().partstockbasket.deliverychallan.DCTypeCode === 'DCN_VNDR'
                ? schema.required('validation_error_deliverychallan_create_destination_vendor_required').moreThan(-1, ('validation_error_deliverychallan_create_destination_vendor_required'))
                : schema.nullable()
        )
    });

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={redirectToPartStocks}>
                {t('impreststock_create_success_message')}
            </SweetAlert>
        );
    }

    const redirectToPartStocks = async () => {
        store.dispatch(toggleInformationModalStatus());
        document.getElementById("closeStockTransfer")?.click();
        store.dispatch(initializeBasketItemList())
        const stocklist = await getPartStockList(store.getState().partstocklist.search, store.getState().partstocklist.partStockFilter, store.getState().partstocklist.currentPage);
        store.dispatch(loadPartStocks(stocklist));
        const stockdetaillist = await getPartStockDetailList(PartId, "", 1);
        store.dispatch(loadPartStockDetails(stockdetaillist));
    }

    useEffect(() => {
        if (impreststock.CustomerId != 0) {
            getFilteredContracts()
        }
    }, [impreststock.CustomerId])

    const onSubmit = async () => {
        store.dispatch(updateErrors({}));
        store.dispatch(updateErrorsForDc({}));
        let errors: any = null;
        let errorsDC: any = null;
        try {
            await validationSchema.validate(impreststock, { abortEarly: false });
        } catch (error: any) {
            errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors));
        }
        if (impreststock.IsbyCourier == 'ISC_BCER') {
            try {
                await validationSchemaForDC.validate(store.getState().partstockbasket.deliverychallan, { abortEarly: false });
            } catch (error: any) {
                errorsDC = error.inner.reduce((allErrors: any, currentError: any) => {
                    return { ...allErrors, [currentError.path as string]: currentError.message };
                }, {});
                store.dispatch(updateErrorsForDc(errorsDC));
            }
        }

        if (errors || errorsDC) {
            return;
        }
        store.dispatch(startPreloader());
        const result = await (impreststock.IsbyCourier == 'ISC_BCER' ? CreateImprestStockForCustomer(impreststock, store.getState().partstockbasket.deliverychallan) : CreateImprestStockForCustomer(impreststock));
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e);
                store.dispatch(updateErrors(errorMessages));
            }
        });
        store.dispatch(stopPreloader());
    };

    const getFilteredContracts = async () => {
        const { Contracts } = await getFilteredContractsByCustomer(impreststock.CustomerId);
        const FormatedContracts = await formatSelectInput(Contracts, "ContractNumber", "Id")
        store.dispatch(loadContractNumbers({ SelectDetails: FormatedContracts }));
    }

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        var value = selectedOption.value
        var name = actionMeta.name
        if (name == 'CustomerSiteId') {
            store.dispatch(setIsCustomerSite(true))
        }
        store.dispatch(updateImprestStockField({ name: name as keyof PartBasketItemState['impreststock'], value }));
    }
    const [dctype, setDctype] = useState('')

    const onSelectChangeForDC = (selectedOption: any, actionMeta: any) => {
        var value = selectedOption.value
        var name = actionMeta
        if (name == 'DcTypeId') {
            store.dispatch(setDCTypeCode(selectedOption.code))
            setDctype(selectedOption.label)
            store.dispatch(updateField({ name: 'DcTypeId', value }));
        }
        store.dispatch(updateField({ name: name as keyof PartBasketItemState['deliverychallan'], value }));
    }

    function onUpdateField(ev: any) {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateImprestStockField({ name: name as keyof PartBasketItemState['impreststock'], value }));
    }

    const proceedButton = async () => {
        store.dispatch(setProceedToPreview(true))
    }

    const reservelocations = [
        { value: 'RLN_LGST', label: 'Imprest Stock At Location' },
        { value: 'RLN_CSMR', label: 'Imprest Stock At Customer Site' }
    ]

    const modes = [
        { value: 'ISC_BHND', label: "By Hand" },
        { value: 'ISC_BCER', label: "By Courier" }
    ]

    function handleCheckbox(value: string) {
        store.dispatch(setReserveLocation(value))
        if (value == "RLN_LGST") {
            store.dispatch(setIsCustomerSite(false))
        }
        store.dispatch(updateImprestStockField({ name: 'CustomerSiteId', value: null }));
    }

    const transferCheckbox = async (value) => {
        { value == "ISC_BCER" ? store.dispatch(setCourierOrNot('ISC_BCER')) : store.dispatch(setCourierOrNot('ISC_BHND')) }
        store.dispatch(clearDeliveryChallan())
    }

    function onUpdateData(ev: any) {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof PartBasketItemState['deliverychallan'], value }));
    }

    return (
        <>
            {ProceedPreview === true ?
                <div className="row mx-0">
                    <ImprestStockCustomerPreview />
                </div>
                :
                <>
                    <div className="row mx-0 p-0">
                        <div className="col-md-6">
                            <label className="mt-2 red-asterisk">{t('impreststock_create_label_customer_name')}</label>
                            <Select
                                value={CustomerNames && CustomerNames.find(option => option.value == impreststock.CustomerId) || null}
                                options={CustomerNames}
                                onChange={onSelectChange}
                                isSearchable
                                placeholder="Select option"
                                className={`${errors["CustomerId"] ? " border border-danger rounded-2" : ""}`}
                                name="CustomerId"
                            />
                            <div className="small text-danger"> {t(errors['CustomerId'])}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="mt-2 red-asterisk">{t('impreststock_create_label_contract_number')}</label>
                            <Select
                                options={ContractNumbers}
                                value={ContractNumbers && ContractNumbers.find(option => option.value == impreststock.ContractId) || null}
                                onChange={onSelectChange}
                                isSearchable
                                placeholder="Select option"
                                className={`${errors["ContractId"] ? " border border-danger rounded-2" : ""}`}
                                name="ContractId"
                            />
                            <div className="small text-danger"> {t(errors['ContractId'])}</div>
                        </div>
                        <div className="row mx-0 mt-2">
                            {reservelocations.map((item) => (
                                <div key={item.value} className="pb-2 ps-0">
                                    <input
                                        type="radio"
                                        className={`form-check-input border-secondary`}
                                        onChange={(ev) => handleCheckbox(item.value)}
                                        value={item.value}
                                        checked={ReserveLocation == item.value}
                                    />
                                    <label className="form-check-label ms-2">{item.label}</label>
                                </div>
                            )
                            )}
                        </div>
                        {ReserveLocation == "RLN_CSMR" &&
                            <>
                                <div className="col-md-12">
                                    <label className="mt-2 red-asterisk">{t('impreststock_create_label_contract_customer_site_name')}</label>
                                    <Select
                                        options={CustomerSiteNames}
                                        value={CustomerSiteNames && CustomerSiteNames.find(option => option.value == impreststock.CustomerSiteId) || null}
                                        onChange={onSelectChange}
                                        isSearchable
                                        placeholder="Select option"
                                        name="CustomerSiteId"
                                        className={`${errors["CustomerSiteId"] ? " border border-danger rounded-2" : ""}`}
                                    />
                                    <div className="small text-danger"> {t(errors['CustomerSiteId'])}</div>
                                    {formattedSiteList.length > 0 && (
                                        <div className="text-muted mt-1">
                                            {(SiteList.filter((value) => (value.Id == impreststock.CustomerSiteId))).length > 0
                                                ? `Address : ${(SiteList.filter((value) => (value.Id == impreststock.CustomerSiteId)))[0].Address || 'Not Available'}`
                                                : ''}
                                        </div>
                                    )}
                                </div>
                                <label className="mt-2 red-asterisk">{t('impreststock_create_label_transmode')}</label>
                                <div className="d-flex flex-row mx-0 mt-2">
                                    {modes.map((item) =>
                                        <div key={item.value} className="pb-2 pe-3">
                                            <input
                                                type="radio"
                                                className={`form-check-input border-secondary`}
                                                onChange={(ev) => transferCheckbox(item.value)}
                                                value={item.value}
                                                checked={impreststock.IsbyCourier == item.value}
                                            />
                                            <label className="form-check-label ms-2">{item.label}</label>
                                        </div>
                                    )}
                                </div>
                                {impreststock.IsbyCourier == 'ISC_BHND' &&
                                    <div className="col">
                                        <label className="mt-2 red-asterisk">{t('impreststock_create_label_se')}</label>
                                        <Select
                                            options={ServiceEngineers}
                                            value={ServiceEngineers && ServiceEngineers.find(option => option.value == impreststock.ServiceEngineerId) || null}
                                            onChange={onSelectChange}
                                            isSearchable
                                            name="ServiceEngineerId"
                                            className={`${errors["ServiceEngineerId"] ? " border border-danger rounded-2" : ""}`}
                                            placeholder={t('deliverychallan_create_select_option')}
                                        />
                                        <div className="small text-danger"> {t(errors['ServiceEngineerId'])}</div>
                                        {formattedSEList.length > 0 && (
                                            <div className="text-muted mt-1">
                                                {(SEList.filter((value) => (value.Id == impreststock.ServiceEngineerId))).length > 0
                                                    ? `Address : ${(SEList.filter((value) => (value.Id == impreststock.ServiceEngineerId)))[0].Address || 'Not Available'}`
                                                    : ''}
                                            </div>
                                        )}
                                    </div>
                                }
                                {impreststock.IsbyCourier == 'ISC_BCER' &&
                                    <>
                                        <div className="mb-2 col">
                                            <label className="mt-2 red-asterisk">{t('impreststock_create_label_transto')}</label>
                                            <Select
                                                value={masterDataList.DCType && masterDataList.DCType.find(option => option.value == deliverychallan.DcTypeId) || null}
                                                options={masterDataList.DCType}
                                                onChange={(selectedOption) => onSelectChangeForDC(selectedOption, "DcTypeId")}
                                                isSearchable
                                                className={`${errors["DcTypeId"] ? " border border-danger rounded-2" : ""}`}
                                                name="DcTypeId"
                                                placeholder="Select option"
                                            />
                                            <div className="small text-danger"> {t(errorsDC['DcTypeId'])}</div>
                                        </div>
                                        {deliverychallan.DCTypeCode == "DCN_ENGR" &&
                                            <div className="col">
                                                <label className="mt-2 red-asterisk">{t('deliverychallan_create_destination_engid')}</label>
                                                <Select
                                                    options={ServiceEngineers}
                                                    onChange={(selectedOption) => onSelectChangeForDC(selectedOption, "DestinationEmployeeId")}
                                                    isSearchable
                                                    className={`${errors["DestinationEmployeeId"] ? " border border-danger rounded-2" : ""}`}
                                                    name="DestinationEmployeeId"
                                                    placeholder={t('deliverychallan_create_select_option')}
                                                />
                                                <div className="small text-danger"> {t(errorsDC['DestinationEmployeeId'])}</div>
                                                {formattedSEList.length > 0 && (
                                                    <div className="text-muted mt-1">
                                                        {(SEList.filter((value) => (value.Id == deliverychallan.DestinationEmployeeId))).length > 0
                                                            ? `Address : ${(SEList.filter((value) => (value.Id == deliverychallan.DestinationEmployeeId)))[0].Address || 'Not Available'}`
                                                            : ''}
                                                    </div>
                                                )}
                                            </div>
                                        }
                                        <div className="row m-0 p-0">
                                            <div className="mt-2 col-md-6">
                                                <label className="form-label mb-0">{t('deliverychallan_create_logistics_vendortype')}</label>
                                                <Select
                                                    options={masterDataList.VendorTypes}
                                                    name="LogisticsVendorTypeId"
                                                    value={(masterDataList.VendorTypes && masterDataList.VendorTypes.find((option) => option.value == deliverychallan.LogisticsVendorTypeId)) || null}
                                                    className={`${errorsDC["LogisticsVendorTypeId"] ? "is-invalid" : ""}`}
                                                    onChange={(selectedOption) => onSelectChangeForDC(selectedOption, "LogisticsVendorTypeId")}
                                                    isSearchable
                                                    placeholder={t('deliverychallan_create_select_option')}
                                                />
                                            </div>
                                            <div className="mt-2 col-md-6">
                                                <label className="form-label mb-0">{t('deliverychallan_create_logistics_vendor')}</label>
                                                <Select
                                                    options={VendorNames}
                                                    name="LogisticsVendorId"
                                                    value={(VendorNames && VendorNames.find((option) => option.value === deliverychallan.LogisticsVendorId)) || null}
                                                    className={`${errorsDC["LogisticsVendorId"] ? "is-invalid" : ""}`}
                                                    onChange={(selectedOption) => onSelectChangeForDC(selectedOption, "LogisticsVendorId")}
                                                    isSearchable
                                                    placeholder={t('deliverychallan_create_select_option')}
                                                />
                                                <div className="small text-danger"> {t(errorsDC['LogisticsVendorId'])}</div>
                                                {(VendorNames.length > 0 &&
                                                    <div className="text-muted mt-1">
                                                        {(VendorNames.filter((value) => (value.value == deliverychallan.LogisticsVendorId)
                                                        )).length > 0 ? `Address : ${(VendorNames.filter((value) => (value.value == deliverychallan.LogisticsVendorId)
                                                        ))[0].code}` : ''}
                                                    </div>
                                                )}
                                            </div>
                                            <div className='col-md-6'>
                                                <label className="mt-2">{t('deliverychallan_create_logistics_receipt_no')}</label>
                                                <input
                                                    name="LogisticsReceiptNumber"
                                                    onChange={onUpdateData}
                                                    type="text"
                                                    value={deliverychallan.LogisticsReceiptNumber ?? 0}
                                                    className={`form-control`}
                                                />
                                            </div>
                                            <div className='col-md-6'>
                                                <label className='mt-2'>{t('deliverychallan_create_logistics_receipt_date')}</label>
                                                <input name='LogisticsReceiptDate' onChange={onUpdateData} type='date' className='form-control'></input>
                                                <div className="small text-danger"> {t(errorsDC["LogisticsReceiptDate"])}</div>
                                            </div>
                                            <div className="mb-2 col-md-6">
                                                <label className="mt-2">{t('deliverychallan_create_modeof_transport')}</label>
                                                <Select
                                                    value={masterDataList.TransportationMode && masterDataList.TransportationMode.find(option => option.value == deliverychallan.ModeOfTransport) || null}
                                                    options={masterDataList.TransportationMode}
                                                    onChange={(selectedOption) => onSelectChangeForDC(selectedOption, "ModeOfTransport")}
                                                    isSearchable
                                                    name="ModeOfTransport"
                                                    placeholder={t('deliverychallan_create_select_option')}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2">{t('deliverychallan_create_trackingid')}</label>
                                                <input
                                                    name="TrackingId"
                                                    onChange={onUpdateData}
                                                    type="text"
                                                    value={deliverychallan.TrackingId ?? 0}
                                                    className={`form-control`}
                                                />
                                            </div>
                                        </div>
                                    </>
                                }
                            </>
                        }
                        <div className="row mx-0">
                            {/* from date */}
                            <div className='col-md-6 ps-0'>
                                <div className="">
                                    <label className="mt-2 red-asterisk">{t('impreststock_create_label_reservedfrom')}</label>
                                    <input
                                        name='ReservedFrom'
                                        value={impreststock.ReservedFrom ? impreststock.ReservedFrom : ""}
                                        onChange={onUpdateField}
                                        type='date'
                                        className={`form-control  ${errors["ReservedFrom"] ? "border border-danger" : ""}`}
                                    ></input>
                                    <div className="small text-danger"> {t(errors['ReservedFrom'])}</div>
                                </div>
                            </div>
                            {/* from date ends */}
                            {/* to date */}
                            <div className='col-md-6 pe-0'>
                                <div className="">
                                    <label className="mt-2 red-asterisk">{t('impreststock_create_label_reservedto')}</label>
                                    <input
                                        name='ReservedTo'
                                        value={impreststock.ReservedTo ? impreststock.ReservedTo : ""}
                                        onChange={onUpdateField}
                                        type='date'
                                        className={`form-control  ${errors["ReservedTo"] ? "is-invalid" : ""}`}
                                    ></input>
                                    <div className="small text-danger"> {t(errors['ReservedTo'])}</div>
                                </div>
                            </div>
                            {/* to date ends */}
                        </div>
                        <div className='col-md-12'>
                            <label className="mt-2 ">{t('impreststock_create_label_remarks')}</label>
                            <textarea
                                value={impreststock.Remarks}
                                className="form-control"
                                rows={3}
                                name="Remarks"
                                maxLength={128}
                                onChange={onUpdateField}
                            ></textarea>
                        </div>
                    </div>
                    <div className="d-flex flex-row-reverse">
                        <div className="mt-2">
                            {impreststock.CustomerId != 0 &&
                                <button className="btn bg-light text-dark float-end" type="button" onClick={proceedButton}>
                                    <span className="material-symbols-outlined align-middle pe-1">visibility</span> {t('impreststock_create_preview')}
                                </button>
                            }
                        </div>
                        <div className="mt-2 me-2">
                            <button className="btn app-primary-bg-color text-white float-end" disabled={impreststock != null ? false : true} type="button" onClick={onSubmit}>
                                {t('impreststock_create_label_submit')}
                            </button>
                        </div>
                    </div>
                    {displayInformationModal ? <InformationModal /> : ""}
                </>
            }
        </>


    )
}