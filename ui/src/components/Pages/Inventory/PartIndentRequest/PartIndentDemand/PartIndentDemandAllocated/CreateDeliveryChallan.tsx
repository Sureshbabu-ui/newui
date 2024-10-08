import { useEffect, useState } from "react";
import { formatSelectInput, formatSelectInputWithCode } from "../../../../../../helpers/formats";
import { getValuesInMasterDataByTable } from "../../../../../../services/masterData";
import { getVendorNames } from "../../../../../../services/vendor";
import { store } from "../../../../../../state/store";
import { useStoreWithInitializer } from "../../../../../../state/storeHooks";
import { stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { getEngineersNames } from "../../../../../../services/assignEngineer";
import { VendorNameList } from "../../../../../../types/vendor";
import Select from 'react-select';
import { useTranslation } from "react-i18next";
import { CreateDeliveryChallanState, loadMasterData, loadServiceEngineers, loadVendorNames, setDCTypeCode, updatedcField } from "./CreateDeliveryChallan.slice";

export function DeliveryChallanFORGIN(props: { partstocks: any, demandnumber: string }) {

    const { deliverychallan, EngineersList, vendornames, masterDataList, errors } = useStoreWithInitializer(({ deliverychallanforgin }) => deliverychallanforgin, onLoad);
    const { t } = useTranslation();

    useEffect(() => {
        onSelectOtherData()
    }, [deliverychallan.DCTypeCode])

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        if (name == 'DcTypeId') {
            store.dispatch(setDCTypeCode(selectedOption.code))
            store.dispatch(updatedcField({ name: 'DcTypeId', value }));
        } else {
            store.dispatch(updatedcField({ name: name as keyof CreateDeliveryChallanState['deliverychallan'], value }));
        }
    }

    const [LogisticsVendorList, setLogisticsVendorList] = useState<VendorNameList[]>([]);
    const [formattedLogisticsVendorList, setFormattedLogisticsVendorList] = useState<any>([])

    const [DestinationVendorList, setDestinationVendorList] = useState<VendorNameList[]>([]);
    const [formattedDestinationVendorList, setFormattedDestinationVendorList] = useState<any>([])

    async function onLoad() {
        try {
            store.dispatch(updatedcField({ name: 'PartIndentDemandNumber', value: props.demandnumber }));
            store.dispatch(updatedcField({ name: 'partstocks', value: props.partstocks }));
            // MasterData tables
            var { MasterData } = await getValuesInMasterDataByTable("DCType")
            const dctype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
            const filtereddctypes = dctype.filter((item) => item.code != 'DCN_ITRN' && item.code != "DCN_SITE")
            store.dispatch(loadMasterData({ name: "DCType", value: { SelectDetails: filtereddctypes } }));

            var { MasterData } = await getValuesInMasterDataByTable("TransportationMode")
            const transportationMode = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
            store.dispatch(loadMasterData({ name: "TransportationMode", value: { SelectDetails: transportationMode } }));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onSelectOtherData = async () => {
        var { MasterData } = await getValuesInMasterDataByTable("VendorType")
        const Vendortype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
        const filteredLogisticstypes = Vendortype.find(i => i.code == "VTP_CRIR")?.value
        const filteredDestinationtypes = Vendortype.find(i => i.code == "VTP_CRIR")?.value
        store.dispatch(updatedcField({ name: 'LogisticsVendorTypeId', value: filteredLogisticstypes }));
        store.dispatch(updatedcField({ name: 'DestinationVendorTypeId', value: filteredDestinationtypes }));

        if (deliverychallan.DCTypeCode == "DCN_ENGR") {
            const { EngineersNames } = await getEngineersNames()
            const EngineersName = await (formatSelectInput(EngineersNames, "FullName", "Id"))
            store.dispatch(loadServiceEngineers({ SelectDetails: EngineersName }));
        }
    }

    useEffect(() => {
        if (deliverychallan.LogisticsVendorTypeId != null) {
            getFilteredLogisticsVendors()
        }
    }, [deliverychallan.LogisticsVendorTypeId])

    const getFilteredLogisticsVendors = async () => {
        if (deliverychallan.LogisticsVendorTypeId != null) {
            const vendornames = await getVendorNames(deliverychallan.LogisticsVendorTypeId);
            setLogisticsVendorList(vendornames.VendorNames)
            setFormattedLogisticsVendorList(formatSelectInput(vendornames.VendorNames, "Name", "Id"))
            store.dispatch(loadVendorNames(vendornames));
        }
    }

    useEffect(() => {
        if (deliverychallan.DestinationVendorTypeId != null) {
            getFilteredDestinationVendors()
        }
    }, [deliverychallan.DestinationVendorTypeId])

    const getFilteredDestinationVendors = async () => {
        if (deliverychallan.DestinationVendorTypeId != null) {
            const vendornames = await getVendorNames(deliverychallan.DestinationVendorTypeId);
            setDestinationVendorList(vendornames.VendorNames)
            setFormattedDestinationVendorList(formatSelectInput(vendornames.VendorNames, "Name", "Id"))
            store.dispatch(loadVendorNames(vendornames));
        }
    }

    function onUpdateData(ev: any) {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updatedcField({ name: name as keyof CreateDeliveryChallanState['deliverychallan'], value }));
    }

    return (
        <>
            <div className="mx-0">
                <h6 className="app-primary-color fw-bold mt-2">Courier Details</h6>
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
                    <div className="small text-danger"> {t(errors['DcTypeId'])}</div>
                </div>
                {deliverychallan.DCTypeCode == 'DCN_VNDR' ? (
                    <div className="mt-2 col">
                        <label className="form-label mb-0 red-asterisk">{t('deliverychallan_create_destination_vendorid')}</label>
                        <Select
                            options={formattedDestinationVendorList}
                            name="DestinationVendorId"
                            value={(formattedDestinationVendorList && formattedDestinationVendorList.find((option) => option.value === deliverychallan.DestinationVendorId)) || null}
                            className={`${errors["DestinationVendorId"] ? "is-invalid" : ""}`}
                            onChange={(selectedOption) => onSelectChange(selectedOption, "DestinationVendorId")}
                            isSearchable
                            placeholder={t('deliverychallan_create_select_option')}
                        />
                        <div className="small text-danger"> {t(errors['DestinationVendorId'])}</div>
                        {(formattedDestinationVendorList.length > 0 &&
                            <div className="text-muted mt-1">
                                {(DestinationVendorList.filter((value) => (value.Id == deliverychallan.DestinationVendorId)
                                )).length > 0 ? `Address : ${(DestinationVendorList.filter((value) => (value.Id == deliverychallan.DestinationVendorId)
                                ))[0].Address}` : ''}
                            </div>
                        )}
                    </div>
                ) : deliverychallan.DCTypeCode == 'DCN_ENGR' && (
                    <div className="col">
                        <label className="mt-2 red-asterisk">{t('deliverychallan_create_destination_engid')}</label>
                        <Select
                            options={EngineersList}
                            onChange={(selectedOption) => onSelectChange(selectedOption, "DestinationEmployeeId")}
                            isSearchable
                            name="DestinationEmployeeId"
                            placeholder={t('deliverychallan_create_select_option')}
                        />
                        <div className="small text-danger"> {t(errors['DestinationEmployeeId'])}</div>
                    </div>
                )}
            </div>
            <div className="row m-0 p-0">
                <div className="mt-2 col-md-6 m-0 p-0">
                    <label className="form-label mb-0">{t('deliverychallan_create_logistics_vendor')}</label>
                    <Select
                        options={formattedLogisticsVendorList}
                        name="LogisticsVendorId"
                        value={(formattedLogisticsVendorList && formattedLogisticsVendorList.find((option) => option.value === deliverychallan.LogisticsVendorId)) || null}
                        className={`${errors["LogisticsVendorId"] ? "is-invalid" : ""}`}
                        onChange={(selectedOption) => onSelectChange(selectedOption, "LogisticsVendorId")}
                        isSearchable
                        placeholder={t('deliverychallan_create_select_option')}
                    />
                    <div className="small text-danger"> {t(errors['LogisticsVendorId'])}</div>
                    {(formattedLogisticsVendorList.length > 0 &&
                        <div className="text-muted mt-1">
                            {(LogisticsVendorList.filter((value) => (value.Id == deliverychallan.LogisticsVendorId)
                            )).length > 0 ? `Address : ${(LogisticsVendorList.filter((value) => (value.Id == deliverychallan.LogisticsVendorId)
                            ))[0].Address}` : ''}
                        </div>
                    )}
                </div>
                <div className='col-md-6 m-0 pe-0'>
                    <label className="mt-2">{t('deliverychallan_create_logistics_receipt_no')}</label>
                    <input
                        name="LogisticsReceiptNumber"
                        onChange={onUpdateData}
                        type="text"
                        value={deliverychallan.LogisticsReceiptNumber ?? 0}
                        className={`form-control`}
                    />
                </div>
                <div className='col-md-6 m-0 p-0'>
                    <label className='mt-2'>{t('deliverychallan_create_logistics_receipt_date')}</label>
                    <input name='LogisticsReceiptDate' onChange={onUpdateData} type='date' className='form-control'></input>
                    <div className="small text-danger"> {t(errors["LogisticsReceiptDate"])}</div>
                </div>
                <div className="mb-2 col-md-6 pe-0">
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
                <div className={`m-0 p-0 col-md-6`}>
                    <label className="mt-2">{t('deliverychallan_create_trackingid')}</label>
                    <input
                        name="TrackingId"
                        onChange={onUpdateData}
                        type="text"
                        value={deliverychallan.TrackingId ?? 0}
                        className={`form-control`}
                    />
                </div>
                <div className="col-md-6 pe-0">
                    <label className="mt-2">{t('deliverychallan_create_partindent_demand_no')}</label>
                    <input
                        name="PartIndentDemandNumber"
                        onChange={onUpdateData}
                        type="text"
                        value={deliverychallan.PartIndentDemandNumber ?? ""}
                        className={`form-control`}
                    />
                </div>
            </div>
        </>
    )
}