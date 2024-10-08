import { useEffect, useRef, useState } from "react";
import { TenantInfoDetails } from "../../../../../../../types/tenantofficeinfo";
import { VendorNameList } from "../../../../../../../types/vendor";
import { checkForPermission } from "../../../../../../../helpers/permissions";
import { store } from "../../../../../../../state/store";
import { PartBasketItemState, initializeBasketItemList, setDCTypeCode, toggleInformationModalStatus, updateErrorsForDc, updateField } from "../../PartStockBasket/PartStockBasket.slice";
import { getVendorNames } from "../../../../../../../services/vendor";
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithCode } from "../../../../../../../helpers/formats";
import { getUnProcessedDemands } from "../../../../../../../services/partindentdemand";
import { getValuesInMasterDataByTable } from "../../../../../../../services/masterData";
import { useStore } from "../../../../../../../state/storeHooks";
import { useTranslation } from "react-i18next";
import Select from 'react-select';
import { CreateDeliveryChallan, getDestinationLocationList } from "../../../../../../../services/deliverychallan";
import { getEngineersNames } from "../../../../../../../services/assignEngineer";
import { loadDemandList, loadMasterData, loadServiceEngineers, loadTenantOffices, loadVendorNames } from "./StockTransferDC.slice";
import { startPreloader, stopPreloader } from "../../../../../../Preloader/Preloader.slice";
import * as yup from 'yup';
import { getPartStockList } from "../../../../../../../services/partStock";
import { loadPartStocks } from "../.././PartStockList/PartStockList.slice";
import SweetAlert from 'react-bootstrap-sweetalert';
import { getPartStockDetailList } from "../../../../../../../services/partStockDetail";
import { loadPartStockDetails } from "../../../PartStockDetail/PartStockDetailList/PartStockDetailList.slice";

export const StockTranferDC = () => {
    const { t } = useTranslation();

    const { partstockbasket: { errorsDC, deliverychallan, BasketItem, PartId, displayInformationModal, TransferType } } = useStore(({ partstockbasket }) => ({ partstockbasket }));
    const { stocktransferdc: { DemandList, EngineersList, masterDataList } } = useStore(({ stocktransferdc }) => ({ stocktransferdc }));

    useEffect(() => {
        if (TransferType == 'STT_ISTR') {
            onLoad()
        }
    }, [TransferType])

    const [TenantOfficeList, setTenantOfficeList] = useState<TenantInfoDetails[]>([]);
    const [formattedOfficeList, setFormattedOfficeList] = useState<any>([]);
    const [VendorList, setVendorList] = useState<VendorNameList[]>([]);
    const [formattedVendorList, setFormattedVendorList] = useState<any>([]);
    const [Demands, setDemandList] = useState<any>([]);

    const onLoad = async () => {
        try {
            if (checkForPermission("PARTSTOCK_LIST")) {
                const demands = await getUnProcessedDemands();
                setDemandList(demands.DemandList)
                const formattedDemands = await formatSelectInput(demands.DemandList, "DemandNumber", "Id")
                store.dispatch(loadDemandList({ SelectDetails: formattedDemands }))

                // MasterData tables
                var { MasterData } = await getValuesInMasterDataByTable("DCType")
                const dctype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
                const filtereddctypes = dctype.filter((item) => item.code == 'DCN_ITRN')
                store.dispatch(loadMasterData({ name: "DCType", value: { SelectDetails: filtereddctypes } }));

                var { MasterData } = await getValuesInMasterDataByTable("TransportationMode")
                const transportationMode = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
                store.dispatch(loadMasterData({ name: "TransportationMode", value: { SelectDetails: transportationMode } }));

                var { MasterData } = await getValuesInMasterDataByTable("VendorType")
                const Vendortype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
                store.dispatch(loadMasterData({ name: "VendorTypes", value: { SelectDetails: Vendortype } }));
            }
        }
        catch (error) {
            return;
        }
    }

    useEffect(() => {
        if (deliverychallan.LogisticsVendorTypeId != null) {
            getFilteredVendors()
        }
    }, [deliverychallan.LogisticsVendorTypeId])

    const getFilteredVendors = async () => {
        if (deliverychallan.LogisticsVendorTypeId != null) {
            const vendornames = await getVendorNames(deliverychallan.LogisticsVendorTypeId);
            setVendorList(vendornames.VendorNames)
            setFormattedVendorList(formatSelectInputWithCode(vendornames.VendorNames, "Name", "Id", "Address"))
            store.dispatch(loadVendorNames({ SelectDetails: formatSelectInputWithCode(vendornames.VendorNames, "Name", "Id", "Address") }));
        }
    }

    const validationSchema = yup.object().shape({
        DcTypeId: yup.number().positive('validation_error_deliverychallan_create_dctype_required'),
        DestinationEmployeeId: yup.number().when('DCTypeCode', (DCTypeCode, schema) =>
            deliverychallan.DCTypeCode === "DCN_ENGR"
                ? schema.required('validation_error_deliverychallan_create_destination_engineer_required').moreThan(-1, 'validation_error_deliverychallan_create_destination_engineer_required')
                : schema.nullable()
        ),
        DestinationTenantOfficeId: yup.number().when('DCTypeCode', (DCTypeCode, schema) =>
            deliverychallan.DCTypeCode === 'DCN_ITRN'
                ? schema.required('validation_error_deliverychallan_create_destination_location_required').moreThan(-1, ('validation_error_deliverychallan_create_destination_location_required'))
                : schema.nullable()
        ),
        DestinationVendorId: yup.number().when('DCTypeCode', (DCTypeCode, schema) =>
            deliverychallan.DCTypeCode === 'DCN_VNDR'
                ? schema.required('validation_error_deliverychallan_create_destination_vendor_required').moreThan(-1, ('validation_error_deliverychallan_create_destination_vendor_required'))
                : schema.nullable()
        ),
    });

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={redirectToPartStocks}>
                {t('deliverychallan_create_success_message')}
            </SweetAlert>
        );
    }

    useEffect(() => {
        store.dispatch(updateField({ name: 'DestinationEmployeeId', value: null }));
        store.dispatch(updateField({ name: 'DestinationTenantOfficeId', value: null }));
        store.dispatch(updateField({ name: 'DestinationVendorId', value: null }));
    }, [deliverychallan.DcTypeId]);

    const redirectToPartStocks = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(initializeBasketItemList());
        const stocklist = await getPartStockList(store.getState().partstocklist.search, store.getState().partstocklist.partStockFilter, store.getState().partstocklist.currentPage);
        store.dispatch(loadPartStocks(stocklist));
        const stockdetaillist = await getPartStockDetailList(PartId, "", 1);
        store.dispatch(loadPartStockDetails(stockdetaillist));
        document.getElementById("closeStockTransfer")?.click();
    }

    const onSubmit = async () => {
        store.dispatch(updateErrorsForDc({}));
        try {
            await validationSchema.validate(deliverychallan, { abortEarly: false });
        } catch (error: any) {
            const errorsDC = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrorsForDc(errorsDC))
            if (errorsDC)
                return;
        }
        store.dispatch(startPreloader());
        const result = await CreateDeliveryChallan(deliverychallan)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrorsForDc(errorMessages));
            }
        });
        store.dispatch(stopPreloader());
    }

    useEffect(() => {
        onSelectOtherData()
    }, [deliverychallan.DCTypeCode])

    const onSelectOtherData = async () => {
        if (deliverychallan.DCTypeCode == "DCN_VNDR") {
            var { MasterData } = await getValuesInMasterDataByTable("VendorType")
            const Vendortype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
            store.dispatch(loadMasterData({ name: "VendorTypes", value: { SelectDetails: Vendortype } }));
        } else if (deliverychallan.DCTypeCode == "DCN_ITRN") {
            const TenantOffices = await getDestinationLocationList();
            setTenantOfficeList(TenantOffices.TenantOfficeInfo)
            setFormattedOfficeList(formatSelectInput(TenantOffices.TenantOfficeInfo, "OfficeName", "Id"))
            store.dispatch(loadTenantOffices(TenantOffices));
        } else if (deliverychallan.DCTypeCode == "DCN_ENGR") {
            const { EngineersNames } = await getEngineersNames()
            const EngineersName = await (formatSelectInput(EngineersNames, "FullName", "Id"))
            store.dispatch(loadServiceEngineers({ SelectDetails: EngineersName }));
        }
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        if (name == "PartIndentDemandNumber") {
            store.dispatch(updateField({ name: 'PartIndentDemandNumber', value: selectedOption.label }));
        } else if (name == 'DcTypeId') {
            store.dispatch(setDCTypeCode(selectedOption.code))
            store.dispatch(updateField({ name: 'DcTypeId', value }));
        } else {
            store.dispatch(updateField({ name: name as keyof PartBasketItemState['deliverychallan'], value }));
        }
    }

    function onUpdateData(ev: any) {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof PartBasketItemState['deliverychallan'], value }));
    }

    return (
        <>
            <div className="mx-0">
                <div className="mb-2 col">
                    <label className="mt-2 red-asterisk">{t('deliverychallan_create_dctype')}</label>
                    <Select
                        value={masterDataList.DCType && masterDataList.DCType.find(option => option.value == deliverychallan.DcTypeId) || null}
                        options={masterDataList.DCType}
                        onChange={(selectedOption) => onSelectChange(selectedOption, "DcTypeId")}
                        isSearchable
                        name="DcTypeId"
                        placeholder="Select option"
                    />
                    <div className="small text-danger"> {t(errorsDC['DcTypeId'])}</div>
                </div>
                {deliverychallan.DCTypeCode == 'DCN_VNDR' ? (
                    <div className="mt-2 col">
                        <label className="form-label mb-0 red-asterisk">{t('deliverychallan_create_destination_vendorid')}</label>
                        <Select
                            options={formattedVendorList}
                            name="DestinationVendorId"
                            value={(formattedVendorList && formattedVendorList.find((option) => option.value === deliverychallan.DestinationVendorId)) || null}
                            className={`${errorsDC["DestinationVendorId"] ? "is-invalid" : ""}`}
                            onChange={(selectedOption) => onSelectChange(selectedOption, "DestinationVendorId")}
                            isSearchable
                            placeholder={t('deliverychallan_create_select_option')}
                        />
                        <div className="small text-danger"> {t(errorsDC['DestinationVendorId'])}</div>
                        {(formattedVendorList.length > 0 &&
                            <div className="text-muted mt-1">
                                {(VendorList.filter((value) => (value.Id == deliverychallan.DestinationVendorId)
                                )).length > 0 ? `Address : ${(VendorList.filter((value) => (value.Id == deliverychallan.DestinationVendorId)
                                ))[0].Address}` : ''}
                            </div>
                        )}
                    </div>
                ) : deliverychallan.DCTypeCode == 'DCN_ITRN' ? (
                    <div className="col">
                        <div className="mt-2 ps-0">
                            <label className="form-label mb-0 red-asterisk">{t('deliverychallan_create_destination_locationid')}</label>
                            <Select
                                options={formattedOfficeList}
                                name="DestinationTenantOfficeId"
                                onChange={(selectedOption) => onSelectChange(selectedOption, "DestinationTenantOfficeId")}
                                isSearchable
                                placeholder={t('deliverychallan_create_select_option')}
                            />
                            <div className="small text-danger"> {t(errorsDC['DestinationTenantOfficeId'])}</div>
                            {(formattedOfficeList.length > 0 &&
                                <div className="text-muted mt-1">
                                    {(TenantOfficeList.filter((value) => (value.Id == deliverychallan.DestinationTenantOfficeId)
                                    )).length > 0 ? `Address : ${(TenantOfficeList.filter((value) => (value.Id == deliverychallan.DestinationTenantOfficeId)
                                    ))[0].Address}` : ''}
                                </div>
                            )}
                        </div>
                    </div>) : deliverychallan.DCTypeCode == 'DCN_ENGR' && (
                        <div className="col">
                            <label className="mt-2 red-asterisk">{t('deliverychallan_create_destination_engid')}</label>
                            <Select
                                options={EngineersList}
                                onChange={(selectedOption) => onSelectChange(selectedOption, "DestinationEmployeeId")}
                                isSearchable
                                name="DestinationEmployeeId"
                                placeholder={t('deliverychallan_create_select_option')}
                            />
                            <div className="small text-danger"> {t(errorsDC['DestinationEmployeeId'])}</div>
                        </div>
                    )}
            </div>
            <div className="row m-0 p-0">
                <div className="mt-2 col-md-6">
                    <label className="form-label mb-0">{t('deliverychallan_create_logistics_vendortype')}</label>
                    <Select
                        options={masterDataList.VendorTypes}
                        name="LogisticsVendorTypeId"
                        value={(masterDataList.VendorTypes && masterDataList.VendorTypes.find((option) => option.value === deliverychallan.LogisticsVendorTypeId)) || null}
                        className={`${errorsDC["LogisticsVendorTypeId"] ? "is-invalid" : ""}`}
                        onChange={(selectedOption) => onSelectChange(selectedOption, "LogisticsVendorTypeId")}
                        isSearchable
                        placeholder={t('deliverychallan_create_select_option')}
                    />
                </div>
                <div className="mt-2 col-md-6">
                    <label className="form-label mb-0">{t('deliverychallan_create_logistics_vendor')}</label>
                    <Select
                        options={formattedVendorList}
                        name="LogisticsVendorId"
                        value={(formattedVendorList && formattedVendorList.find((option) => option.value === deliverychallan.LogisticsVendorId)) || null}
                        className={`${errorsDC["LogisticsVendorId"] ? "is-invalid" : ""}`}
                        onChange={(selectedOption) => onSelectChange(selectedOption, "LogisticsVendorId")}
                        isSearchable
                        placeholder={t('deliverychallan_create_select_option')}
                    />
                    <div className="small text-danger"> {t(errorsDC['LogisticsVendorId'])}</div>
                    {(formattedVendorList.length > 0 &&
                        <div className="text-muted mt-1">
                            {(VendorList.filter((value) => (value.Id == deliverychallan.LogisticsVendorId)
                            )).length > 0 ? `Address : ${(VendorList.filter((value) => (value.Id == deliverychallan.LogisticsVendorId)
                            ))[0].Address}` : ''}
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
                        onChange={(selectedOption) => onSelectChange(selectedOption, "ModeOfTransport")}
                        isSearchable
                        name="ModeOfTransport"
                        placeholder={t('deliverychallan_create_select_option')}
                    />
                </div>
                <div className={`${deliverychallan.DCTypeCode !== "" && deliverychallan.DCTypeCode !== 'DCN_VNDR' ? "col-md-6" : "col-md-12"}`}>
                    <label className="mt-2">{t('deliverychallan_create_trackingid')}</label>
                    <input
                        name="TrackingId"
                        onChange={onUpdateData}
                        type="text"
                        value={deliverychallan.TrackingId ?? 0}
                        className={`form-control`}
                    />
                </div>
                <>
                    {deliverychallan.DCTypeCode !== "" && deliverychallan.DCTypeCode !== 'DCN_VNDR' &&
                        <div className="col">
                            <label className="mt-2">{t('deliverychallan_create_partindent_demand_no')}</label>
                            <Select
                                options={DemandList}
                                onChange={(selectedOption) => onSelectChange(selectedOption, "PartIndentDemandNumber")}
                                isSearchable
                                name="PartIndentDemandNumber"
                                placeholder={t('deliverychallan_create_select_option')}
                            />
                            {(DemandList.length > 0 &&
                                <div className="text-muted mt-1">
                                    {Demands.filter((demand) => demand.DemandNumber === deliverychallan.PartIndentDemandNumber).map(filteredDemand => (
                                        <div key={filteredDemand.id}>
                                            {filteredDemand.DemandAddress}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    }
                    <div className="mt-2">
                        <button className="btn app-primary-bg-color text-white float-end" disabled={deliverychallan != null ? false : true} type="button" onClick={onSubmit}>
                            {t('deliverychallan_create_btn_submit')}
                        </button>
                    </div>
                </>
            </div>
            {displayInformationModal ? <InformationModal /> : ""}
        </>
    )
}