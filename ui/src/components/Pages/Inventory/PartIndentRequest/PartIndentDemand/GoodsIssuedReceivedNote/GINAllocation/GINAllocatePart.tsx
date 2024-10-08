import { useStore } from '../../../../../../../state/storeHooks';
import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../../ContainerPage/ContainerPage";
import { store } from "../../../../../../../state/store";
import { useEffect, useRef } from "react";
import { convertBackEndErrorsToValidationErrors, formatCurrency, formatDate, formatSelectInputWithCode } from '../../../../../../../helpers/formats';
import { ValidationErrorComp } from '../../../../../../ValidationErrors/ValidationError';
import { initializeGIRNCreate, loadMasterData, loadPartStocks, setMaxExceeds, setStockTypeCode, toggleInformationModalStatus, updateErrors, updateField } from './GINAllocatePart.slice';
import { startPreloader, stopPreloader } from '../../../../../../Preloader/Preloader.slice';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getSelectedPartStockList } from '../../../../../../../services/partStock';
import { useHistory } from 'react-router-dom';
import { getValuesInMasterDataByTable } from '../../../../../../../services/masterData';
import Select from 'react-select';
import { DemandListCWHAttentionNotNeeded, GINPartAllocation } from '../../../../../../../services/partindentdemand';
import { loadPartIndentDemand } from '../../PartIndentDemandListLogistics/PartIndentDemandsCompleted/PartIndentDemandCompleted.slice';
import { setActiveTab } from '../../PartIndentDemandListLogistics/DemandListManagement.slice';

export const CreateGoodsIssuedReceivedNote = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const history = useHistory();

    const {
        creategirn: { displayInformationModal, maxexceed, PartStocks, masterDataList, stocktypeid, IndentDemand, errors, GIRNList },
    } = useStore(({ creategirn, app }) => ({ creategirn, app }));

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={redirectToDemandList}>
                {t('part_allocation_success_message')}
            </SweetAlert>
        );
    }

    useEffect(() => {
        onLoad();
    }, [stocktypeid, IndentDemand.PartIndentDemandId]);

    async function onLoad() {
        store.dispatch(startPreloader());
        try {
            // MasterData tables
            var { MasterData } = await getValuesInMasterDataByTable("StockType")
            const stocktype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
            const filteredStocktypes = stocktype.filter(i => i.code !== "STT_DFCT")
            const stocktypes = [{ label: "All", value: "", code: "STT_ALL" }, ...filteredStocktypes];
            store.dispatch(loadMasterData({ name: "StockType", value: { Select: stocktypes } }));

            if (IndentDemand.PartIndentDemandId != 0) {
                const result = await getSelectedPartStockList(store.getState().creategirn.IndentDemand.PartIndentDemandId, stocktypeid);
                store.dispatch(loadPartStocks(result))
            }
        } catch (error) {
            console.log(error);
            return;

        }
        store.dispatch(stopPreloader());
    }

    const redirectToDemandList = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(setActiveTab('nav-not-allocated'))
        const result = await DemandListCWHAttentionNotNeeded(1, store.getState().partindentdemandlogisticsallocated.search, false);
        store.dispatch(loadPartIndentDemand(result));
        modalRef.current?.click()
    }

    const onModalClose = async () => {
        store.dispatch(initializeGIRNCreate())
    }

    const onSubmit = async () => {
        store.dispatch(startPreloader());
        const result = await GINPartAllocation(GIRNList)
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

    const onUpdateField = (ev: any, PartStockId: number) => {
        const checked = ev.target.checked;
        if (GIRNList.PartStockData.length === IndentDemand.Quantity && checked == true) {
            store.dispatch(setMaxExceeds(true))
        } else if (GIRNList.PartStockData.length <= IndentDemand.Quantity) {
            store.dispatch(updateField({ PartStockId: PartStockId, Action: checked }));
            store.dispatch(setMaxExceeds(false))
        }
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        store.dispatch(setStockTypeCode(value));
    }

    return (
        <div
            className="modal fade"
            id='CreateGIN'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header mx-3">
                        <h5 className="modal-title app-primary-color">{t('create_gin_main_heading')}</h5>
                        <button
                            type='button'
                            className="btn-close me-2"
                            data-bs-dismiss='modal'
                            id='closeCreateGIN'
                            onClick={onModalClose}
                            aria-label='Close'
                            ref={modalRef}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <ContainerPage>
                            <div className='fw-bold mb-2'>{t('create_gin_sub_heading1')}{IndentDemand.Quantity}{t('create_gin_sub_heading2')} {IndentDemand.WorkOrderNumber}?</div>
                            {/* Stock Type */}
                            <label className=''>{t('create_gin_filter_with_st')}</label>
                            <div className="col-6 mb-2">
                                <Select
                                    value={masterDataList.StockType && masterDataList.StockType.find(option => option.value == stocktypeid) || null}
                                    options={masterDataList.StockType}
                                    onChange={(selectedOption) => onSelectChange(selectedOption, "StockTypeId")}
                                    isSearchable
                                    className="rounded-0 "
                                    name="StockTypeId"
                                    placeholder={t('create_gin_stocktype_select')}
                                />
                            </div>
                            {PartStocks.length > 0 ? (
                                <>
                                    {maxexceed == true &&
                                        <div className="alert alert-danger p-1 ms-2 me-4" role="alert">
                                            <div>
                                                <span className="material-symbols-outlined align-bottom">warning</span>&nbsp;
                                                <span>{t('create_gin_max')}</span>
                                            </div>
                                        </div>
                                    }
                                    <ValidationErrorComp errors={errors} />
                                    <div className="m-0">
                                        <div className='ps-0 table-responsive overflow-auto pe-0'>
                                            <table className="table table-bordered text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th scope="col">{t('part_allocate_partstock_label_slno')}</th>
                                                        <th scope="col">{t('part_allocate_partstock_label_partcode')}</th>
                                                        <th scope="col">{t('part_allocate_partstock_label_partname')}</th>
                                                        <th scope="col">{t('part_allocate_partstock_label_rate')}</th>
                                                        <th scope='col'>{t('part_allocate_partstock_label_serialno')}</th>
                                                        <th scope='col'>{t('part_allocate_partstock_label_location')}</th>
                                                        <th scope='col'>{t('part_allocate_partstock_label_stocktype')}</th>
                                                        <th scope='col'>{t('part_allocate_partstock_label_aging')}</th>
                                                        <th scope='col'>{t('part_allocate_partstock_label_room')}</th>
                                                        <th scope='col'>{t('part_allocate_partstock_label_warranty_expiry')}</th>
                                                    </tr>
                                                </thead>
                                                {PartStocks.map((field, index) => (
                                                    <tbody>
                                                        <tr><td> <input
                                                            className={`form-check-input me-2`}
                                                            type="checkbox"
                                                            onChange={(ev) => { onUpdateField(ev, field.PartStockId) }}
                                                            checked={GIRNList.PartStockData.find(item => item.PartStockId == field.PartStockId) ? true : false}
                                                            name="PartStock"
                                                        />
                                                        </td>
                                                            <td scope='row'>{(1 - 1) * 10 + (index + 1)}</td>
                                                            <td>{field.PartCode}</td>
                                                            <td>{field.PartName}</td>
                                                            <td>{formatCurrency(field.Rate)}</td>
                                                            <td>{field.SerialNumber}</td>
                                                            <td>{field.TenantOffice}</td>
                                                            <td>{field.StockType}</td>
                                                            <td>{field.AgingInDays ? field.AgingInDays : 0} </td>
                                                            <td>{field.RoomName}</td>
                                                            <td>{formatDate(field.PartWarrantyExpiryDate)}</td>
                                                        </tr>
                                                    </tbody>
                                                ))}
                                            </table>
                                        </div>
                                    </div>

                                    <div className='row mt-3 pe-0'>
                                        <div className="col-md- pe-0">
                                            <button type="button" disabled={GIRNList.PartStockData.length < IndentDemand.Quantity ? true : false} onClick={() => onSubmit()} className="btn app-primary-bg-color border text-white float-end">
                                                {t('create_button_allocate')}
                                            </button>
                                            <button
                                                type='button' className="btn btn-outline-secondary float-end me-2" data-bs-dismiss='modal'
                                                id='closeCreateGIRN'
                                                onClick={onModalClose}
                                                aria-label='Close'
                                                ref={modalRef}
                                            >{t('part_allocate_cancel_button')}</button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='mt-3'>{t('part_allocate_no_records')}</div>
                            )}
                        </ContainerPage>
                        {displayInformationModal ? <InformationModal /> : ""}
                    </div>
                </div>
            </div>
        </div>
    )
} 