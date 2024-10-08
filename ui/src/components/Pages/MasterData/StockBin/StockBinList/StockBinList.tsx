import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeStockBinList, loadStockBins, setSearch } from './StockBin.slice'
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { deleteStockBin, getStockBinList } from "../../../../../services/stockbin";
import { StockBinCreate } from "../StockBinCreate/StockBinCreate";
import { loadStockBinDetails } from "../StockBinEdit/StockBinEdit.slice";
import { StockBinEdit } from "../StockBinEdit/StockBinEdit";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const StockBinList = () => {
    const { t, i18n } = useTranslation();
    const {
        stockbinlist: { stockbin, totalRows, perPage, currentPage, search },
    } = useStore(({ stockbinlist, app }) => ({ stockbinlist, app }));

    useEffect(() => {
        if (checkForPermission("STOCKBIN_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeStockBinList());
        try {
            const stockbins = await getStockBinList(search, currentPage);
            store.dispatch(loadStockBins(stockbins));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getStockBinList(search, index);
        store.dispatch(loadStockBins(result));
    }

    async function filterstockbinsList(e) {
        store.dispatch(changePage(1))
        const result = await getStockBinList(store.getState().stockbinlist.search, 1)
        store.dispatch(loadStockBins(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getStockBinList(store.getState().stockbinlist.search, store.getState().stockbinlist.currentPage);
            store.dispatch(loadStockBins(result));
        }
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_stockbin' },
    ];
    const [Id, setId] = useState(0);

    const handleConfirm = (Id: number) => {
        setId(Id);
    };

    const handleCancel = () => {
        setId(0);
    };

    function DeleteConfirmationModal() {
        return (
            <SweetAlert
                danger
                showCancel
                confirmBtnText={t('stockbin_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('stockbin_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('stockbin_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteStockBin(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('stockbin_message_success_delete'), {
                    duration: 3000,
                    style: {
                        borderRadius: '0',
                        background: '#00D26A',
                        color: '#fff',
                    },
                });
                onLoad();
            },
            err: (err) => {
                toast(i18n.t(err.Message), {
                    duration: 3600,
                    style: {
                        borderRadius: '0',
                        background: '#F92F60',
                        color: '#fff',
                    },
                });
                setId(0);
            },
        });
    }

    return (<ContainerPage>
        <>
            <BreadCrumb items={breadcrumbItems} />
            {
                checkForPermission("STOCKBIN_VIEW") &&
                stockbin.match({
                    none: () => <div className="ps-3 pe-4 ">{t('stockbin_list_loading')}</div>,
                    some: (stockbin) => <div className="ps-3 pe-4 ">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-9 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('stockbin_list_title')}</h5>
                            </div>
                            {
                                checkForPermission("STOCKBIN_MANAGE") &&
                                <div className="col-md-3 ">
                                    <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#Createstockbin'>
                                        {t('stockbin_list_button_create')}
                                    </button>
                                </div>
                            }
                        </div>
                        <div className="mb-3 ps-1">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('stockbin_list_placeholder_search') ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterstockbinsList(e);
                                        }
                                    }} onChange={addData} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterstockbinsList}>
                                    {t('stockbin_list_search_button')}
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ps-1">
                            {stockbin.length > 0 ? (
                                <div className=" table-responsive ">
                                    <table className="table table-hover  table-bordered ">
                                        <thead>
                                            <tr>
                                                {checkForPermission("STOCKBIN_MANAGE") &&
                                                    <th></th>
                                                }
                                                <th scope="col">{t('stockbin_list_th_sl_no')}</th>
                                                <th scope="col">{t('stockbin_list_th_bincode')}</th>
                                                <th scope="col">{t('stockbin_list_th_binname')}</th>
                                                <th scope='col'>{t('stockbin_list_th_status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stockbin.map((field, index) => (
                                                <tr className="mt-2" key={index}>
                                                    {checkForPermission("STOCKBIN_MANAGE") &&
                                                        <td>
                                                            <a
                                                                className="pseudo-href app-primary-color"
                                                                onClick={() => store.dispatch(loadStockBinDetails(field.stockbin))}
                                                                data-bs-toggle="modal"
                                                                data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                data-bs-target="#Editstockbin"
                                                            >
                                                                <span className="material-symbols-outlined ">
                                                                    edit_note
                                                                </span>
                                                            </a>
                                                            <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.stockbin.Id)}>
                                                                Delete
                                                            </span>
                                                        </td>
                                                    }
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td> {field.stockbin.BinCode} </td>
                                                    <td> {field.stockbin.BinName} </td>
                                                    <td >{field.stockbin.IsActive == true ? "ACTIVE" : "INACTIVE"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row m-0">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('stockbinlist_no_data')}</div>
                            )}
                        </div>
                        {Id ? <DeleteConfirmationModal /> : ""}
                        <Toaster />
                        <StockBinEdit />
                        <StockBinCreate />
                    </div>
                })}
        </>
    </ContainerPage>)
}